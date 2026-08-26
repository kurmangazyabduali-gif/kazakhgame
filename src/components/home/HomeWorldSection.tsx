'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import { TuyeTaban } from './ornaments/TuyeTaban'

interface World {
  id: string
  title: string
  desc: string
  tags: string
  image: string
  imageAlt: string
  color: string
  soft: string
}

const WORLDS: World[] = [
  {
    id: 'sport',
    title: 'ҰЛТТЫҚ СПОРТ',
    desc: 'Мергендік, күш және төзімділік. Ұрпақтан ұрпаққа берілетін жарыс рухын сезініңіз.',
    tags: 'АСЫҚ АТУ · ЖАМБЫ АТУ · ҚҰСБЕГІЛІК',
    image: '/images/games/jamby-atu.jpg',
    imageAlt: 'Ұлттық спорт',
    color: 'var(--home-terracotta)',
    soft: 'var(--home-terracotta-soft)',
  },
  {
    id: 'tradition',
    title: 'ҰЛТТЫҚ ДӘСТҮР',
    desc: 'Қонақжайлылық пен құрмет. Адамдар арасындағы байланысты қалыптастыратын тірі этика.',
    tags: 'КЕЛІН ШАЙ',
    image: '/images/games/kelin-shai.jpg',
    imageAlt: 'Ұлттық дәстүр',
    color: 'var(--home-turquoise)',
    soft: 'var(--home-turquoise-soft)',
  },
  {
    id: 'strategy',
    title: 'СТРАТЕГИЯ',
    desc: 'Терең ойлауды талап ететін интеллектуалды шайқастар. Әр қадам — ұрпақтан ұрпаққа жеткен есеп.',
    tags: 'ТОҒЫЗҚҰМАЛАҚ',
    image: '/images/games/togyzqumalak.jpg',
    imageAlt: 'Стратегия',
    color: 'var(--home-saffron)',
    soft: 'var(--home-saffron-soft)',
  },
]

function TiltCard({ world, index }: { world: World; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 20 })
  const sry = useSpring(ry, { stiffness: 200, damping: 20 })
  const glowX = useMotionValue(50)
  const glowY = useMotionValue(50)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    ry.set((px - 0.5) * 14)
    rx.set((0.5 - py) * 10)
    glowX.set(px * 100)
    glowY.set(py * 100)
  }

  function handleLeave() {
    rx.set(0)
    ry.set(0)
  }

  const glowBackground = useTransform([glowX, glowY], ([gx, gy]: number[]) =>
    `radial-gradient(340px circle at ${gx}% ${gy}%, ${world.color}22, transparent 70%)`
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ perspective: 1200 }}
    >
      <motion.article
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        data-cursor="Ашу"
        data-cursor-color={world.color}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: 'preserve-3d',
          ['--shadow-tint' as string]: `${world.color}2E`,
        }}
        className="home-tinted-shadow group relative rounded-2xl overflow-hidden border border-[var(--home-border)] bg-[var(--home-surface)] hover:shadow-[0_34px_70px_-22px_var(--shadow-tint)]"
      >
        <motion.div className="absolute inset-0 pointer-events-none z-20" style={{ background: glowBackground }} />

        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={world.image}
            alt={world.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--home-surface)] via-[var(--home-surface)]/10 to-transparent" />
          <div
            className="absolute top-5 left-5 w-10 h-10 rounded-full border flex items-center justify-center"
            style={{ background: world.soft, borderColor: `${world.color}40`, color: world.color }}
          >
            <TuyeTaban className="w-5 h-5" />
          </div>
        </div>

        <div className="p-7 md:p-8" style={{ transform: 'translateZ(30px)' }}>
          <h3 className="font-display-premium text-2xl md:text-[27px] font-semibold text-[var(--home-ink)] mb-3 tracking-wide uppercase">
            {world.title}
          </h3>
          <div className="w-10 h-[2.5px] rounded-full mb-4" style={{ background: world.color }} />
          <p className="text-[var(--home-ink-soft)] font-body-premium text-sm leading-relaxed mb-6 min-h-[72px]">
            {world.desc}
          </p>
          <p className="font-body-premium text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: world.color }}>
            {world.tags}
          </p>
        </div>
      </motion.article>
    </motion.div>
  )
}

export function HomeWorldSection() {
  return (
    <section className="relative py-32 bg-[var(--home-bg-soft)] home-grain overflow-hidden">
      <div
        aria-hidden="true"
        className="hidden lg:block absolute right-6 top-1/2 -translate-y-1/2 text-[var(--home-ink)] font-display-premium text-[150px] font-semibold uppercase tracking-tighter opacity-[0.03] leading-none select-none pointer-events-none"
        style={{ writingMode: 'vertical-rl' }}
      >
        ҮШ ӘЛЕМ
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20"
        >
          <span className="inline-block font-body-premium text-xs font-bold tracking-[0.35em] uppercase text-[var(--home-terracotta)] mb-4">
            Үш Әлем
          </span>
          <h2 className="font-display-premium text-4xl md:text-6xl font-semibold text-[var(--home-ink)]">
            Бір мұра, <span className="italic text-accent-gradient">үш қырынан</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {WORLDS.map((world, i) => (
            <TiltCard key={world.id} world={world} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
