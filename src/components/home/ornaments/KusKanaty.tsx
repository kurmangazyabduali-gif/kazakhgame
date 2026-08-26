'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface KusKanatyProps {
  className?: string
  height?: number
}

/**
 * Құс қанаты — "bird's wing", a feathered zigzag border motif. Rendered as
 * a repeating SVG tile so it can run the full width of the map panel as a
 * continuous, softly animated frame.
 */
export function KusKanaty({ className, height = 28 }: KusKanatyProps) {
  const patternId = React.useId().replace(/:/g, '_')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.2 }}
      className={`animate-ornament-shimmer ${className ?? ''}`}
      style={{ height }}
    >
      <svg width="100%" height={height} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={patternId} x="0" y="0" width="34" height={height} patternUnits="userSpaceOnUse">
            <path
              d={`M0 ${height / 2} L9 4 L17 ${height / 2} L25 4 L34 ${height / 2}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`M0 ${height / 2} L9 ${height - 4} L17 ${height / 2} L25 ${height - 4} L34 ${height / 2}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.55"
            />
            <circle cx="17" cy={height / 2} r="1.4" fill="currentColor" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height={height} fill={`url(#${patternId})`} />
      </svg>
    </motion.div>
  )
}
