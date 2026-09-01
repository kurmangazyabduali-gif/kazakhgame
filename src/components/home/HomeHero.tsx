'use client'

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { QoshqarMuiz } from './ornaments/QoshqarMuiz'
import { HomeScrollIndicator } from './HomeScrollIndicator'
import { HomeMarquee } from './HomeMarquee'
import { HomeMagnetic } from './HomeMagnetic'
import { HomeHeroMapBackground } from './HomeHeroMapBackground'

const TICKER_ITEMS = ['АСЫҚ АТУ', 'ЖАМБЫ АТУ', 'КЕЛІН ШАЙ', 'ТОҒЫЗҚҰМАЛАҚ', 'ҚҰСБЕГІЛІК', 'ҰЛЫ ДАЛА МҰРАСЫ']

const titleTop = 'ULY'.split('')
const titleBottom = 'DALA'.split('')

export function HomeHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const yText = useTransform(scrollY, [0, 700], [0, -60])
  const opacityText = useTransform(scrollY, [0, 500], [1, 0])

  // Depth-of-field parallax: far ornament drifts slower than the near one,
  // both layered on top of the existing cursor-tilt for a richer sense of depth.
  const yOrnamentFar = useTransform(scrollY, [0, 900], [0, -110])
  const yOrnamentNear = useTransform(scrollY, [0, 900], [0, -220])

  const letterVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 + i * 0.05, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const },
    }),
  }

  return (
    <>
      <section className="relative w-full min-h-[92dvh] flex items-center justify-center overflow-hidden home-vignette home-dotgrid home-grain pt-20">
        {/* Diagonal corner ribbon */}
        <motion.div
          initial={{ x: 140, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute top-8 -right-16 z-30 rotate-45 bg-[var(--home-ink)] text-[var(--home-bg)] px-20 py-2 shadow-lg hidden sm:block"
        >
          <span className="font-body-premium text-[11px] font-bold tracking-[0.3em] uppercase">2026 · Жаңа маусым</span>
        </motion.div>

        {/* Animated Background Map of Kazakhstan */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
        >
          <motion.div 
            style={{ x: mousePos.x * 0.12, y: mousePos.y * 0.12 }}
            className="w-full max-w-[1450px] aspect-[5/3] flex items-center justify-center p-8 opacity-[0.16] text-[var(--home-terracotta)]"
          >
            <HomeHeroMapBackground className="w-full h-full drop-shadow-md animate-ornament-float" />
          </motion.div>
        </motion.div>

        {/* Two-tone floating ornament, offset from center for an editorial (not symmetric-generic) feel.
            Cursor tilt and scroll-parallax drift compose on separate transforms so both stay smooth. */}
        <motion.div
          style={{ y: yOrnamentFar }}
          className="absolute -right-24 top-[8%] md:right-[2%] md:top-[6%] pointer-events-none z-0"
        >
          <motion.div style={{ x: mousePos.x * 0.15, y: mousePos.y * 0.15 }}>
            <QoshqarMuiz spin className="w-[340px] h-[340px] md:w-[480px] md:h-[480px] text-[var(--home-terracotta)]/[0.10]" />
          </motion.div>
        </motion.div>
        <motion.div
          style={{ y: yOrnamentNear }}
          className="absolute -left-20 bottom-[6%] md:left-[4%] pointer-events-none z-0"
        >
          <motion.div style={{ x: mousePos.x * -0.1, y: mousePos.y * -0.1 }}>
            <QoshqarMuiz className="w-[220px] h-[220px] md:w-[320px] md:h-[320px] text-[var(--home-turquoise)]/[0.10]" drawOnView={false} />
          </motion.div>
        </motion.div>

        {/* Small drifting accent chips */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="hidden lg:flex absolute left-[10%] top-[28%] items-center gap-2 bg-[var(--home-surface)] border border-[var(--home-border)] rounded-full pl-2 pr-4 py-2 shadow-[0_10px_30px_-12px_rgba(33,28,21,0.18)] animate-home-bob z-20"
        >
          <span className="w-7 h-7 rounded-full bg-[var(--home-saffron-soft)] flex items-center justify-center text-[var(--home-saffron)] font-display-premium font-bold text-sm">4</span>
          <span className="font-body-premium text-xs font-semibold uppercase tracking-widest text-[var(--home-ink-soft)]">ойын режимі</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="hidden lg:flex absolute right-[12%] bottom-[24%] items-center gap-2 bg-[var(--home-surface)] border border-[var(--home-border)] rounded-full pl-2 pr-4 py-2 shadow-[0_10px_30px_-12px_rgba(33,28,21,0.18)] animate-home-drift z-20"
        >
          <span className="w-7 h-7 rounded-full bg-[var(--home-turquoise-soft)] flex items-center justify-center text-[var(--home-turquoise)] font-display-premium font-bold text-sm">5</span>
          <span className="font-body-premium text-xs font-semibold uppercase tracking-widest text-[var(--home-ink-soft)]">дала өңірі</span>
        </motion.div>

        {/* Foreground content */}
        <motion.div
          style={{ y: yText, opacity: opacityText }}
          className="relative z-40 flex flex-col items-center text-center px-6 w-full max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-8 bg-[var(--home-terracotta-soft)] border border-[var(--home-terracotta)]/25 rounded-full px-5 py-2 text-[var(--home-terracotta)] font-body-premium text-xs font-bold tracking-[0.3em] uppercase"
          >
            <span className="w-1.5 h-1.5 bg-[var(--home-terracotta)] rotate-45" />
            Ұлы Дала Мұрасы
            <span className="w-1.5 h-1.5 bg-[var(--home-terracotta)] rotate-45" />
          </motion.div>

          <h1 className="font-display-premium text-7xl md:text-9xl lg:text-[164px] font-semibold tracking-tight mb-6 leading-[0.88] text-[var(--home-ink)]">
            <span className="flex justify-center overflow-hidden">
              {titleTop.map((ch, i) => (
                <motion.span key={i} custom={i} variants={letterVariants} initial="hidden" animate="visible" className="inline-block">
                  {ch}
                </motion.span>
              ))}
            </span>
            <span className="flex justify-center overflow-hidden italic text-accent-gradient">
              {titleBottom.map((ch, i) => (
                <motion.span key={i} custom={i + 3} variants={letterVariants} initial="hidden" animate="visible" className="inline-block">
                  {ch}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-base md:text-xl text-[var(--home-ink-soft)] font-body-premium font-medium tracking-[0.15em] max-w-2xl mx-auto mb-12"
          >
            Қазақтың ұлттық ойындар мен мәдени мұра платформасы
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <HomeMagnetic strength={0.3}>
              <Link
                href="/games"
                data-cursor="Бастау"
                data-cursor-color="var(--home-bg)"
                className="home-tinted-shadow group relative inline-flex items-center gap-4 px-12 py-5 rounded-full bg-[var(--home-ink)] text-[var(--home-bg)] font-body-premium font-bold text-base tracking-[0.15em] uppercase overflow-hidden transition-transform duration-300 hover:scale-[1.04]"
                style={{ ['--shadow-tint' as string]: 'rgba(33,28,21,0.42)' }}
              >
                <span className="relative z-10">Ойынды бастау</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </Link>
            </HomeMagnetic>

            <Link
              href="/culture"
              data-cursor="Танысу"
              data-cursor-color="var(--home-terracotta)"
              className="group inline-flex items-center gap-2 font-body-premium font-semibold text-sm tracking-widest uppercase text-[var(--home-ink)]"
            >
              Мұрамен танысу
              <span className="relative">
                <span className="absolute -bottom-1 left-0 w-full h-px bg-[var(--home-ink)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400" />
                →
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <HomeScrollIndicator />
      </section>

      <div className="border-y border-[var(--home-border)] bg-[var(--home-bg-deep)] py-4 text-[var(--home-ink-soft)]">
        <HomeMarquee items={TICKER_ITEMS} />
      </div>
    </>
  )
}
