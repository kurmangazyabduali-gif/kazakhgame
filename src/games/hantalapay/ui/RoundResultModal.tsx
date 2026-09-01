'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { RoundResultData } from '../engine/types'

interface RoundResultModalProps {
  data: RoundResultData
  isLastRound: boolean
  onNextRound: () => void
}

export const RoundResultModal: React.FC<RoundResultModalProps> = ({
  data,
  isLastRound,
  onNextRound,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md pointer-events-auto"
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#FAF7F2] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl text-[#2A2621]"
      >
        <div className="inline-flex items-center gap-2 bg-[#B85D36]/15 border border-[#B85D36]/40 px-4 py-1.5 rounded-full text-xs font-bold text-[#B85D36] uppercase tracking-wider">
          <span>🏆</span> РАУНД {data.roundNumber} АЯҚТАЛДЫ
        </div>

        {/* Stars Animated Display */}
        <div className="flex justify-center items-center gap-3">
          {[1, 2, 3].map((starIndex) => (
            <motion.span
              key={starIndex}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: starIndex <= data.stars ? 1.2 : 0.8, rotate: 0 }}
              transition={{ delay: starIndex * 0.15 }}
              className={`text-4xl sm:text-5xl ${
                starIndex <= data.stars ? 'text-[#D4AF37] filter drop-shadow-[0_4px_10px_rgba(212,175,55,0.8)]' : 'text-gray-300'
              }`}
            >
              ★
            </motion.span>
          ))}
        </div>

        {/* Score Summary */}
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-[#2A2621]/60">
            РАУНД УПАЙЫ (SCORE)
          </div>
          <div className="text-4xl font-serif font-bold text-[#B85D36]">
            +{data.score.toLocaleString()}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 bg-white border border-[#2A2621]/15 p-4 rounded-2xl text-xs font-mono text-left shadow-sm">
          <div>
            <div className="text-gray-500">ЖИНАЛДЫ (ASYKS):</div>
            <div className="font-bold text-[#2A2621] text-sm">
              {data.collectedAsyks} / {data.totalAsyks}
            </div>
          </div>

          <div>
            <div className="text-gray-500">ХАН СТАТУСЫ:</div>
            <div className={`font-bold text-sm ${data.khanCaptured ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
              {data.khanCaptured ? '👑 ІЛІНДІ (+500)' : '❌ ҰСТАЛМАДЫ'}
            </div>
          </div>

          <div>
            <div className="text-gray-500">УАҚЫТ (TIME):</div>
            <div className="font-bold text-[#2A2621] text-sm">{data.timeSpentSec} сек</div>
          </div>

          <div>
            <div className="text-gray-500">ДӘЛДІК (ACCURACY):</div>
            <div className="font-bold text-[#2A2621] text-sm">{data.accuracyPct}%</div>
          </div>
        </div>

        <button
          onClick={onNextRound}
          className="w-full py-4 bg-gradient-to-r from-[#B85D36] to-[#944422] hover:from-[#a34f2d] hover:to-[#7c371b] text-white font-bold text-sm uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-95 border border-[#D4AF37]/40"
        >
          {isLastRound ? 'ФИНАЛДЫҚ НӘТИЖЕ (RESULTS) →' : 'КЕЛЕСІ РАУНД (NEXT ROUND) →'}
        </button>
      </motion.div>
    </motion.div>
  )
}
