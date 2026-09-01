'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HantalapayHUDProps {
  roundNumber: number
  totalRounds: number
  roundTitle: string
  timeLeftSec: number
  totalTimeSec: number
  score: number
  comboStreak: number
  collectedCount: number
  totalAsyks: number
  khanCaptured: boolean
}

export const HantalapayHUD: React.FC<HantalapayHUDProps> = ({
  roundNumber,
  totalRounds,
  roundTitle,
  timeLeftSec,
  totalTimeSec,
  score,
  comboStreak,
  collectedCount,
  totalAsyks,
  khanCaptured,
}) => {
  const timePct = Math.max(0, Math.min(100, (timeLeftSec / totalTimeSec) * 100))

  return (
    <div className="absolute top-0 inset-x-0 z-20 p-4 sm:p-6 pointer-events-none select-none flex flex-col gap-3">
      
      {/* Top Main Bar */}
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Game Title & Round */}
        <div className="bg-[#FAF7F2]/95 backdrop-blur-md border border-[#2A2621]/15 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#B85D36] text-white font-bold flex items-center justify-center text-sm shadow">
            {roundNumber}
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#B85D36] font-bold">
              РАУНД {roundNumber} / {totalRounds}
            </div>
            <div className="text-sm font-serif font-bold text-[#2A2621]">
              {roundTitle}
            </div>
          </div>
        </div>

        {/* Center: Score & Combo Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-[#FAF7F2]/95 backdrop-blur-md border border-[#D4AF37]/50 px-5 py-2 rounded-2xl shadow-lg text-center">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#2A2621]/60">
              УПАЙ (SCORE)
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#B85D36]">
              {score.toLocaleString()}
            </div>
          </div>

          <AnimatePresence>
            {comboStreak > 1 && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-gradient-to-r from-[#D4AF37] to-[#B85D36] text-white text-xs font-black px-3.5 py-2 rounded-2xl shadow-lg border border-white/40 flex items-center gap-1"
              >
                <span>🔥</span> {comboStreak}x COMBO!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Collected Counter & Khan Badge */}
        <div className="bg-[#FAF7F2]/95 backdrop-blur-md border border-[#2A2621]/15 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3">
          {khanCaptured && (
            <div className="bg-[#D4AF37] text-[#2A2621] text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
              👑 ХАН ИЕЛЕНДІ
            </div>
          )}
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#2A2621]/60">
              ЖИНАЛДЫ (ASYKS)
            </div>
            <div className="text-sm font-mono font-bold text-[#2A2621]">
              {collectedCount} / {totalAsyks}
            </div>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full max-w-xl mx-auto bg-black/30 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-inner">
        <div
          style={{ width: `${timePct}%` }}
          className={`h-2.5 rounded-full transition-all duration-200 ${
            timePct < 25 ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]' : timePct < 50 ? 'bg-amber-500' : 'bg-[#D4AF37]'
          }`}
        />
      </div>
    </div>
  )
}
