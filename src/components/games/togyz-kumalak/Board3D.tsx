'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Text, useCursor, RoundedBox, Center, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { TogyzqumalakState, Player } from '@/games/togyz-kumalak/engine/types'

const BOARD_COLOR = '#d4c3a3' // Light wood
const HOLE_COLOR = '#8c735a' // Shadowed wood
const STONE_COLOR = '#3d2b1f' // Dark brown stones
const RED_STONE_COLOR = '#cc2900' // Red stone

const SLOT_WIDTH = 0.45
const SLOT_LENGTH = 3.2
const SLOT_SPACING = 0.95
const KAZAN_LENGTH = 8.5
const KAZAN_WIDTH = 0.6

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
    let y = 10
    let z = 10
    if (aspect < 1) {
      y = 16 / aspect
      z = 4
    }
    camera.position.set(0, y, z)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [size, camera])
  return null
}

function getStonePositionInSlot(index: number, stoneCount: number, isP1: boolean, isKazan: boolean = false): [number, number, number] {
  // Stones are arranged in a line. If they overflow, stack them.
  const rowLen = isKazan ? 40 : 12
  const spacing = 0.2
  
  const lineIdx = index % rowLen
  const stackIdx = Math.floor(index / rowLen)
  
  const y = 0.05 + (stackIdx * 0.16)
  
  if (isKazan) {
    // Kazans are aligned along X axis
    const startX = -((Math.min(stoneCount, rowLen) - 1) * spacing) / 2
    return [startX + (lineIdx * spacing), y, 0]
  } else {
    // Otaus are aligned along Z axis
    // For P1, start closest to player (positive Z) and go towards center (negative Z)
    // For P2, start closest to player (negative Z) and go towards center (positive Z)
    const totalInRow = Math.min(stoneCount, rowLen)
    const zOffset = (lineIdx * spacing) - ((totalInRow - 1) * spacing) / 2
    return [0, y, zOffset]
  }
}

function OtauSlot({
  index, linearIndex, position, stones, isLegal, isSelected, isTuzdyk, isAnimating, isHoverTarget, isP1, onClick, onHover
}: {
  index: number, linearIndex: number, position: [number, number, number], stones: number, 
  isLegal: boolean, isSelected: boolean, isTuzdyk: boolean, isAnimating: boolean, isHoverTarget: boolean, isP1: boolean,
  onClick: () => void, onHover: (idx: number | null) => void
}) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && isLegal)

  const handlePointerOver = (e: any) => { e.stopPropagation(); setHovered(true); if(isLegal) onHover(index) }
  const handlePointerOut = (e: any) => { e.stopPropagation(); setHovered(false); onHover(null) }

  return (
    <group position={position}>
      {/* The Hole */}
      <RoundedBox 
        args={[SLOT_WIDTH, 0.1, SLOT_LENGTH]} 
        radius={SLOT_WIDTH/2.1} 
        smoothness={4} 
        position={[0, -0.05, 0]}
        onClick={() => isLegal && onClick()}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial color={hovered && isLegal ? '#a68c70' : HOLE_COLOR} roughness={0.9} />
      </RoundedBox>

      {/* Target glow / Selection */}
      {(isAnimating || isHoverTarget || isSelected) && (
        <RoundedBox args={[SLOT_WIDTH + 0.15, 0.12, SLOT_LENGTH + 0.15]} radius={SLOT_WIDTH/2} position={[0, -0.06, 0]}>
          <meshBasicMaterial color={isHoverTarget ? '#ff9900' : isSelected ? '#ffffff' : '#ffcc00'} transparent opacity={0.5} />
        </RoundedBox>
      )}

      {/* Stones */}
      {!isTuzdyk && Array.from({ length: stones }).map((_, i) => {
        const [sx, sy, sz] = getStonePositionInSlot(i, stones, isP1)
        // In the photo, there is usually one red stone mixed in, let's make the first stone red if there's an odd number or just randomly?
        // Actually, let's just make the very first stone red to match the photo's aesthetic
        const isRed = i === 0 && stones > 1 
        return (
          <mesh key={`stone-${i}`} position={[sx, sy, sz]} castShadow>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshPhysicalMaterial color={isRed ? RED_STONE_COLOR : STONE_COLOR} roughness={0.4} clearcoat={0.5} />
          </mesh>
        )
      })}

      {/* Tuzdyk Marker */}
      {isTuzdyk && (
        <group position={[0, 0.1, 0]}>
           <mesh castShadow>
             <boxGeometry args={[SLOT_WIDTH - 0.1, 0.2, SLOT_LENGTH - 0.2]} />
             <meshStandardMaterial color="#b39a7b" />
           </mesh>
           <Text position={[0, 0.15, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.25} color="#4a3623">
             ТУЗДЫК
           </Text>
        </group>
      )}
      
      {/* Number Label */}
      <Text position={[0, 0, isP1 ? SLOT_LENGTH/2 + 0.4 : -SLOT_LENGTH/2 - 0.4]} rotation={[-Math.PI/2, 0, isP1 ? 0 : Math.PI]} fontSize={0.3} color="#4a3623">
        {index + 1}
      </Text>

      {/* Hover stones count */}
      {(hovered || isHoverTarget) && !isTuzdyk && (
        <Text position={[0, 1.0, 0]} fontSize={0.5} color="#ff9900" outlineWidth={0.02} outlineColor="#000">
          {stones}
        </Text>
      )}
    </group>
  )
}

