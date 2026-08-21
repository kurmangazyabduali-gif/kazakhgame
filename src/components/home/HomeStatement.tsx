'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'

export function HomeStatement() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [100, 0, 0, -100])
  const scale = useTransform(scrollYProgress, [0.2, 0.5], [0.9, 1])

  const titleChars = "Р‘Т°Р› РћР™Р«Рќ Р•РњР•РЎ.".split('')

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center bg-white py-32 overflow-hidden border-t border-b border-border/10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-white to-sand pointer-events-none" />
      
      {/* Background large subtle ornament */}
      <motion.div 
        style={{ opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 0.05]) }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] pointer-events-none"
      >
        <KazakhOrnament variant="tumar" className="w-full h-full animate-ornament-spin" />
      </motion.div>

      <motion.div 
        style={{ opacity, y, scale }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <h2 className="font-display text-5xl md:text-7xl lg:text-9xl font-bold text-foreground mb-8 tracking-wide drop-shadow-2xl flex flex-wrap justify-center overflow-hidden">
          {titleChars.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: index * 0.05, ease: [0.2, 0.65, 0.3, 0.9] }}
              className={char === ' ' ? 'w-4 md:w-8' : ''}
            >
              {char}
            </motion.span>
          ))}
        </h2>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-px bg-gold/50 mb-8" />
          <p className="text-xl md:text-3xl font-heading text-gold font-light tracking-widest uppercase opacity-90">
            Р‘Т±Р» вЂ” РјТ±СЂР°РЅС‹ СЃРµР·С–РЅСѓРґС–ТЈ Р¶Р°ТЈР° Р¶РѕР»С‹.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

