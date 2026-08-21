'use client'

import { useRouter } from 'next/navigation'
import { Player } from '@/games/togyz-kumalak/engine/types'
import { MaterialSurface } from '../../ui/heritage/MaterialSurface'
import { KazakhOrnament } from '../../ui/heritage/KazakhOrnament'
import { HeritageButton } from '../../ui/heritage/HeritageButton'

interface ResultScreenProps {
  winner: Player | null
  isDraw: boolean
  myPlayer: Player
  playerKazan: number
  aiKazan: number
  moveCount: number
  capturedTotal: number
  tuzdykCreated: boolean
  duration: number
  xp: number
  isSubmitting: boolean
  onPlayAgain: () => void
  onShowReplay: () => void
}

export default function ResultScreen({
  winner,
  isDraw,
  myPlayer,
  playerKazan,
  aiKazan,
  moveCount,
  capturedTotal,
  tuzdykCreated,
  duration,
  xp,
  isSubmitting,
  onPlayAgain,
  onShowReplay,
}: ResultScreenProps) {
  const router = useRouter()
  const didWin = winner === myPlayer
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    return `${m}м ${s % 60}с`
  }

  const headline = isDraw ? 'ТЕҢ ОЙЫН!' : didWin ? 'ЖЕҢІС!' : 'ЖЕҢІЛІС!'
  const sub = isDraw
    ? 'Обе стороны набрали 81 камень'
    : didWin
    ? 'Ты собрал больше камней в казан!'
    : 'AI победил на этот раз. Попробуй ещё!'

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md animate-in fade-in duration-500">
      <MaterialSurface material="felt" className="w-full max-w-lg rounded-3xl p-8 border border-gold/30 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 opacity-10 text-gold pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <KazakhOrnament variant="tumar" className="w-64 h-64" />
        </div>
        <div className="absolute bottom-0 left-0 opacity-10 text-gold pointer-events-none transform -translate-x-1/4 translate-y-1/4">
          <KazakhOrnament variant="qoshqar-muiiz" className="w-64 h-64" />
        </div>

        <div className="relative z-10">
          {/* Headline */}
          <div className="text-center mb-8">
            <div className={`font-display text-5xl md:text-6xl font-black mb-2 uppercase tracking-widest ${isDraw ? 'text-text-muted' : didWin ? 'text-gold' : 'text-terracotta'}`}>
              {headline}
            </div>
            <p className="font-serif text-text-muted text-sm">{sub}</p>
          </div>

          {/* Score comparison */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-surface-elevated rounded-2xl p-4 text-center border border-gold/20 shadow-inner">
              <div className="font-display text-4xl font-bold text-gold">{playerKazan}</div>
              <div className="font-heading text-xs text-text-muted mt-2 uppercase tracking-widest font-bold">Твой қазан</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="font-display text-text-muted text-2xl font-bold">VS</div>
            </div>
            <div className="bg-surface/50 rounded-2xl p-4 text-center border border-border/50 shadow-inner">
              <div className="font-display text-4xl font-bold text-foreground">{aiKazan}</div>
              <div className="font-heading text-xs text-text-muted mt-2 uppercase tracking-widest font-bold">Қазан AI</div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="font-heading text-text-muted text-xs uppercase tracking-widest font-bold">Ходов сделано</span>
              <span className="font-display text-foreground font-bold text-lg">{moveCount}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="font-heading text-text-muted text-xs uppercase tracking-widest font-bold">Захвачено</span>
              <span className="font-display text-foreground font-bold text-lg">{capturedTotal}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="font-heading text-text-muted text-xs uppercase tracking-widest font-bold">Тұздық</span>
              <span className={`font-display font-bold text-lg ${tuzdykCreated ? 'text-gold' : 'text-foreground'}`}>
                {tuzdykCreated ? '✦ Да' : 'Нет'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="font-heading text-text-muted text-xs uppercase tracking-widest font-bold">Время</span>
              <span className="font-display text-foreground font-bold text-lg">{formatTime(duration)}</span>
            </div>
          </div>

          {/* XP */}
          <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-center mb-8 flex items-center justify-between">
            <div className="font-heading text-xs text-gold uppercase tracking-widest font-bold">Заработано опыта</div>
            <div className="font-display text-gold font-bold text-2xl">+{xp} XP</div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <HeritageButton
              variant="primary"
              size="lg"
              onClick={onPlayAgain}
              disabled={isSubmitting}
              className="w-full"
            >
              ИГРАТЬ СНОВА
            </HeritageButton>
            <div className="flex gap-3">
              <HeritageButton
                variant="cultural"
                onClick={onShowReplay}
                className="flex-1"
              >
                ПОВТОР ПАРТИИ
              </HeritageButton>
              <HeritageButton
                variant="secondary"
                onClick={() => router.push('/games')}
                className="flex-1"
              >
                БИБЛИОТЕКА ИГР
              </HeritageButton>
            </div>
          </div>
        </div>
      </MaterialSurface>
    </div>
  )
}

