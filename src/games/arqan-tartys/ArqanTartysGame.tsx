'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as Phaser from 'phaser'
import { getPhaserConfig } from './engine/Game'

export default function ArqanTartysGame() {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!gameRef.current) return

    if (!phaserGameRef.current) {
      const config = getPhaserConfig(gameRef.current)
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
      className="w-full h-full bg-black overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    />
  )
}
