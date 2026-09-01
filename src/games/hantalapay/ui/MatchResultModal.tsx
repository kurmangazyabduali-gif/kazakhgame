'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MatchSummary } from '../engine/types'
import Link from 'next/link'

interface MatchResultModalProps {
  summary: MatchSummary
  onRestart: () => void
}

export const MatchResultModal: React.FC<MatchResultModalProps> = ({ summary, onRestart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md pointer-events-auto"
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#FAF7F2] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-6 shadow-2xl text-[#2A2621]"
      >
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-5 py-2 rounded-full text-xs font-black text-[#B85D36] uppercase tracking-widest">
          <span>👑</span> ХАНТАЛАПАЙ ЧЕМПИОНАТЫ АЯҚТАЛДЫ
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#2A2621] uppercase tracking-wider">
          ТАМАША НӘТИЖЕ!
        </h2>

        {/* Big Score Counter */}
        <div className="bg-gradient-to-r from-[#B85D36]/10 via-[#D4AF37]/20 to-[#B85D36]/10 p-4 rounded-2xl border border-[#D4AF37]/40 space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-[#2A2621]/60 font-bold">
            ЖАЛПЫ ЖИНАЛҒАН УПАЙ (TOTAL SCORE)
          </div>
          <div className="text-4xl sm:text-6xl font-mono font-black text-[#B85D36] drop-shadow-sm">
            {summary.totalScore.toLocaleString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 bg-white border border-[#2A2621]/15 p-4 rounded-2xl text-xs font-mono text-left shadow-sm">
          <div>
            <div className="text-gray-500">ЖАЛПЫ ЖҰЛДЫЗ:</div>
            <div className="font-bold text-[#D4AF37] text-sm">
              ★ {summary.totalStars} / 30
            </div>
          </div>

          <div>
            <div className="text-gray-500">ҚАЗАНДАҒЫ ХАНДАР:</div>
            <div className="font-bold text-[#B85D36] text-sm">
              👑 {summary.totalKhansCaptured} ХАН
            </div>
          </div>

          <div>
            <div className="text-gray-500">ЖИНАЛҒАН АСЫҚТАР:</div>
            <div className="font-bold text-[#2A2621] text-sm">{summary.totalCollected} асық</div>
          </div>

          <div>
            <div className="text-gray-500">АЛҒАН ТӘЖІРИБЕ (XP):</div>
            <div className="font-bold text-emerald-600 text-sm">+{summary.xpEarned} XP</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onRestart}
            className="flex-1 py-4 bg-gradient-to-r from-[#B85D36] to-[#944422] hover:from-[#a34f2d] hover:to-[#7c371b] text-white font-bold text-sm uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-95 border border-[#D4AF37]/40"
          >
            🔄 ҚАЙТА ОЙНАУ (REPLAY)
          </button>

          <Link
            href="/games"
            className="py-4 px-6 bg-white hover:bg-gray-100 text-[#2A2621] font-bold text-sm uppercase tracking-widest rounded-2xl border border-[#2A2621]/20 shadow transition-all flex items-center justify-center"
          >
            ОЙЫНДАРҒА ОРАЛУ ↩
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
