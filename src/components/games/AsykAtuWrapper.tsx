'use client'

import { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import AsykAtuHUD from './AsykAtuHUD'
import AsykAtuResult from './AsykAtuResult'
import LevelTransition from './LevelTransition'
import { AsykAtuGame } from '@/games/asyk-atu/AsykAtuGame'
import { AsykFace, ThrowParams, AsykAtuPhase, ThrowEvent } from '@/games/asyk-atu/types'
import { GameResult } from '@/types/game'
import { getLevelConfig } from '@/games/asyk-atu/levels'
import { GameSession } from '@/games/engine/GameSession'
import { guestStorage } from '@/lib/guestStorage'
import { Canvas } from '@react-three/fiber'
import { Asyk3DScene } from '@/games/asyk-atu/components/Asyk3DScene'
import { GameShell } from '@/components/games/shared/GameShell'

interface WrapperProps {
  sessionId: string
}

export default function AsykAtuWrapper({ sessionId }: WrapperProps) {
  const logicRef = useRef<AsykAtuGame | null>(null)
  const sessionRef = useRef<GameSession | null>(null)

  const [phase, setPhase] = useState<AsykAtuPhase>('INTRO')
  const [level, setLevel] = useState(1)
  const [maxLevels] = useState(5)
  const [totalTargets, setTotalTargets] = useState(5)
  const [remainingTargets, setRemainingTargets] = useState(5)
  
  const [score, setScore] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [throwsUsed, setThrowsUsed] = useState(0)
  
  const [aimParams, setAimParams] = useState<ThrowParams | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentCombo, setCurrentCombo] = useState(0)

  const submitScore = useCallback(async (finalResult: GameResult) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/games/asyk-atu/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          clientScore: finalResult.score,
          duration: finalResult.duration,
          events: finalResult.metadata?.events || []
        })
      })
      if (response.ok) {
        const data = await response.json()
        if (data.guest) {
          guestStorage.saveGameResult('asyk-atu', data.validatedScore, data.xpEarned)
        }
      } else {
        console.error('Failed to submit score')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    logicRef.current = new AsykAtuGame()
    sessionRef.current = new GameSession(logicRef.current)
  }, [])

  const startGame = () => {
    const config = getLevelConfig(1)
    setTotalTargets(config.targetCount)
    setRemainingTargets(config.targetCount)
    setPhase('AIM')
    sessionRef.current?.start()
  }

  const handlePlayAgain = () => {
    setResult(null)
    setScore(0)
    setAccuracy(0)
    setThrowsUsed(0)
    setLevel(1)
    const config = getLevelConfig(1)
    setTotalTargets(config.targetCount)
    setRemainingTargets(config.targetCount)
    setPhase('AIM')
    sessionRef.current?.restart()
  }

  const handleNextLevel = () => {
    const nextLevel = level + 1
    if (nextLevel > maxLevels) {
      const finalResult = sessionRef.current!.finish()
      if (finalResult) {
        setResult(finalResult)
        submitScore(finalResult)
      }
      setPhase('GAME_COMPLETE')
    } else {
      setLevel(nextLevel)
      const config = getLevelConfig(nextLevel)
      setTotalTargets(config.targetCount)
      setRemainingTargets(config.targetCount)
      logicRef.current!.advanceLevel()
      setPhase('AIM')
    }
  }

  const handleAimUpdate = (params: ThrowParams) => {
    setAimParams(params)
  }
  
  const handleThrowStart = () => {
    setPhase('THROWING')
  }
  
  const handleThrowComplete = (roundData: { targetsHit: number, landedFace?: AsykFace, remaining: number }) => {
    const isHit = roundData.targetsHit > 0
    const hitQuality = isHit ? 'direct' : 'miss'
    const newThrowsUsed = throwsUsed + 1
    
    // Combo calculation
    let newCombo = 0
    if (roundData.targetsHit > 1) {
      newCombo = roundData.targetsHit
    }
    setCurrentCombo(newCombo)

    const event: ThrowEvent = {
      levelNumber: level,
      throwNumber: newThrowsUsed,
      throwParams: aimParams || { angleDeg: 0, powerPercent: 0, directionDeg: 0 },
      hitQuality,
      targetsHit: roundData.targetsHit,
      goldenHits: 0, // No golden hits for now
      combo: newCombo,
      landedFace: roundData.landedFace,
      alshyBonus: roundData.landedFace === 'alshy'
    }
    
    logicRef.current!.recordThrow(event)
    const state = logicRef.current!.state
    
    setScore(state.score)
    setAccuracy(state.accuracy)
    setThrowsUsed(newThrowsUsed)
    setRemainingTargets(roundData.remaining)
    setAimParams(null)
    
    if (roundData.remaining <= 0) {
      setPhase('LEVEL_COMPLETE')
    } else {
      setPhase('AIM')
    }
  }

  return (
    <GameShell title="Асық ату" gameSlug="asyk-atu">
      <div className="relative w-full h-full overflow-hidden bg-background touch-none select-none">
        {/* 3D Canvas */}
        {phase !== 'INTRO' && phase !== 'GAME_COMPLETE' && (
          <div className="absolute inset-0 touch-none" style={{ touchAction: 'none' }}>
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-gold font-heading text-xl uppercase tracking-widest">Жүктелуде...</div>}>
              <Canvas camera={{ position: [0, 8, 10], fov: 45 }}>
                <Asyk3DScene 
                  key={`level-${level}`}
                  currentPhase={phase}
                  onAimUpdate={handleAimUpdate}
                  onThrowStart={handleThrowStart}
                  onThrowComplete={handleThrowComplete}
                  level={level}
                />
              </Canvas>
            </Suspense>
          </div>
        )}
        
        {/* Intro / Tutorial */}
        {phase === 'INTRO' && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-surface text-foreground p-10 rounded-3xl shadow-2xl max-w-md w-full border border-gold/20 text-center animate-in zoom-in-95 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/textures/sand.png')] opacity-10 mix-blend-overlay pointer-events-none" />
              <h2 className="text-4xl font-bold mb-6 font-display text-gold uppercase tracking-widest drop-shadow-sm">Асық ату</h2>
              <div className="space-y-6 text-text-muted mb-10 text-left text-sm font-heading tracking-wider">
                <p className="flex items-start gap-3"><span className="text-gold text-lg">🎯</span> <span>Кездегі барлық асықтарды шеңберден шығарыңыз.</span></p>
                <p className="flex items-start gap-3"><span className="text-gold text-lg">👆</span> <span>Экранды басып, рогатка сияқты төмен тартыңыз. Қатты тартсаңыз, соғұрлым қатты ұшады.</span></p>
                <p className="flex items-start gap-3"><span className="text-gold text-lg">⭐</span> <span>Бір соққымен бірнеше асықты ұрып, көбірек ұпай жинаңыз!</span></p>
              </div>
              <button 
                onClick={startGame}
                className="relative z-10 w-full py-4 bg-gold text-primary font-bold font-heading uppercase tracking-widest rounded-xl hover:bg-gold/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gold/20"
              >
                ОЙЫНДЫ БАСТАУ
              </button>
            </div>
          </div>
        )}

        {/* HUD */}
        {(phase === 'AIM' || phase === 'THROWING' || phase === 'SETTLING') && (
          <AsykAtuHUD 
            level={level}
            maxLevels={maxLevels}
            remainingTargets={remainingTargets}
            totalTargets={totalTargets}
            score={score} 
            accuracy={accuracy} 
            throws={throwsUsed}
            aimParams={aimParams} 
            onRestart={handlePlayAgain}
          />
        )}
        
        {/* Level Passed */}
        {phase === 'LEVEL_COMPLETE' && (
          <LevelTransition
            level={level}
            score={score}
            accuracy={accuracy}
            combo={currentCombo}
            onNextLevel={handleNextLevel}
          />
        )}
        
        {/* Final Result */}
        {phase === 'GAME_COMPLETE' && result && (
          <AsykAtuResult 
            result={result} 
            isSubmitting={isSubmitting} 
            onPlayAgain={handlePlayAgain} 
          />
        )}
      </div>
    </GameShell>
  )
}
