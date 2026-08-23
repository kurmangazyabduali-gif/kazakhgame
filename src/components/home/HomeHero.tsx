'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { HeritageButton } from '../ui/heritage/HeritageButton'
import { HomeScrollIndicator } from './HomeScrollIndicator'
import Link from 'next/link'

// Detailed Kazakh Ornament (Koshkar Muiiz / Horns) for side framing
function SideOrnamentSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M50,10 C50,10 70,30 70,50 C70,70 50,90 30,90 C10,90 10,70 20,60 C30,50 50,70 50,90 C50,110 30,130 10,130 M50,10 C50,10 30,30 30,50 C30,70 50,90 70,90 C90,90 90,70 80,60 C70,50 50,70 50,90 C50,110 70,130 90,130" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M50,120 L50,180" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6"/>
      <path d="M50,180 C50,180 80,195 80,215 C80,235 60,250 40,250 C20,250 15,235 25,225 C35,215 50,230 50,250 C50,270 30,290 10,290" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="50" cy="10" r="4" fill="currentColor"/>
      <circle cx="50" cy="150" r="3" fill="currentColor"/>
      <circle cx="50" cy="290" r="4" fill="currentColor"/>
    </svg>
  )
}

// Epic Shanyraq SVG with inner ornaments
function ShanyraqPortalSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="3"/>
      <circle cx="150" cy="150" r="110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
      <circle cx="150" cy="150" r="70" stroke="currentColor" strokeWidth="2"/>
      <circle cx="150" cy="150" r="30" fill="currentColor" opacity="0.15"/>
      {/* 12 major cross-beams resembling yurt roof */}
      <line x1="150" y1="10" x2="150" y2="290" stroke="currentColor" strokeWidth="2"/>
      <line x1="10" y1="150" x2="290" y2="150" stroke="currentColor" strokeWidth="2"/>
      <line x1="51" y1="51" x2="249" y2="249" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="249" y1="51" x2="51" y2="249" stroke="currentColor" strokeWidth="1.5"/>
      {/* Traditional curved yurt roof details */}
      <path d="M150,10 A140,140 0 0,1 290,150" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M290,150 A140,140 0 0,1 150,290" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M150,290 A140,140 0 0,1 10,150" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M10,150 A140,140 0 0,1 150,10" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    </svg>
  )
}

