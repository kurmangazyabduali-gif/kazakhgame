'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import * as THREE from 'three'
import { Sparkles } from '@react-three/drei'
import { ScenarioEngine } from '@/games/engine/scenario/ScenarioEngine'
import { ScenarioState } from '@/games/engine/scenario/types'

interface Cup3DProps {
  id: string
  engine: ScenarioEngine | null
  initialPosition: [number, number, number]
  state: any
  scenarioState?: ScenarioState | null
}

export default function Cup3D({ id, engine, initialPosition, state, scenarioState }: Cup3DProps) {
  const [pos, setPos] = useState<[number, number, number]>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [localFillAmount, setLocalFillAmount] = useState(0)
  const groupRef = useRef<THREE.Group>(null)
  const liquidRef = useRef<THREE.Mesh>(null)
  const { camera, raycaster, size } = useThree()

  // Handle continuous pouring from Teapot
  useEffect(() => {
    const handlePouring = (e: any) => {
      if (e.detail.cupId === id && !state?.filled) {
        setLocalFillAmount(prev => {
          const next = prev + 0.02
          if (next >= 1.0 && prev < 1.0) {
            // Reached full! Dispatch to engine.
            if (engine) {
              engine.performAction({
                id: 'act_' + Date.now(),
                type: 'pour',
                itemId: 'teapot',
                targetId: id
              })
            }
          }
          return Math.min(next, 1.2) // allow slight overfill visually
        })
      }
    }
    window.addEventListener('teapot_pouring', handlePouring)
    return () => window.removeEventListener('teapot_pouring', handlePouring)
  }, [id, state?.filled, engine])

  const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.1)

  const bind = useDrag(({ active, movement: [mx, my], xy: [cx, cy] }) => {
    setIsDragging(active)

    if (active) {
      document.body.style.cursor = 'grabbing'
      const x = (cx / size.width) * 2 - 1
      const y = -(cy / size.height) * 2 + 1
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      
      const intersectPoint = new THREE.Vector3()
      raycaster.ray.intersectPlane(dragPlane, intersectPoint)
      
      if (intersectPoint) {
        setPos([intersectPoint.x, 0.4, intersectPoint.z])
      }
    } else {
      document.body.style.cursor = 'grab'
      let droppedOnNpc = false
      if (engine) {
        const state = engine.getStateSnapshot()
        
        if (state) {
          // Find nearest NPC
          let nearestNpc = null
          let minDistance = 1.5 // Drop radius

          state.actors.forEach((npc) => {
            // Convert 2D npc position to roughly the 3D target area
            const scale = 0.007
            const npcX = (npc.position.x - 450) * scale
            const npcZ = -2.0
            
            const dist = Math.sqrt(Math.pow(pos[0] - npcX, 2) + Math.pow(pos[2] - npcZ, 2))
            if (dist < minDistance) {
              minDistance = dist
              nearestNpc = npc
            }
          })

          if (nearestNpc) {
            const feedback = engine.performAction({
              id: 'act_' + Date.now(),
              type: 'give',
              itemId: id,
              targetId: (nearestNpc as any).id
            })
            if (feedback?.success) {
              droppedOnNpc = true
            }
          }
        }
      }
      
      // If successfully given to NPC, wait and then return to start empty (handled by state update visually).
      // For now, always snap back to initial position after a short delay so it doesn't float.
      setPos([initialPosition[0], 0.1, initialPosition[2]])
    }
  })

  useFrame((sceneState, delta) => {
    if (!groupRef.current) return
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pos[0], 20 * delta)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pos[1], 15 * delta)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, pos[2], 20 * delta)
  })

  // Points for a curved piala bowl
  const points = []
  for (let i = 0; i <= 15; i++) {
    const t = i / 15
    const r = Math.sin(t * Math.PI * 0.5) * 0.18 + 0.04
    const y = t * 0.15
    points.push(new THREE.Vector2(r, y))
  }

  const handlePointerOver = () => document.body.style.cursor = 'grab'
  const handlePointerOut = () => document.body.style.cursor = 'auto'

  return (
    <group 
      ref={groupRef} 
      {...(bind() as any)}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Cup Base using Lathe */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <latheGeometry args={[points, 32]} />
        <meshPhysicalMaterial color="#FAF9F6" roughness={0.1} metalness={0.1} side={THREE.DoubleSide} clearcoat={1.0} />
      </mesh>
      
      {/* Golden rim */}
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.005, 16, 32]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
      </mesh>
      
      {/* Tea Liquid */}
      {(state?.filled || localFillAmount > 0) && (
        <group position={[0, 0.05 + Math.min(localFillAmount, 1.0) * 0.08, 0]}>
          <mesh ref={liquidRef}>
            <cylinderGeometry args={[0.2, 0.2, 0.02 + Math.min(localFillAmount, 1.0) * 0.1, 32]} />
            <meshStandardMaterial color="#5C2E16" roughness={0.1} metalness={0.8} transparent opacity={0.9} />
          </mesh>
          <Sparkles count={15} scale={0.4} size={3} speed={0.4} opacity={0.3} color="#ffffff" position={[0, 0.1, 0]} />
        </group>
      )}

      {/* Overfill Warning Ring */}
      {localFillAmount > 1.0 && !isDragging && (
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial color="#FF4444" transparent opacity={Math.min((localFillAmount - 1.0) * 5, 0.5)} />
        </mesh>
      )}

      {/* Perfect fill Gold Ring */}
      {state?.filled && localFillAmount <= 1.0 && !isDragging && (
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Sugar Cube */}
      {state?.sugar && (
        <mesh position={[0, 0.13, 0]} rotation={[0.2, 0.5, 0.1]}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
        </mesh>
      )}
    </group>
  )
}
