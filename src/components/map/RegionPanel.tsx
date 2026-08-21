'use client'

import { Region } from '@/lib/data/regions'
import { GAMES_METADATA } from '@/lib/data/games'
import { GameCard } from '@/components/heritage/GameCard'
import { Info } from 'lucide-react'
import { MaterialSurface } from '@/components/ui/heritage/MaterialSurface'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'
import { CulturalBadge } from '@/components/ui/heritage/CulturalBadge'

interface RegionPanelProps {
  region: Region | null
}

export function RegionPanel({ region }: RegionPanelProps) {
  if (!region) {
    return (
      <MaterialSurface material="felt" className="w-full h-full min-h-[600px] flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-gold/20 animate-in fade-in">
        <KazakhOrnament variant="tumar" className="w-24 h-24 text-gold opacity-30 mb-6" />
        <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-gold mb-4">Выберите регион</h3>
        <p className="text-text-muted text-sm max-w-xs font-serif leading-relaxed">
          Нажмите на карту, чтобы исследовать культурное наследие и национальные игры региона.
        </p>
      </MaterialSurface>
    )
  }

  // Get games for this region
  const games = region.games.map(slug => GAMES_METADATA[slug]).filter(Boolean)

  return (
    <div className="w-full h-full flex flex-col bg-surface rounded-3xl border border-border/40 shadow-xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
      {/* Header */}
      <MaterialSurface material="felt" className="p-8 border-b border-gold/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 text-gold transform translate-x-1/4 -translate-y-1/4">
           <KazakhOrnament variant="qoshqar-muiiz" className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <CulturalBadge variant="gold" className="mb-4">
            Культурный регион
          </CulturalBadge>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight text-foreground mb-2">{region.name}</h2>
          <div className="text-sm font-bold text-gold uppercase tracking-widest mb-6 font-heading">
            {region.nameEn} • {region.nameKk}
          </div>
          <p className="text-text-muted font-serif leading-relaxed text-lg">
            {region.description}
          </p>
        </div>
      </MaterialSurface>

      {/* Content */}
      <div className="p-8 flex-1 overflow-y-auto space-y-12 bg-background">
        
        {/* Traditions */}
        {region.traditions.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold mb-6 flex items-center gap-2 font-heading">
              <Info className="w-4 h-4" /> Традиции
            </h3>
            <div className="flex flex-wrap gap-2">
              {region.traditions.map((t, i) => (
                <CulturalBadge key={i} variant="navy">
                  {t}
                </CulturalBadge>
              ))}
            </div>
          </div>
        )}

        {/* Games */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gold mb-6 font-heading">
            Национальные игры региона
          </h3>
          
          {games.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {games.map(game => (
                <div key={game.slug} className="transform scale-95 origin-top">
                  <GameCard 
                    href={`/games/info/${game.slug}`}
                    gameSlug={game.slug}
                    title={game.title}
                    category={game.category}
                    description={game.description}
                    skills={game.skills || []}
                    status="available"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-surface-elevated rounded-2xl border border-border/50 text-center">
              <KazakhOrnament variant="su" className="w-12 h-12 mx-auto text-gold opacity-20 mb-4" />
              <p className="text-sm text-text-muted font-serif">
                Культурные материалы (игры) для этого региона будут добавлены позже.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Footer Meta */}
      {region.sourceIds.length > 0 && (
        <div className="p-4 border-t border-border/40 bg-surface-elevated text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
          {region.verified ? (
            <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_rgba(var(--color-gold),0.8)]" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-terracotta" />
          )}
          Источники: {region.sourceIds.length}
        </div>
      )}
    </div>
  )
}
