'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface OrnamentDividerProps {
  className?: string
  /** 1-5: specific kazakh pattern. 'gold'|'light' also accepted. */
  variant?: 1 | 2 | 3 | 4 | 5 | 'gold' | 'light' | 'standard'
  /** Backward-compat alias — 'subtle' maps to light coloring */
  level?: string
  height?: number
}

// Five authentic Kazakh border ornament SVG tiles
const PATTERNS: Record<number, { width: number; height: number; path: React.ReactNode }> = {
  1: {
    // Scrolling vine with spiral peaks — like Row 1 of reference image
    width: 120,
    height: 40,
    path: (
      <>
        <path
          d="M0,20 C8,4 22,4 30,20 C38,36 52,36 60,20 C68,4 82,4 90,20 C98,36 112,36 120,20"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
        />
        {/* Spiral accents at wave peaks */}
        <path d="M30,14 C28,8 22,6 18,10 C14,14 16,20 22,20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M90,14 C88,8 82,6 78,10 C74,14 76,20 82,20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        {/* Dots at troughs */}
        <circle cx="0"  cy="20" r="2.5" fill="currentColor"/>
        <circle cx="60" cy="20" r="2.5" fill="currentColor"/>
        <circle cx="120" cy="20" r="2.5" fill="currentColor"/>
        {/* Small diamond accent */}
        <path d="M58,18 L60,14 L62,18 L60,22 Z" fill="currentColor"/>
      </>
    ),
  },
  2: {
    // Diamond-cross centers with connected curls — Row 2
    width: 160,
    height: 60,
    path: (
      <>
        {/* Left diamond */}
        <path d="M35,30 L45,15 L55,30 L45,45 Z" fill="currentColor"/>
        {/* Right diamond */}
        <path d="M105,30 L115,15 L125,30 L115,45 Z" fill="currentColor"/>
        {/* Left curl to edge */}
        <path d="M0,30 C10,20 25,16 35,30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M0,30 C10,40 25,44 35,30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Center connector curls */}
        <path d="M55,30 C70,15 90,15 105,30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M55,30 C70,45 90,45 105,30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Right curl to edge */}
        <path d="M125,30 C135,20 150,16 160,30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M125,30 C135,40 150,44 160,30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Center ornament dot */}
        <circle cx="80" cy="30" r="4" fill="currentColor"/>
        <circle cx="80" cy="30" r="8" fill="none" stroke="currentColor" strokeWidth="1"/>
      </>
    ),
  },
  3: {
    // Koshkar Muiiz — Rams horn, symmetric — Row 3-4
    width: 200,
    height: 50,
    path: (
      <>
        {/* Top left horn */}
        <path d="M0,25 C15,8 35,3 55,14 C68,21 72,33 65,42 C58,51 46,50 40,44"
          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        {/* Bottom left horn mirror */}
        <path d="M0,25 C15,42 35,47 55,36 C68,29 72,17 65,8 C58,-1 46,0 40,6"
          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        {/* Top right horn */}
        <path d="M200,25 C185,8 165,3 145,14 C132,21 128,33 135,42 C142,51 154,50 160,44"
          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        {/* Bottom right horn mirror */}
        <path d="M200,25 C185,42 165,47 145,36 C132,29 128,17 135,8 C142,-1 154,0 160,6"
          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        {/* Center diamond */}
        <path d="M93,18 L100,25 L107,18 L100,11 Z" fill="currentColor"/>
        <path d="M93,32 L100,25 L107,32 L100,39 Z" fill="currentColor"/>
        {/* Connector lines */}
        <path d="M40,25 C60,15 140,15 160,25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
        <path d="M40,25 C60,35 140,35 160,25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
      </>
    ),
  },
  4: {
    // Double S-curve — Row 4
    width: 140,
    height: 44,
    path: (
      <>
        {/* Upper S */}
        <path d="M0,10 C15,2 30,2 40,10 C55,22 65,22 80,10 C95,2 110,2 120,10 C130,18 135,22 140,16"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Lower S mirror */}
        <path d="M0,34 C15,42 30,42 40,34 C55,22 65,22 80,34 C95,42 110,42 120,34 C130,26 135,22 140,28"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Connection dots at intersections */}
        <circle cx="0"   cy="22" r="2" fill="currentColor"/>
        <circle cx="40"  cy="22" r="3" fill="currentColor"/>
        <circle cx="80"  cy="22" r="3" fill="currentColor"/>
        <circle cx="120" cy="22" r="3" fill="currentColor"/>
        <circle cx="140" cy="22" r="2" fill="currentColor"/>
        {/* Inner spiral at center */}
        <path d="M77,18 C74,14 70,13 68,16 C66,20 69,25 75,24 C81,23 84,18 80,14"
          fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </>
    ),
  },
  5: {
    // Large bold S-curves nested — Row 5 (most ornate)
    width: 180,
    height: 60,
    path: (
      <>
        {/* Outer band top */}
        <path d="M0,10 C20,2 40,2 60,10 C80,18 100,22 120,15 C140,8 160,4 180,10"
          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        {/* Outer band bottom */}
        <path d="M0,50 C20,58 40,58 60,50 C80,42 100,38 120,45 C140,52 160,56 180,50"
          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        {/* Inner nested curves */}
        <path d="M0,30 C30,10 60,10 90,30 C120,50 150,50 180,30"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M0,30 C30,50 60,50 90,30 C120,10 150,10 180,30"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        {/* End terminals */}
        <circle cx="0" cy="30" r="4" fill="currentColor"/>
        <circle cx="180" cy="30" r="4" fill="currentColor"/>
        <circle cx="90" cy="30" r="5" fill="currentColor"/>
        {/* Diamond at center */}
        <path d="M85,24 L90,18 L95,24 L90,30 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
      </>
    ),
  },
}

function variantToNumber(v: OrnamentDividerProps['variant'], level?: string): number {
  if (typeof v === 'number') return Math.min(5, Math.max(1, v))
  if (v === 'light' || level === 'subtle') return 1
  if (v === 'standard') return 2
  return 3 // 'gold' default
}

function isLight(v: OrnamentDividerProps['variant'], level?: string): boolean {
  return v === 'light' || level === 'subtle'
}

export function OrnamentDivider({
  className,
  variant = 3,
  level,
  height = 60,
}: OrnamentDividerProps) {
  const num = variantToNumber(variant, level)
  const pattern = PATTERNS[num]
  const patternId = React.useId().replace(/:/g, '_')
  const colorClass = isLight(variant, level) ? 'text-gold/25' : 'text-gold/70'

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.6 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'w-full overflow-hidden pointer-events-none animate-ornament-sway',
        colorClass,
        className,
      )}
      style={{ height }}
    >
      <svg width="100%" height={height} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern
            id={patternId}
            x="0" y="0"
            width={pattern.width}
            height={pattern.height}
            patternUnits="userSpaceOnUse"
          >
            {pattern.path}
          </pattern>
        </defs>
        {/* Center the pattern vertically */}
        <rect
          x="0"
          y={(height - pattern.height) / 2}
          width="100%"
          height={pattern.height}
          fill={`url(#${patternId})`}
        />
      </svg>
    </motion.div>
  )
}


