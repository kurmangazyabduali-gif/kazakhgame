'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HantalapayGameComponent } from '@/games/hantalapay/HantalapayGameComponent'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'

export default function HantalapayGamePage() {
  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#2A2621] pb-24 font-sans select-none overflow-x-hidden">
      
      {/* Header Banner */}
      <div className="relative py-12 px-6 bg-[var(--home-sand)] border-b border-[#2A2621]/10 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          
          <div className="flex items-center justify-between w-full mb-2">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border border-[#2A2621]/20 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              <span>←</span> ОЙЫНДАР КАТАЛОГЫ
            </Link>

            <div className="inline-flex items-center gap-2 bg-[#B85D36]/10 border border-[#B85D36]/30 text-[#B85D36] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
              <span>👑</span> ҰЛТТЫҚ 2D ОЙЫН
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-serif font-black text-[#2A2621] uppercase tracking-wider"
          >
            ХАНТАЛАПАЙ
          </motion.h1>

          <p className="text-sm sm:text-base text-[#2A2621]/75 max-w-xl mx-auto font-serif">
            Асықтар шашылғанда жылдам жинап, алтын <span className="font-bold text-[#D4AF37]">ХАНДЫ</span> іліп кет! Шапшаңдық пен реакцияға құрылған 10 раундтық турнир.
          </p>
        </div>
      </div>

      {/* Main Game Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <HantalapayGameComponent />
      </div>
    </div>
  )
}
