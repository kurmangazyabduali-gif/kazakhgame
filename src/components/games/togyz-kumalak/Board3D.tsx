'use client'

import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, Text, useCursor, RoundedBox, Center, ContactShadows, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { TogyzqumalakState, Player } from '@/games/togyz-kumalak/engine/types'

// Physical Layout Constants
const OTAU_RADIUS = 0.6
const QAZAN_RADIUS = 1.6
const STONE_RADIUS = 0.16
const OTAU_SPACING = 1.4
const ROW_SPACING = 2.2
const BOARD_WIDTH = (9 * OTAU_SPACING) + (QAZAN_RADIUS * 4) + 2
const BOARD_DEPTH = ROW_SPACING + (OTAU_RADIUS * 4) + 1.5

// Colors & Materials
const WOOD_COLOR = '#2b1002' // Rich dark mahogany
const GOLD_COLOR = '#ffcc00'
const STONE_COLORS = ['#f5f5dc', '#d2b48c', '#8b4513', '#696969'] // Ivory, Tan, Brown, Gray for variation

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
    let y = 14
    let z = 10
    
    if (aspect < 1) {
      y = 22 / aspect
      z = 6
    } else if (aspect < 1.5) {
      y = 16
      z = 8
    }
    
    camera.position.set(0, y, z)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [size, camera])

  return null
}

function generateCluster(count: number, radius: number, seed: number): {x: number, y: number, z: number, colorIdx: number}[] {
  const points = []
  const phi = Math.PI * (3 - Math.sqrt(5)) 
  for (let i = 0; i < count; i++) {
    const r = radius * 0.7 * Math.sqrt(i / (count || 1))
    const theta = i * phi + (seed * 1.5)
    // Pseudo-random height variation and color based on index and seed
    points.push({
      x: Math.cos(theta) * r,
      y: 0.08 + (i * 0.015),
      z: Math.sin(theta) * r,
      colorIdx: (i + seed) % STONE_COLORS.length
    })
  }
  return points
}

function TuzdykFlag() {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Base pole */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshPhysicalMaterial color={GOLD_COLOR} metalness={1} roughness={0.2} clearcoat={1} />
      </mesh>
      {/* Flag */}
      <mesh position={[0.2, 0.1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.02]} />
        <meshPhysicalMaterial color="#cc0000" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Top finial */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshPhysicalMaterial color={GOLD_COLOR} metalness={1} roughness={0.1} />
      </mesh>
    </group>
  )
}

function Otau3D({
  index, linearIndex, position, stones, isLegal, isSelected, isTuzdyk, isAnimating, isHoverTarget, onClick, onHover
}: {
  index: number
  linearIndex: number
  position: [number, number, number]
  stones: number
  isLegal: boolean
  isSelected: boolean
  isTuzdyk: boolean
  isAnimating: boolean
  isHoverTarget: boolean
  onClick: () => void
  onHover: (idx: number | null) => void
}) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && isLegal)

  // Use linear index as seed for stable stone positions
  const stoneData = useMemo(() => generateCluster(stones, OTAU_RADIUS, linearIndex), [stones, linearIndex])
  
  const handlePointerOver = (e: any) => { e.stopPropagation(); setHovered(true); if(isLegal) onHover(index) }
  const handlePointerOut = (e: any) => { e.stopPropagation(); setHovered(false); onHover(null) }

  // Wood rim color logic
  const rimColor = isTuzdyk ? GOLD_COLOR : isSelected || isHoverTarget ? '#ff9900' : '#4d2306'

  return (
    <group position={position}>
      {/* Pit Hole Base */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.02, 0]}
        onClick={() => isLegal && onClick()}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <circleGeometry args={[OTAU_RADIUS, 32]} />
        <meshStandardMaterial color={hovered && isLegal ? '#3a1a05' : '#1a0a02'} roughness={0.9} />
      </mesh>

      {/* Beveled Golden/Wood Rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[OTAU_RADIUS, OTAU_RADIUS + 0.1, 32]} />
        <meshPhysicalMaterial 
          color={rimColor} 
          metalness={isTuzdyk || isHoverTarget ? 0.9 : 0.3} 
          roughness={isTuzdyk ? 0.1 : 0.6} 
          clearcoat={0.5} 
          emissive={isHoverTarget ? '#ff6600' : '#000'}
          emissiveIntensity={isHoverTarget ? 0.5 : 0}
        />
      </mesh>
      
      {/* Animation / Target Glow */}
      {(isAnimating || isHoverTarget) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[OTAU_RADIUS + 0.1, OTAU_RADIUS + 0.25, 32]} />
          <meshBasicMaterial color={isHoverTarget ? '#ffcc00' : GOLD_COLOR} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Tuzdyk Marker */}
      {isTuzdyk && <TuzdykFlag />}

      {/* Qumalaq (Stones) */}
      {!isTuzdyk && stoneData.map((s, i) => (
        <mesh key={`stone-${i}`} position={[s.x, s.y, s.z]} castShadow receiveShadow>
          <sphereGeometry args={[STONE_RADIUS, 32, 32]} />
          <meshPhysicalMaterial 
            color={STONE_COLORS[s.colorIdx]} 
            roughness={0.1} 
            metalness={0.1} 
            clearcoat={1.0} 
            clearcoatRoughness={0.1}
            transmission={0.1}
            ior={1.5}
          />
        </mesh>
      ))}

      {/* Hover stone count indicator */}
      {(hovered || isHoverTarget) && !isTuzdyk && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.4}
          color="#ffcc00"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          {stones}
        </Text>
      )}
    </group>
  )
}

