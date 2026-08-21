'use client'

import { useGuestProgress } from '@/lib/useGuestProgress'
import { LevelService } from '@/lib/services/LevelService'
import { UserCircle2 } from 'lucide-react'
import { MaterialSurface } from '../ui/heritage/MaterialSurface'
import { OrnamentFrame } from '../ui/heritage/OrnamentFrame'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'
import { CulturalBadge } from '../ui/heritage/CulturalBadge'

export function GuestProfile() {
  const progress = useGuestProgress()

  if (!progress) return null

  const currentLevel = LevelService.calculateLevel(progress.xp)
  const xpForNextLevel = LevelService.getXpForNextLevel(currentLevel)
  const prevLevelXp = LevelService.getXpForNextLevel(currentLevel - 1)
  const xpProgress = Math.max(0, Math.min(100, (((progress.xp || 0) - prevLevelXp) / (xpForNextLevel - prevLevelXp)) * 100))

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-80px)] bg-background relative overflow-hidden">
      
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
        <KazakhOrnament variant="su" className="w-[600px] h-[600px] text-gold" />
      </div>

      <div className="w-full max-w-5xl mx-auto p-6 md:p-12 relative z-10 flex-1 flex flex-col justify-center">
        
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-display text-5xl md:text-6xl font-bold uppercase tracking-tight text-foreground">
            Жеке Профиль
          </h1>
          <p className="font-heading text-text-muted tracking-widest uppercase text-sm md:text-base mt-2">
            ВАШ ПУТЬ В МИРЕ КОЧЕВНИКОВ
          </p>
        </div>
        
        {/* 1. Identity Card */}
        <MaterialSurface material="felt" className="rounded-3xl border border-gold/20 p-8 flex flex-col md:flex-row gap-8 items-center shadow-xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <KazakhOrnament variant="qoshqar-muiiz" className="w-48 h-48 text-gold transform rotate-180" />
          </div>
          
          <div className="w-32 h-32 rounded-full bg-gold/10 flex items-center justify-center text-gold relative border-4 border-gold/30 shadow-md z-10 shrink-0">
            <UserCircle2 className="w-16 h-16" />
          </div>
          
          <div className="flex-1 text-center md:text-left z-10 space-y-6 w-full">
            <div>
              <h2 className="font-display text-4xl font-bold text-foreground">Гость / Қонақ</h2>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                 <CulturalBadge variant="gold">{LevelService.getLevelTitle(currentLevel)}</CulturalBadge>
              </div>
            </div>
            
            <div className="bg-background/50 rounded-xl p-6 w-full border border-border/50">
              <div className="flex justify-between items-center text-sm mb-3 font-heading font-bold uppercase tracking-wider">
                <span className="text-gold">Деңгей {currentLevel}</span>
                <span className="text-text-muted">{progress.xp || 0} / {xpForNextLevel} XP</span>
              </div>
              <div className="w-full bg-surface-elevated rounded-full h-3 border border-border">
                <div 
                  className="bg-gold h-3 rounded-full relative overflow-hidden" 
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>
        </MaterialSurface>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <OrnamentFrame variant="subtle" className="bg-surface text-center p-8">
            <div className="font-display text-5xl font-bold text-gold mb-2">{progress.gamesPlayed || 0}</div>
            <div className="text-xs text-text-muted uppercase font-bold tracking-widest font-heading">Ойналған ойындар</div>
          </OrnamentFrame>
          <OrnamentFrame variant="subtle" className="bg-surface text-center p-8">
            <div className="font-display text-5xl font-bold text-gold mb-2">{progress.achievements.length || 0}</div>
            <div className="text-xs text-text-muted uppercase font-bold tracking-widest font-heading">Жетістіктер</div>
          </OrnamentFrame>
          <OrnamentFrame variant="subtle" className="bg-surface text-center p-8">
            <div className="font-display text-5xl font-bold text-gold mb-2">{progress.xp || 0}</div>
            <div className="text-xs text-text-muted uppercase font-bold tracking-widest font-heading">Барлық XP</div>
          </OrnamentFrame>
        </div>

        {/* 3. Local Progress */}
        <div>
          <h2 className="font-heading text-xl font-bold mb-6 uppercase tracking-widest text-gold text-center md:text-left">
            Прогресс платформы
          </h2>
          <MaterialSurface material="none" className="bg-surface-elevated rounded-3xl p-8 border border-border/50">
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="text-sm font-bold text-text-muted uppercase tracking-widest mb-2 font-heading">Игры сыграно</div>
                <div className="font-display text-4xl font-black text-foreground">
                  {Math.min(progress.gamesPlayed || 0, 5)} <span className="text-2xl text-text-muted font-medium">/ 5</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-4 rounded-full border ${i < (progress.gamesPlayed || 0) ? 'bg-gold border-gold' : 'bg-surface border-border/50'}`} 
                />
              ))}
            </div>
          </MaterialSurface>
        </div>
      </div>
    </div>
  )
}
