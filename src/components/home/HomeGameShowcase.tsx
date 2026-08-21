'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'

export function HomeGameShowcase() {
  return (
    <section className="py-32 relative bg-background border-t border-border/10 overflow-hidden">
      {/* Background large ornaments */}
      <div className="absolute top-0 right-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
        <KazakhOrnament variant="qoshqar-muiiz" className="w-[800px] h-[800px] text-gold" />
      </div>
      <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none transform -translate-x-1/4 translate-y-1/4">
        <KazakhOrnament variant="tumar" className="w-[600px] h-[600px] text-gold" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <h2 className="font-display text-5xl md:text-7xl font-bold mb-6 text-foreground drop-shadow-lg uppercase tracking-wide">Ұлы Даланың Ойындары</h2>
          <div className="flex justify-center items-center gap-4 text-gold/60 font-heading font-bold text-sm tracking-[0.3em] uppercase">
            <span>Спорт</span>
            <span className="w-1.5 h-1.5 bg-gold/50 rotate-45" />
            <span>Дәстүр</span>
            <span className="w-1.5 h-1.5 bg-gold/50 rotate-45" />
            <span>Стратегия</span>
          </div>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 h-auto lg:h-[700px]">
          <ShowcaseCard 
            title="АСЫҚ АТУ"
            desc="Испытайте свою меткость в традиционной 3D игре кочевников. Бросайте асыки, собирайте комбо и соревнуйтесь с другими."
            category="СПОРТ"
            href="/games/asyk-atu"
            image="/images/games/asyk-atu.jpg"
            ornament="qoshqar-muiiz"
            delay={0}
          />
          <ShowcaseCard 
            title="КЕЛІН ШАЙ"
            desc="Познайте тонкости этикета и уважения. Разливайте чай, следите за температурой и угощайте гостей в уютной юрте."
            category="ДӘСТҮР"
            href="/games/kelin-shai"
            image="/images/games/kelin-shai.jpg"
            ornament="tumar"
            delay={0.2}
          />
          <ShowcaseCard 
            title="ТОҒЫЗҚҰМАЛАҚ"
            desc="Интеллектуальная битва на премиальной доске. Рассчитывайте ходы, создавайте туздыки и побеждайте искусственный интеллект."
            category="СТРАТЕГИЯ"
            href="/games/togyz-kumalak"
            image="/images/games/togyzqumalak.jpg"
            ornament="geometric"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  )
}

function ShowcaseCard({ 
  title, 
  desc, 
  category, 
  href, 
  image, 
  ornament,
  delay
}: { 
  title: string, 
  desc: string, 
  category: string, 
  href: string, 
  image: string,
  ornament: 'qoshqar-muiiz' | 'tumar' | 'su' | 'geometric',
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex-1 min-h-[500px] lg:min-h-0 relative"
    >
      <Link href={href} className="group relative w-full h-full rounded-3xl overflow-hidden block border border-border/20 bg-background transition-all duration-700 shadow-xl hover:shadow-[0_0_60px_-10px_rgba(212,175,55,0.25)] hover:border-gold/40 hover:-translate-y-2">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105 group-focus:scale-105">
          <Image src={image} alt={title} fill className="object-cover opacity-40 mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000" />
        </div>
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay" />
        
        {/* Ornament that draws on hover */}
        <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-60 transition-opacity duration-700 delay-100">
          <KazakhOrnament variant={ornament} animate="draw" className="w-16 h-16 text-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end">
          <div className="transform transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] lg:translate-y-12 group-hover:translate-y-0">
            <span className="text-xs font-heading font-bold uppercase tracking-[0.2em] text-gold mb-4 inline-block drop-shadow-md border border-gold/30 bg-gold/10 px-3 py-1 rounded-full">
              {category}
            </span>
            <h3 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 drop-shadow-xl uppercase">
              {title}
            </h3>
            
            <div className="lg:h-0 lg:opacity-0 lg:overflow-hidden group-hover:h-auto group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
              <p className="text-text-muted text-sm md:text-base leading-relaxed mb-8 font-heading tracking-wider">
                {desc}
              </p>
              
              {/* CTA Line */}
              <div className="flex items-center gap-4 text-gold font-heading text-sm font-bold uppercase tracking-widest">
                <span className="relative">
                  ОЙНАУ
                  <span className="absolute -bottom-1 left-0 w-full h-px bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 delay-200" />
                </span>
                <span className="transform translate-x-0 group-hover:translate-x-3 transition-transform duration-500 ease-out">→</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
