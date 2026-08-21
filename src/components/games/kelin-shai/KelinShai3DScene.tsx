'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ScenarioEngine } from '@/games/engine/scenario/ScenarioEngine'
import { ScenarioState } from '@/games/engine/scenario/types'

import Room from '@/games/kelin-shai/environment/Room'
import Dastarkhan from '@/games/kelin-shai/environment/Dastarkhan'
import Lighting from '@/games/kelin-shai/lighting/Lighting'
import Teapot3D from '@/games/kelin-shai/props/Teapot3D'
import Cup3D from '@/games/kelin-shai/props/Cup3D'
import FoodProps from '@/games/kelin-shai/props/FoodProps'
import Character3D from '@/games/kelin-shai/characters/Character3D'
import CameraController from '@/games/kelin-shai/camera/CameraController'
import InteractionGuide from '@/games/kelin-shai/guidance/InteractionGuide'
import { useHintSystem } from '@/games/kelin-shai/guidance/useHintSystem'
import { EffectComposer, DepthOfField, Bloom } from '@react-three/postprocessing'

interface KelinShai3DSceneProps {
  engine: ScenarioEngine | null
  state: ScenarioState | null
}

function SceneContent({ engine, state }: KelinShai3DSceneProps) {
  // Map 2D initial positions to 3D roughly
  // The Phaser 2D space was ~900x600. Center was 450, 400 for table.
  // We'll translate 2D (x,y) to 3D (x,z).
  const to3D = (x: number, y: number, isNpc = false): [number, number, number] => {
    const scale = 0.007
    const xPos = (x - 450) * scale
    const zPos = isNpc ? -2.0 : ((y - 400) * scale)
    return [xPos, 0.1, zPos]
  }

  // Determine current active step target for hints
  const activeStepId = state?.currentStepIndex !== undefined ? engine?.getCurrentStep()?.id : undefined
  const { hintLevel } = useHintSystem(activeStepId, true)

  let hintGuide = null
  if (hintLevel >= 2 && state) {
    if (activeStepId === 'step2_prepare_table') {
      const item = Array.from(state.items.values()).find(i => ['bauyrsak', 'qurt', 'sweets'].includes(i.id) && !i.state?.placed)
      if (item) {
        hintGuide = <InteractionGuide level={hintLevel} sourcePos={to3D(item.initialPosition.x, item.initialPosition.y, false)} targetPos={[0, 0.1, 0]} actionType="drag" />
      }
    } else if (activeStepId?.startsWith('step3') || activeStepId?.startsWith('step4') || activeStepId?.startsWith('step5')) {
      // Find the expected npc target for this step
      let npcTargetId = 'ene'
      if (activeStepId === 'step4_pour_guest') npcTargetId = 'adult_guest'
      if (activeStepId === 'step5_younger_guest') npcTargetId = 'younger_guest'
      
      const teapot = state.items.get('teapot')
      // Find an unfilled cup, or a filled cup ready to give
      const unfilledCup = Array.from(state.items.values()).find(i => i.id.startsWith('cup') && !i.state?.filled)
      const filledCup = Array.from(state.items.values()).find(i => i.id.startsWith('cup') && i.state?.filled)

      if (unfilledCup && teapot && !filledCup) {
        hintGuide = <InteractionGuide level={hintLevel} sourcePos={to3D(teapot.initialPosition.x, teapot.initialPosition.y, false)} targetPos={to3D(unfilledCup.initialPosition.x, unfilledCup.initialPosition.y, false)} actionType="pour" />
      } else if (filledCup) {
        const targetNpc = state.actors.get(npcTargetId)
        if (targetNpc) {
          const targetPos = to3D(targetNpc.position.x, targetNpc.position.y, true)
          targetPos[1] = 0.5
          targetPos[2] += 0.5
          hintGuide = <InteractionGuide level={hintLevel} sourcePos={to3D(filledCup.initialPosition.x, filledCup.initialPosition.y, false)} targetPos={targetPos} actionType="handoff" />
        }
      }
    }
  }

  return (
    <>
      <Lighting />
      <Room />
      <Dastarkhan engine={engine} state={state} />
      
      {hintGuide}

      {/* NPCs */}
      {state && Array.from(state.actors.values()).map(npc => {
        const pos = to3D(npc.position.x, npc.position.y, true)
        
        let role = 'adult_male'
        if (npc.id === 'ene') role = 'elder_female'
        if (npc.id === 'guest') role = 'elder_male'
        if (npc.id === 'younger_guest') role = 'young_male'

        return (
          <Character3D 
            key={npc.id} 
            id={npc.id} 
            role={role as any} 
            position={pos} 
            state={npc.state} 
          />
        )
      })}
      
      {/* Post-Processing for Cinematic Look */}
      <EffectComposer multisampling={4}>
        <DepthOfField focusDistance={0.015} focalLength={0.02} bokehScale={2} height={480} />
        <Bloom luminanceThreshold={1} luminanceSmoothing={0.9} intensity={0.5} />
      </EffectComposer>

      {/* Player (Kelin) - Over the shoulder presence */}
      <Character3D 
        id="player_kelin" 
        role="kelin" 
        position={[0, 0.1, 2.5]} // Foreground, facing away from camera towards table
      />

      {/* Items */}
      {state && Array.from(state.items.values()).map(item => {
        const pos = to3D(item.initialPosition.x, item.initialPosition.y, false)
        
        if (item.id === 'teapot') {
          return <Teapot3D key={item.id} id={item.id} engine={engine} initialPosition={pos} />
        }
        if (item.id.startsWith('cup')) {
          return <Cup3D key={item.id} id={item.id} engine={engine} initialPosition={pos} state={item.state} />
        }
        return <FoodProps key={item.id} id={item.id} engine={engine} initialPosition={pos} type={item.id as any} />
      })}
    </>
  )
}

export default function KelinShai3DScene({ engine, state }: KelinShai3DSceneProps) {
  return (
    <Canvas shadows dpr={[1, 2]} onContextMenu={(e) => e.preventDefault()}>
      {/* Soft color management for realism */}
      <color attach="background" args={['#1F1610']} />
      
      <CameraController />
      <SceneContent engine={engine} state={state} />
      
    </Canvas>
  )
}
