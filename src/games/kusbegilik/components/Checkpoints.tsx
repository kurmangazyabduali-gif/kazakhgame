'use client'

import { useKusbegilikEngine } from '../engine'
import { GamePhysicsBody, CuboidCollider } from '@/three/systems/PhysicsAdapter'
import type { IntersectionEnterPayload } from '@react-three/rapier'

export function Checkpoints() {
  const checkpoints = useKusbegilikEngine(s => s.checkpoints)
  const passCheckpoint = useKusbegilikEngine(s => s.passCheckpoint)

  return (
    <group>
      {checkpoints.map(cp => (
        <group key={cp.id} position={cp.position}>
          {/* Visual Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[cp.radius, 0.5, 8, 24]} />
            <meshStandardMaterial 
              color={cp.passed ? "#10b981" : "#eab308"} 
              transparent 
              opacity={cp.passed ? 0.2 : 0.8}
              emissive={cp.passed ? "#10b981" : "#eab308"}
              emissiveIntensity={cp.passed ? 0.2 : 0.5}
            />
          </mesh>
          
          {/* Sensor for physics */}
          {!cp.passed && (
            <GamePhysicsBody 
              type="fixed" 
              userData={{ type: 'checkpoint', id: cp.id }}
              onIntersectionEnter={(e: IntersectionEnterPayload) => {
                if (e.other.rigidBodyObject?.userData?.type === 'eagle') {
                  passCheckpoint(cp.id)
                }
              }}
            >
              {/* Using a box sensor covering the inside of the ring */}
              <CuboidCollider args={[cp.radius, cp.radius, 1]} sensor />
            </GamePhysicsBody>
          )}
        </group>
      ))}
    </group>
  )
}
