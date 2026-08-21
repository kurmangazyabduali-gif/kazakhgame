'use client'

import { ThreeGameCanvas } from '@/three/components/ThreeGameCanvas'
import { Environment } from '@/three/components/Environment'
import { CameraManager } from '@/three/systems/CameraManager'
import { GamePhysicsBody } from '@/three/systems/PhysicsAdapter'
import { HorseController, HorseMock } from './HorseController'
import { BowSystem } from './BowSystem'
import { JambyTarget } from './JambyTarget'
import { JambyUI } from './JambyUI'
import { useJambyEngine } from '../engine'
import { useEffect } from 'react'
import { AssetFallbackBoundary } from '@/components/three/AssetFallbackBoundary'
import { ASSETS } from '@/lib/data/assets'

const LEFT_SCENERY = Array.from({ length: 20 }, (_, i) => [-15 + ((i * 37) % 50) / 10, 0.5, -i * 10] as [number, number, number])
const RIGHT_SCENERY = Array.from({ length: 20 }, (_, i) => [10 + ((i * 29) % 50) / 10, 0.5, -i * 10] as [number, number, number])

function GroundAndPath() {
  return (
    <GamePhysicsBody type="fixed" colliders="cuboid" position={[0, -0.5, -200]} friction={1}>
      <mesh receiveShadow>
        <boxGeometry args={[40, 1, 500]} />
        <meshStandardMaterial color="#8a7f71" />
      </mesh>
      
      {/* Visual path for the horse */}
      <mesh position={[0, 0.51, 0]} receiveShadow>
        <boxGeometry args={[2, 0.05, 500]} />
        <meshStandardMaterial color="#6a5f51" />
      </mesh>
    </GamePhysicsBody>
  )
}

function Scenery() {
  return (
    <group>
      {/* Just some scattered boxes to give sense of speed and distance */}
      {LEFT_SCENERY.map((position, i) => (
        <mesh key={i} position={position} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#4a3b2c" />
        </mesh>
      ))}
      {RIGHT_SCENERY.map((position, i) => (
        <mesh key={`r${i}`} position={position} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#4a3b2c" />
        </mesh>
      ))}
    </group>
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
        <Environment preset="sunset" showSky groundColor="#8a7f71" />
        <CameraManager mode="first-person" position={[0, 2, 0]} />
        
        <GroundAndPath />
        <Scenery />
        
        <HorseController>
          <AssetFallbackBoundary 
            assetId="horse-hero" 
            url={ASSETS.find(a => a.id === 'horse-hero')?.path || ''} 
            fallback={<HorseMock />} 
          />
          <BowSystem />
        </HorseController>

        {/* The active target. Since horse resets to z=0 on each level, target can stay at z=-30 */}
        <JambyTarget position={[0, 2, -30]} key={currentLevelIndex} />

      </ThreeGameCanvas>
    </div>
  )
}
