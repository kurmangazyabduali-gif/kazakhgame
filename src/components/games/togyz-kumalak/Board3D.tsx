'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, Text, useCursor, RoundedBox, Center, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { TogyzqumalakState, Player } from '@/games/togyz-kumalak/engine/types'

// Physical Layout Constants
const OTAU_RADIUS = 0.55
const QAZAN_RADIUS = 1.6
const STONE_RADIUS = 0.12
const OTAU_SPACING = 1.3
const ROW_SPACING = 1.8
const BOARD_WIDTH = (9 * OTAU_SPACING) + (QAZAN_RADIUS * 4) + 2
const BOARD_DEPTH = ROW_SPACING + (OTAU_RADIUS * 4) + 1

// Colors
const WOOD_COLOR = '#2a1608' // Dark walnut
const WOOD_HIGHLIGHT = '#3d2410'
const GOLD_COLOR = '#d4af37'
const STONE_COLOR = '#e8d9c5' // Natural bone/stone

interface Board3DProps {
  state: TogyzqumalakState
  legalMoves: Set<number>
  selectedOtau: number | null
  animatingOtau: number | null
  humanPlayer: Player
  onOtauClick: (otauIndex: number) => void
}

/**
 * Camera Fitter to ensure the board always fits the screen
 */
function CameraRig() {
  const { camera, size } = useThree()
  
  useEffect(() => {
    const aspect = size.width / size.height
    // Base position
    let y = 12
    let z = 8
    
    // If screen is narrow (mobile), we need to pull camera back
    if (aspect < 1) {
      y = 18 / aspect
      z = 4
    } else if (aspect < 1.5) {
      y = 14
      z = 6
    }
    
    camera.position.set(0, y, z)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [size, camera])

  return null
}

function getWoodMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: WOOD_COLOR,
    roughness: 0.85,
    metalness: 0.05,
    clearcoat: 0.1,
    clearcoatRoughness: 0.8,
  })
}

// Generate clustered offsets for stones in a pit
function generateCluster(count: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  const phi = Math.PI * (3 - Math.sqrt(5)) // golden angle
  for (let i = 0; i < count; i++) {
    // Vogel's spiral for better natural packing
    const r = radius * 0.7 * Math.sqrt(i / (count || 1))
    const theta = i * phi
    points.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r))
  }
  return points
}

// Visual Otau Component
function Otau3D({
  index,
  position,
  stones,
  isLegal,
  isSelected,
  isTuzdyk,
  isAnimating,
  onClick
}: {
  index: number
  position: [number, number, number]
  stones: number
  isLegal: boolean
  isSelected: boolean
  isTuzdyk: boolean
  isAnimating: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && isLegal)

  const stoneOffsets = useMemo(() => generateCluster(stones, OTAU_RADIUS), [stones])
  
  const innerColor = isSelected ? '#5c3a21' : hovered && isLegal ? '#4a2a16' : '#140a04'

  return (
    <group position={position}>
      {/* Pit Hole (Carved effect) */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.05, 0]}
        onClick={() => isLegal && onClick()}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
      >
        <circleGeometry args={[OTAU_RADIUS, 32]} />
        <meshStandardMaterial color={innerColor} roughness={0.9} />
      </mesh>
      
      {/* Pit Inner Shadow Rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[OTAU_RADIUS - 0.05, OTAU_RADIUS, 32]} />
        <meshStandardMaterial color="#0a0502" transparent opacity={0.6} />
      </mesh>

      {/* Beveled Edge / Gold Rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[OTAU_RADIUS, OTAU_RADIUS + 0.06, 32]} />
        <meshStandardMaterial color={isTuzdyk ? GOLD_COLOR : WOOD_HIGHLIGHT} metalness={isTuzdyk ? 0.8 : 0.2} roughness={isTuzdyk ? 0.2 : 0.8} />
      </mesh>
      
      {/* Active Animation Glow */}
      {isAnimating && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
          <ringGeometry args={[OTAU_RADIUS + 0.08, OTAU_RADIUS + 0.15, 32]} />
          <meshBasicMaterial color={GOLD_COLOR} transparent opacity={0.5} />
        </mesh>
      )}

      {/* Tuzdyk Indicator */}
      {isTuzdyk && (
        <Text
          position={[0, 0.1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color={GOLD_COLOR}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          ТҰЗДЫҚ
        </Text>
      )}

      {/* Stones */}
      {!isTuzdyk && stoneOffsets.map((offset, i) => {
        // slight random rotation and scale for realism
        const rot = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number]
        const scale = 0.9 + Math.random() * 0.2
        return (
          <mesh key={`stone-${i}`} position={[offset.x, 0.08 + (i * 0.015), offset.z]} rotation={rot} scale={scale} castShadow receiveShadow>
            <icosahedronGeometry args={[STONE_RADIUS, 1]} />
            <meshStandardMaterial color={STONE_COLOR} roughness={0.7} metalness={0.1} />
          </mesh>
        )
      })}
    </group>
  )
}

