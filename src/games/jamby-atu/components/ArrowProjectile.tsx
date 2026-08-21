'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { GamePhysicsBody } from '@/three/systems/PhysicsAdapter'
import type { CollisionEnterPayload, IntersectionEnterPayload, RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useJambyEngine, LEVELS, HitZone } from '../engine'

interface ArrowProjectileProps {
  position: [number, number, number]
  direction: THREE.Vector3
  power: number // 0 to 100
  onHit: (zone: HitZone, position: THREE.Vector3) => void
  onMiss: () => void
}

export function ArrowProjectile({ position, direction, power, onHit, onMiss }: ArrowProjectileProps) {
  const rigidBody = useRef<RapierRigidBody>(null)
  const arrowMesh = useRef<THREE.Group>(null)
  const hasHit = useRef(false)
  
  const levelIndex = useJambyEngine(s => s.currentLevelIndex)
  const level = LEVELS[levelIndex]

  useEffect(() => {
    if (!rigidBody.current) return
    
    // Apply initial impulse based on power and direction
    const forceMagnitude = 10 + (power * 0.8) // Base force + power
    const impulse = direction.clone().multiplyScalar(forceMagnitude)
    rigidBody.current.applyImpulse(impulse, true)

  }, [direction, power])

  useFrame(() => {
    if (!rigidBody.current || !arrowMesh.current || hasHit.current) return

    // Apply wind force
    if (level.windStrength > 0) {
      const windForce = new THREE.Vector3(...level.windDirection).multiplyScalar(level.windStrength * 0.5)
      rigidBody.current.applyImpulse(windForce, true)
    }

    // Align arrow to velocity trajectory
    const velocity = rigidBody.current.linvel()
    const vec = new THREE.Vector3(velocity.x, velocity.y, velocity.z)
    if (vec.length() > 0.1) {
      // Look in direction of velocity
      const targetRotation = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        vec.clone().normalize()
      )
      arrowMesh.current.quaternion.slerp(targetRotation, 0.5)
    }

    // Miss detection (fell too low or flew too far)
    const pos = rigidBody.current.translation()
    if (pos.y < -5 || pos.z < -100) {
      hasHit.current = true
      onMiss()
    }
  })

  const handleCollision = (e: CollisionEnterPayload | IntersectionEnterPayload) => {
    if (hasHit.current) return
    
    const otherType = e.other.rigidBodyObject?.userData?.type
    if (otherType === 'target') {
      hasHit.current = true
      const zone = e.other.rigidBodyObject?.userData?.zone as HitZone
      const body = rigidBody.current
      if (!body) return
      
      // Stop arrow
      body.setLinvel({ x: 0, y: 0, z: 0 }, true)
      body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      // Make it kinematic so it sticks
      body.setBodyType(2, true) // 2 = kinematic position
      
      const pos = body.translation()
      onHit(zone, new THREE.Vector3(pos.x, pos.y, pos.z))
    }
  }

  return (
    <GamePhysicsBody 
      ref={rigidBody}
      position={position}
      mass={0.1}
      ccd={true} // Continuous collision detection for fast projectiles
      onIntersectionEnter={handleCollision}
      onCollisionEnter={handleCollision}
      userData={{ type: 'arrow' }}
    >
      <group ref={arrowMesh}>
        {/* Shaft */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.5]} />
          <meshStandardMaterial color="#8b5a2b" />
        </mesh>
        {/* Arrowhead */}
        <mesh position={[0, 0, -0.75]} rotation={[-Math.PI/2, 0, 0]} castShadow>
          <coneGeometry args={[0.05, 0.2]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        {/* Fletching */}
        <mesh position={[0, 0, 0.7]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.3]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    </GamePhysicsBody>
  )
}
