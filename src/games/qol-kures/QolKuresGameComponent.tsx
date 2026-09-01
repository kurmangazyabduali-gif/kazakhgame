'use client'

import React, { useEffect } from 'react'
import { useQolKuresStore } from './store/useQolKuresStore'
import { AthletesRenderer } from './ui/AthletesRenderer'
import { QolKuresHUD } from './ui/QolKuresHUD'
import { TutorialManager } from './tutorial/TutorialManager'
import { AnimatePresence } from 'framer-motion'

export default function QolKuresGameComponent() {
  const {
    gameStatus,
    showTutorial,
    dismissTutorial,
    setPlayerPressing,
    tick,
    attemptBurst,
    attemptComeback,
    physicsState,
    audio
  } = useQolKuresStore()

  // 1. Background Music Loop Control
  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      audio.startBackgroundMusic()
    } else {
      audio.stopBackgroundMusic()
    }
    return () => {
      audio.stopBackgroundMusic()
    }
  }, [gameStatus, audio])

  // 2. Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.code === 'Space') {
        e.preventDefault()
        if (physicsState.burstWindowActive) {
          attemptBurst()
        } else if (physicsState.comebackActive) {
          attemptComeback()
        } else {
          setPlayerPressing(true)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setPlayerPressing(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [setPlayerPressing, attemptBurst, attemptComeback, physicsState])

  // 3. Gameplay Physics and AI Tick loop
  useEffect(() => {
    let lastTime = performance.now()
    let frameId: number

    const loop = (time: number) => {
      const dt = time - lastTime
      lastTime = time

      // Limit dt to handle browser window switches
      tick(Math.min(dt, 100))

      frameId = requestAnimationFrame(loop)
    }

    if (gameStatus === 'PLAYING') {
      lastTime = performance.now()
      frameId = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [gameStatus, tick])

  // 4. Mouse / Touch click controls
  const handlePointerDown = (e: React.PointerEvent) => {
    if (gameStatus !== 'PLAYING') return

    // If tapping inside a burst or comeback window, trigger that instead of normal press
    if (physicsState.burstWindowActive) {
      attemptBurst()
    } else if (physicsState.comebackActive) {
      attemptComeback()
    } else {
      setPlayerPressing(true)
    }
  }

  const handlePointerUp = () => {
    setPlayerPressing(false)
  }

  return (
    <div 
      className="relative w-full h-full bg-[#120904] flex items-center justify-center overflow-hidden select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      {/* 2D Athletes & Environment */}
      <AthletesRenderer />

      {/* Heads-up display, Stamina controls, overlays */}
      <QolKuresHUD />

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialManager onDismiss={dismissTutorial} />
        )}
      </AnimatePresence>
    </div>
  )
}
