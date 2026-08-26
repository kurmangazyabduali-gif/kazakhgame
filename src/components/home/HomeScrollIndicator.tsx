'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Minimal descending line — a quiet cue, not a competing call to action.
 * The hero's real CTA is the "Ойынды бастау" button.
 */
export function HomeScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY <= 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-2"
        >
          <span className="font-body-premium text-[9px] font-bold text-[var(--home-ink-faint)] uppercase tracking-[0.35em]">Төмен жылжыт</span>
          <div className="w-px h-9 bg-[var(--home-border-strong)] relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-[var(--home-terracotta)]"
              animate={{ y: [0, 36] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
