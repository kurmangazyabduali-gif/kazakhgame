'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface GhostHandHintProps {
  x: number
  y: number
}

export const GhostHandHint: React.FC<GhostHandHintProps> = ({ x, y }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      style={{ left: x, top: y }}
      className="absolute pointer-events-none z-20 transform -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        animate={{ y: [0, -12, 0], scale: [1, 0.9, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-1"
      >
        <div className="text-3xl filter drop-shadow-[0_4px_8px_rgba(212,175,55,0.8)]">
          👆
        </div>
        <div className="bg-[#D4AF37] text-[#2A2621] text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-lg border border-white">
          МҰНДА БАС! (TAP)
        </div>
      </motion.div>
    </motion.div>
  )
}
