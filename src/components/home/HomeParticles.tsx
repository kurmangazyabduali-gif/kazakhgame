'use client'

import React, { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

interface HomeParticlesProps {
  density?: number
  color?: string
  className?: string
}

export function HomeParticles({ 
  density = 50, 
  color = 'rgba(212, 175, 55, 0.4)',
  className = ''
}: HomeParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particlesRef.current = []
      // Adjust particle count based on screen size (density is per 1000x1000 area)
      const area = (width * height) / 1000000
      const particleCount = Math.floor(density * area)

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2 - 0.1, // Slight upward drift
          opacity: Math.random() * 0.5 + 0.1
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      particlesRef.current.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        
        // Wrap around
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${p.opacity})`)
        ctx.fill()
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', handleResize)
    initParticles()
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [density, color, shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  )
}
