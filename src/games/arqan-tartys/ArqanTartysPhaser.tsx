'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as Phaser from 'phaser'
import { getPhaserConfig } from './engine/Game'
import { gameAudio } from '@/lib/services/GameAudioService'
import { loadProgression } from './scoring/progression'

export default function ArqanTartysPhaser() {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)
  const [, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!gameRef.current) return

    if (!phaserGameRef.current) {
      gameAudio.init()
      const progression = loadProgression()
      const config = getPhaserConfig(gameRef.current, progression.unlockedLevel)
      phaserGameRef.current = new Phaser.Game(config)
      setIsLoaded(true)
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={gameRef}
      className="w-full h-full bg-[#e8b978] overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    />
  )
}
