'use client'

import { ThreeGameCanvas } from '@/three/components/ThreeGameCanvas'
import { Environment } from '@/three/components/Environment'
import { EagleFlightController } from './EagleFlightController'
import { SmoothTrailingCamera } from './FlightCamera'
import { FlightEnvironment } from './FlightEnvironment'
import { Checkpoints } from './Checkpoints'
import { FlightUI } from './FlightUI'
import { useKusbegilikEngine } from '../engine'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function KusbegilikPrototypeScene() {
  const reset = useKusbegilikEngine(s => s.reset)
  const eagleRef = useRef<THREE.Group>(null)

  useEffect(() => {
    return () => reset()
  }, [reset])

  return (
    <div className="w-full h-[calc(100vh-64px)] relative bg-sky-200">
      <FlightUI />
      
      <ThreeGameCanvas physicsEnabled debugPhysics={false}>
        <Environment preset="park" showSky groundColor="#556b2f" sunPosition={[50, 100, -50]} />
        
        {/* We pass eagleRef to SmoothTrailingCamera so it can track it in world space */}
        <SmoothTrailingCamera targetRef={eagleRef} />

        <FlightEnvironment />
        <Checkpoints />

        <EagleFlightController>
          {/* We attach a ref inside the controller's group so the camera can find it */}
          <group ref={eagleRef} />
        </EagleFlightController>

      </ThreeGameCanvas>
    </div>
  )
}
