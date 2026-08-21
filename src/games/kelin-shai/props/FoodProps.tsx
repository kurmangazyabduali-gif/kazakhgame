'use client'

import React, { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import * as THREE from 'three'
import { MeshDistortMaterial } from '@react-three/drei'
import { ScenarioEngine } from '@/games/engine/scenario/ScenarioEngine'

interface FoodPropsType {
  id: string
  engine: ScenarioEngine | null
  initialPosition: [number, number, number]
  type: 'bauyrsak' | 'qurt' | 'sweets' | 'napkins' | 'sugar'
}

export default function FoodProps({ id, engine, initialPosition, type }: FoodPropsType) {
  const [pos, setPos] = useState<[number, number, number]>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const { camera, raycaster, size } = useThree()

  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.1)

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
        setPos([intersectPoint.x, 0.4, intersectPoint.z])
      }
    } else {
      document.body.style.cursor = 'grab'
      
      // Smart Snap: if close to table center, snap into place
      const distToCenter = Math.sqrt(Math.pow(pos[0], 2) + Math.pow(pos[2], 2))
      
      if (distToCenter < 1.5) {
        // Target spots on the table
        let targetX = 0, targetZ = 0
        if (type === 'bauyrsak') { targetX = -0.4; targetZ = 0.2 }
        if (type === 'qurt') { targetX = 0.4; targetZ = 0.2 }
        if (type === 'sweets') { targetX = 0; targetZ = 0.3 }
        if (type === 'sugar') { targetX = 0.6; targetZ = 0.1 }
        
        setPos([targetX, 0.1, targetZ])
        if (engine) {
          engine.performAction({
            id: 'act_' + Date.now(),
            type: type === 'sugar' ? 'add_sugar' : 'place',
            itemId: id,
            targetId: type === 'sugar' ? 'cup_placeholder' : 'dastarkhan'
          })
        }
      } else {
        setPos([initialPosition[0], 0.1, initialPosition[2]])
      }
    }
  })

  useFrame((sceneState, delta) => {
    if (!groupRef.current) return
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pos[0], 20 * delta)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pos[1], 15 * delta)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, pos[2], 20 * delta)
  })

  const handlePointerOver = () => document.body.style.cursor = 'grab'
  const handlePointerOut = () => document.body.style.cursor = 'auto'

  const renderContent = () => {
    switch (type) {
      case 'bauyrsak':
        return (
          <group 
            position={[0, 0.08, 0]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            {/* Main piece */}
            <mesh castShadow receiveShadow scale={[1, 0.8, 1.1]} rotation={[Math.random(), Math.random(), 0]}>
              <sphereGeometry args={[0.15, 32, 32]} />
              <MeshDistortMaterial color="#D98A3C" roughness={0.8} distort={0.2} speed={0} />
            </mesh>
            {/* Second piece */}
            <mesh castShadow receiveShadow position={[0.1, 0, 0.1]} scale={[1.1, 0.7, 0.9]} rotation={[0.2, 0.5, 0]}>
              <sphereGeometry args={[0.12, 32, 32]} />
              <MeshDistortMaterial color="#E29548" roughness={0.8} distort={0.2} speed={0} />
            </mesh>
            <mesh castShadow receiveShadow position={[-0.1, 0, 0.1]} scale={[0.9, 0.9, 1]} rotation={[0.1, -0.2, 0]}>
              <sphereGeometry args={[0.14, 32, 32]} />
              <MeshDistortMaterial color="#CE7A31" roughness={0.8} distort={0.15} speed={0} />
            </mesh>
          </group>
        )
      case 'qurt':
        return (
          <group position={[0, 0.05, 0]}>
            <mesh castShadow receiveShadow position={[-0.1, 0, -0.1]} scale={[1, 0.6, 1]} rotation={[0.1, Math.random(), 0.1]}>
              <sphereGeometry args={[0.08, 32, 32]} />
              <MeshDistortMaterial color="#FDFDFD" roughness={1} distort={0.3} speed={0} />
            </mesh>
            <mesh castShadow receiveShadow position={[0.1, 0, 0.1]} scale={[1, 0.6, 1]} rotation={[0.1, Math.random(), 0.1]}>
              <sphereGeometry args={[0.08, 32, 32]} />
              <MeshDistortMaterial color="#e8e8e8" roughness={1} distort={0.4} speed={0} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, 0, 0.15]} scale={[1, 0.6, 1]} rotation={[0.1, Math.random(), 0.1]}>
              <sphereGeometry args={[0.08, 32, 32]} />
              <MeshDistortMaterial color="#f0f0f0" roughness={1} distort={0.3} speed={0} />
            </mesh>
          </group>
        )
      case 'sweets':
        return (
          <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
            <boxGeometry args={[0.2, 0.1, 0.2]} />
            <meshStandardMaterial color="#8B4513" roughness={0.6} />
          </mesh>
        )
      case 'sugar':
        return (
          <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.15, 0.12, 0.1, 16]} />
            <meshStandardMaterial color="#D1D5DB" roughness={0.5} />
          </mesh>
        )
      default:
        return (
          <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
            <boxGeometry args={[0.3, 0.04, 0.3]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
          </mesh>
        )
    }
  }

  return (
    <group 
      ref={groupRef} 
      {...(bind() as any)}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {renderContent()}
    </group>
  )
}
