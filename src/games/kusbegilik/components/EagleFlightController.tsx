'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useKusbegilikEngine } from '../engine'
import { GamePhysicsBody, CuboidCollider } from '@/three/systems/PhysicsAdapter'

import { AssetFallbackBoundary } from '@/components/three/AssetFallbackBoundary'
import { ASSETS } from '@/lib/data/assets'

export function EagleFlightController({ children }: { children: React.ReactNode }) {
  const rigidBody = useRef<RapierRigidBody>(null)
  const eagleMesh = useRef<THREE.Group>(null)
  const wings = useRef<THREE.Group>(null)
  
  const { 
    gameState, updateTelemetry, setFlightState, updateStamina,
    controlMode, activeCommand, missionState, setMissionState, setTargetInfo, currentStamina
  } = useKusbegilikEngine()

  // Flight Model Parameters
  const config = {
    baseSpeed: 20,
    maxSpeed: 60,
    minSpeed: 10,
    pitchRate: 1.5,
    rollRate: 2.5,
    yawRateBase: 1.0,
    gravity: 9.8,
  }

  const flightData = useRef({
    pitch: 0,
    roll: 0,
    yaw: 0,
    speed: config.baseSpeed
  })

  const keys = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true }
    const onKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    if (gameState !== 'PLAYING' || !rigidBody.current || !eagleMesh.current) return
    const dt = Math.min(delta, 0.1)
    const data = flightData.current
    const currentPos = rigidBody.current.translation()

    // --- Hunting Target Logic (Mocked distance checking) ---
    // If we're hunting, check if we found the target (mocked as a point at 0, 0, -200)
    if (missionState === 'SEARCH' && currentPos.z < -100) {
      setMissionState('LOCATE')
    }
    if (missionState === 'LOCATE' && currentPos.z < -150) {
      setTargetInfo(true, Math.abs(currentPos.z + 200))
      setMissionState('FOCUS')
    }

    // --- Control Logic ---
    let pitchInput = 0
    let rollInput = 0
    let boostInput = 0

    if (controlMode === 'DIRECT') {
      if (keys.current['KeyW']) pitchInput -= 1 
      if (keys.current['KeyS']) pitchInput += 1 
      if (keys.current['KeyA']) rollInput -= 1  
      if (keys.current['KeyD']) rollInput += 1  
      if (keys.current['ShiftLeft'] || keys.current['ShiftRight']) boostInput = 1
    } else if (controlMode === 'COMMAND') {
      // Autopilot based on active command
      if (activeCommand === 'DIVE') {
        pitchInput = -1 // Dive hard
        boostInput = 1
        if (currentPos.y < 2) setMissionState('ATTACK')
      } else if (activeCommand === 'FOLLOW') {
        // Just fly straight towards target (mock)
        pitchInput = currentPos.y > 20 ? -0.2 : 0
        rollInput = 0
      } else if (activeCommand === 'RETURN') {
        pitchInput = 0.5 // Climb up and return
        rollInput = 0
      }
    }

    // --- Integration ---
    data.pitch = THREE.MathUtils.lerp(data.pitch, pitchInput * (Math.PI / 4), dt * config.pitchRate)
    data.roll = THREE.MathUtils.lerp(data.roll, rollInput * (Math.PI / 3), dt * config.rollRate)
    data.yaw += -data.roll * config.yawRateBase * dt

    const pitchDeg = THREE.MathUtils.radToDeg(data.pitch)
    
    // Speed adjustments
    if (pitchDeg < 0) data.speed += Math.abs(pitchDeg) * 0.5 * dt
    else if (pitchDeg > 0) data.speed -= pitchDeg * 0.3 * dt
    
    if (boostInput && currentStamina > 0) {
      data.speed += 10 * dt
      updateStamina(-10 * dt) // Drain stamina
    } else {
      updateStamina(2 * dt) // Recover stamina slowly
    }

    if (pitchInput === 0 && !boostInput) {
      data.speed = THREE.MathUtils.lerp(data.speed, config.baseSpeed, dt * 0.5)
    }

    data.speed = Math.max(config.minSpeed, Math.min(config.maxSpeed, data.speed))

    const quaternion = new THREE.Quaternion()
    const euler = new THREE.Euler(data.pitch, data.yaw, data.roll, 'YXZ')
    quaternion.setFromEuler(euler)

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion)
    const velocity = forward.clone().multiplyScalar(data.speed)
    
    if (data.speed < 15 && data.pitch > 0) velocity.y -= config.gravity * dt * 2

    const nextPos = {
      x: currentPos.x + velocity.x * dt,
      y: currentPos.y + velocity.y * dt,
      z: currentPos.z + velocity.z * dt
    }
    
    // Floor collision prevention (simplified)
    if (nextPos.y < 0.5) {
      nextPos.y = 0.5
      data.pitch = 0
    }

    rigidBody.current.setNextKinematicTranslation(nextPos)
    rigidBody.current.setNextKinematicRotation(quaternion)

    updateTelemetry(
      Math.round(data.speed), Math.round(nextPos.y), Math.round(pitchDeg), Math.round(THREE.MathUtils.radToDeg(data.roll)), Math.round(THREE.MathUtils.radToDeg(data.yaw))
    )

    let fState: 'GLIDE' | 'CLIMB' | 'DIVE' | 'TURN' | 'BRAKE' = 'GLIDE'
    if (pitchDeg < -10) fState = 'DIVE'
    else if (pitchDeg > 10) fState = 'CLIMB'
    else if (Math.abs(data.roll) > 0.2) fState = 'TURN'
    setFlightState(fState)

    if (wings.current) {
      const flapSpeed = data.speed > config.baseSpeed + 10 ? 20 : data.speed < config.baseSpeed ? 5 : 0
      if (flapSpeed > 0) wings.current.rotation.z = Math.sin(state.clock.elapsedTime * flapSpeed) * 0.3
      else wings.current.rotation.z = THREE.MathUtils.lerp(wings.current.rotation.z, 0, dt * 5)
    }
  })

  const eagleAsset = ASSETS.find(a => a.id === 'eagle-hero')
  
  const fallbackMock = (
    <group>
      <mesh castShadow><boxGeometry args={[0.5, 0.4, 1.5]} /><meshStandardMaterial color="#3e2723" /></mesh>
      <mesh position={[0, 0.1, -0.8]} castShadow><boxGeometry args={[0.3, 0.3, 0.4]} /><meshStandardMaterial color="#f5f5dc" /></mesh>
      <group ref={wings}>
        <mesh position={[-1.2, 0, 0]} castShadow><boxGeometry args={[2, 0.05, 0.8]} /><meshStandardMaterial color="#4e342e" /></mesh>
        <mesh position={[1.2, 0, 0]} castShadow><boxGeometry args={[2, 0.05, 0.8]} /><meshStandardMaterial color="#4e342e" /></mesh>
      </group>
    </group>
  )

  return (
    <GamePhysicsBody ref={rigidBody} type="kinematicPosition" position={[0, 50, 0]} userData={{ type: 'eagle' }}>
      <group ref={eagleMesh}>
        <AssetFallbackBoundary 
          assetId="eagle-hero" 
          url={eagleAsset?.path || ''} 
          fallback={fallbackMock} 
        />
        {children}
        <CuboidCollider args={[2, 1, 2]} sensor />
      </group>
    </GamePhysicsBody>
  )
}
