'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Target, Zap, ChevronRight } from 'lucide-react'

interface LevelTransitionProps {
  level: number
  score: number
  accuracy: number
  combo: number
  onNextLevel: () => void
}

export default function LevelTransition({ level, score, accuracy, combo, onNextLevel }: LevelTransitionProps) {
  return (
    <div className="absolute inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-surface text-foreground p-10 rounded-3xl shadow-2xl max-w-sm w-full border border-gold/20 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/textures/sand.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="mx-auto w-20 h-20 bg-background border border-gold/30 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10">
          <CheckCircle2 className="w-10 h-10 text-gold" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 text-gold font-display uppercase tracking-widest">{level}-ШІ ДЕҢГЕЙ АЯҚТАЛДЫ</h2>
          <p className="text-text-muted mb-8 text-xs font-heading tracking-widest uppercase">
            Барлық асықтар қағылды!
          </p>
          
          <div className="space-y-3 mb-10">
            <div className="flex justify-between items-center bg-background/80 border border-border/10 p-4 rounded-xl shadow-inner">
              <div className="flex items-center gap-3 text-text-muted text-xs font-heading font-bold uppercase tracking-widest">
                <Target className="w-4 h-4 text-gold" /> Ұпай (Score)
              </div>
              <div className="font-display font-bold text-xl text-foreground">{score}</div>
            </div>
            
            <div className="flex justify-between items-center bg-background/80 border border-border/10 p-4 rounded-xl shadow-inner">
              <div className="flex items-center gap-3 text-text-muted text-xs font-heading font-bold uppercase tracking-widest">
                <Target className="w-4 h-4 text-primary" /> Дәлдік (Accuracy)
              </div>
              <div className="font-display font-bold text-xl text-foreground">{accuracy}%</div>
            </div>
            
            <div className="flex justify-between items-center bg-background/80 border border-border/10 p-4 rounded-xl shadow-inner">
              <div className="flex items-center gap-3 text-text-muted text-xs font-heading font-bold uppercase tracking-widest">
                <Zap className="w-4 h-4 text-terracotta" /> Үздік комбо
              </div>
              <div className="font-display font-bold text-xl text-foreground">x{combo}</div>
            </div>
          </div>

          <button 
            onClick={onNextLevel}
            className="w-full py-4 bg-gold text-primary font-bold font-heading uppercase tracking-widest rounded-xl hover:bg-gold/90 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
          >
            КЕЛЕСІ ДЕҢГЕЙ <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
