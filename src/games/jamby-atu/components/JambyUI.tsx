'use client'

import { useJambyEngine, LEVELS } from '../engine'
import { Target, Wind, Trophy, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { guestStorage } from '@/lib/guestStorage'
import { motion, AnimatePresence } from 'framer-motion'

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
        body: JSON.stringify({ score, hits, combo, accuracy: 100, results })
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
      const event = new CustomEvent('jamby-shoot', { detail: { power: drawStrength } })
      window.dispatchEvent(event)
    }
  }

  return (
    <div 
      className="absolute inset-0 z-10 select-none touch-none font-sans"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Top Main HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-20">
        
        {/* Left: Score Card */}
        <div className="bg-[#FAF7F2]/90 backdrop-blur-md border-2 border-[#D4AF37]/50 p-4 rounded-2xl shadow-xl min-w-[160px] text-[#2A2621]">
          <div className="text-[10px] font-mono font-bold text-[#B85D36] uppercase tracking-widest mb-0.5">
            УПАЙ (SCORE)
          </div>
          <div className="text-3xl font-serif font-black text-[#2A2621]">{score}</div>
          {combo > 1 && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1.1 }}
              className="text-xs font-black text-[#B85D36] mt-1 flex items-center gap-1"
            >
              <span>🔥</span> {combo}x COMBO!
            </motion.div>
          )}
        </div>

        {/* Right: Round Counter */}
        <div className="bg-[#FAF7F2]/90 backdrop-blur-md border-2 border-[#D4AF37]/50 p-4 rounded-2xl shadow-xl text-right text-[#2A2621]">
          <div className="text-[10px] font-mono font-bold text-[#B85D36] uppercase tracking-widest mb-0.5">
            НЫСАНА (LEVEL)
          </div>
          <div className="text-lg font-serif font-bold flex items-center justify-end gap-2 text-[#2A2621]">
            <Target className="w-5 h-5 text-[#B85D36]" />
            {currentLevelIndex + 1} / {LEVELS.length}
          </div>
        </div>
      </div>

      {/* Wind Indicator */}
      {level && level.windStrength > 0 && (
        <div className="absolute top-24 right-4 bg-[#FAF7F2]/90 backdrop-blur-md border border-[#D4AF37]/40 p-3 rounded-2xl shadow-lg flex items-center gap-3 pointer-events-none text-[#2A2621]">
          <Wind className="w-5 h-5 text-[#D4AF37] animate-pulse" />
          <div>
            <div className="text-[10px] font-mono font-bold text-[#B85D36] uppercase tracking-wider">ЖЕЛ БАҒЫТЫ</div>
            <div className="font-mono text-sm font-bold">{Math.round(level.windStrength * 100)}%</div>
          </div>
        </div>
      )}

      {/* Golden Kazakh Archery Crosshair */}
      {(gameState === 'AIM' || gameState === 'DRAW') && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-[#D4AF37] rounded-full relative shadow-[0_0_20px_rgba(212,175,55,0.6)] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#B85D36] rounded-full shadow" />
            
            {/* Draw Strength Arc Indicator */}
            {gameState === 'DRAW' && (
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.2)"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={drawStrength > 90 ? '#EF4444' : '#D4AF37'}
                  strokeWidth="4"
                  strokeDasharray={`${(drawStrength / 100) * 175} 175`}
                  className="transition-all duration-75"
                />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Intro Modal */}
      {gameState === 'INTRO' && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto">
          <motion.div 
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#FAF7F2] p-8 rounded-3xl max-w-md w-full border-2 border-[#D4AF37] text-center shadow-2xl text-[#2A2621] space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-[#B85D36]/15 border border-[#B85D36]/30 flex items-center justify-center mx-auto text-3xl">
              🏹
            </div>
            <div>
              <h1 className="text-3xl font-serif font-black uppercase tracking-wider mb-2 text-[#2A2621]">ЖАМБЫ АТУ</h1>
              <p className="text-xs text-[#2A2621]/80 font-serif leading-relaxed">
                Шауып бара жатқан ат үстінде күміс мен алтын жамбыны мергендікпен атып түсір!
              </p>
            </div>

            <div className="text-left text-xs space-y-3 bg-white p-4 rounded-2xl border border-[#2A2621]/15 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-lg">🎯</span>
                <div><span className="font-bold text-[#B85D36]">Нысаналаңыз:</span> Экранды басып көздеңіз</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🏹</span>
                <div><span className="font-bold text-[#D4AF37]">Тетиваны тартыңыз:</span> Шертіп ұстап тұрыңыз</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">💨</span>
                <div><span className="font-bold text-[#2A2621]">Желді ескеріңіз:</span> Көздеуді желге бұрыңыз</div>
              </div>
            </div>

            <button 
              onClick={() => setGameState('RIDE')}
              className="w-full py-4 bg-gradient-to-r from-[#B85D36] to-[#944422] hover:from-[#a34f2d] hover:to-[#7c371b] text-white font-bold text-sm uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-95 border border-[#D4AF37]/40 flex items-center justify-center gap-2"
            >
              ОЙЫНДЫ БАСТАУ <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}

      {/* Result / Final Result Modal */}
      {(gameState === 'RESULT' || gameState === 'FINAL_RESULT') && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto">
          <motion.div 
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#FAF7F2] p-8 rounded-3xl max-w-sm w-full border-2 border-[#D4AF37] text-center shadow-2xl text-[#2A2621] space-y-6"
          >
            <h2 className="text-3xl font-serif font-black uppercase tracking-wider">
              {gameState === 'FINAL_RESULT' ? 'ОЙЫН АЯҚТАЛДЫ!' : 'МЕРГЕНДІК НӘТИЖЕСІ'}
            </h2>
            
            {gameState === 'RESULT' && (
              <div className="py-4 space-y-2">
                <div className="text-5xl">🎯</div>
                <div className="text-lg font-serif font-bold text-[#2A2621]">ТАМАША ТИЮ!</div>
                <div className="text-[#B85D36] font-mono text-3xl font-black">+{score} ұпай</div>
              </div>
            )}

            {gameState === 'FINAL_RESULT' && (
              <div className="py-4 space-y-3 text-left bg-white p-5 rounded-2xl border border-[#2A2621]/15 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">ЖАЛПЫ УПАЙ:</span>
                  <span className="font-bold text-base text-[#B85D36]">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">ДӘЛ ТИГЕНІ:</span>
                  <span className="font-bold text-sm text-[#2A2621]">{hits} / {LEVELS.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">МАКС. КОМБО:</span>
                  <span className="font-bold text-sm text-[#D4AF37]">{combo}x</span>
                </div>
              </div>
            )}

            {gameState === 'RESULT' ? (
              <button 
                onClick={() => useJambyEngine.getState().nextLevel()}
                className="w-full py-4 bg-gradient-to-r from-[#B85D36] to-[#944422] hover:from-[#a34f2d] hover:to-[#7c371b] text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-95 border border-[#D4AF37]/40"
              >
                КЕЛЕСІ НЫСАНА →
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={() => router.push('/games/jamby-atu')}
                  className="flex-1 py-4 bg-white text-[#2A2621] font-bold text-xs uppercase tracking-widest rounded-2xl border border-[#2A2621]/20 shadow hover:bg-gray-100 transition-all"
                >
                  ОЙЫННАН ШЫҒУ
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
