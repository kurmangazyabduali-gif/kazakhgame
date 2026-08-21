'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useJambyEngine } from '../engine'
import * as THREE from 'three'

export function HorseController({ children }: { children: React.ReactNode }) {
  const gameState = useJambyEngine(s => s.gameState)
  const group = useRef<THREE.Group>(null)
  const speed = useRef(0)
  
  useFrame((state, delta) => {
    if (!group.current) return

    // Reset position if we are in AIM but Z is way past target, or we just changed levels
    // Actually, let's reset horse position when state goes back to RIDE for the new level
    if (gameState === 'RIDE' && group.current.position.z < -20) {
      group.current.position.z = 0
    }

    // Logic: move forward on Z axis during RIDE, AIM, DRAW, RELEASE, ARROW_FLIGHT
    const movingStates = ['RIDE', 'AIM', 'DRAW', 'RELEASE', 'ARROW_FLIGHT']
    const targetSpeed = movingStates.includes(gameState) ? 15 : 0
    
    // Smooth acceleration / deceleration
    speed.current = THREE.MathUtils.lerp(speed.current, targetSpeed, delta * 2)
    
    // Move horse
    group.current.position.z -= speed.current * delta
    
    // Simple bobbing effect
    if (speed.current > 1) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 10) * 0.1
    } else {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, delta * 5)
    }
  })

  return (
    <group ref={group}>
      {children}
    </group>
  )
}

// Temporary visual mock for the horse
export function HorseMock() {
  return (
    <group position={[0, 1, 0]}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.5, 2.5]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.2, -1.5]}>
        <boxGeometry args={[0.6, 1, 1]} />
        <meshStandardMaterial color="#3e2723" />
      </mesh>
    </group>
  )
}