function Qazan3D({ position, stones, label, isAnimating, seed }: { position: [number, number, number], stones: number, label: string, isAnimating: boolean, seed: number }) {
  const stoneData = useMemo(() => generateCluster(stones, QAZAN_RADIUS * 0.9, seed), [stones, seed])

  return (
    <group position={position}>
      {/* Kazan Hole */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[QAZAN_RADIUS, 64]} />
        <meshStandardMaterial color="#0f0501" roughness={0.9} />
      </mesh>

      {/* Kazan Bevel / Gold Edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[QAZAN_RADIUS, QAZAN_RADIUS + 0.2, 64]} />
        <meshPhysicalMaterial color={GOLD_COLOR} metalness={0.8} roughness={0.2} clearcoat={1.0} />
      </mesh>
      
      {isAnimating && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[QAZAN_RADIUS + 0.2, QAZAN_RADIUS + 0.35, 64]} />
          <meshBasicMaterial color={GOLD_COLOR} transparent opacity={0.4} />
        </mesh>
      )}

      {/* Stones */}
      {stoneData.map((s, i) => (
        <mesh key={`kazan-stone-${i}`} position={[s.x, s.y, s.z]} castShadow receiveShadow>
          <sphereGeometry args={[STONE_RADIUS, 32, 32]} />
          <meshPhysicalMaterial 
            color={STONE_COLORS[s.colorIdx]} 
            roughness={0.1} 
            metalness={0.1} 
            clearcoat={1.0}
            transmission={0.1}
          />
        </mesh>
      ))}

      {/* Label & Score */}
      <Text
        position={[0, 0.2, -QAZAN_RADIUS - 0.5]}
        rotation={[-Math.PI / 4, 0, 0]}
        fontSize={0.4}
        color={GOLD_COLOR}
        anchorX="center"
        anchorY="middle"
        font="/fonts/kz-ornament-font.woff"
      >
        {label}: {stones}
      </Text>
    </group>
  )
}

// Decorative corner carvings for the board
function CornerCarving({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[1.5, 0.1, 1.5]} />
      <meshPhysicalMaterial color={GOLD_COLOR} metalness={0.9} roughness={0.3} clearcoat={1} />
    </mesh>
  )
}

