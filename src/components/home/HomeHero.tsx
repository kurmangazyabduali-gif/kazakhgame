'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HeritageButton } from '../ui/heritage/HeritageButton'
import { HomeOrnamentCanvas } from './HomeOrnamentCanvas'
import { HomeParticles } from './HomeParticles'
import { HomeScrollIndicator } from './HomeScrollIndicator'
import Link from 'next/link'

export function HomeHero() {
  return (
    <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-background">
      {/* Layer 1: Deep dark gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface via-background to-background z-0" />
      
      {/* Layer 2: Texture grain */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay z-0 pointer-events-none" style={{ backgroundImage: 'url("/textures/sand.png")' }} />

      {/* Layer 3: Particles */}
      <HomeParticles density={30} className="opacity-50" />

      {/* Layer 4: Ornament Canvas (Parallax) */}
      <HomeOrnamentCanvas />

      {/* Layer 5: Soft Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none z-10" />

      {/* Foreground Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl mt-12">
        {/* Entrance Sequence */}
        
        {/* 1. Small Gold Line Top */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
          className="w-16 h-px bg-gold/70 mb-8"
        />

        {/* 2. Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-7xl md:text-8xl lg:text-[140px] leading-none font-bold text-foreground drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-wide mb-6"
        >
          ULY <span className="text-gold">DALA</span>
        </motion.h1>

        {/* 3. Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          className="text-lg md:text-2xl text-text-muted font-heading font-medium tracking-[0.15em] uppercase max-w-2xl mx-auto mb-16 drop-shadow-md"
        >
          Ұлы даланың мұрасы<br />жаңа форматта
        </motion.p>

        {/* 4. CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: "easeOut" }}
        >
          <Link href="/games">
            <HeritageButton 
              variant="gold" 
              size="lg" 
              className="px-12 py-7 text-lg animate-pulse-glow shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:scale-105"
            >
              БАСТАУ
            </HeritageButton>
          </Link>
        </motion.div>
        
        {/* 5. Microtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-12 text-[9px] font-heading font-bold text-gold uppercase tracking-[0.4em]"
        >
          ҰЛТТЫҚ ОЙЫНДАР • ДӘСТҮР • ҰЛЫ ДАЛА
        </motion.div>
      </div>

      <HomeScrollIndicator />
    </section>
  )
}
