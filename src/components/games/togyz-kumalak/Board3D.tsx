'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, Text, useCursor, Center, ContactShadows, SpotLight } from '@react-three/drei'
import * as THREE from 'three'
import { TogyzqumalakState, Player } from '@/games/togyz-kumalak/engine/types'

// --- LUXURY COLOR PALETTE ---
const BOARD_WOOD = '#2c0a00'      // Very dark, rich mahogany
const HOLE_INNER = '#0a0200'      // Pitch black/dark brown for depth
const GOLD_TRIM = '#ffb347'       // Warm, gleaming gold
const STONE_IVORY = '#fffae6'     // Polished ivory/marble
const GLOW_COLOR = '#ff9900'      // Warm interaction glow

// --- DIMENSIONS ---
const BOARD_W = 15.5
const BOARD_H = 8.5
const OTAU_W = 0.95
const OTAU_H = 2.6
const SPACING = 1.3
const KAZAN_W = 12.5
const KAZAN_H = 0.7

interface Board3DProps {
  state: TogyzqumalakState
  legalMoves: Set<number>
  selectedOtau: number | null
  animatingOtau: number | null
  humanPlayer: Player
  onOtauClick: (otauIndex: number) => void
}

function CameraRig() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height
    // Orthographic-style framing using perspective camera with narrow FOV
    // This reduces perspective distortion while keeping 3D depth
    camera.position.set(0, 16, 0)
    camera.lookAt(0, 0, 0)
    
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const pc = camera as THREE.PerspectiveCamera
      pc.fov = aspect < 1 ? 45 / aspect : 35
      pc.updateProjectionMatrix()
    }
  }, [size, camera])
  return null
}

function CustomOtauShape({ position, isKazan = false }: { position: [number, number, number], isKazan?: boolean }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const w = isKazan ? KAZAN_W / 2 : OTAU_W / 2
    const h = isKazan ? KAZAN_H / 2 : OTAU_H / 2
    const indent = 0.15
    
    if (isKazan) {
       s.moveTo(-w, -h)
       s.lineTo(w, -h)
       s.quadraticCurveTo(w + indent, 0, w, h)
       s.lineTo(-w, h)
       s.quadraticCurveTo(-w - indent, 0, -w, -h)
    } else {
       s.moveTo(-w, -h)
       s.lineTo(w, -h)
       s.quadraticCurveTo(w - indent, 0, w, h)
       s.lineTo(-w, h)
       s.quadraticCurveTo(-w + indent, 0, -w, -h)
    }
    return s
  }, [isKazan])

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer Gold Trim */}
      <mesh position={[0, 0, -0.05]} castShadow receiveShadow>
        <extrudeGeometry args={[shape, { depth: 0.15, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 4 }]} />
        <meshPhysicalMaterial 
          color={GOLD_TRIM} 
          metalness={1} 
          roughness={0.15} 
          clearcoat={1} 
          clearcoatRoughness={0.1}
          envMapIntensity={2} 
        />
      </mesh>
      {/* Inner Dark Hole */}
      <mesh position={[0, 0, 0.02]}>
        <extrudeGeometry args={[shape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }]} />
        <meshStandardMaterial color={HOLE_INNER} roughness={0.9} />
      </mesh>
    </group>
  )
}

function getStonePosition(index: number, stoneCount: number, isKazan: boolean): [number, number, number] {
  const spacing = 0.32
  
  if (isKazan) {
    const cols = 35
    const col = index % cols
    const row = Math.floor(index / cols)
    const startX = -((Math.min(stoneCount, cols) - 1) * spacing) / 2
    return [startX + (col * spacing), 0.15 + (row * 0.1), (row * spacing) - 0.15]
  } else {
    // 5 stones per column
    const rows = 5
    const row = index % rows
    const col = Math.floor(index / rows)
    const startZ = OTAU_H / 2 - 0.25
    const startX = -OTAU_W / 2 + 0.3
    // stack upwards if we exceed capacity
    const yOffset = 0.15 + (Math.floor(col / 2) * 0.1)
    return [startX + ((col % 2) * spacing), yOffset, startZ - (row * spacing)]
  }
}

function OtauSlot({
  index, position, stones, isLegal, isSelected, isTuzdyk, isHoverTarget, isP1, onClick, onHover
}: {
  index: number, position: [number, number, number], stones: number, 
  isLegal: boolean, isSelected: boolean, isTuzdyk: boolean, isHoverTarget: boolean, isP1: boolean,
  onClick: () => void, onHover: (idx: number | null) => void
}) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && isLegal)

  const handlePointerOver = (e: any) => { e.stopPropagation(); setHovered(true); if(isLegal) onHover(index) }
  const handlePointerOut = (e: any) => { e.stopPropagation(); setHovered(false); onHover(null) }

  const rotY = isP1 ? 0 : Math.PI
  const isActive = (hovered && isLegal) || isHoverTarget

  return (
    <group position={position}>
      <group onPointerDown={(e) => { e.stopPropagation(); if(isLegal) onClick() }} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <CustomOtauShape position={[0, 0, 0]} />
        
        {/* Interaction Glow */}
        {(isActive || isSelected) && (
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[OTAU_W - 0.2, OTAU_H - 0.2]} />
            <meshBasicMaterial color={isSelected ? '#ffffff' : GLOW_COLOR} transparent opacity={0.4} />
          </mesh>
        )}
      </group>

      {/* Stones */}
      <group rotation={[0, rotY, 0]}>
        {!isTuzdyk && Array.from({ length: stones }).map((_, i) => {
          const [sx, sy, sz] = getStonePosition(i, stones, false)
          return (
            <mesh key={`stone-${i}`} position={[sx, sy, sz]} castShadow>
              <sphereGeometry args={[0.16, 32, 32]} />
              <meshPhysicalMaterial 
                color={STONE_IVORY} 
                roughness={0.1} 
                metalness={0.05} 
                clearcoat={1.0} 
                clearcoatRoughness={0.1}
              />
            </mesh>
          )
        })}
      </group>

      {/* Tuzdyk Marker */}
      {isTuzdyk && (
        <group position={[0, 0.2, 0]}>
          <mesh rotation={[-Math.PI/2, 0, 0]} castShadow>
            <planeGeometry args={[OTAU_W - 0.3, OTAU_H - 0.4]} />
            <meshPhysicalMaterial color={GOLD_TRIM} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* Number Labels */}
      <Text 
        position={[0, 0.1, isP1 ? OTAU_H/2 + 0.4 : -OTAU_H/2 - 0.4]} 
        rotation={[-Math.PI/2, 0, isP1 ? 0 : Math.PI]} 
        fontSize={0.3} 
        color={isActive ? GLOW_COLOR : GOLD_TRIM} 
        fontWeight="bold"
      >
        {index + 1}
      </Text>
    </group>
  )
}

