'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hantalapayEngine } from './engine/HantalapayEngine'
import { asykRenderer } from './entities/AsykEntity'
import { khanRenderer } from './entities/KhanEntity'
import { obstacleRenderer } from './entities/ObstacleEntity'
import { particlePool } from './entities/ParticlePool'
import { idleDetector } from './hints/IdleDetector'

import { HantalapayHUD } from './ui/HantalapayHUD'
import { KhanHighlightOverlay } from './ui/KhanHighlightOverlay'
import { RoundResultModal } from './ui/RoundResultModal'
import { MatchResultModal } from './ui/MatchResultModal'
import { TutorialOverlay } from './tutorial/TutorialOverlay'
import { GhostHandHint } from './tutorial/GhostHandHint'
import { guestStorage } from '@/lib/guestStorage'

export const HantalapayGameComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [gameState, setGameState] = useState(hantalapayEngine.state)
  const [showTutorial, setShowTutorial] = useState(true)
  const [hudData, setHudData] = useState({
    roundNumber: 1,
    totalRounds: 10,
    roundTitle: 'Балақай Бастауы',
    timeLeftSec: 20,
    totalTimeSec: 20,
    score: 0,
    comboStreak: 0,
    collectedCount: 0,
    totalAsyks: 12,
    khanCaptured: false,
  })

  const [idleHint, setIdleHint] = useState<{ x: number; y: number } | null>(null)

  // Start game on mount
  useEffect(() => {
    hantalapayEngine.startMatch()
    setGameState(hantalapayEngine.state)
  }, [])

  // Sync canvas size
  const updateSize = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr

    hantalapayEngine.setBounds(width, height)
  }, [])

  useEffect(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [updateSize])

  // Canvas Render & Animation Loop
  useEffect(() => {
    let animId: number
    let lastTime = performance.now()

    const loop = (now: number) => {
      const deltaMs = Math.min(100, now - lastTime)
      lastTime = now

      // 1. Step Engine
      hantalapayEngine.step(deltaMs)
      setGameState(hantalapayEngine.state)

      // Sync HUD
      const cfg = hantalapayEngine.currentConfig
      setHudData({
        roundNumber: hantalapayEngine.currentRoundNumber,
        totalRounds: hantalapayEngine.totalRounds,
        roundTitle: cfg.titleKz,
        timeLeftSec: Math.max(0, hantalapayEngine.roundTimerSec),
        totalTimeSec: cfg.timeLimitSec,
        score: hantalapayEngine.score,
        comboStreak: hantalapayEngine.comboStreak,
        collectedCount: hantalapayEngine.collectedCount,
        totalAsyks: hantalapayEngine.asyks.length,
        khanCaptured: hantalapayEngine.khanCapturedInRound,
      })

      // Sync Idle Hint
      const idleInfo = idleDetector.update(deltaMs / 1000, hantalapayEngine.asyks)
      if (idleInfo.isIdle && idleInfo.targetAsyk && hantalapayEngine.state === 'PLAYING') {
        setIdleHint({ x: idleInfo.targetAsyk.x, y: idleInfo.targetAsyk.y })
      } else {
        setIdleHint(null)
      }

      // 2. Render Canvas
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const dpr = window.devicePixelRatio || 1
          ctx.save()
          ctx.scale(dpr, dpr)

          const width = hantalapayEngine.bounds.width
          const height = hantalapayEngine.bounds.height
          const timeSec = now / 1000

          // A. Draw Felt Carpet Background (Текемет / Сырмақ)
          ctx.fillStyle = cfg.carpetBgVariant === 'blue-syrmak' ? '#1E3A5F' : cfg.carpetBgVariant === 'gold-dastarkhan' ? '#3D2817' : '#5C1D15'
          ctx.fillRect(0, 0, width, height)

          // Carpet Ornament Border (Қошқар мүйіз border)
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)'
          ctx.lineWidth = 12
          ctx.strokeRect(20, 20, width - 40, height - 40)

          ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)'
          ctx.lineWidth = 2
          ctx.strokeRect(30, 30, width - 60, height - 60)

          // B. Draw Obstacles
          hantalapayEngine.obstacles.forEach((obs) => {
            obstacleRenderer.drawObstacle(ctx, obs)
          })

          // C. Draw Asyks
          const highlightedId = idleDetector.getHighlightedId()
          hantalapayEngine.asyks.forEach((item) => {
            if (item.isKhan) {
              khanRenderer.drawKhan(ctx, item, timeSec)
            } else {
              asykRenderer.drawAsyk(ctx, item, item.id === highlightedId)
            }
          })

          // D. Draw Particles
          particlePool.updateAndDraw(ctx, deltaMs / 1000)

          // E. Draw Countdown Banner (3, 2, 1, ХАНТАЛАПАЙ!)
          if (hantalapayEngine.state === 'COUNTDOWN') {
            ctx.save()
            ctx.fillStyle = 'rgba(42, 38, 33, 0.65)'
            ctx.fillRect(0, 0, width, height)

            ctx.font = 'black 80px serif'
            ctx.fillStyle = '#D4AF37'
            ctx.strokeStyle = '#FFFFFF'
            ctx.lineWidth = 4
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            const text = hantalapayEngine.countdownSec > 0 ? `${hantalapayEngine.countdownSec}` : 'ХАНТАЛАПАЙ!'
            ctx.strokeText(text, width / 2, height / 2)
            ctx.fillText(text, width / 2, height / 2)
            ctx.restore()
          }

          ctx.restore()
        }
      }

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [])

  // Handle Pointer / Touch Events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top

    hantalapayEngine.handleTap(clientX, clientY)
  }

  // Handle Next Round
  const handleNextRound = () => {
    if (hantalapayEngine.currentRoundNumber >= hantalapayEngine.totalRounds) {
      hantalapayEngine.finishMatch()
      setGameState('MATCH_RESULT')
      
      // Submit server validation
      if (hantalapayEngine.finalMatchSummary) {
        fetch('/api/games/hantalapay/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            score: hantalapayEngine.finalMatchSummary.totalScore,
            stars: hantalapayEngine.finalMatchSummary.totalStars,
            roundsCompleted: hantalapayEngine.finalMatchSummary.roundsCompleted,
            khansCaptured: hantalapayEngine.finalMatchSummary.totalKhansCaptured,
          }),
        }).catch(() => {})

        guestStorage.saveGameResult(
          'hantalapay',
          hantalapayEngine.finalMatchSummary.totalScore,
          hantalapayEngine.finalMatchSummary.xpEarned
        )
      }
    } else {
      hantalapayEngine.startRound(hantalapayEngine.currentRoundNumber + 1)
      setGameState(hantalapayEngine.state)
    }
  }

  const handleRestart = () => {
    hantalapayEngine.startMatch()
    setGameState(hantalapayEngine.state)
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="relative w-full h-[82vh] min-h-[500px] max-h-[900px] bg-[#2A2621] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/40 select-none touch-none"
      style={{ touchAction: 'none' }}
    >
      {/* HTML5 Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" />

      {/* Game HUD */}
      {gameState !== 'MATCH_RESULT' && (
        <HantalapayHUD
          roundNumber={hudData.roundNumber}
          totalRounds={hudData.totalRounds}
          roundTitle={hudData.roundTitle}
          timeLeftSec={hudData.timeLeftSec}
          totalTimeSec={hudData.totalTimeSec}
          score={hudData.score}
          comboStreak={hudData.comboStreak}
          collectedCount={hudData.collectedCount}
          totalAsyks={hudData.totalAsyks}
          khanCaptured={hudData.khanCaptured}
        />
      )}

      {/* Khan Highlight Slow-Mo Overlay */}
      <AnimatePresence>
        {gameState === 'KHAN_HIGHLIGHT' && <KhanHighlightOverlay />}
      </AnimatePresence>

      {/* Idle Ghost Hand Hint */}
      <AnimatePresence>
        {idleHint && <GhostHandHint x={idleHint.x} y={idleHint.y} />}
      </AnimatePresence>

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && <TutorialOverlay onDismiss={() => setShowTutorial(false)} />}
      </AnimatePresence>

      {/* Round Result Modal */}
      <AnimatePresence>
        {gameState === 'ROUND_RESULT' && hantalapayEngine.currentRoundResult && (
          <RoundResultModal
            data={hantalapayEngine.currentRoundResult}
            isLastRound={hantalapayEngine.currentRoundNumber >= hantalapayEngine.totalRounds}
            onNextRound={handleNextRound}
          />
        )}
      </AnimatePresence>

      {/* Final Match Result Modal */}
      <AnimatePresence>
        {gameState === 'MATCH_RESULT' && hantalapayEngine.finalMatchSummary && (
          <MatchResultModal summary={hantalapayEngine.finalMatchSummary} onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </div>
  )
}