function KazanSlot({ position, stones, isP1, isAnimating }: { position: [number, number, number], stones: number, isP1: boolean, isAnimating: boolean }) {
  return (
    <group position={position}>
      {/* Kazan Hole */}
      <RoundedBox args={[KAZAN_LENGTH, 0.1, KAZAN_WIDTH]} radius={KAZAN_WIDTH/2.1} smoothness={4} position={[0, -0.05, 0]}>
        <meshStandardMaterial color={HOLE_COLOR} roughness={0.9} />
      </RoundedBox>

      {isAnimating && (
        <RoundedBox args={[KAZAN_LENGTH + 0.15, 0.12, KAZAN_WIDTH + 0.15]} radius={KAZAN_WIDTH/2} position={[0, -0.06, 0]}>
          <meshBasicMaterial color="#ffcc00" transparent opacity={0.5} />
        </RoundedBox>
      )}

      {/* Stones */}
      {Array.from({ length: stones }).map((_, i) => {
        const [sx, sy, sz] = getStonePositionInSlot(i, stones, isP1, true)
        return (
          <mesh key={`kazan-stone-${i}`} position={[sx, sy, sz]} castShadow>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshPhysicalMaterial color={STONE_COLOR} roughness={0.4} clearcoat={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function Board3D({
  state, legalMoves, selectedOtau, animatingOtau, humanPlayer, onOtauClick,
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
    const x = (colIdx - 4) * SLOT_SPACING
    const z = isP1 ? 2.5 : -2.5
    return [x, 0.1, z]
  }

  const p1KazanPos: [number, number, number] = [0, 0.1, 0.45]
  const p2KazanPos: [number, number, number] = [0, 0.1, -0.45]

  return (
    <div className="absolute inset-0 w-full h-full bg-[#1e4a75]">
      {/* Background Ornament pattern using CSS */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #eebb00 10%, transparent 80%)' }} />
           
      <Canvas shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <CameraRig />
        
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} color="#fffcf5" />
        <Environment preset="city" />
        
        <Center>
          <group>
            {/* The folding board base */}
            <RoundedBox args={[9.5, 0.4, 8.5]} radius={0.1} smoothness={4} position={[0, -0.2, 0]} receiveShadow>
              <meshPhysicalMaterial color={BOARD_COLOR} roughness={0.7} clearcoat={0.1} />
            </RoundedBox>
            
            {/* Center Hinge Line */}
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[9.5, 0.01, 0.02]} />
              <meshStandardMaterial color="#a08a6b" />
            </mesh>

            {/* Kazans */}
            <KazanSlot position={p2KazanPos} stones={state.kazan.player2} isP1={false} isAnimating={animatingOtau === 19} />
            <KazanSlot position={p1KazanPos} stones={state.kazan.player1} isP1={true} isAnimating={animatingOtau === 18} />

            {/* Otaus */}
            {state.board.player1Otaus.map((stones, i) => (
              <OtauSlot key={`p1-${i}`} index={i} linearIndex={i} position={getOtauPosition(i)} stones={stones}
                isLegal={humanPlayer === 1 && legalMoves.has(i)} isSelected={selectedOtau === i && humanPlayer === 1}
                isTuzdyk={state.tuzdyk.player2 === i} isAnimating={animatingOtau === i} isHoverTarget={hoverTargetLinear === i}
                isP1={true} onClick={() => onOtauClick(i)} onHover={handleHoverOtau} />
            ))}

            {state.board.player2Otaus.map((stones, i) => (
              <OtauSlot key={`p2-${i}`} index={i} linearIndex={i + 9} position={getOtauPosition(i + 9)} stones={stones}
                isLegal={humanPlayer === 2 && legalMoves.has(i)} isSelected={selectedOtau === i && humanPlayer === 2}
                isTuzdyk={state.tuzdyk.player1 === i} isAnimating={animatingOtau === i + 9} isHoverTarget={hoverTargetLinear === i + 9}
                isP1={false} onClick={() => onOtauClick(i)} onHover={handleHoverOtau} />
            ))}
          </group>
        </Center>
      </Canvas>
    </div>
  )
}
