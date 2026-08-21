'use client'

import { GamePhysicsBody } from '@/three/systems/PhysicsAdapter'

const LANDMARKS = Array.from({ length: 50 }, (_, i) => {
  const x = ((i * 73) % 1000) - 500
  const z = ((i * 137) % 1000) - 500
  const scale = 2 + ((i * 19) % 50) / 10
  return { x, z, scale }
})

export function FlightEnvironment() {
  return (
    <group>
      {/* Ground */}
      <GamePhysicsBody type="fixed" colliders="cuboid" position={[0, -1, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[2000, 2, 2000]} />
          <meshStandardMaterial color="#556b2f" /> {/* Dark olive green for steppe */}
        </mesh>
      </GamePhysicsBody>

      {/* Landmarks to give sense of scale and speed */}
      {LANDMARKS.map(({ x, z, scale }, i) => (
        <mesh key={i} position={[x, scale / 2, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0, scale, scale, 4]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      ))}
    </group>
  )
}
