'use client'

import React, { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import * as THREE from 'three'
import { ScenarioEngine } from '@/games/engine/scenario/ScenarioEngine'

interface Teapot3DProps {
  id: string
  engine: ScenarioEngine | null
  initialPosition: [number, number, number]
}

export default function Teapot3D({ id, engine, initialPosition }: Teapot3DProps) {
  const [pos, setPos] = useState<[number, number, number]>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const { camera, raycaster, size } = useThree()

  // Use a plane for dragging in 3D space
  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.1) // table height

  const bind = useDrag(({ active, movement: [mx, my], xy: [cx, cy] }) => {
    setIsDragging(active)

    if (active) {
      document.body.style.cursor = 'grabbing'
      const x = (cx / size.width) * 2 - 1
      const y = -(cy / size.height) * 2 + 1
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      
      const intersectPoint = new THREE.Vector3()
      raycaster.ray.intersectPlane(dragPlane, intersectPoint)
      
      if (intersectPoint) {
        // Find nearest cup
        let nearestCupId = null
        let minDist = 0.5 // Pour radius
        
        if (engine) {
          const state = engine.getStateSnapshot()
          if (state) {
            state.items.forEach(item => {
              if (item.id.startsWith('cup') && !item.state?.filled) { // Only pour if not filled
                const scale = 0.007
                const cupX = (item.initialPosition.x - 450) * scale
                const cupZ = (item.initialPosition.y - 400) * scale
                const dist = Math.sqrt(Math.pow(intersectPoint.x - cupX, 2) + Math.pow(intersectPoint.z - cupZ, 2))
                
                if (dist < minDist) {
                  minDist = dist
                  nearestCupId = item.id
                  // Snap slightly above and behind cup
                  intersectPoint.x = cupX + 0.1
                  intersectPoint.z = cupZ - 0.2
                }
              }
            })
          }
        }

        if (nearestCupId) {
          setPos([intersectPoint.x, 0.5, intersectPoint.z])
          window.dispatchEvent(new CustomEvent('teapot_pouring', { detail: { cupId: nearestCupId } }))
          // Tilt the teapot
          if (groupRef.current) groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -Math.PI / 3, 0.2)
        } else {
          setPos([intersectPoint.x, 0.4, intersectPoint.z])
          if (groupRef.current) groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.2)
        }
      }
    } else {
      document.body.style.cursor = 'grab'
      setPos([initialPosition[0], 0.1, initialPosition[2]])
      if (groupRef.current) groupRef.current.rotation.z = 0
    }
  })

  useFrame((sceneState, delta) => {
    if (!groupRef.current) return
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pos[0], 20 * delta)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pos[1], 15 * delta)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, pos[2], 20 * delta)
    
    if (!isDragging) {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 10 * delta)
    }
  })

  // Points for a beautiful smooth teapot curve
  const points = []
  for (let i = 0; i <= 20; i++) {
    const t = i / 20
    const r = Math.sin(t * Math.PI) * 0.3 + (1 - t) * 0.1
    const y = t * 0.4
    points.push(new THREE.Vector2(r, y))
  }

  const handlePointerOver = () => document.body.style.cursor = 'grab'
  const handlePointerOut = () => document.body.style.cursor = 'auto'

  return (
    <group 
      ref={groupRef} 
      {...(bind() as any)}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Body using Lathe */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <latheGeometry args={[points, 32]} />
        <meshPhysicalMaterial color="#FAF9F6" roughness={0.05} metalness={0.1} clearcoat={1.0} /> 
      </mesh>
      
      {/* Golden Base Rim */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.01, 16, 32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Golden Neck Trim */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.015, 16, 32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Elegant Curved Spout */}
      <group position={[0.25, 0.25, 0]} rotation={[0, 0, -Math.PI / 3.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.05, 0.25, 16]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.05} />
        </mesh>
        {/* Tea Stream (Visual) */}
        {groupRef.current && groupRef.current.rotation.z < -0.5 && (
          <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.6, 8]} />
            <meshBasicMaterial color="#d17a3a" transparent opacity={0.6} />
          </mesh>
        )}
      </group>
      
      {/* Sweeping Gold Handle */}
      <mesh castShadow position={[-0.25, 0.25, 0]} rotation={[0, 0, Math.PI / 8]}>
        <torusGeometry args={[0.15, 0.025, 16, 32, Math.PI * 1.3]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} /> 
      </mesh>
      
      {/* Domed Lid */}
      <group position={[0, 0.4, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FAF9F6" roughness={0.05} />
        </mesh>
        <mesh castShadow position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>
    </group>
  )
}
