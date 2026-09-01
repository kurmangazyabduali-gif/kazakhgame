'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useJambyEngine, LEVELS } from '../engine'
import { GamePhysicsBody } from '@/three/systems/PhysicsAdapter'
import * as THREE from 'three'

interface JambyTargetProps {
  position: [number, number, number]
}

export function JambyTarget({ position }: JambyTargetProps) {
  const levelIndex = useJambyEngine(s => s.currentLevelIndex)
  const level = LEVELS[levelIndex]
  const group = useRef<THREE.Group>(null)
  const initialX = position[0]

  useFrame((state) => {
    if (!group.current) return
    if (level.targetMovement === 'NONE') return

    const speed = level.targetMovement === 'FAST' ? 3 : 1.5
    const amplitude = 3
    group.current.position.x = initialX + Math.sin(state.clock.elapsedTime * speed) * amplitude
  })

  // Sizes for score zones based on level difficulty
  const baseSize = level.targetSize
  const bullseyeR = 0.25 * baseSize
  const centerR = 0.6 * baseSize
  const outerR = 1.1 * baseSize

  return (
    <group ref={group} position={position}>
      {/* Wooden Pole with Gold Ornament Cap */}
      <mesh position={[0, -2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 4.5]} />
        <meshStandardMaterial color="#3D2817" roughness={0.7} />
      </mesh>

      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Target Outer Ring (Felt Backing) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[outerR, outerR, 0.2]} />
        <meshStandardMaterial color="#5C1D15" roughness={0.8} />
      </mesh>

      {/* Target Inner Ring (Terracotta Red) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.11]}>
        <cylinderGeometry args={[centerR, centerR, 0.02]} />
        <meshStandardMaterial color="#B85D36" roughness={0.5} />
      </mesh>

      {/* Bullseye Gold "ЖАМБЫ" Silver-Gold Disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.13]}>
        <cylinderGeometry args={[bullseyeR, bullseyeR, 0.03]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Physics Hitboxes */}
      <GamePhysicsBody type="fixed" userData={{ type: 'target', zone: 'BULLSEYE' }}>
        <mesh position={[0, 0, 0.13]}>
          <cylinderGeometry args={[bullseyeR, bullseyeR, 0.1]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </GamePhysicsBody>

      <GamePhysicsBody type="fixed" userData={{ type: 'target', zone: 'CENTER' }}>
        <mesh position={[0, 0, 0.11]}>
          <cylinderGeometry args={[centerR, centerR, 0.1]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </GamePhysicsBody>

      <GamePhysicsBody type="fixed" userData={{ type: 'target', zone: 'OUTER' }}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[outerR, outerR, 0.1]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </GamePhysicsBody>
    </group>
  )
}
