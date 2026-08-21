'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useKusbegilikEngine } from '../engine'

export function HuntingCamera({ eagleRef, preyRef }: { eagleRef: React.RefObject<THREE.Group | null>, preyRef: React.RefObject<THREE.Group | null> }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const currentPos = useRef(new THREE.Vector3(0, 55, 10))
  const currentLookAt = useRef(new THREE.Vector3(0, 50, 0))

  const missionState = useKusbegilikEngine(s => s.missionState)

  useFrame((state, delta) => {
    if (!cameraRef.current || !eagleRef.current) return
    const dt = Math.min(delta, 0.1)

    const eagleWorldPos = new THREE.Vector3()
    eagleRef.current.getWorldPosition(eagleWorldPos)
    
    const eagleWorldDir = new THREE.Vector3()
    eagleRef.current.getWorldDirection(eagleWorldDir)

    const desiredPos = eagleWorldPos.clone()
    const desiredLook = eagleWorldPos.clone()

    if (missionState === 'FOCUS' || missionState === 'DIVE' || missionState === 'ATTACK') {
      // In Dive/Focus, we want an 'action' camera. Behind eagle, looking towards both eagle and prey.
      desiredPos.add(eagleWorldDir.clone().multiplyScalar(-3))
      desiredPos.y += 1.5

      if (preyRef.current) {
        const preyPos = new THREE.Vector3()
        preyRef.current.getWorldPosition(preyPos)
        desiredLook.lerpVectors(eagleWorldPos, preyPos, 0.5) // Look halfway between eagle and prey
      } else {
        desiredLook.add(eagleWorldDir.clone().multiplyScalar(5))
      }
    } else {
      // Normal chase
      desiredPos.add(eagleWorldDir.clone().multiplyScalar(-6))
      desiredPos.y += 2
      desiredLook.add(eagleWorldDir.clone().multiplyScalar(2))
    }

    currentPos.current.lerp(desiredPos, dt * 5)
    cameraRef.current.position.copy(currentPos.current)

    currentLookAt.current.lerp(desiredLook, dt * 8)
    cameraRef.current.lookAt(currentLookAt.current)
  })

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={60} />
}
