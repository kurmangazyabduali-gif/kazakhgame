'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface OrnamentDividerProps {
  className?: string;
  variant?: 'primary' | 'gold' | 'light';
  level?: 'subtle' | 'standard' | string;
}

export function OrnamentDivider({ className, variant = 'gold', level }: OrnamentDividerProps) {
  const patternId = React.useId();
  
  const colors = {
    primary: 'text-foreground',
    gold: 'text-gold',
    light: 'text-gold/20'
  };
  
  const activeVariant = level === 'subtle' ? 'light' : variant;

  return (
    <div className={cn('w-full h-20 overflow-hidden flex items-center justify-center relative z-20 my-0 py-8', className)}>
      <motion.div 
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className={cn('w-full h-full', colors[activeVariant as keyof typeof colors])}
      >
        <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            {/* Seamless Kazakh Koshkar-Muiiz style repeating pattern */}
            <pattern id={patternId} x='0' y='0' width='160' height='40' patternUnits='userSpaceOnUse'>
              <g fill='currentColor' transform='scale(0.8) translate(10, 5)' className='animate-ornament-draw'>
                {/* Top waves */}
                <path d='M0,20 C10,0 30,0 40,20 C50,40 70,40 80,20 C90,0 110,0 120,20 C130,40 150,40 160,20' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'/>
                {/* Bottom waves */}
                <path d='M0,20 C10,40 30,40 40,20 C50,0 70,0 80,20 C90,40 110,40 120,20 C130,0 150,0 160,20' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'/>
                
                {/* Center dots/diamonds */}
                <path d='M40,17 L43,20 L40,23 L37,20 Z' />
                <path d='M120,17 L123,20 L120,23 L117,20 Z' />
                
                {/* Connecting nodes */}
                <circle cx='80' cy='20' r='3' fill='none' stroke='currentColor' strokeWidth='2' />
                <circle cx='160' cy='20' r='3' fill='none' stroke='currentColor' strokeWidth='2' />
              </g>
            </pattern>
          </defs>
          <rect x='0' y='0' width='100%' height='100%' fill={`url(#${patternId})`} />
        </svg>
      </motion.div>
    </div>
  )
}
