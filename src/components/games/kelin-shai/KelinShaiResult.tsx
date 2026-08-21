'use client'

import { useRouter } from 'next/navigation'
import { ScenarioResult } from '@/games/engine/scenario/types'
import { MaterialSurface } from '../../ui/heritage/MaterialSurface'
import { KazakhOrnament } from '../../ui/heritage/KazakhOrnament'
import { HeritageButton } from '../../ui/heritage/HeritageButton'
import { ProgressCard } from '../../heritage/ProgressCard'

interface ResultProps {
  result: ScenarioResult
  isSubmitting: boolean
  onPlayAgain: () => void
}

export default function KelinShaiResult({ result, isSubmitting, onPlayAgain }: ResultProps) {
  const router = useRouter()

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md animate-in fade-in duration-500">
      <MaterialSurface material="felt" className="p-10 rounded-3xl shadow-[0_20px_50px_rgba(212,175,55,0.15)] w-full max-w-lg border border-gold/30 relative overflow-hidden group">
        
        <div className="absolute top-0 right-0 opacity-5 text-gold pointer-events-none transform translate-x-1/4 -translate-y-1/4 group-hover:rotate-12 transition-transform duration-1000">
          <KazakhOrnament variant="qoshqar-muiiz" className="w-80 h-80" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-border/30" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${result.score * 2.827} 282.7`} strokeLinecap="round" className="text-gold transition-all duration-1000 ease-out" />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-display font-bold text-gold drop-shadow-md">{result.score}</span>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-text-muted mt-1">Ұпай</span>
              </div>
            </div>
            {result.xp > 0 && (
              <div className="bg-gold/10 border border-gold/30 text-gold font-heading font-bold text-xs uppercase tracking-widest px-6 py-2 rounded-full animate-in zoom-in slide-in-from-bottom-2 duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                +{result.xp} XP
              </div>
            )}
          </div>

          <div className="space-y-4 mb-8 bg-background/50 border border-border/20 rounded-2xl p-6 shadow-inner relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="font-heading font-bold text-text-muted uppercase tracking-widest text-[10px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/50" /> Қонақжайлық
              </span>
              <span className="font-display text-2xl font-bold text-gold">{result.metrics.hospitality}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="font-heading font-bold text-text-muted uppercase tracking-widest text-[10px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/50" /> Әдеп
              </span>
              <span className="font-display text-2xl font-bold text-gold">{result.metrics.etiquette}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-3">
              <span className="font-heading font-bold text-text-muted uppercase tracking-widest text-[10px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/50" /> Дәстүр
              </span>
              <span className="font-display text-2xl font-bold text-gold">{result.metrics.tradition}</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="font-heading font-bold text-text-muted uppercase tracking-widest text-[10px] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/50" /> Ұқыптылық
              </span>
              <span className="font-display text-2xl font-bold text-gold">{result.metrics.neatness}</span>
            </div>
          </div>
          
          <div className="bg-background/30 border border-gold/10 rounded-2xl p-5 mb-8">
            {result.score >= 90 ? (
              <p className="font-heading text-sm text-text-muted tracking-wide italic">«Тамаша! Қонақтар сіздің сыпайылығыңыз бен дәстүрді білуіңізге дән риза.»</p>
            ) : result.score >= 70 ? (
              <p className="font-heading text-sm text-text-muted tracking-wide italic">«Жақсы, бірақ кейбір қателіктер болды. Шайды үлкендерге ұсыну ретін ұмытпаңыз.»</p>
            ) : (
              <p className="font-heading text-sm text-text-muted tracking-wide italic">«Әдеп ережелерін қайта қарап шығу керек. Уайымдамаңыз, қайта көріңіз!»</p>
            )}
            {result.mistakes > 0 && (
              <p className="font-heading text-[10px] font-bold text-terracotta mt-4 uppercase tracking-widest">Жіберілген қателер: {result.mistakes}</p>
            )}
          </div>

          {result.achievements && result.achievements.length > 0 && (
            <div className="mb-10 text-center bg-gold/5 border border-gold/20 p-5 rounded-2xl">
              <div className="font-heading text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-gold rounded-full animate-pulse-glow" /> 
                Жаңа жетістіктер
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.achievements.map((id) => (
                  <span key={id} className="bg-gold/10 border border-gold/20 text-gold text-[10px] px-4 py-2 rounded-lg font-bold uppercase tracking-wider shadow-sm">
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <HeritageButton 
              className="flex-1 py-5" 
              variant="gold"
              size="lg" 
              onClick={onPlayAgain}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'САҚТАЛУДА...' : 'ҚАЙТАЛАУ'}
            </HeritageButton>
            <HeritageButton 
              className="flex-1" 
              variant="secondary" 
              onClick={() => router.push('/games')}
            >
              МӘЗІРГЕ
            </HeritageButton>
          </div>
        </div>
      </MaterialSurface>
    </div>
  )
}
