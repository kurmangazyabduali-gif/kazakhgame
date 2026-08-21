'use client'

import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { CameraMode } from '../types/three'

interface CameraManagerProps {
  mode: CameraMode
  makeDefault?: boolean
  position?: [number, number, number]
  target?: [number, number, number]
}

export function CameraManager({ 
  mode, 
  makeDefault = true, 
  position = [0, 5, 10], 
  target = [0, 0, 0] 
}: CameraManagerProps) {
  
  if (mode === 'free-camera') {
    return (
      <>
        <PerspectiveCamera makeDefault={makeDefault} position={position} fov={45} />
        <OrbitControls target={target} enableDamping dampingFactor={0.05} />
      </>
    )
  }

  // Placeholder for other camera modes
  if (mode === 'third-person') {
    return (
      <>
        <PerspectiveCamera makeDefault={makeDefault} position={position} fov={60} />
        {/* We would use a custom rig here attached to the player character */}
      </>
    )
  }

  return <PerspectiveCamera makeDefault={makeDefault} position={position} fov={50} />
}