// Visual Kazan Component
function Qazan3D({ position, stones, label, isAnimating }: { position: [number, number, number], stones: number, label: string, isAnimating: boolean }) {
  const stoneOffsets = useMemo(() => generateCluster(stones, QAZAN_RADIUS * 0.9), [stones])

  return (
    <group position={position}>
      {/* Kazan Hole */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[QAZAN_RADIUS, 64]} />
        <meshStandardMaterial color="#140a04" roughness={0.9} />
      </mesh>
      
      {/* Inner Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[QAZAN_RADIUS - 0.1, QAZAN_RADIUS, 64]} />
        <meshStandardMaterial color="#0a0502" transparent opacity={0.6} />
      </mesh>

      {/* Kazan Bevel / Bronze Edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[QAZAN_RADIUS, QAZAN_RADIUS + 0.15, 64]} />
        <meshStandardMaterial color="#8a5a32" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {isAnimating && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
          <ringGeometry args={[QAZAN_RADIUS + 0.2, QAZAN_RADIUS + 0.3, 64]} />
          <meshBasicMaterial color={GOLD_COLOR} transparent opacity={0.4} />
        </mesh>
      )}

      {/* Stones */}
      {stoneOffsets.map((offset, i) => {
        const rot = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number]
        const scale = 0.9 + Math.random() * 0.2
        return (
          <mesh key={`kazan-stone-${i}`} position={[offset.x, 0.08 + (i * 0.005), offset.z]} rotation={rot} scale={scale} castShadow receiveShadow>
            <icosahedronGeometry args={[STONE_RADIUS, 1]} />
            <meshStandardMaterial color={STONE_COLOR} roughness={0.7} metalness={0.1} />
          </mesh>
        )
      })}
    </group>
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
  const woodMaterial = useMemo(() => getWoodMaterial(), [])

  // Calculate positions
  // Linear index: 0-8 for P1 (left to right), 9-17 for P2 (right to left from P1 perspective)
  const getOtauPosition = (linearIdx: number): [number, number, number] => {
    const isP1 = linearIdx < 9
    const row = isP1 ? 1 : -1
    const colIdx = isP1 ? linearIdx : 17 - linearIdx
    const col = colIdx - 4 // center at 0
    return [col * OTAU_SPACING, 0, row * (ROW_SPACING / 2)]
  }

  const p1KazanPos: [number, number, number] = [(4.5 * OTAU_SPACING) + QAZAN_RADIUS - 0.2, 0, 0]
  const p2KazanPos: [number, number, number] = [-(4.5 * OTAU_SPACING) - QAZAN_RADIUS + 0.2, 0, 0]

  return (
    <div className="absolute inset-0 w-full h-full bg-[#080503]">
      <Canvas shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
        <CameraRig />
        
        <ambientLight intensity={0.4} color="#ffe8cc" />
        <directionalLight 
          position={[5, 12, 4]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
          color="#ffeedd"
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#aaddff" />
        <Environment preset="studio" />

        <Center>
          <group position={[0, 0, 0]}>
            {/* Main Board Wood Block */}
            <RoundedBox args={[BOARD_WIDTH, 1.2, BOARD_DEPTH]} radius={0.3} smoothness={4} position={[0, -0.6, 0]} castShadow receiveShadow>
              <primitive object={woodMaterial} />
            </RoundedBox>
            
            {/* Dark inner base for the whole board to give depth to carvings */}
            <mesh position={[0, -0.01, 0]}>
              <boxGeometry args={[BOARD_WIDTH - 0.5, 0.1, BOARD_DEPTH - 0.5]} />
              <meshStandardMaterial color="#050201" />
            </mesh>

            {/* Center Motif (Golden line) */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[BOARD_WIDTH - 4, 0.02]} />
              <meshStandardMaterial color={GOLD_COLOR} metalness={0.8} roughness={0.3} transparent opacity={0.5} />
            </mesh>

            {/* Kazans */}
            <Qazan3D position={p2KazanPos} stones={state.kazan.player2} label="P2 ҚАЗАН" isAnimating={animatingOtau === 19} />
            <Qazan3D position={p1KazanPos} stones={state.kazan.player1} label="P1 ҚАЗАН" isAnimating={animatingOtau === 18} />

            {/* Otaus P1 */}
            {state.board.player1Otaus.map((stones, i) => (
              <Otau3D
                key={`p1-${i}`}
                index={i}
                position={getOtauPosition(i)}
                stones={stones}
                isLegal={humanPlayer === 1 && state.currentPlayer === 1 && legalMoves.has(i)}
                isSelected={selectedOtau === i}
                isTuzdyk={state.tuzdyk.player2 === i}
                isAnimating={animatingOtau === i}
                onClick={() => onOtauClick(i)}
              />
            ))}

            {/* Otaus P2 */}
            {state.board.player2Otaus.map((stones, i) => {
              const logicalIdx = i + 9
              return (
                <Otau3D
                  key={`p2-${logicalIdx}`}
                  index={logicalIdx}
                  position={getOtauPosition(logicalIdx)}
                  stones={stones}
                  isLegal={humanPlayer === 2 && state.currentPlayer === 2 && legalMoves.has(logicalIdx)}
                  isSelected={selectedOtau === logicalIdx}
                  isTuzdyk={state.tuzdyk.player1 === logicalIdx}
                  isAnimating={animatingOtau === logicalIdx}
                  onClick={() => onOtauClick(logicalIdx)}
                />
              )
            })}
          </group>
        </Center>
        
        {/* Soft shadow catcher on the "table" */}
        <ContactShadows position={[0, -1.2, 0]} opacity={0.8} scale={30} blur={2.5} far={4} color="#000000" />
      </Canvas>
    </div>
  )
}
