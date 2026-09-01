'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface TutorialOverlayProps {
  onDismiss: () => void
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onDismiss }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm pointer-events-auto"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#FAF7F2] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl text-[#2A2621]"
      >
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 px-4 py-1.5 rounded-full text-xs font-bold text-[#B85D36] uppercase tracking-wider">
          <span>✨</span> ОЙЫН ЕРЕЖЕСІ (TUTORIAL)
        </div>

        <h2 className="text-3xl font-serif font-bold text-[#2A2621] uppercase tracking-wide">
          ХАНТАЛАПАЙ!
        </h2>

        <p className="text-sm text-[#2A2621]/80 leading-relaxed font-serif">
          Асықтар шашылғанда <span className="font-bold text-[#B85D36]">мүмкіндігінше жылдам</span> басып жина! Алтын алқалы <span className="font-bold text-[#D4AF37]">ХАНДЫ</span> бірінші болып іліп кетсең, рекордтық бонус аласың!
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-white border border-[#2A2621]/15 rounded-2xl text-left text-xs space-y-1 shadow-sm">
            <div className="font-bold text-[#B85D36]">⚡ ЖЫЛДАМДЫҚ</div>
            <div className="text-gray-600">Комбо бонусын өсіреді</div>
          </div>

          <div className="p-3 bg-white border border-[#D4AF37]/40 rounded-2xl text-left text-xs space-y-1 shadow-sm">
            <div className="font-bold text-[#D4AF37]">👑 ХАН АСЫҒЫ</div>
            <div className="text-gray-600">+500 ХАН Бонусы</div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="w-full py-4 bg-gradient-to-r from-[#B85D36] to-[#944422] hover:from-[#a34f2d] hover:to-[#7c371b] text-white font-bold text-sm uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-95 border border-[#D4AF37]/40"
        >
          ОЙЫНДЫ БАСТАУ! (START)
        </button>
      </motion.div>
    </motion.div>
  )
}
