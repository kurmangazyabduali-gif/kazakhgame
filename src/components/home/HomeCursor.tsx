'use client'

import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

interface CursorState {
  label: string
  color: string
}

/**
 * Desktop-only follower cursor. Interactive elements opt in by setting
 * `data-cursor="Label"` and optionally `data-cursor-color="var(--home-terracotta)"`.
 * Hidden entirely on touch devices and under reduced-motion.
 */
export function HomeCursor() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState<CursorState | null>(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  // Runs once on mount: detects device capability (a real read of an
  // external API — must happen client-side, so it can't be a lazy useState
  // initializer without breaking SSR) and, only when supported, wires up
  // the mousemove listener that drives the follower cursor.
  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduceMotion) return

    function handleMove(e: MouseEvent) {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor]')
      if (target) {
        setActive({
          label: target.dataset.cursor || '',
          color: target.dataset.cursorColor || 'var(--home-ink)',
        })
      } else {
        setActive(null)
      }
    }

    const raf = requestAnimationFrame(() => setEnabled(true))
    window.addEventListener('mousemove', handleMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', handleMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!enabled) return null

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="fixed top-0 left-0 z-[70] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            className="flex items-center justify-center rounded-full backdrop-blur-sm"
            style={{
              width: active.label ? 84 : 14,
              height: active.label ? 84 : 14,
              background: `${active.color}14`,
              border: `1px solid ${active.color}55`,
            }}
          >
            {active.label && (
              <span
                className="font-body-premium text-[9px] font-bold uppercase tracking-[0.15em] text-center leading-tight px-1"
                style={{ color: active.color }}
              >
                {active.label}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
