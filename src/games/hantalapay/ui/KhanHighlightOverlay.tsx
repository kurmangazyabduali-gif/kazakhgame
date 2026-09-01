'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { QoshqarMuiz } from '@/components/home/ornaments/QoshqarMuiz'

export const KhanHighlightOverlay: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden bg-gradient-to-t from-[#B85D36]/30 via-transparent to-[#D4AF37]/30 backdrop-blur-[2px]"
    >
      {/* Rotating Gold Ornament Background Shockwave */}
      <motion.div
        initial={{ scale: 0.2, rotate: 0, opacity: 0.9 }}
        animate={{ scale: 2.2, rotate: 180, opacity: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="absolute w-96 h-96 text-[#D4AF37]"
      >
        <QoshqarMuiz className="w-full h-full" />
      </motion.div>

      {/* Main Dramatic Gold Banner */}
      <motion.div
        initial={{ scale: 0.4, y: 30 }}
        animate={{ scale: 1.15, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative bg-gradient-to-r from-[#B85D36] via-[#D4AF37] to-[#B85D36] p-1 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.8)] border border-white/60 text-center"
      >
        <div className="bg-[#2A2621] px-8 py-5 rounded-[22px] space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
            👑 ЖЕҢІС СӘТІ! (ROYAL CAPTURE)
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-[#FAF7F2] tracking-wider drop-shadow-md">
            ХАН ТҮСТІ!
          </h1>
          <div className="text-sm font-bold text-amber-300">
            +500 ХАН БОНУСЫ ІЛІНДІ!
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
