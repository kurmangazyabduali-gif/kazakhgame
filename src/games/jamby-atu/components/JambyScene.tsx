'use client'

import { ThreeGameCanvas } from '@/three/components/ThreeGameCanvas'
import { CameraManager } from '@/three/systems/CameraManager'
import { GamePhysicsBody } from '@/three/systems/PhysicsAdapter'
import { HorseController } from './HorseController'
import { BowSystem } from './BowSystem'
import { JambyTarget } from './JambyTarget'
import { JambyUI } from './JambyUI'
import { useJambyEngine } from '../engine'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'

// Scatter some simple trees/rocks
const LEFT_SCENERY = Array.from({ length: 40 }, (_, i) => [-25 + ((i * 37) % 50) / 10, 0, -i * 15] as [number, number, number])
const RIGHT_SCENERY = Array.from({ length: 40 }, (_, i) => [25 + ((i * 29) % 50) / 10, 0, -i * 15] as [number, number, number])

function GroundAndPath() {
  return (
    <GamePhysicsBody type="fixed" colliders="cuboid" position={[0, -0.5, -200]} friction={1}>
      <mesh receiveShadow>
        <boxGeometry args={[150, 1, 600]} />
        <meshStandardMaterial color="#4d6b33" roughness={1} />
      </mesh>
      
      {/* Dirt Path */}
      <mesh position={[0, 0.51, 0]} receiveShadow>
        <boxGeometry args={[4, 0.05, 600]} />
        <meshStandardMaterial color="#5c4a3d" roughness={1} />
      </mesh>
    </GamePhysicsBody>
  )
}

function Scenery() {
  return (
    <group>
      {/* Stylized trees */}
      {LEFT_SCENERY.map((position, i) => (
        <group key={i} position={position}>
          <mesh position={[0, 2, 0]} castShadow>
            <sphereGeometry args={[2 + Math.random(), 7, 7]} />
            <meshStandardMaterial color="#2d421e" />
          </mesh>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 3]} />
            <meshStandardMaterial color="#3a2a1c" />
          </mesh>
        </group>
      ))}
      {RIGHT_SCENERY.map((position, i) => (
        <group key={`r${i}`} position={position}>
          <mesh position={[0, 2, 0]} castShadow>
            <sphereGeometry args={[2 + Math.random(), 7, 7]} />
            <meshStandardMaterial color="#2d421e" />
          </mesh>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 3]} />
            <meshStandardMaterial color="#3a2a1c" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function SkyboxEnvironment() {
  const texture = useLoader(THREE.TextureLoader, '/assets/jamby-atu/skybox.jpg')
  texture.colorSpace = THREE.SRGBColorSpace
  
  return (
    <mesh>
      <sphereGeometry args={[300, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}

export function JambyScene() {
  const reset = useJambyEngine(s => s.reset)
  const currentLevelIndex = useJambyEngine(s => s.currentLevelIndex)

  // Reset game state on unmount
  useEffect(() => {
    return () => reset()
  }, [reset])

  return (
    <div className="w-full h-[calc(100vh-64px)] relative bg-black">
      <JambyUI />
      
      <ThreeGameCanvas physicsEnabled debugPhysics={false}>
        {/* Global illumination */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 20, -10]} intensity={2.5} castShadow />
        
        {/* Ultra-realistic Skybox */}
        <SkyboxEnvironment />
        
        <CameraManager mode="first-person" position={[0, 2.5, 0]} />
        
        <GroundAndPath />
        <Scenery />
        
        <HorseController>
          <BowSystem />
        </HorseController>

        {/* The active target */}
        <JambyTarget position={[0, 2.5, -30]} key={currentLevelIndex} />

      </ThreeGameCanvas>
    </div>
  )
}
