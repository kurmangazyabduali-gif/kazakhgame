'use client'

import { useJambyEngine, LEVELS } from '../engine'
import { Target, Wind, Trophy, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { guestStorage } from '@/lib/guestStorage'

export function JambyUI() {
  const router = useRouter()
  const { gameState, setGameState, drawStrength, score, currentLevelIndex, combo, hits, results } = useJambyEngine()
  const level = LEVELS[currentLevelIndex]

  // Submit score to backend
  useEffect(() => {
    if (gameState === 'FINAL_RESULT') {
      fetch('/api/games/jamby-atu/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, hits, combo, accuracy: 100, results }) // 100 accuracy placeholder for now
      }).then(res => res.json()).then(data => {
        if (data.guest) {
          guestStorage.saveGameResult('jamby-atu', data.validatedScore || score, data.xpEarned || score)
        }
      }).catch(console.error)
    }
  }, [gameState, score, hits, combo, results])

  // Pointer event handlers for drawing the bow
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    if (gameState === 'AIM') {
      setGameState('DRAW')
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault()
    if (gameState === 'DRAW') {
      // Fire custom event for BowSystem to pick up
      const event = new CustomEvent('jamby-shoot', { detail: { power: drawStrength } })
      window.dispatchEvent(event)
    }
  }

  // Animation frame loop to update UI strength bar smoothly outside react render if needed,
  // but for MVP, zustand binding is okay since it's just a simple bar.

  return (
    <div 
      className="absolute inset-0 z-10 select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        
        <div className="bg-background/80 backdrop-blur border p-4 rounded-xl shadow-md min-w-[150px]">
          <div className="text-sm font-bold text-muted-foreground uppercase mb-1">Ұпай</div>
          <div className="text-3xl font-black text-primary">{score}</div>
          {combo > 1 && (
            <div className="text-xs font-bold text-orange-500 mt-1 animate-pulse">
              {combo}x COMBO!
            </div>
          )}
        </div>

        <div className="bg-background/80 backdrop-blur border p-4 rounded-xl shadow-md text-right">
          <div className="text-sm font-bold text-muted-foreground uppercase mb-1">Кезең</div>
          <div className="text-xl font-bold flex items-center justify-end gap-2">
            <Target className="w-5 h-5 text-red-500" />
            {currentLevelIndex + 1} / {LEVELS.length}
          </div>
        </div>
      </div>

      {/* Wind Indicator */}
      {level && level.windStrength > 0 && (
        <div className="absolute top-24 right-4 bg-background/80 backdrop-blur border p-3 rounded-xl shadow-md flex items-center gap-3 pointer-events-none">
          <Wind className="w-6 h-6 text-blue-400" />
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase">Жел</div>
            <div className="font-mono text-sm font-bold">{Math.round(level.windStrength * 100)}%</div>
          </div>
        </div>
      )}

      {/* Crosshair */}
      {(gameState === 'AIM' || gameState === 'DRAW') && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-white/50 rounded-full relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full" />
            
            {/* Draw Strength Indicator */}
            {gameState === 'DRAW' && (
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="4"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke={drawStrength > 90 ? '#ef4444' : '#3b82f6'}
                  strokeWidth="4"
                  strokeDasharray={`${(drawStrength / 100) * 138} 138`}
                  className="transition-all duration-75"
                />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Intro State */}
      {gameState === 'INTRO' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur flex items-center justify-center pointer-events-auto">
          <div className="bg-card p-8 rounded-2xl max-w-md w-full border text-center shadow-2xl">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-black mb-2 uppercase">Жамбы Ату</h1>
            <p className="text-muted-foreground mb-6">
              Мергендік пен ат құлағында ойнау өнері.
            </p>
            <ul className="text-left text-sm space-y-3 mb-8 bg-secondary/50 p-4 rounded-xl">
              <li className="flex items-center gap-2"><span>🎯</span> Нысанаға бағыттаңыз (Drag)</li>
              <li className="flex items-center gap-2"><span>🏹</span> Тетиваны тартыңыз (Hold)</li>
              <li className="flex items-center gap-2"><span>💨</span> Желдің бағытын ескеріңіз</li>
            </ul>
            <button 
              onClick={() => setGameState('RIDE')}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              Бастау <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Result State */}
      {(gameState === 'RESULT' || gameState === 'FINAL_RESULT') && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-card p-8 rounded-2xl max-w-sm w-full border text-center shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black mb-2">
              {gameState === 'FINAL_RESULT' ? 'Ойын аяқталды!' : 'Нәтиже'}
            </h2>
            
            {gameState === 'RESULT' && (
              <div className="py-6">
                <div className="text-5xl mb-4">🎯</div>
                <div className="text-xl font-bold mb-1">Тамаша!</div>
                <div className="text-primary font-mono text-2xl font-bold">+{score} ұпай</div>
              </div>
            )}

            {gameState === 'FINAL_RESULT' && (
              <div className="py-6 space-y-4 text-left bg-secondary/50 p-4 rounded-xl mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Жалпы ұпай:</span>
                  <span className="font-bold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дәл тигені:</span>
                  <span className="font-bold">{hits} / {LEVELS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Макс. комбо:</span>
                  <span className="font-bold text-orange-500">{combo}x</span>
                </div>
              </div>
            )}

            {gameState === 'RESULT' ? (
              <button 
                onClick={() => useJambyEngine.getState().nextLevel()}
                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all"
              >
                Келесі нысана
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => router.push('/games/jamby-atu')}
                  className="flex-1 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl shadow-md hover:bg-secondary/80 transition-all"
                >
                  Ойыннан шығу
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
