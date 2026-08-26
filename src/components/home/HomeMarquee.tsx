'use client'

import React from 'react'

interface HomeMarqueeProps {
  items: string[]
  className?: string
  reverse?: boolean
}

/**
 * Infinite horizontal ticker. The item list is rendered twice back-to-back
 * and the whole track is translated by exactly -50%, so the loop seam is
 * invisible. Pauses on hover/focus so the text stays readable on demand.
 */
export function HomeMarquee({ items, className, reverse = false }: HomeMarqueeProps) {
  const track = [...items, ...items]

  return (
    <div className={`group pause-marquee-hover relative w-full overflow-hidden ${className ?? ''}`}>
      <div
        className="flex w-max items-center animate-home-marquee group-hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {track.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="font-body-premium text-sm md:text-base font-semibold uppercase tracking-[0.25em] px-6 whitespace-nowrap">
              {item}
            </span>
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: i % 3 === 0 ? 'var(--home-terracotta)' : i % 3 === 1 ? 'var(--home-turquoise)' : 'var(--home-saffron)' }}
            />
          </span>
        ))}
      </div>
    </div>
  )
}
