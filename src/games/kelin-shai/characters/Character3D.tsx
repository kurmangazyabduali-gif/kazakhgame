'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'

export type KelinRole = 'elder_female' | 'elder_male' | 'adult_male' | 'young_male' | 'kelin'

interface CharacterProps {
  id: string
  role: KelinRole
  position: [number, number, number]
  state?: any
}

// Color palettes based on role
const palettes = {
  elder_female: { skin: '#E0AC82', clothes: '#1F402E', trim: '#D4AF37', head: '#FDFBF7' }, // Ene: Dark Green, Gold, White Kimeshek
  elder_male: { skin: '#D69E71', clothes: '#2E2B2A', trim: '#4A3424', head: '#D4AF37' }, // Aksakal: Dark grey/brown, Gold trim
  adult_male: { skin: '#E5B289', clothes: '#384860', trim: '#6B7A90', head: '#2C2114' }, // Guest: Blueish modern suit
  young_male: { skin: '#F0C29E', clothes: '#8B4513', trim: '#D98A3C', head: '#3A2818' }, // Young: Warm brown jacket
  kelin: { skin: '#F0C29E', clothes: '#8B2520', trim: '#D4AF37', head: '#FDFBF7' }, // Player: Burgundy dress, gold trim
}

export default function Character3D({ id, role, position, state }: CharacterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const armsRef = useRef<THREE.Group>(null)
  const [reactionTime, setReactionTime] = useState(0)

  useEffect(() => {
    const handleReaction = () => {
      setReactionTime(Date.now())
    }
    window.addEventListener('npc_reaction', handleReaction)
    return () => window.removeEventListener('npc_reaction', handleReaction)
  }, [])
  
  const colors = palettes[role] || palettes.adult_male

  useFrame((sceneState, delta) => {
    if (!groupRef.current || !headRef.current || !armsRef.current) return
    
    // Idle floating & Reaction
    const t = sceneState.clock.elapsedTime
    let yOffset = Math.sin(t * 2 + position[0]) * 0.02
    
    // Reaction nod/hop
    if (Date.now() - reactionTime < 1000) {
      yOffset += Math.sin((Date.now() - reactionTime) / 100) * 0.1
    }
    
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1] + yOffset, 5 * delta)
    
    // Subtle breathing
    groupRef.current.scale.y = 1 + Math.sin(t * 2) * 0.015
    groupRef.current.scale.z = 1 + Math.sin(t * 2) * 0.01
    
    // Look at center table slowly
    const target = new THREE.Vector3(0, 0.5, 0)
    
    // If waiting for tea, maybe look slightly up or follow pointer?
    // We'll just do a subtle idle head sway for now
    headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1
    headRef.current.rotation.x = Math.sin(t * 0.3) * 0.05
    
    // Subtle arm sway
    armsRef.current.rotation.z = Math.sin(t * 0.8) * 0.02
  })

  // Look-at base rotation: NPCs sit at -Z looking at +Z (table)
  const isKelin = role === 'kelin'
  const baseRotation = isKelin ? 0 : 0 // If Kelin, face away from camera? Camera is at +Z looking -Z. So Kelin at +Z looking -Z is rotation Math.PI

  return (
    <group ref={groupRef} position={position} rotation={[0, isKelin ? Math.PI : 0, 0]}>
      {/* Torso (Stylized RoundedBox) */}
      <RoundedBox args={[0.8, 1.2, 0.6]} radius={0.2} smoothness={4} position={[0, 0.6, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={colors.clothes} roughness={0.8} />
      </RoundedBox>

      {/* Decorative Trim (Collar / Shapan edge) */}
      <mesh position={[0, 0.8, 0.31]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.8, 0.05]} />
        <meshStandardMaterial color={colors.trim} roughness={0.6} />
      </mesh>

      {/* Head Group */}
      <group ref={headRef} position={[0, 1.4, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.2, 16]} />
          <meshStandardMaterial color={colors.skin} roughness={0.6} />
        </mesh>

        {/* Face/Head Base (Stylized Capsule) */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.22, 0.15, 16, 32]} />
          <meshStandardMaterial color={colors.skin} roughness={0.5} />
        </mesh>

        {/* Hair / Headwear */}
        {role === 'elder_female' && (
          // Kimeshek (White hood)
          <mesh position={[0, 0.05, -0.05]} castShadow receiveShadow>
            <sphereGeometry args={[0.26, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8]} />
            <meshStandardMaterial color={colors.head} roughness={0.9} />
          </mesh>
        )}
        {role === 'elder_male' && (
          // Taqia (Skullcap)
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.1, 32]} />
            <meshStandardMaterial color={colors.head} roughness={0.9} />
          </mesh>
        )}

        {/* Simple Eyes (Stylized dots) */}
        <mesh position={[-0.08, 0.05, 0.21]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#1A1A1A" />
        </mesh>
        <mesh position={[0.08, 0.05, 0.21]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#1A1A1A" />
        </mesh>

        {/* Simple Mouth */}
        <mesh position={[0, -0.05, 0.22]} rotation={[0, 0, state === 'drinking' ? 0 : ((Date.now() - reactionTime < 2000) ? Math.PI : Math.PI * 0.9)]}>
          {state === 'drinking' ? (
            <sphereGeometry args={[0.03]} />
          ) : (
            <torusGeometry args={[0.03, 0.01, 8, 16, Math.PI * 0.8]} />
          )}
          <meshBasicMaterial color="#3A1A1A" />
        </mesh>
      </group>

      {/* Arms Group */}
      <group ref={armsRef} position={[0, 1.0, 0]}>
        {/* Left Arm (Relaxed) */}
        <mesh position={[-0.45, -0.25, 0]} rotation={[0, 0, -0.1]} castShadow receiveShadow>
          <capsuleGeometry args={[0.12, 0.5, 16, 16]} />
          <meshStandardMaterial color={colors.clothes} roughness={0.8} />
        </mesh>
        {/* Left Hand */}
        <mesh position={[-0.48, -0.6, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color={colors.skin} roughness={0.6} />
        </mesh>

        {/* Right Arm (Resting on table or ready to receive) */}
        <mesh position={[0.45, -0.1, 0.2]} rotation={[-1.2, 0, 0.1]} castShadow receiveShadow>
          <capsuleGeometry args={[0.12, 0.4, 16, 16]} />
          <meshStandardMaterial color={colors.clothes} roughness={0.8} />
        </mesh>
        {/* Right Hand */}
        <mesh position={[0.45, -0.3, 0.4]} castShadow receiveShadow>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color={colors.skin} roughness={0.6} />
        </mesh>
      </group>
      
      {/* Sitting Legs (Under table) */}
      <mesh position={[0, 0.15, 0.2]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.2, 0.6, 16, 16]} />
        <meshStandardMaterial color={colors.clothes} roughness={0.8} />
      </mesh>
    </group>
  )
}
