'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { QoshqarMuiz } from './ornaments/QoshqarMuiz'

export function HomeStatement() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [70, 0, 0, -70])
  const scale = useTransform(scrollYProgress, [0.2, 0.5], [0.95, 1])

  const words = ['БҰЛ', 'ОЙЫН', 'ЕМЕС.']
  let globalCharIndex = 0

  return (
    <section
      ref={containerRef}
      className="relative min-h-[85vh] flex items-center justify-center bg-[var(--home-bg)] py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,_rgba(193,80,46,0.05),_transparent_70%)] pointer-events-none" />

      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 0.09]), rotate: useTransform(scrollYProgress, [0, 1], [0, 25]) }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--home-turquoise)] w-[65vw] h-[65vw] max-w-[680px] max-h-[680px] pointer-events-none"
      >
        <QoshqarMuiz className="w-full h-full" drawOnView={false} />
      </motion.div>

      <motion.div style={{ opacity, y, scale }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h2 className="font-display-premium text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mb-8 tracking-tight flex flex-wrap justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-[var(--home-ink)]">
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap">
              {word.split('').map((char) => {
                const charIdx = globalCharIndex++
                return (
                  <motion.span
                    key={charIdx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.7, delay: charIdx * 0.05, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                )
              })}
            </span>
          ))}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-14 h-px bg-[var(--home-border-strong)] mb-8 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="absolute inset-0 bg-[var(--home-terracotta)] origin-left"
            />
          </div>

          <p className="font-serif text-xl md:text-2xl lg:text-3xl italic text-[var(--home-terracotta)] font-light max-w-xl mx-auto leading-relaxed">
            Бұл — мұраны сезінудің жаңа жолы.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
