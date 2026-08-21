'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { HitZone, useJambyEngine } from '../engine'
import * as THREE from 'three'
import { ArrowProjectile } from './ArrowProjectile'

export function BowSystem() {
  const gameState = useJambyEngine(s => s.gameState)
  const setGameState = useJambyEngine(s => s.setGameState)
  const drawStrength = useJambyEngine(s => s.drawStrength)
  const setDrawStrength = useJambyEngine(s => s.setDrawStrength)
  
  const bowGroup = useRef<THREE.Group>(null)
  const { camera } = useThree()
  
  const [activeArrow, setActiveArrow] = useState<{
    id: number
    position: [number, number, number]
    direction: THREE.Vector3
    power: number
  } | null>(null)
  const arrowIdRef = useRef(0)

  // We map mouse/touch position to aim the bow
  useFrame((state) => {
    if (!bowGroup.current) return
    if (gameState !== 'AIM' && gameState !== 'DRAW') return

    // Calculate aim direction based on pointer
    const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5)
    vector.unproject(camera)
    const dir = vector.sub(camera.position).normalize()
    
    // Position bow relative to camera but slightly offset
    const bowPos = camera.position.clone().add(dir.clone().multiplyScalar(2))
    // Offset slightly to the right and down
    bowPos.add(new THREE.Vector3(0.5, -0.5, 0))
    
    bowGroup.current.position.copy(bowPos)
    
    // Look at target
    const targetLook = bowPos.clone().add(dir)
    bowGroup.current.lookAt(targetLook)

    // Handle drawing logic if in DRAW state
    if (gameState === 'DRAW') {
      setDrawStrength(drawStrength + (100 * state.clock.getDelta())) // takes ~1s to reach 100%
    }
  })

  // Global pointer events attached to a generic overlay later, 
  // but for now we expose a method to shoot.
  
  const handleShoot = useCallback((power: number) => {
    if (!bowGroup.current) return
    
    const dir = new THREE.Vector3()
    bowGroup.current.getWorldDirection(dir)
    const pos = bowGroup.current.position.clone()

    setActiveArrow({
      id: arrowIdRef.current + 1,
      position: [pos.x, pos.y, pos.z],
      direction: dir,
      power
    })
    arrowIdRef.current += 1
    
    setGameState('ARROW_FLIGHT')
  }, [setGameState])

  // Effect to listen for custom shoot event dispatched from UI overlay
  // (We use window events to decouple UI DOM from Canvas logic)
  useEffect(() => {
    const onRelease = (event: Event) => {
      const shootEvent = event as CustomEvent<{ power: number }>
      if (gameState === 'DRAW') {
        handleShoot(shootEvent.detail.power)
      }
    }

    window.addEventListener('jamby-shoot', onRelease)
    return () => window.removeEventListener('jamby-shoot', onRelease)
  }, [gameState, handleShoot])

  const handleArrowHit = (zone: HitZone) => {
    // Just a basic accuracy calc for now based on zone
    const accuracy = zone === 'BULLSEYE' ? 100 : zone === 'CENTER' ? 70 : 30
    useJambyEngine.getState().registerShot(zone, accuracy)
  }

  const handleArrowMiss = () => {
    useJambyEngine.getState().registerShot('MISS', 0)
  }

  return (
    <>
      {/* The Bow Visual */}
      {(gameState === 'AIM' || gameState === 'DRAW') && (
        <group ref={bowGroup}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.05, 8, 20, Math.PI]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          {/* Arrow knocked on bow */}
          <mesh position={[0, 0, -0.2]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      )}

      {/* The Fired Arrow */}
      {activeArrow && (
        <ArrowProjectile 
          key={activeArrow.id}
          position={activeArrow.position} 
          direction={activeArrow.direction} 
          power={activeArrow.power}
          onHit={handleArrowHit}
          onMiss={handleArrowMiss}
        />
      )}
    </>
  )
}
