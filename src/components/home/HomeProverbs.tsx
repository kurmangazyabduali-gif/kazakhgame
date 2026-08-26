'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Proverb {
  text: string
  translation: string
}

// Well-known anonymous Kazakh folk proverbs (халық мақалдары) — not
// attributed to any individual, chosen for their fit with the platform's
// themes of heritage, skill, and lineage.
const PROVERBS: Proverb[] = [
  {
    text: 'Ат — ердің қанаты.',
    translation: 'Конь — крылья джигита.',
  },
  {
    text: 'Ұяда не көрсең, ұшқанда соны көресің.',
    translation: 'Что видел в гнезде, то увидишь и в полёте.',
  },
  {
    text: 'Атадан ұл туса игі, ата жолын қуса игі.',
    translation: 'Хорошо, когда сын рождён — ещё лучше, когда он идёт по пути отца.',
  },
  {
    text: 'Ат жақсысы жарыста, ер жақсысы жиында білінеді.',
    translation: 'Лучший конь познаётся в скачке, лучший джигит — в собрании.',
  },
  {
    text: 'Туған жердей жер болмас, туған елдей ел болмас.',
    translation: 'Нет земли роднее родной земли, нет народа роднее своего народа.',
  },
]

export function HomeProverbs() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setIndex((i) => (i + 1) % PROVERBS.length), [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5200)
    return () => clearInterval(t)
  }, [paused, next])

  const current = PROVERBS[index]

  return (
    <section
      className="relative py-28 md:py-36 bg-[var(--home-ink)] text-[var(--home-bg)] home-grain overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 opacity-[0.05] home-noise pointer-events-none" style={{ filter: 'invert(1)' }} />
      <div
        aria-hidden="true"
        className="absolute -top-10 left-1/2 -translate-x-1/2 font-display-premium text-[260px] leading-none select-none pointer-events-none opacity-[0.08]"
      >
        &ldquo;
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <span className="inline-block font-body-premium text-xs font-bold tracking-[0.35em] uppercase text-[var(--home-saffron)] mb-10">
          Халық мақалы
        </span>

        <div className="min-h-[180px] md:min-h-[150px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <p className="font-display-premium italic text-3xl md:text-5xl font-medium leading-snug mb-5">
                {current.text}
              </p>
              <p className="font-body-premium text-sm md:text-base text-[var(--home-bg)]/55 tracking-wide">
                {current.translation}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2.5 mt-10">
          {PROVERBS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Мақал ${i + 1}`}
              data-cursor={i === index ? undefined : 'Ауысу'}
              data-cursor-color="var(--home-saffron)"
              className="relative h-1.5 rounded-full transition-all duration-500 overflow-hidden"
              style={{ width: i === index ? 28 : 8, background: 'rgba(251,249,243,0.25)' }}
            >
              {i === index && (
                <motion.span
                  layoutId="proverb-dot"
                  className="absolute inset-0 bg-[var(--home-saffron)] rounded-full"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
