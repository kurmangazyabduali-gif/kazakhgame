'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface TuyeTabanProps {
  className?: string
  animate?: boolean
}

/**
 * Түйе табан — "camel's footprint", a compact twin-lobe motif traditionally
 * used as a small accent between larger ornament bands. Drawn as two
 * asymmetric rounded lobes split by a soft groove, echoing a cloven print.
 */
export function TuyeTaban({ className, animate = true }: TuyeTabanProps) {
  const reduceMotion = useReducedMotion()
  const shouldAnimate = animate && !reduceMotion

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { delay: i * 0.15, duration: 1.1, ease: [0.22, 0.61, 0.36, 1] as const },
    }),
  }

  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <motion.path
        d="M24 6 C15 6 9 14 9 23 C9 32 15 40 22 40 C24 40 24 37 24 34 C24 30 24 27 24 23 C24 16 24 10 24 6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        custom={0}
        variants={shouldAnimate ? draw : undefined}
        initial={shouldAnimate ? 'hidden' : undefined}
        whileInView={shouldAnimate ? 'visible' : undefined}
        viewport={{ once: true, margin: '-10%' }}
      />
      <motion.path
        d="M24 6 C33 6 39 14 39 23 C39 32 33 40 26 40 C24 40 24 37 24 34 C24 30 24 27 24 23 C24 16 24 10 24 6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        custom={0.4}
        variants={shouldAnimate ? draw : undefined}
        initial={shouldAnimate ? 'hidden' : undefined}
        whileInView={shouldAnimate ? 'visible' : undefined}
        viewport={{ once: true, margin: '-10%' }}
      />
    </svg>
  )
}
