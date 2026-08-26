'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { HomeMagnetic } from './HomeMagnetic'

interface Blob {
  baseX: number
  baseY: number
  r: number
  color: string
  freqX: number
  freqY: number
  phase: number
  amp: number
}

const BLOB_COLORS = ['#C1502E', '#1B8378', '#C98A15', '#37437C']

/** Soft drifting gradient blobs, blurred via CSS filter — a cheap canvas
 *  "gradient mesh" background. Renders one still frame under reduced motion. */
function CanvasBlobs() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let width = 0
    let height = 0

    const blobs: Blob[] = BLOB_COLORS.map((color, i) => ({
      baseX: 0.2 + (i % 2) * 0.6,
      baseY: 0.2 + Math.floor(i / 2) * 0.6,
      r: 220 + i * 30,
      color,
      freqX: 0.00013 + i * 0.00004,
      freqY: 0.00017 + i * 0.00003,
      phase: i * 1.7,
      amp: 0.12,
    }))

    function resize() {
      if (!canvas) return
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * Math.min(window.devicePixelRatio || 1, 2)
      canvas.height = height * Math.min(window.devicePixelRatio || 1, 2)
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      ctx!.scale(canvas.width / width, canvas.height / height)
    }

    function draw(t: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      for (const b of blobs) {
        const x = (b.baseX + Math.sin(t * b.freqX + b.phase) * b.amp) * width
        const y = (b.baseY + Math.cos(t * b.freqY + b.phase) * b.amp) * height
        ctx.beginPath()
        ctx.fillStyle = b.color
        ctx.globalAlpha = 0.16
        ctx.arc(x, y, b.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw)
    }

    resize()
    draw(0)
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ filter: 'blur(70px)' }} aria-hidden="true" />
}

export function HomeFinalCTA() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[var(--home-bg)]">
      <CanvasBlobs />
      <div className="absolute inset-0 bg-[var(--home-bg)]/55" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <span className="font-body-premium text-xs font-bold tracking-[0.35em] uppercase text-[var(--home-terracotta)] mb-6">
            Келесі ұрпаққа
          </span>

          <h2 className="font-display-premium text-5xl md:text-7xl lg:text-8xl font-semibold mb-14 tracking-tight text-[var(--home-ink)]">
            Ұлы Дала <span className="italic text-accent-gradient">жалғасады</span>
          </h2>

          <HomeMagnetic strength={0.3}>
            <Link
              href="/games"
              data-cursor="Кіру"
              data-cursor-color="var(--home-bg)"
              className="home-tinted-shadow group relative inline-flex items-center gap-4 px-14 py-6 rounded-full bg-[var(--home-ink)] text-[var(--home-bg)] font-body-premium font-bold text-base tracking-[0.15em] uppercase overflow-hidden transition-transform duration-300 hover:scale-[1.04]"
              style={{ ['--shadow-tint' as string]: 'rgba(33,28,21,0.45)' }}
            >
              <span className="relative z-10">ULY DALA-ҒА КІРУ</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </Link>
          </HomeMagnetic>
        </motion.div>
      </div>

      {/* Smooth hand-off into the (unchanged) light footer below */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </section>
  )
}
