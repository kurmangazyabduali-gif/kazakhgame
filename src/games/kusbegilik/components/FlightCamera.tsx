'use client'

import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

export function FlightCamera() {
  // Actually, since it's mounted INSIDE the EagleFlightController's eagle mesh, 
  // it will inherit position. If we just offset it, it will be a RIGID chase camera.
  // The user requested "Camera: следует за птицей; немного отстаёт; сглаживает движение; не привязывать жёстко".
  // This means I should not return it here. I'll return a world-space camera in the Scene instead.
  
  return null
}

// True smooth trailing camera to be placed in Scene root
export function SmoothTrailingCamera({ targetRef }: { targetRef: React.RefObject<THREE.Group | null> }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const [mode, setMode] = useState<'CHASE' | 'SIDE'>('CHASE')
  const currentPos = useRef(new THREE.Vector3(0, 55, 10))
  const currentLookAt = useRef(new THREE.Vector3(0, 50, 0))

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyV') {
        setMode(m => m === 'CHASE' ? 'SIDE' : 'CHASE')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useFrame((state, delta) => {
    if (!cameraRef.current || !targetRef.current) return
    const dt = Math.min(delta, 0.1)

    // Get Eagle's world transform
    const eagleWorldPos = new THREE.Vector3()
    targetRef.current.getWorldPosition(eagleWorldPos)
    
    const eagleWorldDir = new THREE.Vector3()
    targetRef.current.getWorldDirection(eagleWorldDir)

    // Calculate desired camera position
    const desiredPos = eagleWorldPos.clone()
    
    if (mode === 'CHASE') {
      // Behind and slightly up
      desiredPos.add(eagleWorldDir.clone().multiplyScalar(-6))
      desiredPos.y += 2
    } else {
      // Side view
      // We need the right vector. Since eagleWorldDir is forward (-Z in local),
      // we can cross with world UP to get Right
      const right = eagleWorldDir.clone().cross(new THREE.Vector3(0, 1, 0)).normalize()
      desiredPos.add(right.multiplyScalar(8))
      desiredPos.y += 1
    }

    // Smooth position
    currentPos.current.lerp(desiredPos, dt * 5)
    cameraRef.current.position.copy(currentPos.current)

    // Smooth lookAt (look slightly ahead of the eagle)
    const desiredLook = eagleWorldPos.clone().add(eagleWorldDir.clone().multiplyScalar(2))
    currentLookAt.current.lerp(desiredLook, dt * 8)
    cameraRef.current.lookAt(currentLookAt.current)
  })

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={60} />
}
