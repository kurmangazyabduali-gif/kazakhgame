'use client'

import { useRouter } from 'next/navigation'
import { GameResult } from '@/types/game'
import { MaterialSurface } from '../ui/heritage/MaterialSurface'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'
import { HeritageButton } from '../ui/heritage/HeritageButton'
import { ProgressCard } from '../heritage/ProgressCard'

interface AsykAtuResultProps {
  result: GameResult
  isSubmitting: boolean
  onPlayAgain: () => void
}

export default function AsykAtuResult({ result, isSubmitting, onPlayAgain }: AsykAtuResultProps) {
  const router = useRouter()

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <MaterialSurface material="felt" className="p-10 rounded-3xl border border-gold/30 shadow-[0_20px_50px_rgba(212,175,55,0.15)] max-w-lg w-full text-center animate-in zoom-in-95 duration-500 relative overflow-hidden group">
        
        <div className="absolute top-0 right-0 opacity-5 text-gold pointer-events-none transform translate-x-1/4 -translate-y-1/4 group-hover:rotate-12 transition-transform duration-1000">
          <KazakhOrnament variant="qoshqar-muiiz" className="w-80 h-80" />
        </div>

        <div className="relative z-10">
          <div className="mx-auto w-20 h-20 bg-background/50 text-gold rounded-full flex items-center justify-center border border-gold/40 mb-8 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
             <KazakhOrnament variant="su" className="w-10 h-10" />
          </div>
          
          <h2 className="font-display text-4xl font-bold mb-3 text-foreground uppercase tracking-widest drop-shadow-sm">ОЙЫН АЯҚТАЛДЫ</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-10" />

          <div className="grid grid-cols-2 gap-4 mb-8">
            <ProgressCard title="Ұпай" value={result.score} className="bg-background/50 border-gold/10 shadow-inner" />
            <ProgressCard title="Дәлдік" value={result.accuracy || 0} label="%" className="bg-background/50 border-gold/10 shadow-inner" />
          </div>
          
          <div className="bg-background/80 border border-gold/20 rounded-2xl p-5 flex justify-between items-center mb-8 shadow-inner">
            <span className="font-heading font-bold uppercase tracking-widest text-text-muted text-xs">Тәжірибе (XP)</span>
            <span className="font-display text-3xl font-bold text-gold drop-shadow-sm">+{result.xp} XP</span>
          </div>

          {result.achievements && result.achievements.length > 0 && (
            <div className="mb-10 text-left bg-background/30 border border-gold/10 p-5 rounded-2xl">
              <h3 className="font-heading font-bold text-[10px] uppercase tracking-[0.2em] text-gold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-gold rounded-full animate-pulse-glow" /> 
                Жаңа жетістіктер
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.achievements.map((ach) => (
                  <span key={ach} className="bg-gold/10 border border-gold/20 text-gold px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {ach.replace('asyk_', '').replace('_', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <HeritageButton variant="gold" size="lg" className="w-full text-sm py-5" onClick={onPlayAgain} disabled={isSubmitting}>
              {isSubmitting ? 'САҚТАЛУДА...' : 'ҚАЙТА ОЙНАУ'}
            </HeritageButton>
            <div className="grid grid-cols-2 gap-4">
              <HeritageButton variant="secondary" onClick={() => router.push('/games')} disabled={isSubmitting}>
                БАРЛЫҚ ОЙЫНДАР
              </HeritageButton>
              <HeritageButton variant="secondary" onClick={() => router.push('/profile')} disabled={isSubmitting}>
                ЖЕКЕ КАБИНЕТ
              </HeritageButton>
            </div>
          </div>
        </div>
      </MaterialSurface>
    </div>
  )
}
