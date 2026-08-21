'use client'

import React, { useEffect, useRef } from 'react'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'
import { useReducedMotion } from 'framer-motion'

export function HomeOrnamentCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return
    
    const container = containerRef.current
    if (!container) return

    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0
    let animationFrame: number

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-1 to +1)
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      
      targetX = x
      targetY = y
    }

    const updateParallax = () => {
      // Lerp for smooth movement
      currentX += (targetX - currentX) * 0.05
      currentY += (targetY - currentY) * 0.05

      // Apply CSS custom properties
      container.style.setProperty('--mx', currentX.toString())
      container.style.setProperty('--my', currentY.toString())

      animationFrame = requestAnimationFrame(updateParallax)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    animationFrame = requestAnimationFrame(updateParallax)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrame)
    }
  }, [shouldReduceMotion])

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden z-10 [perspective:1000px]"
    >
      {/* Background abstract grid/lines layer */}
      <div 
        className="absolute inset-0 opacity-[0.03] transition-transform duration-75 will-change-transform"
        style={{ transform: shouldReduceMotion ? 'none' : 'translate(calc(var(--mx, 0) * -10px), calc(var(--my, 0) * -10px))' }}
      >
         <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent bg-[length:100px_100px]" />
      </div>

      {/* Main glowing central ornament */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] opacity-20 text-gold transition-transform duration-75 will-change-transform flex items-center justify-center"
        style={{ transform: shouldReduceMotion ? 'translate(-50%, -50%)' : 'translate(calc(-50% + var(--mx, 0) * 15px), calc(-50% + var(--my, 0) * 15px))' }}
      >
        <KazakhOrnament variant="qoshqar-muiiz" animate="draw" className="w-full h-full blur-[2px]" />
      </div>

      {/* Foreground sharp ornament outline */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] opacity-40 text-gold transition-transform duration-75 will-change-transform flex items-center justify-center"
        style={{ transform: shouldReduceMotion ? 'translate(-50%, -50%)' : 'translate(calc(-50% + var(--mx, 0) * -8px), calc(-50% + var(--my, 0) * -8px)) scale(1.05)' }}
      >
        <KazakhOrnament variant="qoshqar-muiiz" animate="draw" className="w-full h-full drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
      </div>
      
      {/* Floating accent shapes */}
      <div 
        className="absolute top-1/4 left-1/4 w-32 h-32 text-gold/10 transition-transform duration-75 will-change-transform"
        style={{ transform: shouldReduceMotion ? 'none' : 'translate(calc(var(--mx, 0) * 25px), calc(var(--my, 0) * 25px)) rotate(15deg)' }}
      >
        <KazakhOrnament variant="tumar" animate="float" className="w-full h-full" />
      </div>
      <div 
        className="absolute bottom-1/4 right-1/4 w-40 h-40 text-gold/10 transition-transform duration-75 will-change-transform"
        style={{ transform: shouldReduceMotion ? 'none' : 'translate(calc(var(--mx, 0) * -20px), calc(var(--my, 0) * -20px)) rotate(-15deg)' }}
      >
        <KazakhOrnament variant="su" animate="float" className="w-full h-full" />
      </div>
    </div>
  )
}
