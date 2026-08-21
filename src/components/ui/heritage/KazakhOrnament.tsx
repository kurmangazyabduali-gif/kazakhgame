import React from 'react'
import { cn } from '@/lib/utils'

export type OrnamentLevel = 'subtle' | 'standard' | 'hero'
export type OrnamentAnimation = 'none' | 'float' | 'spin' | 'pulse' | 'draw'

interface KazakhOrnamentProps extends React.SVGProps<SVGSVGElement> {
  level?: OrnamentLevel
  variant?: 'qoshqar-muiiz' | 'tumar' | 'su' | 'geometric'
  animate?: OrnamentAnimation
}

export function KazakhOrnament({ 
  level = 'standard', 
  variant = 'qoshqar-muiiz',
  animate = 'none',
  className,
  ...props 
}: KazakhOrnamentProps) {
  // Mappings for visual weight
  const opacityMap = {
    subtle: 'opacity-10',
    standard: 'opacity-50',
    hero: 'opacity-100',
  }

  // Animation mappings
  const animationMap = {
    none: '',
    float: 'animate-ornament-float',
    spin: 'animate-ornament-spin',
    pulse: 'animate-ornament-pulse',
    draw: 'animate-ornament-draw',
  }

  // Basic abstract SVG representations of Kazakh motifs
  const getPath = () => {
    const isDraw = animate === 'draw'
    const fillValue = isDraw ? 'none' : 'currentColor'
    const strokeValue = isDraw ? 'currentColor' : 'none'
    const strokeWidthValue = isDraw ? '1.5' : '0'

    switch (variant) {
      case 'tumar': // Triangle amulet
        return (
          <path 
            d="M12 2L2 20h20L12 2zm0 4.5l6.5 11.5h-13L12 6.5z" 
            fill={fillValue}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
          />
        )
      case 'su': // Water/wave motif
        return (
          <path 
            d="M0 12c4 0 4-4 8-4s4 4 8 4 4-4 8-4v4c-4 0-4 4-8 4s-4-4-8-4-4 4-8 4v-4z" 
            fill={fillValue}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
          />
        )
      case 'geometric': // Minimal digital representation
        return (
          <rect 
            x="4" 
            y="4" 
            width="16" 
            height="16" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={isDraw ? strokeWidthValue : '2'} 
            transform="rotate(45 12 12)" 
          />
        )
      case 'qoshqar-muiiz': // Ram's horn (simplified for digital)
      default:
        return (
          <path 
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 2.228-.73 4.286-1.96 5.928a1 1 0 0 1-1.636-1.156A7.95 7.95 0 0 0 20 12c0-4.418-3.582-8-8-8S4 7.582 4 12s3.582 8 8 8c1.373 0 2.666-.346 3.8-.951a1 1 0 1 1 1.01 1.728A9.957 9.957 0 0 1 12 22z" 
            fill={fillValue}
            stroke={strokeValue}
            strokeWidth={strokeWidthValue}
          />
        )
    }
  }

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "pointer-events-none transition-all duration-500",
        opacityMap[level],
        animationMap[animate],
        className
      )}
      {...props}
    >
      {getPath()}
    </svg>
  )
}
