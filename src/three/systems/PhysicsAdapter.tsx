'use client'

import { Physics, RigidBody, CuboidCollider, BallCollider, CylinderCollider } from '@react-three/rapier'

interface PhysicsAdapterProps {
  children: React.ReactNode
  debug?: boolean
  gravity?: [number, number, number]
}

export function PhysicsAdapter({ 
  children, 
  debug = false, 
  gravity = [0, -9.81, 0] 
}: PhysicsAdapterProps) {
  return (
    <Physics debug={debug} gravity={gravity}>
      {children}
    </Physics>
  )
}

// Re-exporting Rapier components wraps the physics implementation so the rest of the game code 
// doesn't need to know we're using Rapier specifically, allowing future swap.
export { RigidBody as GamePhysicsBody }
export { CuboidCollider, BallCollider, CylinderCollider }
