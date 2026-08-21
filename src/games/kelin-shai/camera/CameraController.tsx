'use client'

import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export default function CameraController() {
  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[2, 2.5, 4.5]} 
        fov={45} 
      />
      <OrbitControls
        makeDefault
        target={[-0.5, 0, 0]}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going under the floor
        minDistance={2}
        maxDistance={8}
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN, // Set to PAN, but enablePan is false, so it does nothing!
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE // Free camera on right click
        }}
      />
    </>
  )
}
