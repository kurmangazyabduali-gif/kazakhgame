'use client'

import React, { useState } from 'react'
import { CinematicHero } from '@/components/heritage/CinematicHero'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'
import { OrnamentDivider } from '@/components/ui/heritage/OrnamentDivider'
import { OrnamentFrame } from '@/components/ui/heritage/OrnamentFrame'
import { HeritageButton } from '@/components/ui/heritage/HeritageButton'
import { CulturalBadge } from '@/components/ui/heritage/CulturalBadge'
import { ShanyraqMark } from '@/components/ui/heritage/ShanyraqMark'
import { MaterialSurface } from '@/components/ui/heritage/MaterialSurface'
import { GameCard } from '@/components/heritage/GameCard'
import { ProgressCard } from '@/components/heritage/ProgressCard'
import { RegionMarker } from '@/components/heritage/RegionMarker'
import { ResultScreen } from '@/components/heritage/ResultScreen'

export default function DesignSystemPage() {
  const [showResult, setShowResult] = useState(false)

  return (
    <div className="min-h-screen bg-background w-full">
      {/* 1. Hero */}
      <section className="w-full">
        <CinematicHero
          title="ULY DALA"
          subtitle="Heritage design system"
          imageUrl="/images/games/kelin-shai.jpg"
        />
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        
        {/* 2. Typography & Colors */}
        <section>
          <div className="mb-12">
            <h2 className="font-display text-4xl mb-2 text-foreground">Typography & Colors</h2>
            <p className="text-text-muted">The core visual tokens of ULY DALA Heritage System.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <div className="font-display text-5xl mb-2">Display Typography</div>
                <div className="text-text-muted">Cormorant Garamond - Ұлы Дала (Kazakh Supported)</div>
              </div>
              <div>
                <div className="font-heading text-3xl font-bold uppercase tracking-wide mb-2">Heading Typography</div>
                <div className="text-text-muted">Montserrat - Тарих және Мәдениет</div>
              </div>
              <div>
                <div className="font-sans text-lg mb-2">Body Typography</div>
                <div className="text-text-muted">Geist - Modern, readable sans-serif for UI and paragraphs.</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary text-primary-foreground p-4 rounded-lg">Primary Navy</div>
              <div className="bg-surface text-foreground p-4 rounded-lg border border-border">Sand Surface</div>
              <div className="bg-gold text-primary p-4 rounded-lg">Heritage Gold</div>
              <div className="bg-terracotta text-primary-foreground p-4 rounded-lg">Terracotta Accent</div>
            </div>
          </div>
        </section>

        <OrnamentDivider />

        {/* 3. Buttons & Badges */}
        <section>
          <div className="mb-12">
            <h2 className="font-display text-4xl mb-2 text-foreground">Buttons & Badges</h2>
          </div>
          <div className="flex flex-wrap items-center gap-6 mb-12">
            <HeritageButton variant="primary">Primary Button</HeritageButton>
            <HeritageButton variant="secondary">Secondary Button</HeritageButton>
            <HeritageButton variant="gold">Gold Button</HeritageButton>
            <HeritageButton variant="cultural">Cultural Action</HeritageButton>
            <HeritageButton variant="ghost">Ghost Button</HeritageButton>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <CulturalBadge variant="gold">History</CulturalBadge>
            <CulturalBadge variant="terracotta">Medium Difficulty</CulturalBadge>
            <CulturalBadge variant="navy">Verified Source</CulturalBadge>
            <CulturalBadge variant="ghost">Optional</CulturalBadge>
          </div>
        </section>

        {/* 4. Ornaments & Frames */}
        <section>
          <div className="mb-12">
            <h2 className="font-display text-4xl mb-2 text-foreground">Ornaments & Frames</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center p-8 bg-surface rounded-xl">
              <KazakhOrnament variant="qoshqar-muiiz" className="w-16 h-16 text-gold mb-4" />
              <span className="text-sm font-bold uppercase tracking-wider text-text-muted">Qoshqar Muiiz</span>
            </div>
            <div className="flex flex-col items-center p-8 bg-surface rounded-xl">
              <KazakhOrnament variant="tumar" className="w-16 h-16 text-primary-muted mb-4" />
              <span className="text-sm font-bold uppercase tracking-wider text-text-muted">Tumar</span>
            </div>
            <div className="flex flex-col items-center p-8 bg-surface rounded-xl">
              <ShanyraqMark size="lg" />
              <span className="text-sm font-bold uppercase tracking-wider text-text-muted mt-4">Shanyraq</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <OrnamentFrame variant="gold">
              <div className="p-8 text-center">
                <h3 className="font-heading text-2xl font-bold uppercase mb-4">Ornament Frame</h3>
                <p className="text-text-muted">Used to highlight important cultural text, museum items, or final result screens.</p>
              </div>
            </OrnamentFrame>
          </div>
        </section>

        <OrnamentDivider level="subtle" />

        {/* 5. Game Cards & Progress */}
        <section>
          <div className="mb-12">
            <h2 className="font-display text-4xl mb-2 text-foreground">Cards & Materials</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <GameCard 
              title="Асық ату"
              category="Ловкость и Точность"
              description="Древняя игра кочевников, развивающая глазомер и меткость. Играется бараньими косточками."
              skills={['Точность', 'Стратегия']}
              gameSlug="asyk-atu"
              visualMotif="asyk-atu"
            />
            <GameCard 
              title="Тоғызқұмалақ"
              category="Логика и Счет"
              description="Интеллектуальная игра на доске с лунками. Развивает математическое мышление."
              skills={['Логика', 'Математика']}
              gameSlug="togyzqumalak"
              visualMotif="togyzqumalak"
            />
            <GameCard 
              title="Құсбегілік"
              category="Природа и Доверие"
              description="Искусство охоты с ловчими птицами. Ощутите связь между человеком и беркутом."
              skills={['Реакция', 'Тайминг']}
              gameSlug="kusbegilik"
              visualMotif="kusbegilik"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProgressCard title="Опыт" value="1,240 XP" label="Global Rank: 42" />
            <ProgressCard title="Сыграно Игр" value="15" label="В 3 дисциплинах" />
            
            <MaterialSurface material="nightSky" className="rounded-2xl p-6 flex flex-col items-center justify-center border border-border/20 text-center">
              <ShanyraqMark size="md" className="mb-4" />
              <div className="text-sm font-bold uppercase tracking-wider text-gold">Material Demo</div>
              <div className="text-xs text-white/70 mt-2">Night Sky Gradient with Overlay</div>
            </MaterialSurface>
          </div>
        </section>

        {/* 6. Map Markers */}
        <section>
          <div className="mb-12">
            <h2 className="font-display text-4xl mb-2 text-foreground">Interactive Elements</h2>
          </div>
          
          <div className="p-12 bg-primary rounded-3xl flex items-center justify-center gap-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/textures/sand.png')] opacity-10 mix-blend-overlay" />
            
            <RegionMarker label="Алматы" />
            <RegionMarker label="Астана" active />
            <RegionMarker label="Туркестан" />
          </div>
        </section>

        {/* 7. Result Screen Trigger */}
        <section className="text-center pb-32">
          <HeritageButton variant="primary" size="lg" onClick={() => setShowResult(true)}>
            Show Result Screen Overlay
          </HeritageButton>
        </section>
      </div>

      {showResult && (
        <ResultScreen 
          gameName="АСЫҚ АТУ"
          score={420}
          stats={[{ label: 'Точность', value: '85%' }, { label: 'Комбо', value: 'x3' }]}
          achievement="МЕТКИЙ СТРЕЛОК"
          onPlayAgain={() => setShowResult(false)}
          onExit={() => setShowResult(false)}
        />
      )}
    </div>
  )
}
