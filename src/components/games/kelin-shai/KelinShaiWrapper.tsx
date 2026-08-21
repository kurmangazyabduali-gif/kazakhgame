'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { KelinShaiGame } from '@/games/kelin-shai/KelinShaiGame'
import { ScenarioResult, ScenarioState, InteractionFeedback, ScenarioStep } from '@/games/engine/scenario/types'
import KelinShaiHUD from './KelinShaiHUD'
import KelinShaiResult from './KelinShaiResult'
import KelinShai3DScene from './KelinShai3DScene'
import { guestStorage } from '@/lib/guestStorage'
import { GameShell } from '@/components/games/shared/GameShell'

export default function KelinShaiWrapper({ sessionId }: { sessionId: string }) {
  const kelinShaiGameRef = useRef<KelinShaiGame | null>(null)
  
  const [state, setState] = useState<ScenarioState | null>(null)
  const [result, setResult] = useState<ScenarioResult | null>(null)
  const [currentStep, setCurrentStep] = useState<ScenarioStep | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)

  const submitScore = useCallback(async (finalResult: ScenarioResult) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/games/kelin-shai/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          result: finalResult
        })
      })
      if (response.ok) {
        const data = await response.json() as {
          guest?: boolean
          validatedScore: number
          xpEarned: number
          achievements?: string[]
          unlockedAchievements?: string[]
        }
        if (data.guest) {
          guestStorage.saveGameResult('kelin-shai', data.validatedScore, data.xpEarned)
          ;(data.achievements ?? data.unlockedAchievements ?? []).forEach((achievementId) => {
            guestStorage.unlockAchievement(achievementId)
          })
        }
      } else {
        console.warn('Kelin Shai result was not saved')
      }
    } catch (err) {
      console.warn('Kelin Shai result submit failed', err)
    } finally {
      setIsSubmitting(false)
    }
  }, [sessionId])

  useEffect(() => {
    kelinShaiGameRef.current = new KelinShaiGame()
    kelinShaiGameRef.current.initialize()
    const engine = kelinShaiGameRef.current.engine
    
    setState(engine.getStateSnapshot())
    setCurrentStep(engine.getCurrentStep())
    
    engine.onStateUpdate = (newState: ScenarioState) => {
      setState(newState)
      setCurrentStep(engine.getCurrentStep())
    }

    engine.onFeedback = (fb: InteractionFeedback) => {
      const handleFeedback = (feedback: any) => {
        setFeedback(feedback.message)
        setTimeout(() => setFeedback(null), 3000)
        if (feedback.reaction !== 'none' && feedback.reaction !== 'wait') {
          window.dispatchEvent(new CustomEvent('npc_reaction', { 
            detail: { reaction: feedback.reaction, message: feedback.message } 
          }))
        }
      }
      handleFeedback(fb)
    }

    engine.onScenarioComplete = (res: ScenarioResult) => {
      setResult(res)
      submitScore(res)
    }

    return () => {
      kelinShaiGameRef.current = null
    }
  }, [submitScore])

  const startGame = () => {
    setShowTutorial(false)
    kelinShaiGameRef.current?.start()
  }

  const handlePlayAgain = () => {
    setResult(null)
    setFeedback(null)
    kelinShaiGameRef.current?.restart()
  }

  return (
    <GameShell title="Келін шай" gameSlug="kelin-shai">
      <div className="relative w-full h-full overflow-hidden bg-[#1F1610] touch-none select-none">
        
        {/* R3F Canvas Mount Point */}
        <div className="absolute inset-0 z-0">
          {kelinShaiGameRef.current && (
            <KelinShai3DScene 
              engine={kelinShaiGameRef.current.engine}
              state={state}
            />
          )}
        </div>
        
        {showTutorial && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 pointer-events-auto" onClick={startGame}>
            <div className="text-center animate-in fade-in duration-1000 cursor-pointer">
              <h2 className="text-6xl font-bold mb-4 font-display text-gold uppercase tracking-widest drop-shadow-[0_5px_15px_rgba(0,0,0,1)]">КЕЛІН ШАЙ</h2>
              <p className="text-gold/80 font-heading tracking-[0.2em] uppercase text-sm animate-pulse">Бастау үшін басыңыз (Tap to start)</p>
            </div>
          </div>
        )}

        {!result && !showTutorial && (
          <KelinShaiHUD 
            state={state} 
            currentStep={currentStep} 
            feedbackMessage={feedback} 
            engine={kelinShaiGameRef.current?.engine || null}
          />
        )}
        
        {result && (
          <KelinShaiResult 
            result={result} 
            isSubmitting={isSubmitting} 
            onPlayAgain={handlePlayAgain} 
          />
        )}
      </div>
    </GameShell>
  )
}
