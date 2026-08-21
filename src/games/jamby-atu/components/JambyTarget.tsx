'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useJambyEngine, LEVELS } from '../engine'
import { GamePhysicsBody, CuboidCollider } from '@/three/systems/PhysicsAdapter'
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
  const bullseyeR = 0.2 * baseSize
  const centerR = 0.5 * baseSize
  const outerR = 1.0 * baseSize

  return (
    <group ref={group} position={position}>
      {/* Stand */}
      <mesh position={[0, -2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial color="#4a3b2c" />
      </mesh>
      
      {/* Target Board - visually */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[outerR, outerR, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.11]}>
        <cylinderGeometry args={[centerR, centerR, 0.02]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]}>
        <cylinderGeometry args={[bullseyeR, bullseyeR, 0.02]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Physics Hitboxes - Using Sensor colliders attached to a fixed body. 
          We use sensor so the arrow can overlap and trigger intersection manually, or just bounce. 
          For MVP, we just use standard colliders and detect collision. */}
      
      <GamePhysicsBody type="fixed" userData={{ type: 'target', zone: 'BULLSEYE' }}>
        <CuboidCollider args={[bullseyeR, bullseyeR, 0.2]} />
      </GamePhysicsBody>
      
      <GamePhysicsBody type="fixed" userData={{ type: 'target', zone: 'CENTER' }}>
        <CuboidCollider args={[centerR, centerR, 0.15]} />
      </GamePhysicsBody>

      <GamePhysicsBody type="fixed" userData={{ type: 'target', zone: 'OUTER' }}>
        <CuboidCollider args={[outerR, outerR, 0.1]} />
      </GamePhysicsBody>
    </group>
  )
}
