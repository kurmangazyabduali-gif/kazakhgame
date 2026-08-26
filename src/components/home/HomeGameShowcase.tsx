'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface GameCard {
  title: string
  desc: string
  category: string
  href: string
  image: string
  color: string
  soft: string
}

const GAMES: GameCard[] = [
  {
    title: 'АСЫҚ АТУ',
    desc: 'Көшпенділердің дәстүрлі 3D ойынында мергендігіңізді сынаңыз. Асық атып, комбо жинап, басқалармен жарысыңыз.',
    category: 'СПОРТ',
    href: '/games/asyk-atu',
    image: '/images/games/asyk-atu.jpg',
    color: 'var(--home-terracotta)',
    soft: 'var(--home-terracotta-soft)',
  },
  {
    title: 'ЖАМБЫ АТУ',
    desc: 'Ат үстінде садақ ату өнері. Шауып келе жатып нысанаға дәл тигізіп, нағыз мерген екеніңізді дәлелдеңіз.',
    category: 'СПОРТ',
    href: '/games/zhamby-atu',
    image: '/images/games/jamby-atu.jpg',
    color: 'var(--home-terracotta)',
    soft: 'var(--home-terracotta-soft)',
  },
  {
    title: 'КЕЛІН ШАЙ',
    desc: 'Этикет пен құрметтің қыр-сырын біліңіз. Жайлы үйде шай құйып, қонақтарға құрмет көрсетіңіз.',
    category: 'ДӘСТҮР',
    href: '/games/kelin-shai',
    image: '/images/games/kelin-shai.jpg',
    color: 'var(--home-turquoise)',
    soft: 'var(--home-turquoise-soft)',
  },
  {
    title: 'ТОҒЫЗҚҰМАЛАҚ',
    desc: 'Премиум тақтадағы зияткерлік шайқас. Қадамдарыңызды есептеп, тұздықтар жасап, жасанды интеллектті жеңіңіз.',
    category: 'СТРАТЕГИЯ',
    href: '/games/togyz-kumalak',
    image: '/images/games/togyzqumalak.jpg',
    color: 'var(--home-saffron)',
    soft: 'var(--home-saffron-soft)',
  },
]

export function HomeGameShowcase() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const dragState = useRef({
    dragging: false,
    startX: 0,
    startScroll: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  })
  const momentumRaf = useRef(0)

  const updateProgress = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? el.scrollLeft / max : 0)
  }, [])

  function scrollByCard(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * 380, behavior: 'smooth' })
  }

  function stopMomentum() {
    if (momentumRaf.current) cancelAnimationFrame(momentumRaf.current)
    momentumRaf.current = 0
  }

  function runMomentum() {
    const el = trackRef.current
    if (!el) return
    let v = dragState.current.velocity
    function step() {
      if (!el || Math.abs(v) < 0.05) {
        momentumRaf.current = 0
        return
      }
      el.scrollLeft -= v
      v *= 0.94
      momentumRaf.current = requestAnimationFrame(step)
    }
    momentumRaf.current = requestAnimationFrame(step)
  }

  function onPointerDown(e: React.PointerEvent) {
    const el = trackRef.current
    if (!el) return
    stopMomentum()
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      lastX: e.clientX,
      lastT: performance.now(),
      velocity: 0,
    }
    el.setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    const el = trackRef.current
    if (!el || !dragState.current.dragging) return
    el.scrollLeft = dragState.current.startScroll - (e.clientX - dragState.current.startX)

    const now = performance.now()
    const dt = now - dragState.current.lastT
    if (dt > 0) {
      dragState.current.velocity = ((e.clientX - dragState.current.lastX) / dt) * 16
      dragState.current.lastX = e.clientX
      dragState.current.lastT = now
    }
  }
  function onPointerUp() {
    if (dragState.current.dragging) runMomentum()
    dragState.current.dragging = false
  }

  useEffect(() => stopMomentum, [])

  return (
    <section className="py-32 relative bg-[var(--home-bg)] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <span className="inline-block font-body-premium text-xs font-bold tracking-[0.35em] uppercase text-[var(--home-terracotta)] mb-4">
              Ойын кітапханасы
            </span>
            <h2 className="font-display-premium text-4xl md:text-6xl font-semibold text-[var(--home-ink)]">
              Ұлы Даланың <span className="italic text-accent-gradient">ойындары</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Алдыңғы"
              className="w-11 h-11 rounded-full border border-[var(--home-border-strong)] flex items-center justify-center text-[var(--home-ink)] hover:bg-[var(--home-ink)] hover:text-[var(--home-bg)] transition-colors duration-300"
            >
              ←
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Келесі"
              className="w-11 h-11 rounded-full border border-[var(--home-border-strong)] flex items-center justify-center text-[var(--home-ink)] hover:bg-[var(--home-ink)] hover:text-[var(--home-bg)] transition-colors duration-300"
            >
              →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Drag-to-scroll horizontal gallery */}
      <div
        ref={trackRef}
        onScroll={updateProgress}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="flex gap-6 md:gap-7 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 md:px-10 pb-6 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {GAMES.map((game, i) => (
          <motion.div
            key={game.href}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
            className="snap-start shrink-0 w-[300px] md:w-[380px]"
          >
            <Link
              href={game.href}
              draggable={false}
              data-cursor="Ойнау"
              data-cursor-color={game.color}
              className="home-tinted-shadow group relative flex flex-col aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[var(--home-border)] bg-[var(--home-surface)] transition-all duration-500 hover:-translate-y-2 select-none"
              style={{ ['--shadow-tint' as string]: `${game.color}33` }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 30px 60px -20px ${game.color}55`)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={game.image}
                  alt={game.title}
                  fill
                  sizes="(max-width: 768px) 300px, 380px"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  draggable={false}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <span
                className="absolute top-5 left-5 text-[10px] font-body-premium font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full backdrop-blur-md"
                style={{ background: `${game.color}dd`, color: 'var(--home-bg)' }}
              >
                {game.category}
              </span>

              <div className="relative mt-auto p-6 md:p-7 text-white">
                <h3 className="font-display-premium text-2xl md:text-[26px] font-semibold mb-3 uppercase tracking-wide">
                  {game.title}
                </h3>

                <div className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] grid-rows-[0fr] group-hover:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="text-white/75 text-sm leading-relaxed mb-5 font-body-premium">
                      {game.desc}
                    </p>
                    <div className="flex items-center gap-3 font-body-premium text-xs font-bold uppercase tracking-[0.25em]" style={{ color: game.color }}>
                      <span className="relative">
                        ОЙНАУ
                        <span className="absolute -bottom-1 left-0 w-full h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 delay-150" style={{ background: game.color }} />
                      </span>
                      <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
        <div className="shrink-0 w-px" aria-hidden="true" />
      </div>

      {/* Scroll progress bar */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 mt-4">
        <div className="h-1 rounded-full bg-[var(--home-border)] overflow-hidden max-w-[200px]">
          <motion.div
            className="h-full bg-[var(--home-terracotta)] rounded-full"
            style={{ width: `${8 + progress * 92}%` }}
            transition={{ type: 'tween', duration: 0.1 }}
          />
        </div>
      </div>
    </section>
  )
}
