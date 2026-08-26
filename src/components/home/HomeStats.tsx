'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

interface Stat {
  value: number
  suffix?: string
  label: string
  color: string
  soft: string
}

const STATS: Stat[] = [
  { value: 4, label: 'ұлттық ойын', color: 'var(--home-terracotta)', soft: 'var(--home-terracotta-soft)' },
  { value: 5, label: 'дала өңірі', color: 'var(--home-turquoise)', soft: 'var(--home-turquoise-soft)' },
  { value: 3, label: 'мұра санаты', color: 'var(--home-saffron)', soft: 'var(--home-saffron-soft)' },
  { value: 100, suffix: '%', label: 'ақысыз қолжетімді', color: 'var(--home-indigo)', soft: 'var(--home-indigo-soft)' },
]

function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: 1600, bounce: 0 })

  useEffect(() => {
    if (inView) motionValue.set(value)
  }, [inView, value, motionValue])

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toString() + (suffix ?? '')
    })
  }, [spring, suffix])

  return <span ref={ref}>0{suffix}</span>
}

export function HomeStats() {
  return (
    <section className="relative py-20 md:py-24 bg-[var(--home-bg-soft)] border-b border-[var(--home-border)] overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,_rgba(201,138,21,0.06),_transparent_65%)] pointer-events-none"
      />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3 px-2"
            >
              <span
                className="w-14 h-14 rounded-full flex items-center justify-center mb-1 transition-transform duration-500 hover:scale-110"
                style={{ background: stat.soft, color: stat.color }}
                aria-hidden="true"
              >
                <span className="w-2.5 h-2.5 rounded-full animate-home-glow" style={{ background: stat.color }} />
              </span>
              <span className="font-display-premium text-5xl md:text-6xl font-semibold tabular-nums" style={{ color: stat.color }}>
                <CountUp value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="font-body-premium text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--home-ink-soft)]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