export default function Board3D({
  state,
  legalMoves,
  selectedOtau,
  animatingOtau,
  humanPlayer,
  onOtauClick,
}: Board3DProps) {
  const [hoverTargetLinear, setHoverTargetLinear] = useState<number | null>(null)

  // Calculate target when hovering over a legal move
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
    const row = isP1 ? 1 : -1
    const colIdx = isP1 ? linearIdx : 17 - linearIdx
    const col = colIdx - 4
    return [col * OTAU_SPACING, 0.3, row * (ROW_SPACING / 2)]
  }

  const p1KazanPos: [number, number, number] = [(4.5 * OTAU_SPACING) + QAZAN_RADIUS + 0.2, 0.3, 0]
  const p2KazanPos: [number, number, number] = [-(4.5 * OTAU_SPACING) - QAZAN_RADIUS - 0.2, 0.3, 0]

  return (
    <div className="absolute inset-0 w-full h-full bg-[#110702]">
      <Canvas shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <CameraRig />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.4} color="#ffe8cc" />
        <directionalLight 
          position={[5, 15, 8]} 
          intensity={2.5} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
          shadow-bias={-0.0001}
          color="#ffeedd"
        />
        <directionalLight position={[-8, 5, -5]} intensity={0.8} color="#aaddff" />
        <Environment preset="apartment" />
        <ContactShadows position={[0, -0.65, 0]} opacity={0.8} scale={30} blur={2} far={4} />

        <Center>
          <group position={[0, 0, 0]}>
            {/* Main Board Wood Block (Mahogany) */}
            <RoundedBox args={[BOARD_WIDTH, 1.2, BOARD_DEPTH]} radius={0.2} smoothness={4} position={[0, -0.3, 0]} castShadow receiveShadow>
              <meshPhysicalMaterial 
                color={WOOD_COLOR} 
                roughness={0.4} 
                metalness={0.1} 
                clearcoat={1.0} 
                clearcoatRoughness={0.3} 
              />
            </RoundedBox>

            {/* Gold trim around the board */}
            <RoundedBox args={[BOARD_WIDTH + 0.1, 0.1, BOARD_DEPTH + 0.1]} radius={0.2} smoothness={4} position={[0, 0.25, 0]}>
              <meshPhysicalMaterial color={GOLD_COLOR} metalness={0.9} roughness={0.2} clearcoat={1} />
            </RoundedBox>

            {/* Decorative Corners */}
            <CornerCarving position={[(BOARD_WIDTH/2) - 0.8, 0.3, (BOARD_DEPTH/2) - 0.8]} rotation={[0, 0, 0]} />
            <CornerCarving position={[-(BOARD_WIDTH/2) + 0.8, 0.3, (BOARD_DEPTH/2) - 0.8]} rotation={[0, 0, 0]} />
            <CornerCarving position={[(BOARD_WIDTH/2) - 0.8, 0.3, -(BOARD_DEPTH/2) + 0.8]} rotation={[0, 0, 0]} />
            <CornerCarving position={[-(BOARD_WIDTH/2) + 0.8, 0.3, -(BOARD_DEPTH/2) + 0.8]} rotation={[0, 0, 0]} />

            {/* Kazans */}
            <Qazan3D position={p2KazanPos} stones={state.kazan.player2} label="ҚАЗАН 2" isAnimating={animatingOtau === 19} seed={19} />
            <Qazan3D position={p1KazanPos} stones={state.kazan.player1} label="ҚАЗАН 1" isAnimating={animatingOtau === 18} seed={18} />

            {/* Otaus P1 */}
            {state.board.player1Otaus.map((stones, i) => (
              <Otau3D
                key={`p1-${i}`}
                index={i}
                linearIndex={i}
                position={getOtauPosition(i)}
                stones={stones}
                isLegal={humanPlayer === 1 && legalMoves.has(i)}
                isSelected={selectedOtau === i && humanPlayer === 1}
                isTuzdyk={state.tuzdyk.player2 === i}
                isAnimating={animatingOtau === i}
                isHoverTarget={hoverTargetLinear === i}
                onClick={() => onOtauClick(i)}
                onHover={handleHoverOtau}
              />
            ))}

            {/* Otaus P2 */}
            {state.board.player2Otaus.map((stones, i) => (
              <Otau3D
                key={`p2-${i}`}
                index={i}
                linearIndex={i + 9}
                position={getOtauPosition(i + 9)}
                stones={stones}
                isLegal={humanPlayer === 2 && legalMoves.has(i)}
                isSelected={selectedOtau === i && humanPlayer === 2}
                isTuzdyk={state.tuzdyk.player1 === i}
                isAnimating={animatingOtau === i + 9}
                isHoverTarget={hoverTargetLinear === i + 9}
                onClick={() => onOtauClick(i)}
                onHover={handleHoverOtau}
              />
            ))}
          </group>
        </Center>
      </Canvas>
    </div>
  )
}
