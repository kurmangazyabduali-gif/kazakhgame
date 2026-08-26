'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface QoshqarMuizProps {
  className?: string
  /** Draw the horns in once they enter view, then hold. */
  drawOnView?: boolean
  /** Keep a slow, continuous rotation (used behind the hero title). */
  spin?: boolean
}

/**
 * Қошқар мүйіз — "ram's horns", the archetypal Kazakh spiral motif.
 * Hand-built as paired symmetric spirals around a central stem, so the
 * line-drawing animation traces a real horn silhouette rather than a
 * generic shape.
 */
export function QoshqarMuiz({ className, drawOnView = true, spin = false }: QoshqarMuizProps) {
  const reduceMotion = useReducedMotion()

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.22, duration: 1.8, ease: [0.22, 0.61, 0.36, 1] as const },
        opacity: { delay: i * 0.22, duration: 0.4 },
      },
    }),
  }

  const content = (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* central stem */}
      <motion.path
        d="M200 200 L200 340"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        custom={0}
        variants={reduceMotion ? undefined : draw}
        initial={reduceMotion ? undefined : 'hidden'}
        {...(drawOnView ? { whileInView: 'visible' } : { animate: 'visible' })}
        viewport={{ once: true, margin: '-10%' }}
      />

      {/* left horn spiral */}
      <motion.path
        d="M200 200
           C 150 200 120 170 120 130
           C 120 96 146 70 180 70
           C 206 70 226 90 226 116
           C 226 136 210 152 190 152
           C 174 152 162 140 162 124
           C 162 111 172 101 185 101"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        custom={1}
        variants={reduceMotion ? undefined : draw}
        initial={reduceMotion ? undefined : 'hidden'}
        {...(drawOnView ? { whileInView: 'visible' } : { animate: 'visible' })}
        viewport={{ once: true, margin: '-10%' }}
      />

      {/* right horn spiral (mirrored) */}
      <motion.path
        d="M200 200
           C 250 200 280 170 280 130
           C 280 96 254 70 220 70
           C 194 70 174 90 174 116
           C 174 136 190 152 210 152
           C 226 152 238 140 238 124
           C 238 111 228 101 215 101"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        custom={1.15}
        variants={reduceMotion ? undefined : draw}
        initial={reduceMotion ? undefined : 'hidden'}
        {...(drawOnView ? { whileInView: 'visible' } : { animate: 'visible' })}
        viewport={{ once: true, margin: '-10%' }}
      />

      {/* lower guard curls */}
      <motion.path
        d="M200 240 C 170 246 150 268 150 296 C 150 312 162 324 178 324"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        custom={2}
        variants={reduceMotion ? undefined : draw}
        initial={reduceMotion ? undefined : 'hidden'}
        {...(drawOnView ? { whileInView: 'visible' } : { animate: 'visible' })}
        viewport={{ once: true, margin: '-10%' }}
      />
      <motion.path
        d="M200 240 C 230 246 250 268 250 296 C 250 312 238 324 222 324"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        custom={2.15}
        variants={reduceMotion ? undefined : draw}
        initial={reduceMotion ? undefined : 'hidden'}
        {...(drawOnView ? { whileInView: 'visible' } : { animate: 'visible' })}
        viewport={{ once: true, margin: '-10%' }}
      />

      {/* center diamond knot */}
      <motion.path
        d="M200 190 L212 200 L200 210 L188 200 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        custom={0.5}
        variants={reduceMotion ? undefined : draw}
        initial={reduceMotion ? undefined : 'hidden'}
        {...(drawOnView ? { whileInView: 'visible' } : { animate: 'visible' })}
        viewport={{ once: true, margin: '-10%' }}
      />
    </svg>
  )

  if (!spin || reduceMotion) return content

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      className={className}
      style={{ transformOrigin: '50% 50%' }}
    >
      {content}
    </motion.div>
  )
}
