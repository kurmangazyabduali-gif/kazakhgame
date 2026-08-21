'use client'

import React from 'react'
import { Environment } from '@react-three/drei'

export default function Lighting() {
  return (
    <>
      {/* Soft interior ambient */}
      <ambientLight intensity={0.2} color="#E8DCD1" />
      
      {/* Warm Key Light from ceiling/window */}
      <directionalLight 
        castShadow 
        position={[4, 5, 4]} 
        intensity={1.2} 
        color="#ffaa55" 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0001}
      />
      
      {/* Fill Light - soft neutral from the opposite side */}
      <directionalLight 
        position={[-4, 3, 4]} 
        intensity={0.4} 
        color="#aaccff" 
      />

      {/* Rim Light - very light golden from behind characters to separate them from background */}
      <spotLight 
        position={[0, 6, -6]} 
        intensity={2.0} 
        color="#ffd700"
        angle={0.8}
        penumbra={1}
        distance={20}
      />
    </>
  )
}