export function HomeHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()

  // Track mouse movement for 3D parallax layers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30, // Max offset X
        y: (e.clientY / window.innerHeight - 0.5) * 30, // Max offset Y
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll Transforms
  const ySky = useTransform(scrollY, [0, 800], [0, 200])
  const yBackHills = useTransform(scrollY, [0, 800], [0, 120])
  const yFrontHills = useTransform(scrollY, [0, 800], [0, 50])
  const yText = useTransform(scrollY, [0, 800], [0, -80])
  const opacityText = useTransform(scrollY, [0, 500], [1, 0])
  const scaleText = useTransform(scrollY, [0, 500], [1, 0.9])

  return (
    <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-[#FAF7F0] select-none">
      
      {/* 1. SKY & SUNPORTAL (Deep background) */}
      <motion.div 
        style={{ y: ySky, x: mousePos.x * 0.2 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        {/* Glowing Sun/Shanyraq Gate */}
        <div className="absolute right-[-10%] top-[-10%] md:right-[10%] md:top-[5%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] text-gold/10 animate-shanyrak opacity-80">
          <ShanyraqPortalSVG className="w-full h-full"/>
        </div>
        {/* Soft atmospheric golden radial gradient */}
        <div className="absolute right-[5%] top-[10%] w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      </motion.div>

      {/* 2. STARS / FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold/30 animate-dust"
            style={{
              left: `${(i * 7) % 100}%`,
              bottom: `${(i * 13) % 80}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${6 + (i % 5)}s`
            }}
          />
        ))}
      </div>

      {/* 3. SILHOUETTE HILLS / STEPPE MOUNTAINS (Back Layer) */}
      <motion.div 
        style={{ y: yBackHills, x: mousePos.x * -0.4 }}
        className="absolute bottom-0 inset-x-0 w-full h-[35vh] pointer-events-none z-10"
      >
        <svg viewBox="0 0 1440 300" className="absolute bottom-[-2px] w-full h-full text-[#EADEC9] fill-current" preserveAspectRatio="none">
          <path d="M0,220 Q360,150 720,200 T1440,160 L1440,300 L0,300 Z" />
        </svg>
      </motion.div>

      {/* 4. RUNNING HORSES SILHOUETTES (Middle dynamic layer) */}
      <motion.div
        style={{ y: yFrontHills, x: mousePos.x * 0.5 }}
        className="absolute bottom-[8vh] md:bottom-[12vh] inset-x-0 h-20 pointer-events-none z-20 overflow-hidden"
      >
        {/* Animated Horse moving across the hills */}
        <div className="absolute w-24 h-24 text-gold/30 opacity-40 animate-marquee-horse" style={{ left: '-10%' }}>
          <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <path d="M20,50 Q30,40 45,43 T75,35 Q85,45 80,55 T55,50 Q45,60 30,55 Z M50,55 L45,75 M55,55 L60,78 M35,53 L30,73 M30,53 L22,70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        </div>
      </motion.div>

      {/* 5. FOREGROUND STEPPE HILL (Front Layer) */}
      <motion.div 
        style={{ y: yFrontHills, x: mousePos.x * -0.8 }}
        className="absolute bottom-0 inset-x-0 w-full h-[22vh] pointer-events-none z-30"
      >
        <svg viewBox="0 0 1440 200" className="absolute bottom-[-2px] w-full h-full text-[#FAF7F0] fill-current drop-shadow-[0_-15px_30px_rgba(212,175,55,0.04)]" preserveAspectRatio="none">
          <path d="M0,150 Q400,100 800,140 T1440,110 L1440,200 L0,200 Z" />
        </svg>
      </motion.div>

      {/* 6. SIDE FRAMING ORNAMENTS (Elegant traditional frame) */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 flex items-center justify-center text-gold/25 z-40 hidden md:flex">
        <SideOrnamentSVG className="h-[70vh] w-auto animate-pulse-slow" />
      </div>
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 flex items-center justify-center text-gold/25 z-40 hidden md:flex scale-x-[-1]">
        <SideOrnamentSVG className="h-[70vh] w-auto animate-pulse-slow" />
      </div>

      {/* 7. FOREGROUND HERO CONTENT (Centered overlay) */}
      <motion.div 
        style={{ y: yText, opacity: opacityText, scale: scaleText }}
        className="relative z-40 flex flex-col items-center text-center px-6 w-full max-w-4xl"
      >
        {/* Ethno Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-6 bg-gold/10 border border-gold/30 rounded-full px-5 py-2 text-gold font-heading text-xs font-bold tracking-[0.25em] uppercase shadow-inner"
        >
          <span className="w-1.5 h-1.5 bg-gold rotate-45" />
          Ұлы Дала Мұрасы
          <span className="w-1.5 h-1.5 bg-gold rotate-45" />
        </motion.div>

        {/* Grand Title */}
        <h1 className="font-display text-8xl md:text-9xl lg:text-[160px] font-extrabold text-foreground tracking-wider mb-6 relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-gold drop-shadow-sm select-text">
            ULY DALA
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-2xl text-text-muted font-heading font-medium tracking-[0.15em] max-w-2xl mx-auto mb-16 uppercase"
        >
          Қазақтың ұлттық ойындар платформасы
        </motion.p>

        {/* Grand CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/games">
            <HeritageButton
              variant="gold"
              size="lg"
              className="px-16 py-8 text-xl font-bold tracking-[0.2em] animate-pulse-glow hover:scale-105 transition-transform rounded-2xl shadow-xl shadow-gold/15"
            >
              ОЙЫНДАРДЫ БАСТАУ
            </HeritageButton>
          </Link>
        </motion.div>

        {/* Micro decor line */}
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent mt-12" />
      </motion.div>

      {/* Scroll indicator */}
      <HomeScrollIndicator />
    </section>
  )
}
