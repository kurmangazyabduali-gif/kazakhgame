'use client'

import React from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { KusKanaty } from './ornaments/KusKanaty'

interface RegionPoint {
  id: string
  x: number
  y: number
  label: string
  color: string
}

const POINTS: RegionPoint[] = [
  { id: 'west', x: 15, y: 45, label: 'БАТЫС', color: 'var(--home-terracotta)' },
  { id: 'north', x: 45, y: 20, label: 'СОЛТҮСТІК', color: 'var(--home-turquoise)' },
  { id: 'center', x: 55, y: 45, label: 'ОРТАЛЫҚ', color: 'var(--home-saffron)' },
  { id: 'south', x: 65, y: 80, label: 'ОҢТҮСТІК', color: 'var(--home-indigo)' },
  { id: 'east', x: 85, y: 40, label: 'ШЫҒЫС', color: 'var(--home-terracotta)' },
]

const CONNECTIONS: [string, string][] = [
  ['west', 'north'],
  ['west', 'center'],
  ['west', 'south'],
  ['north', 'center'],
  ['north', 'east'],
  ['center', 'south'],
  ['center', 'east'],
  ['south', 'east'],
]

function MagneticPin({ point, delay }: { point: RegionPoint; delay: number }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * 0.35)
    y.set(relY * 0.35)
  }
  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group"
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, delay, type: 'spring' }}
    >
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        data-cursor={point.label}
        data-cursor-color={point.color}
        className="relative w-12 h-12 flex items-center justify-center cursor-pointer"
      >
        <motion.div style={{ x: sx, y: sy }} className="relative flex flex-col items-center">
          <span className="absolute inset-0 rounded-full animate-ping" style={{ background: point.color, opacity: 0.25, width: 20, height: 20, left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
          <span
            className="w-3.5 h-3.5 rounded-full ring-4 transition-transform duration-300 group-hover:scale-125"
            style={{ background: point.color, boxShadow: `0 0 0 4px ${point.color}22` }}
          />
          <span className="absolute top-6 font-body-premium font-bold text-[10px] tracking-[0.2em] uppercase whitespace-nowrap transition-colors" style={{ color: point.color }}>
            {point.label}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function HomeKazakhstanMap() {
  return (
    <section className="py-32 relative bg-[var(--home-bg-soft)] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9 }}
          className="text-center mb-14"
        >
          <span className="inline-block font-body-premium text-xs font-bold tracking-[0.35em] uppercase text-[var(--home-turquoise)] mb-4">
            Мәдени Кеңістік
          </span>
          <h2 className="font-display-premium text-4xl md:text-6xl font-semibold text-[var(--home-ink)] uppercase tracking-wide">
            ҚАЗАҚСТАН
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1, delay: 0.15 }}
          className="home-tinted-shadow relative w-full rounded-3xl border border-[var(--home-border)] overflow-hidden bg-[var(--home-surface)]"
          style={{ ['--shadow-tint' as string]: 'rgba(27,131,120,0.16)' }}
        >
          <div className="text-[var(--home-ink-faint)]">
            <KusKanaty height={22} />
          </div>

          <div className="w-full aspect-[16/9] md:aspect-[2/1] relative px-6 md:px-12 py-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,_rgba(27,131,120,0.06),_transparent_70%)] pointer-events-none" />

            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
              {CONNECTIONS.map(([p1, p2], i) => {
                const pt1 = POINTS.find((p) => p.id === p1)!
                const pt2 = POINTS.find((p) => p.id === p2)!
                return (
                  <motion.line
                    key={`${p1}-${p2}`}
                    x1={`${pt1.x}%`}
                    y1={`${pt1.y}%`}
                    x2={`${pt2.x}%`}
                    y2={`${pt2.y}%`}
                    stroke="var(--home-ink-faint)"
                    strokeOpacity="0.5"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 1.4, delay: i * 0.08 + 0.3, ease: 'easeInOut' }}
                  />
                )
              })}
            </svg>

            {POINTS.map((pt, i) => (
              <MagneticPin key={pt.id} point={pt} delay={i * 0.15} />
            ))}
          </div>

          <div className="text-[var(--home-ink-faint)] rotate-180">
            <KusKanaty height={22} />
          </div>

          <span className="absolute bottom-4 right-6 text-[10px] font-body-premium text-[var(--home-ink-faint)] tracking-[0.15em] uppercase">
            Интерактивті карта — келесі жаңартуда
          </span>
        </motion.div>
      </div>
    </section>
  )
}
