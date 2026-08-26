'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as Phaser from 'phaser'
import { getPhaserConfig } from './engine/Game'
import { gameAudio } from '@/lib/services/GameAudioService'

export default function ZhambyAtuGame() {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!gameRef.current) return

    // Initialize Phaser only once
    if (!phaserGameRef.current) {
      gameAudio.init()
      const config = getPhaserConfig(gameRef.current)
      phaserGameRef.current = new Phaser.Game(config)
      setIsLoaded(true)
    }

    return () => {
      // Cleanup Phaser on unmount
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true)
        phaserGameRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={gameRef} 
      className="w-full h-full bg-black overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    />
  )
}
