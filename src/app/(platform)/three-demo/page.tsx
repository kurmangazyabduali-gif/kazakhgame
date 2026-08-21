'use client'

import { ThreeGameCanvas } from '@/three/components/ThreeGameCanvas'
import { Environment } from '@/three/components/Environment'
import { DebugUI } from '@/three/components/DebugUI'
import { CameraManager } from '@/three/systems/CameraManager'
import { GamePhysicsBody } from '@/three/systems/PhysicsAdapter'
import { useInteractable, useInteractionStore } from '@/three/systems/InteractionSystem'
import { useEffect } from 'react'

function InteractiveBox() {
  const { hoveredObject, selectedObject } = useInteractionStore()
  const interactProps = useInteractable('test-box')
  
  const isHovered = hoveredObject === 'test-box'
  const isSelected = selectedObject === 'test-box'

  return (
    <GamePhysicsBody colliders="cuboid" mass={1} position={[0, 5, 0]}>
      <mesh {...interactProps} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isSelected ? 'red' : isHovered ? 'orange' : 'teal'} />
      </mesh>
    </GamePhysicsBody>
  )
}

function FallingSpheres() {
  return (
    <>
      <GamePhysicsBody colliders="ball" mass={1} position={[-2, 10, 0]} restitution={0.8}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </GamePhysicsBody>
      
      <GamePhysicsBody colliders="ball" mass={1} position={[2, 15, 0]} restitution={0.8}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </GamePhysicsBody>
    </>
  )
}

function Ground() {
  return (
    <GamePhysicsBody type="fixed" colliders="cuboid" position={[0, -0.5, 0]} friction={1}>
      <mesh receiveShadow>
        <boxGeometry args={[50, 1, 50]} />
        <meshStandardMaterial color="#8a7f71" />
      </mesh>
    </GamePhysicsBody>
  )
}

export default function ThreeDemoPage() {
  
  // Cleanup selected object on unmount
  useEffect(() => {
    return () => {
      useInteractionStore.getState().clear()
    }
  }, [])

  return (
    <div className="w-full h-[calc(100vh-64px)] relative">
      <ThreeGameCanvas physicsEnabled debugPhysics={false}>
        <DebugUI />
        <Environment preset="sunset" showSky groundColor="#8a7f71" />
        <CameraManager mode="free-camera" position={[0, 8, 15]} target={[0, 0, 0]} />
        
        <Ground />
        <InteractiveBox />
        <FallingSpheres />
        
      </ThreeGameCanvas>
      
      {/* UI Overlay test */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="bg-background/80 backdrop-blur border px-6 py-3 rounded-full text-center shadow-lg pointer-events-auto">
          <h1 className="font-bold">3D Foundation Demo</h1>
          <p className="text-sm text-muted-foreground">Physics, Raycasting, Camera, Lighting</p>
        </div>
      </div>
    </div>
  )
}
