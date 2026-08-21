'use client'

import { ThreeGameCanvas } from '@/three/components/ThreeGameCanvas'
import { Environment } from '@/three/components/Environment'
import { EagleFlightController } from './EagleFlightController'
import { SmoothTrailingCamera } from './FlightCamera'
import { HuntingCamera } from './HuntingCamera'
import { FlightEnvironment } from './FlightEnvironment'
import { Checkpoints } from './Checkpoints'
import { PreyTarget } from './PreyTarget'
import { FlightUI } from './FlightUI'
import { useKusbegilikEngine } from '../engine'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function KusbegilikMissionScene() {
  const reset = useKusbegilikEngine(s => s.reset)
  const currentMissionId = useKusbegilikEngine(s => s.currentMissionId)
  const eagleRef = useRef<THREE.Group>(null)
  const preyRef = useRef<THREE.Group>(null)

  useEffect(() => {
    return () => reset()
  }, [reset])

  const isHunt = currentMissionId?.startsWith('hunt')

  return (
    <div className="w-full h-[calc(100vh-64px)] relative bg-sky-200">
      <FlightUI />
      
      <ThreeGameCanvas physicsEnabled debugPhysics={false}>
        <Environment preset="park" showSky groundColor="#556b2f" sunPosition={[50, 100, -50]} />
        
        {isHunt ? (
          <HuntingCamera eagleRef={eagleRef} preyRef={preyRef} />
        ) : (
          <SmoothTrailingCamera targetRef={eagleRef} />
        )}

        <FlightEnvironment />
        
        {isHunt ? (
          <group ref={preyRef}>
            <PreyTarget position={[0, 0, -200]} />
          </group>
        ) : (
          <Checkpoints />
        )}

        <EagleFlightController>
          <group ref={eagleRef} />
        </EagleFlightController>

      </ThreeGameCanvas>
    </div>
  )
}
