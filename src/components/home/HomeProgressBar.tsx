'use client'

import React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Thin fixed rail at the very top of the homepage tracking scroll progress —
 * a quiet orientation cue for a long (~7 screen) single page.
 */
export function HomeProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 40, mass: 0.3 })

  return (
    <motion.div
      style={{ scaleX }}
      className="home-progress-rail fixed top-0 left-0 right-0 h-[3px] z-[60] bg-gradient-to-r from-[var(--home-terracotta)] via-[var(--home-saffron)] to-[var(--home-turquoise)] pointer-events-none"
      aria-hidden="true"
    />
  )
}
