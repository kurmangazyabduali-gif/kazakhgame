import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ArmorTier } from '../store/useArqanStore'

interface PullCharacterProps {
  color: string
  isPulling: boolean
  fatigue: number
  index: number // 0-5 for roster variation
  armorTier?: ArmorTier
  isZhigerActive?: boolean
}

/**
 * Procedural 3D Kazakh Batyr Character.
 * Features PBR metal reflections on helmets & gold ornaments, dynamic sweat sheen,
 * Dubyga steel helmets / Börik headwear, and golden Zhiger aura.
 */
export function PullCharacter({
  color,
  isPulling,
  fatigue,
  index,
  armorTier = 'STANDARD',
  isZhigerActive = false,
}: PullCharacterProps) {
  const bodyRef = useRef<THREE.Group>(null)
  const leftUpperArmRef = useRef<THREE.Group>(null)
  const rightUpperArmRef = useRef<THREE.Group>(null)
  const leftUpperLegRef = useRef<THREE.Group>(null)
  const rightUpperLegRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)
  const auraRef = useRef<THREE.Mesh>(null)

  // Body scale variation per athlete (Anchor is taller/bulkier)
  const isAnchor = index === 5
  const heightScale = isAnchor ? 1.15 : 0.95 + (index % 3) * 0.08
  const widthScale = isAnchor ? 1.25 : 0.95 + ((index + 1) % 3) * 0.08

  // Skin tones
  const skinTones = ['#d4a574', '#c49464', '#e0b88a', '#b8865a', '#c8a078', '#dbb896']
  const skinColor = skinTones[index % skinTones.length]

  const isHeavyArmor = armorTier === 'HEAVY_ARMOR'

  // Dynamic Sweat Sheen (Skin roughness decreases as fatigue increases)
  const sweatRoughness = Math.max(0.18, 0.65 - fatigue * 0.42)

  useFrame((state) => {
    if (!bodyRef.current) return
    const t = state.clock.elapsedTime

    // Synchronized Team Rhythm Cadence (~100 BPM rhythm stroke)
    const teamPulse = Math.sin(t * 6.5) * 0.08 * (isPulling ? 1.0 : 0.2)
    const breathPulse = Math.sin(t * 3.5) * (0.015 + fatigue * 0.03)

    // Lean back in PERFECT UNISON when pulling (-0.52 rad)
    const targetLean = isPulling ? -0.52 : -0.06
    const currentLean = bodyRef.current.rotation.z
    bodyRef.current.rotation.z = THREE.MathUtils.lerp(currentLean, targetLean + teamPulse + breathPulse, 0.12)

    // Synchronized strain vibration under heavy effort
    if (isPulling) {
      const strainVibe = Math.sin(t * 32) * 0.015 * (0.4 + fatigue * 0.6)
      bodyRef.current.position.y = 0.65 + strainVibe
    } else {
      bodyRef.current.position.y = 0.65
    }

    // Arms: Synchronized yanking motion back toward torso on beat
    if (leftUpperArmRef.current && rightUpperArmRef.current) {
      const yankStroke = isPulling ? Math.sin(t * 6.5) * 0.12 : 0
      const targetArmAngle = isPulling ? -0.55 + yankStroke : -0.25
      leftUpperArmRef.current.rotation.z = THREE.MathUtils.lerp(leftUpperArmRef.current.rotation.z, targetArmAngle, 0.14)
      rightUpperArmRef.current.rotation.z = THREE.MathUtils.lerp(rightUpperArmRef.current.rotation.z, targetArmAngle, 0.14)
    }

    // Legs: Firmly planted bracing stance (Front leg braced forward, back leg anchored behind)
    if (leftUpperLegRef.current && rightUpperLegRef.current) {
      const frontLegStance = isPulling ? 0.42 : 0.12
      const backLegStance = isPulling ? -0.28 : -0.05
      leftUpperLegRef.current.rotation.z = THREE.MathUtils.lerp(leftUpperLegRef.current.rotation.z, frontLegStance, 0.12)
      rightUpperLegRef.current.rotation.z = THREE.MathUtils.lerp(rightUpperLegRef.current.rotation.z, backLegStance, 0.12)
    }

    // Head: Synchronized effort tilt
    if (headRef.current) {
      const targetHeadTilt = isPulling ? 0.22 : fatigue * 0.25
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetHeadTilt + teamPulse * 0.5, 0.12)
    }

    // Zhiger Aura Pulse
    if (auraRef.current) {
      const pulseScale = 1.0 + Math.sin(t * 8) * 0.08
      auraRef.current.scale.set(pulseScale, pulseScale, pulseScale)
    }
  })

  // PBR Materials with high specular & reflections
  const skinMat = <meshStandardMaterial color={skinColor} roughness={sweatRoughness} metalness={0.05} />
  const teamMat = <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
  const goldMat = <meshStandardMaterial color="#ffd700" metalness={0.88} roughness={0.18} />
  const steelMat = <meshStandardMaterial color="#a5b0bc" metalness={0.92} roughness={0.15} />
  const leatherMat = <meshStandardMaterial color="#3a1e0b" roughness={0.7} />
  const hairMat = <meshStandardMaterial color="#1f140c" roughness={0.9} />
  const bootMat = <meshStandardMaterial color="#221810" roughness={0.8} />

  return (
    <group scale={[widthScale, heightScale, widthScale]}>
      
      {/* ЖІГЕР Golden Aura Sphere */}
      {isZhigerActive && (
        <mesh ref={auraRef} position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.72, 16, 16]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.4} wireframe />
        </mesh>
      )}

      {/* BODY GROUP */}
      <group ref={bodyRef} position={[0, 0.65, 0]}>

        {/* Torso */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[0.38, 0.46, 0.22]} />
          {isHeavyArmor ? steelMat : teamMat}
        </mesh>

        {/* Steel Pauldrons (Heavy Armor) */}
        {isHeavyArmor && (
          <>
            <mesh position={[0.22, 0.52, 0.12]} castShadow>
              <sphereGeometry args={[0.09, 8, 8]} />
              {goldMat}
            </mesh>
            <mesh position={[0.22, 0.52, -0.12]} castShadow>
              <sphereGeometry args={[0.09, 8, 8]} />
              {goldMat}
            </mesh>
          </>
        )}

        {/* Belt with Gold Ornament */}
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.4, 0.08, 0.24]} />
          {leatherMat}
        </mesh>
        <mesh position={[0.21, 0.16, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.03]} />
          {goldMat}
        </mesh>

        {/* HEAD GROUP */}
        <group ref={headRef} position={[0, 0.74, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.13, 12, 12]} />
            {skinMat}
          </mesh>

          {/* Eyes */}
          <mesh position={[0.11, 0.02, 0.05]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color="#1a1008" />
          </mesh>
          <mesh position={[0.11, 0.02, -0.05]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color="#1a1008" />
          </mesh>

          {/* Steel Dubyga Helmet vs Traditional Börik */}
          {isHeavyArmor ? (
            <group position={[0, 0.06, 0]}>
              {/* Dubyga Cone */}
              <mesh position={[0, 0.08, 0]}>
                <coneGeometry args={[0.14, 0.18, 12]} />
                {steelMat}
              </mesh>
              {/* Gold Spike */}
              <mesh position={[0, 0.2, 0]}>
                <coneGeometry args={[0.02, 0.08, 6]} />
                {goldMat}
              </mesh>
            </group>
          ) : (
            <group position={[0, 0.06, 0]}>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.14, 0.14, 0.06, 12]} />
                <meshStandardMaterial color="#4a2a14" roughness={0.9} />
              </mesh>
              <mesh position={[0, 0.08, 0]}>
                <sphereGeometry args={[0.13, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
                {teamMat}
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                {goldMat}
              </mesh>
            </group>
          )}
        </group>

        {/* ARMS */}
        <group ref={leftUpperArmRef} position={[0.22, 0.52, 0.08]}>
          <mesh position={[0.12, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.05, 0.18, 6, 8]} />
            {isHeavyArmor ? steelMat : teamMat}
          </mesh>
          <group position={[0.28, 0, 0]}>
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
              <capsuleGeometry args={[0.045, 0.16, 6, 8]} />
              {skinMat}
            </mesh>
            <mesh position={[0.22, 0, 0]} castShadow>
              <sphereGeometry args={[0.055, 8, 8]} />
              {skinMat}
            </mesh>
          </group>
        </group>

        <group ref={rightUpperArmRef} position={[0.22, 0.52, -0.08]}>
          <mesh position={[0.12, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.05, 0.18, 6, 8]} />
            {isHeavyArmor ? steelMat : teamMat}
          </mesh>
          <group position={[0.28, 0, 0]}>
            <mesh position={[0.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
              <capsuleGeometry args={[0.045, 0.16, 6, 8]} />
              {skinMat}
            </mesh>
            <mesh position={[0.22, 0, 0]} castShadow>
              <sphereGeometry args={[0.055, 8, 8]} />
              {skinMat}
            </mesh>
          </group>
        </group>

        {/* LEGS */}
        <group ref={leftUpperLegRef} position={[0.1, 0.08, 0.08]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <capsuleGeometry args={[0.06, 0.22, 6, 8]} />
            <meshStandardMaterial color="#2a2a44" />
          </mesh>
          <mesh position={[0, -0.42, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.2, 6, 8]} />
            {skinMat}
          </mesh>
          <mesh position={[0.04, -0.58, 0]} castShadow>
            <boxGeometry args={[0.14, 0.08, 0.09]} />
            {bootMat}
          </mesh>
        </group>

        <group ref={rightUpperLegRef} position={[-0.08, 0.08, -0.08]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <capsuleGeometry args={[0.06, 0.22, 6, 8]} />
            <meshStandardMaterial color="#2a2a44" />
          </mesh>
          <mesh position={[0, -0.42, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.2, 6, 8]} />
            {skinMat}
          </mesh>
          <mesh position={[0.04, -0.58, 0]} castShadow>
            <boxGeometry args={[0.14, 0.08, 0.09]} />
            {bootMat}
          </mesh>
        </group>

      </group>
    </group>
  )
}
