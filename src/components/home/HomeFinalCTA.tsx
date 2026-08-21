'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { HeritageButton } from '../ui/heritage/HeritageButton'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'

export function HomeFinalCTA() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-background">
      {/* Background layer */}
      <div className="absolute inset-0 bg-[url('/images/games/kusbegilik.jpg')] bg-cover bg-center bg-fixed opacity-[0.15] mix-blend-luminosity grayscale" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      {/* Rotating central giant ornament */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-10 pointer-events-none">
        <KazakhOrnament variant="qoshqar-muiiz" animate="spin" className="w-full h-full text-gold" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <KazakhOrnament variant="geometric" className="w-16 h-16 text-gold opacity-80 mb-8" />
          
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-foreground drop-shadow-xl uppercase tracking-wide">
            Ұлы Дала <span className="text-gold">Жалғасады</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-text-muted font-heading font-light tracking-[0.2em] uppercase mb-16 opacity-80">
            Келесі ұрпаққа
          </p>

          <Link href="/games">
            <HeritageButton 
              variant="gold" 
              size="lg" 
              className="px-16 py-8 text-xl group relative overflow-hidden animate-pulse-glow"
            >
              <span className="relative z-10 flex items-center gap-4">
                ULY DALA-ҒА КІРУ
                <KazakhOrnament variant="su" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-4 group-hover:translate-x-0" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
            </HeritageButton>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
