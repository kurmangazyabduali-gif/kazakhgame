'use client'

import React from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export default function Room() {
  return (
    <group>
      {/* Floor (Rich Wooden Planks) */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2c1a0f" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Backdrop walls */}
      <mesh position={[0, 4, -8]} receiveShadow>
        <cylinderGeometry args={[20, 20, 15, 32, 1, true, Math.PI, Math.PI]} />
        <meshStandardMaterial color="#1a110a" roughness={1.0} side={2} /> 
      </mesh>
      
      {/* Baseboard */}
      <mesh position={[0, 0.45, -7.8]} receiveShadow>
        <cylinderGeometry args={[19.9, 19.9, 1, 32, 1, true, Math.PI, Math.PI]} />
        <meshStandardMaterial color="#0f0905" roughness={0.8} side={2} />
      </mesh>

      {/* Tuskiz (Wall hanging carpet) in center back */}
      <mesh position={[0, 4, -7.9]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial color="#5c1d1a" roughness={0.9} />
      </mesh>
      {/* Tuskiz golden border */}
      <mesh position={[0, 4, -7.89]} receiveShadow>
        <planeGeometry args={[7.8, 4.8]} />
        <meshStandardMaterial color="#000000" opacity={0} transparent />
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(7.8, 4.8)]} />
          <lineBasicMaterial color="#D4AF37" linewidth={2} />
        </lineSegments>
      </mesh>

      {/* Sandyq (Traditional Chest) */}
      <group position={[-5, 0.5, -4]} rotation={[0, Math.PI / 5, 0]}>
        <RoundedBox args={[3, 1.2, 1.5]} radius={0.1} castShadow receiveShadow>
          <meshStandardMaterial color="#3a1c0d" roughness={0.8} />
        </RoundedBox>
        {/* Metal Ornaments on Sandyq */}
        <mesh position={[0, 0, 0.76]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-1.0, 0, 0.76]}>
          <planeGeometry args={[0.2, 0.8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[1.0, 0, 0.76]}>
          <planeGeometry args={[0.2, 0.8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Dombra (Stylized) leaning on Sandyq */}
      <group position={[-3.2, 1.5, -3.2]} rotation={[0, -Math.PI / 4, Math.PI / 6]}>
        <mesh castShadow receiveShadow position={[0, -0.6, 0]}>
          <boxGeometry args={[0.5, 0.8, 0.2]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[0.1, 1.6, 0.1]} />
          <meshStandardMaterial color="#3a1c0d" roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}
