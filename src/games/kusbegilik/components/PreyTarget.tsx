'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { GamePhysicsBody, CuboidCollider } from '@/three/systems/PhysicsAdapter'
import { useKusbegilikEngine } from '../engine'

export function PreyTarget({ position = [0, 0, -200] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null)
  const rigidBody = useRef<RapierRigidBody>(null)
  
  const missionState = useKusbegilikEngine(s => s.missionState)

  useFrame((state) => {
    if (!meshRef.current || !rigidBody.current) return
    
    // Very simple wander movement for MVP
    const time = state.clock.elapsedTime
    const wanderX = Math.sin(time * 0.5) * 20
    const wanderZ = Math.cos(time * 0.3) * 20
    
    const nextPos = {
      x: position[0] + wanderX,
      y: position[1] + 0.5,
      z: position[2] + wanderZ
    }

    if (missionState !== 'ATTACK' && missionState !== 'RETURN') {
      rigidBody.current.setNextKinematicTranslation(nextPos)
    }

    // Determine distance to player (if player is nearby, set target located)
    // Actually we'll let the eagle controller calculate distance to Target. 
    // This component will just broadcast its position by assigning an ID or ref.
  })

  return (
    <GamePhysicsBody ref={rigidBody} type="kinematicPosition" position={position} userData={{ type: 'prey' }}>
      <group ref={meshRef}>
        <mesh castShadow>
          {/* A simple box representing a fox/hare */}
          <boxGeometry args={[1, 0.5, 2]} />
          <meshStandardMaterial color="#d97706" /> {/* Orange/Brown like a fox */}
        </mesh>
        
        {/* Sensor for capture radius */}
        <CuboidCollider args={[2, 2, 2]} sensor />
      </group>
    </GamePhysicsBody>
  )
}
