'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HeritageButton } from '../ui/heritage/HeritageButton'
import { HomeScrollIndicator } from './HomeScrollIndicator'
import Link from 'next/link'

// Inline Shanyrak SVG component (yurt roof wheel)
function ShanyraqSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="100" cy="100" r="68" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="100" cy="100" r="38" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="100" cy="100" r="10" fill="currentColor" opacity="0.6"/>
      {/* 12 spokes */}
      <line x1="100" y1="5" x2="100" y2="195" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="5" y1="100" x2="195" y2="100" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="33" y1="33" x2="167" y2="167" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="167" y1="33" x2="33" y2="167" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="65" y1="8" x2="135" y2="192" stroke="currentColor" strokeWidth="1"/>
      <line x1="135" y1="8" x2="65" y2="192" stroke="currentColor" strokeWidth="1"/>
      <line x1="8" y1="65" x2="192" y2="135" stroke="currentColor" strokeWidth="1"/>
      <line x1="8" y1="135" x2="192" y2="65" stroke="currentColor" strokeWidth="1"/>
      {/* Decorative arcs between spokes */}
      <path d="M100,5 A95,95 0 0,1 195,100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
      <path d="M195,100 A95,95 0 0,1 100,195" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
    </svg>
  )
}

// Inline ornament band SVG (vine scroll pattern)
function OrnamentBand({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div className={`w-full overflow-hidden ${className ?? ''}`} style={{ height: 44 }}>
      <svg width="100%" height="44" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
        style={{ transform: flip ? 'scaleY(-1)' : undefined }}>
        <defs>
          <pattern id={flip ? 'hvb' : 'hva'} x="0" y="0" width="120" height="44" patternUnits="userSpaceOnUse">
            <path d="M0,22 C8,6 22,6 30,22 C38,38 52,38 60,22 C68,6 82,6 90,22 C98,38 112,38 120,22"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M30,16 C28,9 22,7 18,11 C14,15 16,21 23,21" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M90,16 C88,9 82,7 78,11 C74,15 76,21 83,21" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="0" cy="22" r="2.5" fill="currentColor"/>
            <circle cx="60" cy="22" r="2.5" fill="currentColor"/>
            <circle cx="120" cy="22" r="2.5" fill="currentColor"/>
            <path d="M58,20 L60,16 L62,20 L60,24 Z" fill="currentColor"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="44" fill={`url(#${flip ? 'hvb' : 'hva'})`}/>
      </svg>
    </div>
  )
}

// Corner ornament piece
function CornerPiece({ className, rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
      className={className} style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      {/* L-shaped frame */}
      <path d="M5,95 L5,5 L95,5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Inner parallel */}
      <path d="M14,87 L14,14 L87,14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Corner diamond */}
      <path d="M5,5 L12,5 L5,12 Z" fill="currentColor"/>
      {/* Scroll on vertical arm */}
      <path d="M5,45 C2,40 2,33 6,30 C10,27 14,31 12,36" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      {/* Scroll on horizontal arm */}
      <path d="M45,5 C40,2 33,2 30,6 C27,10 31,14 36,12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      {/* Small diamond accents */}
      <path d="M14,45 L17,48 L14,51 L11,48 Z" fill="currentColor"/>
      <path d="M45,14 L48,17 L51,14 L48,11 Z" fill="currentColor"/>
    </svg>
  )
}

const DUST = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${8 + (i * 6.5) % 86}%`,
  bottom: `${10 + (i * 11) % 50}%`,
  size: 2 + (i % 3),
  delay: i * 0.5,
  duration: 5 + (i % 4),
}))

const TITLE = ['U', 'L', 'Y', ' ', 'D', 'A', 'L', 'A']

export function HomeHero() {
  return (
    <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-[#FAF7F0]">

      {/* === Background: two rotating shanyraks === */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer large — slow clockwise */}
        <div className="w-[900px] h-[900px] text-gold animate-shanyrak" style={{ opacity: 0.07 }}>
          <ShanyraqSVG className="w-full h-full"/>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Inner medium — faster counter-clockwise */}
        <div className="w-[520px] h-[520px] text-gold animate-shanyrak-reverse" style={{ opacity: 0.12 }}>
          <ShanyraqSVG className="w-full h-full"/>
        </div>
      </div>

      {/* === Ornament top band === */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute top-0 inset-x-0 text-gold/40 animate-ornament-sway"
      >
        <OrnamentBand/>
      </motion.div>

      {/* === Ornament bottom band === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute bottom-0 inset-x-0 text-gold/40 animate-ornament-sway"
      >
        <OrnamentBand flip/>
      </motion.div>

      {/* === 4 Animated Corners === */}
      {[
        { cls: 'top-0 left-0 animate-corner-bloom text-gold/50', rot: 0,   delay: '0.6s' },
        { cls: 'top-0 right-0 animate-corner-bloom text-gold/50', rot: 90,  delay: '0.7s' },
        { cls: 'bottom-0 right-0 animate-corner-bloom text-gold/50', rot: 180, delay: '0.8s' },
        { cls: 'bottom-0 left-0 animate-corner-bloom text-gold/50', rot: 270, delay: '0.9s' },
      ].map(({ cls, rot, delay }) => (
        <div key={rot} className={`absolute pointer-events-none w-24 h-24 ${cls}`} style={{ animationDelay: delay, opacity: 0 }}>
          <CornerPiece rotate={rot} className="w-full h-full"/>
        </div>
      ))}

      {/* === Floating dust particles === */}
      {DUST.map(({ id, left, bottom, size, delay, duration }) => (
        <div
          key={id}
          className="absolute rounded-full bg-gold animate-dust pointer-events-none"
          style={{
            left,
            bottom,
            width: size,
            height: size,
            opacity: 0,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      ))}

      {/* === Foreground content === */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl">

        {/* Gold line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: 'circOut' }}
          className="w-20 h-px bg-gold/60 mb-10"
        />

        {/* Main title — letter-by-letter */}
        <h1 className="font-display text-7xl md:text-8xl lg:text-[148px] leading-none font-bold text-foreground tracking-wide mb-6 flex flex-wrap justify-center">
          {TITLE.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: 0.8 + i * 0.07, ease: [0.2, 0.65, 0.3, 0.9] }}
              className={char === ' ' ? 'w-6 md:w-10 lg:w-14' : (char === 'D' || char === 'A' && i > 3 ? 'text-gold' : '')}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6, ease: 'easeOut' }}
          className="text-base md:text-xl text-text-muted font-heading font-semibold tracking-[0.25em] uppercase max-w-xl mx-auto mb-14"
        >
          ҰЛТТЫҚ ОЙЫНДАР ПЛАТФОРМАСЫ
        </motion.p>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2.0, ease: 'easeOut' }}
        >
          <Link href="/games">
            <HeritageButton
              variant="gold"
              size="lg"
              className="px-14 py-7 text-lg animate-pulse-glow hover:scale-105 transition-transform"
            >
              БАСТАУ
            </HeritageButton>
          </Link>
        </motion.div>

        {/* Microtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          transition={{ duration: 1.2, delay: 2.6 }}
          className="mt-12 text-[9px] font-heading font-bold text-gold uppercase tracking-[0.45em]"
        >
          ҰЛТТЫҚ ОЙЫНДАР • ДӘСТҮР • ҰЛЫ ДАЛА
        </motion.div>
      </div>

      <HomeScrollIndicator />
    </section>
  )
}





