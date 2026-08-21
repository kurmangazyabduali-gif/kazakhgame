'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'

export function HomeKazakhstanMap() {
  // Abstract network points representing regions (normalized 0-100)
  const points = [
    { id: 'west', x: 15, y: 45, label: 'БАТЫС' },
    { id: 'north', x: 45, y: 20, label: 'СОЛТҮСТІК' },
    { id: 'center', x: 55, y: 45, label: 'ОРТАЛЫҚ' },
    { id: 'south', x: 65, y: 80, label: 'ОҢТҮСТІК' },
    { id: 'east', x: 85, y: 40, label: 'ШЫҒЫС' },
  ]

  // Connections between regions
  const connections = [
    ['west', 'north'],
    ['west', 'center'],
    ['west', 'south'],
    ['north', 'center'],
    ['north', 'east'],
    ['center', 'south'],
    ['center', 'east'],
    ['south', 'east'],
  ]

  return (
    <section className="py-32 relative bg-surface overflow-hidden border-t border-border/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/5 via-background to-background pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <KazakhOrnament variant="su" animate="draw" className="w-12 h-12 text-gold mx-auto mb-6 opacity-60" />
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-4 text-foreground drop-shadow-md uppercase tracking-widest">
            ҚАЗАҚСТАН
          </h2>
          <p className="text-text-muted font-heading tracking-[0.2em] uppercase text-sm md:text-base">
            Біртұтас мәдени кеңістік
          </p>
        </motion.div>

        {/* Abstract Map Network */}
        <div className="w-full max-w-4xl aspect-[2/1] relative mt-8 md:mt-12">
          
          {/* Subtle geographic glow behind */}
          <div className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full scale-y-50" />

          {/* Connections (Lines) */}
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
            {connections.map(([p1, p2], i) => {
              const pt1 = points.find(p => p.id === p1)!
              const pt2 = points.find(p => p.id === p2)!
              return (
                <motion.line
                  key={`${p1}-${p2}`}
                  x1={`${pt1.x}%`}
                  y1={`${pt1.y}%`}
                  x2={`${pt2.x}%`}
                  y2={`${pt2.y}%`}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gold/20"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1.5, delay: i * 0.1 + 0.5, ease: "easeInOut" }}
                />
              )
            })}
          </svg>

          {/* Points */}
          {points.map((pt, i) => (
            <motion.div
              key={pt.id}
              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.2, type: "spring" }}
            >
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 bg-gold/30 rounded-full animate-ping opacity-50" style={{ animationDuration: '3s', animationDelay: `${i * 0.5}s` }} />
              
              {/* Core point */}
              <div className="w-2 h-2 bg-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,1)]" />

              {/* Label */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.2 + 0.5 }}
                className="absolute top-6 font-heading font-bold text-[10px] tracking-[0.2em] text-gold/80 uppercase whitespace-nowrap group-hover:text-gold transition-colors"
              >
                {pt.label}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
