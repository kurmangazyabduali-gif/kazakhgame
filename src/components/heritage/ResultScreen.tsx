import React from 'react'
import { OrnamentFrame } from '../ui/heritage/OrnamentFrame'
import { HeritageButton } from '../ui/heritage/HeritageButton'

interface ResultScreenProps {
  gameName: string
  score: number
  stats?: { label: string; value: string | number }[]
  achievement?: string
  onPlayAgain?: () => void
  onExit?: () => void
}

export function ResultScreen({ 
  gameName, 
  score, 
  stats = [], 
  achievement,
  onPlayAgain,
  onExit
}: ResultScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 animate-in fade-in duration-700">
      <OrnamentFrame variant="gold" className="w-full max-w-md bg-surface p-8 text-center shadow-2xl">
        <h3 className="font-heading text-sm font-bold text-gold uppercase tracking-widest mb-6">Отличный результат</h3>
        
        <div className="font-display text-6xl text-foreground font-bold mb-2">
          {score} <span className="text-2xl text-gold">XP</span>
        </div>
        
        <div className="text-xl font-bold uppercase tracking-wider text-text-muted mb-8">
          {gameName}
        </div>
        
        {stats.length > 0 && (
          <div className="space-y-3 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                <span className="text-text-muted">{stat.label}</span>
                <span className="font-bold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
        
        {achievement && (
          <div className="mb-10 p-4 border border-gold/30 bg-gold/5 rounded-lg animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            <div className="text-xs font-bold text-gold uppercase tracking-widest mb-1">Новое достижение</div>
            <div className="font-bold text-foreground">✦ {achievement} ✦</div>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <HeritageButton variant="primary" className="w-full" onClick={onPlayAgain}>
            ИГРАТЬ ЕЩЁ
          </HeritageButton>
          <HeritageButton variant="ghost" className="w-full" onClick={onExit}>
            Вернуться в меню
          </HeritageButton>
        </div>
      </OrnamentFrame>
    </div>
  )
}
