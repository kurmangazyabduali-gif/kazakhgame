import React from 'react'
import Image from 'next/image'
import { HeritageButton } from '../ui/heritage/HeritageButton'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'

interface CinematicHeroProps {
  title: string
  subtitle: string
  imageUrl?: string
  onStart?: () => void
  onExplore?: () => void
}

export function CinematicHero({ 
  title, 
  subtitle,
  imageUrl,
  onStart,
  onExplore
}: CinematicHeroProps) {
  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background base */}
      <div className="absolute inset-0 bg-primary -z-20" />
      
      {/* Optional Photo Background with Blend */}
      {imageUrl && (
        <div className="absolute inset-0 -z-10 opacity-30 mix-blend-luminosity">
          <Image src={imageUrl} alt={title} fill className="object-cover" priority />
        </div>
      )}

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-primary/40 -z-10 pointer-events-none" />
      
      {/* Slow animated ornament background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none mix-blend-overlay">
        <KazakhOrnament 
          variant="qoshqar-muiiz" 
          level="hero" 
          animate="spin"
          className="w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px]" 
        />
      </div>

      {/* Subtle particles (using simple CSS animation) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold/40 rounded-full shadow-lg shadow-gold/50 animate-[ping_4s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-gold/30 rounded-full shadow-lg shadow-gold/50 animate-[ping_6s_ease-in-out_infinite_1s]" />
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-gold/20 rounded-full shadow-xl shadow-gold/50 animate-[ping_8s_ease-in-out_infinite_2s]" />
      </div>

      <div className="relative z-10 text-center px-4 flex flex-col items-center max-w-4xl mx-auto">
        {/* Subtle top ornament */}
        <KazakhOrnament variant="tumar" animate="float" className="w-8 h-8 text-gold mb-8 opacity-70" />
        
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-surface to-gold/70 tracking-tight mb-6 drop-shadow-2xl">
          {title}
        </h1>
        
        <p className="font-heading text-lg md:text-2xl text-sand/90 tracking-widest uppercase mb-12 max-w-2xl">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <HeritageButton variant="gold" size="lg" className="w-full sm:w-auto min-w-[240px]" onClick={onStart}>
            НАЧАТЬ ПУТЕШЕСТВИЕ
          </HeritageButton>
          <HeritageButton variant="cultural" size="lg" className="w-full sm:w-auto min-w-[240px]" onClick={onExplore}>
            ИССЛЕДОВАТЬ КУЛЬТУРУ
          </HeritageButton>
        </div>
      </div>
      
      {/* Horizon line at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  )
}
