'use client'

import { motion } from 'framer-motion'
import { ThrowParams } from '@/games/asyk-atu/types'

interface AsykAtuHUDProps {
  level: number
  maxLevels: number
  remainingTargets: number
  totalTargets: number
  score: number
  accuracy: number
  throws: number
  aimParams: ThrowParams | null
  onRestart: () => void
}

export default function AsykAtuHUD({ level, maxLevels, remainingTargets, totalTargets, score, accuracy, throws, aimParams, onRestart }: AsykAtuHUDProps) {
  return (
    <div className="absolute top-[64px] left-0 w-full h-[calc(100%-64px)] pointer-events-none p-4 md:p-8 flex flex-col justify-between z-20">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        {/* Left Side: Level Info */}
        <div className="bg-surface/80 backdrop-blur-md rounded-2xl p-4 border border-border/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] pointer-events-auto">
          <div className="text-xs font-heading font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-4">
            <span className="bg-gold/10 text-gold px-3 py-1 rounded-md border border-gold/20 shadow-inner">Деңгей {level} / {maxLevels}</span>
            <span>{totalTargets - remainingTargets} / {totalTargets} асық</span>
          </div>
          <button 
            onClick={onRestart}
            className="text-[10px] font-heading font-bold tracking-widest bg-terracotta/20 text-terracotta hover:bg-terracotta hover:text-white px-3 py-1.5 rounded-md transition-colors uppercase border border-terracotta/30"
          >
            Қайта бастау (Restart)
          </button>
        </div>

        {/* Right Side: Score */}
        <div className="bg-surface/80 backdrop-blur-md rounded-2xl p-4 border border-border/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-right pointer-events-auto min-w-[160px]">
          <div className="text-[10px] font-heading font-bold text-text-muted uppercase tracking-widest mb-1">Ұпай (Score)</div>
          <motion.div 
            key={score}
            initial={{ scale: 1.3, color: "#FFD700" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-4xl font-display font-bold text-gold drop-shadow-sm"
          >
            {score}
          </motion.div>
          <div className="flex gap-4 mt-3 justify-end text-[10px] font-heading font-bold tracking-widest text-text-muted uppercase border-t border-border/20 pt-2">
            <div>Дәлдік: <span className="text-foreground">{accuracy}%</span></div>
            <div>Лақтыру: <span className="text-foreground">{throws}</span></div>
          </div>
        </div>
      </div>

      {/* Bottom Bar (Aim Info) */}
      <div className="flex justify-center pb-8 md:pb-12">
        <div className={`transition-opacity duration-300 ${aimParams && aimParams.powerPercent > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transform`}>
          <div className="bg-surface/90 backdrop-blur-md rounded-2xl p-5 border border-gold/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-80 pointer-events-none relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-50" />
            <div className="text-center font-heading font-bold text-[10px] tracking-[0.2em] text-text-muted uppercase mb-4">
              Күш (Power)
            </div>
            
            <div className="w-full bg-background rounded-full h-3 overflow-hidden border border-border/30 flex items-center relative shadow-inner">
              <div 
                className="h-full rounded-full transition-all duration-75 relative z-10 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                style={{ 
                  width: `${aimParams?.powerPercent || 0}%`,
                  background: `linear-gradient(90deg, #D4AF37 0%, ${(aimParams?.powerPercent || 0) > 80 ? '#C0392B' : '#F1C40F'} 100%)`
                }}
              />
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 z-20" />
              <div className="absolute top-0 bottom-0 left-[80%] w-px bg-terracotta/30 z-20" />
            </div>
            
            <div className="text-center text-[9px] font-heading font-bold text-text-muted mt-4 uppercase tracking-[0.15em]">
              Лақтыру үшін жіберіңіз
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
