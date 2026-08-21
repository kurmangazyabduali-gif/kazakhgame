'use client'

import React from 'react'
import { ScenarioEngine } from '@/games/engine/scenario/ScenarioEngine'
import { ScenarioState } from '@/games/engine/scenario/types'

interface DastarkhanProps {
  engine: ScenarioEngine | null
  state: ScenarioState | null
}

import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

export default function Dastarkhan({ engine, state }: DastarkhanProps) {
  // Create a procedural fabric pattern for the tablecloth
  const clothTexture = React.useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#FDFBF7'
      ctx.fillRect(0, 0, 512, 512)
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 4
      ctx.strokeRect(20, 20, 472, 472)
      ctx.strokeRect(30, 30, 452, 452)
      // Simple inner corner ornaments
      const drawCorner = (x: number, y: number, rot: number) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rot)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.quadraticCurveTo(40, 0, 40, 40)
        ctx.quadraticCurveTo(0, 40, 0, 0)
        ctx.fillStyle = '#D4AF37'
        ctx.fill()
        ctx.restore()
      }
      drawCorner(40, 40, 0)
      drawCorner(472, 40, Math.PI / 2)
      drawCorner(472, 472, Math.PI)
      drawCorner(40, 472, -Math.PI / 2)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  return (
    <group position={[0, -0.05, 0]}>
      {/* Traditional Kazakh Rug (Syrmaq/Tekemet) underneath the table */}
      <mesh position={[0, -0.04, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#5c1d1a" roughness={1} bumpScale={0.05} metalness={0.1} /> 
      </mesh>
      
      {/* Rug Gold/Beige Border */}
      <mesh position={[0, -0.038, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.4, 6.4]} />
        <meshPhysicalMaterial color="#8B2520" roughness={0.8} clearcoat={0.1} bumpScale={0.05} />
      </mesh>

      {/* Wooden Table Base (low table) */}
      <RoundedBox args={[5.2, 0.1, 3.2]} radius={0.05} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2c1a0f" roughness={0.7} />
      </RoundedBox>

      {/* Thick Fabric Cloth hanging over */}
      <RoundedBox args={[4.8, 0.12, 2.8]} radius={0.05} smoothness={4} position={[0, 0.02, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#ffffff" roughness={0.8} bumpScale={0.05} map={clothTexture || undefined} clearcoat={0.3} clearcoatRoughness={0.6} />
      </RoundedBox>
    </group>
  )
}