function KazanSlot({ position, stones, isP1 }: { position: [number, number, number], stones: number, isP1: boolean }) {
  return (
    <group position={position}>
      <CustomOtauShape position={[0, 0, 0]} isKazan={true} />
      {Array.from({ length: stones }).map((_, i) => {
        const [sx, sy, sz] = getStonePosition(i, stones, true)
        return (
          <mesh key={`kstone-${i}`} position={[sx, sy, sz]} castShadow>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshPhysicalMaterial color={STONE_IVORY} roughness={0.1} metalness={0.05} clearcoat={1.0} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function Board3D({
  state, legalMoves, selectedOtau, humanPlayer, onOtauClick,
}: Board3DProps) {
  const [hoverTargetLinear, setHoverTargetLinear] = useState<number | null>(null)

  const handleHoverOtau = (index: number | null) => {
    if (index === null) {
      setHoverTargetLinear(null)
      return
    }
    const isP1 = humanPlayer === 1
    const playerOtaus = isP1 ? state.board.player1Otaus : state.board.player2Otaus
    const stoneCount = playerOtaus[index]
    if (stoneCount === 0) {
      setHoverTargetLinear(null)
      return
    }
    const startLinear = isP1 ? index : 9 + index
    const endLinear = stoneCount === 1 ? (startLinear + 1) % 18 : (startLinear + stoneCount - 1) % 18
    setHoverTargetLinear(endLinear)
  }

  const getOtauPosition = (linearIdx: number): [number, number, number] => {
    const isP1 = linearIdx < 9
    const colIdx = isP1 ? linearIdx : 17 - linearIdx
    const x = (colIdx - 4) * SPACING
    const z = isP1 ? 2.6 : -2.6
    return [x, 0.1, z]
  }

  const p1KazanPos: [number, number, number] = [0, 0.1, 0.65]
  const p2KazanPos: [number, number, number] = [0, 0.1, -0.65]

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0a0502]">
      {/* Background radial gradient to focus on the board */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none" 
           style={{ background: 'radial-gradient(circle at center, #3a1505 0%, #000000 80%)' }} />
           
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <React.Suspense fallback={null}>
          <CameraRig />
          
          <ambientLight intensity={0.5} />
          
          {/* Cinematic Spotlight */}
          <SpotLight 
            position={[0, 15, 5]} 
            angle={0.6} 
            penumbra={0.8} 
            intensity={2.5} 
            castShadow 
            color="#ffefe0"
          />
          
          <Environment preset="studio" />
          
          <Center>
            <group>
              {/* Massive Wooden Board Base */}
              <mesh position={[0, -0.4, 0]} receiveShadow>
                <boxGeometry args={[BOARD_W, 0.8, BOARD_H]} />
                <meshPhysicalMaterial 
                  color={BOARD_WOOD} 
                  roughness={0.6} 
                  metalness={0.1}
                  clearcoat={0.3}
                />
              </mesh>

              {/* Kazans */}
              <KazanSlot position={p2KazanPos} stones={state.kazan.player2} isP1={false} />
              <KazanSlot position={p1KazanPos} stones={state.kazan.player1} isP1={true} />

              {/* Otaus */}
              {state.board.player1Otaus.map((stones, i) => (
                <OtauSlot key={`p1-${i}`} index={i} position={getOtauPosition(i)} stones={stones}
                  isLegal={humanPlayer === 1 && legalMoves.has(i)} isSelected={selectedOtau === i && humanPlayer === 1}
                  isTuzdyk={state.tuzdyk.player2 === i} isHoverTarget={hoverTargetLinear === i}
                  isP1={true} onClick={() => onOtauClick(i)} onHover={handleHoverOtau} />
              ))}

              {state.board.player2Otaus.map((stones, i) => (
                <OtauSlot key={`p2-${i}`} index={i} position={getOtauPosition(i + 9)} stones={stones}
                  isLegal={humanPlayer === 2 && legalMoves.has(i)} isSelected={selectedOtau === i && humanPlayer === 2}
                  isTuzdyk={state.tuzdyk.player1 === i} isHoverTarget={hoverTargetLinear === i + 9}
                  isP1={false} onClick={() => onOtauClick(i)} onHover={handleHoverOtau} />
              ))}
            </group>
          </Center>

          {/* Soft shadow under the board to ground it */}
          <ContactShadows position={[0, -0.8, 0]} opacity={0.6} scale={20} blur={2.5} far={4} />
        </React.Suspense>
      </Canvas>
    </div>
  )
}
