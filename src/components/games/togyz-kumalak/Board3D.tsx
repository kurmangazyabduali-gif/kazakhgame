'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Text, useCursor, Center } from '@react-three/drei'
import * as THREE from 'three'
import { TogyzqumalakState, Player } from '@/games/togyz-kumalak/engine/types'

// Colors based on the reference image
const WOOD_BASE = '#5a1f0a' // Dark red wood background
const WOOD_HIGHLIGHT = '#8b3a1a' // Lighter wood for board top
const HOLE_INNER = '#310a01' // Very dark red/brown for inside holes
const GOLD_TRIM = '#d4a259' // Gold borders around everything
const STONE_COLOR = '#e8d8c3' // White/ivory stones (qorghasyn)
const SELECTED_GLOW = '#ffcc00'

// Dimensions
const BOARD_W = 14
const BOARD_H = 8
const OTAU_W = 0.9
const OTAU_H = 2.4
const SPACING = 1.2
const KAZAN_W = 12
const KAZAN_H = 0.6

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
    // Exact top-down 2D orthographic-like feel, but in 3D
    camera.position.set(0, 10, 0)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [size, camera])
  return null
}

function CustomOtauShape({ position, isKazan = false }: { position: [number, number, number], isKazan?: boolean }) {
  // We create a custom shape that looks like the decorative rectangles with pinched centers
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const w = isKazan ? KAZAN_W / 2 : OTAU_W / 2
    const h = isKazan ? KAZAN_H / 2 : OTAU_H / 2
    
    if (isKazan) {
       // Kazan shape: long rectangle with decorative ends
       s.moveTo(-w, -h)
       s.lineTo(w, -h)
       // decorative bump right
       s.quadraticCurveTo(w + 0.2, 0, w, h)
       s.lineTo(-w, h)
       // decorative bump left
       s.quadraticCurveTo(-w - 0.2, 0, -w, -h)
    } else {
       // Otau shape: rectangle with pinched sides
       s.moveTo(-w, -h)
       s.lineTo(w, -h)
       // pinch right
       s.quadraticCurveTo(w - 0.2, 0, w, h)
       s.lineTo(-w, h)
       // pinch left
       s.quadraticCurveTo(-w + 0.2, 0, -w, -h)
    }
    return s
  }, [isKazan])

  const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 }

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Gold Trim Outer Layer */}
      <mesh position={[0, 0, -0.1]} receiveShadow castShadow>
        <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.22, bevelSize: 0.08 }]} />
        <meshStandardMaterial color={GOLD_TRIM} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Dark Inner Hole */}
      <mesh position={[0, 0, 0]}>
        <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.05, bevelSize: 0.01 }]} />
        <meshStandardMaterial color={HOLE_INNER} roughness={0.9} />
      </mesh>
    </group>
  )
}

function getStonePosition(index: number, stoneCount: number, isKazan: boolean): [number, number, number] {
  // Arrange stones in neat rows/columns just like the reference picture
  const r = 0.15 // stone radius
  const spacing = 0.35 // space between centers
  
  if (isKazan) {
    // kazans: pack tightly left to right
    const cols = 20
    const col = index % cols
    const row = Math.floor(index / cols)
    const startX = -KAZAN_W / 2 + 0.4
    return [startX + (col * spacing), 0.1, (row * spacing) - 0.15]
  } else {
    // otaus: columns of 5, filling bottom to top
    // Since otaus face different ways, we just do local coordinates
    const rows = 5
    const row = index % rows
    const col = Math.floor(index / rows)
    // start from "bottom" of the otau
    const startZ = OTAU_H / 2 - 0.3
    const startX = -OTAU_W / 2 + 0.3
    return [startX + (col * spacing), 0.1, startZ - (row * spacing)]
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

  // Need to rotate P2's stones 180 degrees so they fill from their edge inwards
  const rotY = isP1 ? 0 : Math.PI

  return (
    <group position={position}>
      {/* Clickable Area & Visuals */}
      <group
        onClick={() => isLegal && onClick()}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <CustomOtauShape position={[0, 0, 0]} />
        
        {/* Hover/Select Overlay */}
        {(hovered && isLegal || isSelected || isHoverTarget) && (
          <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[OTAU_W, OTAU_H]} />
            <meshBasicMaterial color={isSelected ? '#ffffff' : SELECTED_GLOW} transparent opacity={0.3} />
          </mesh>
        )}
      </group>

      {/* Stones */}
      <group rotation={[0, rotY, 0]}>
        {!isTuzdyk && Array.from({ length: stones }).map((_, i) => {
          const [sx, sy, sz] = getStonePosition(i, stones, false)
          return (
            <mesh key={`stone-${i}`} position={[sx, sy, sz]} castShadow>
              <sphereGeometry args={[0.15, 32, 32]} />
              <meshStandardMaterial color={STONE_COLOR} roughness={0.2} metalness={0.1} />
            </mesh>
          )
        })}
      </group>

      {/* Number Labels (Gold Text) */}
      <Text 
        position={[0, 0.1, isP1 ? OTAU_H/2 + 0.6 : -OTAU_H/2 - 0.6]} 
        rotation={[-Math.PI/2, 0, isP1 ? 0 : Math.PI]} 
        fontSize={0.4} 
        color="#fff" 
        font="/fonts/kz-ornament-font.woff"
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
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color={STONE_COLOR} roughness={0.2} metalness={0.1} />
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
    // In the image, index 1 is on the right for P1? Wait, standard is left-to-right 1 to 9.
    // The reference image shows 1 to 9 right-to-left for the top player, 1 to 9 left-to-right for bottom player.
    const colIdx = isP1 ? linearIdx : 17 - linearIdx
    const x = (colIdx - 4) * SPACING
    const z = isP1 ? 2.5 : -2.5
    return [x, 0, z]
  }

  const p1KazanPos: [number, number, number] = [0, 0, 0.6]
  const p2KazanPos: [number, number, number] = [0, 0, -0.6]

  return (
    <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: WOOD_BASE, backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }}>
      <Canvas shadows orthographic camera={{ zoom: 50, position: [0, 10, 0] }} gl={{ antialias: true }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[0, 10, 0]} intensity={1.5} castShadow />
        
        <Center>
          <group>
            {/* The wooden board texture is mostly the background in this style, but let's add a backplate */}
            <mesh position={[0, -0.5, 0]} receiveShadow>
              <boxGeometry args={[BOARD_W, 0.5, BOARD_H]} />
              <meshStandardMaterial color={WOOD_HIGHLIGHT} roughness={0.8} />
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
      </Canvas>
    </div>
  )
}
