'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'
import Image from 'next/image'

export function HomeWorldSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll through the whole 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Map scroll progress to the 3 sections
  // Section 1: 0 to 0.33
  // Section 2: 0.33 to 0.66
  // Section 3: 0.66 to 1.0

  // Title opacities
  const op1 = useTransform(scrollYProgress, [0, 0.25, 0.33], [1, 1, 0])
  const op2 = useTransform(scrollYProgress, [0.25, 0.33, 0.58, 0.66], [0, 1, 1, 0])
  const op3 = useTransform(scrollYProgress, [0.58, 0.66, 1], [0, 1, 1])

  // Image opacities
  const imgOp1 = useTransform(scrollYProgress, [0, 0.25, 0.33], [0.6, 0.6, 0])
  const imgOp2 = useTransform(scrollYProgress, [0.25, 0.33, 0.58, 0.66], [0, 0.6, 0.6, 0])
  const imgOp3 = useTransform(scrollYProgress, [0.58, 0.66, 1], [0, 0.6, 0.6])

  // Parallax subtle scales
  const scale1 = useTransform(scrollYProgress, [0, 0.33], [1, 1.1])
  const scale2 = useTransform(scrollYProgress, [0.33, 0.66], [1, 1.1])
  const scale3 = useTransform(scrollYProgress, [0.66, 1], [1, 1.1])

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full bg-white">
      {/* Sticky container that stays in view */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        

        {/* IMAGE LAYERS */}
        <div className="absolute inset-0 z-0 w-full h-full">
          {/* World 1: Sport */}
          <motion.div style={{ opacity: imgOp1, scale: scale1 }} className="absolute inset-0 origin-center will-change-transform">
            <Image src="/images/games/jamby-atu.jpg" alt="National Sport" fill className="object-cover opacity-30" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            <div className="absolute inset-0 bg-gold/5" />
          </motion.div>

          {/* World 2: Tradition */}
          <motion.div style={{ opacity: imgOp2, scale: scale2 }} className="absolute inset-0 origin-center will-change-transform">
            <Image src="/images/games/kelin-shai.jpg" alt="National Tradition" fill className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            <div className="absolute inset-0 bg-[#8B4513]/10" />
          </motion.div>

          {/* World 3: Steppe */}
          <motion.div style={{ opacity: imgOp3, scale: scale3 }} className="absolute inset-0 origin-center will-change-transform">
            <Image src="/images/games/togyzqumalak.jpg" alt="The Great Steppe" fill className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            <div className="absolute inset-0 bg-[#0F172A]/20" />
          </motion.div>
        </div>

        {/* CONTENT LAYER */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center h-full">
          
          <div className="w-full md:w-1/2 h-full flex items-center relative">
            {/* World 1 Content */}
            <motion.div style={{ opacity: op1 }} className="absolute w-full">
              <KazakhOrnament variant="geometric" animate="draw" className="w-16 h-16 text-gold mb-8 opacity-80" />
              <h2 className="font-display text-5xl md:text-8xl font-bold mb-6 text-foreground drop-shadow-xl uppercase">РўВ°Р вЂєР СћР СћР В«РўС™ Р РЋР СџР С›Р В Р Сћ</h2>
              <div className="w-12 h-1 bg-gold mb-6" />
              <p className="text-text-muted text-lg md:text-2xl max-w-lg font-heading tracking-widest leading-relaxed uppercase">
                Р СљР ВµРЎвЂљР С”Р С•РЎРѓРЎвЂљРЎРЉ, РЎРѓР С‘Р В»Р В° Р С‘ Р Р†РЎвЂ№Р Т‘Р ВµРЎР‚Р В¶Р С”Р В°. Р С›РЎвЂ°РЎС“РЎвЂљР С‘РЎвЂљР Вµ Р Т‘РЎС“РЎвЂ¦ РЎРѓР С•РЎР‚Р ВµР Р†Р Р…Р С•Р Р†Р В°Р Р…Р С‘Р в„–, Р С—Р ВµРЎР‚Р ВµР Т‘Р В°Р Р†Р В°Р ВµР СРЎвЂ№Р в„– Р С‘Р В· Р С—Р С•Р С”Р С•Р В»Р ВµР Р…Р С‘РЎРЏ Р Р† Р С—Р С•Р С”Р С•Р В»Р ВµР Р…Р С‘Р Вµ.
              </p>
              <div className="mt-12 text-gold/60 font-heading font-bold text-sm tracking-[0.3em] uppercase">Р С’РЎРѓРЎвЂ№РўвЂє Р В°РЎвЂљРЎС“ РІР‚Сћ Р вЂ“Р В°Р СР В±РЎвЂ№ Р В°РЎвЂљРЎС“ РІР‚Сћ РўС™РўВ±РЎРѓР В±Р ВµР С–РЎвЂ“Р В»РЎвЂ“Р С”</div>
            </motion.div>

            {/* World 2 Content */}
            <motion.div style={{ opacity: op2 }} className="absolute w-full pointer-events-none">
              <KazakhOrnament variant="tumar" animate="draw" className="w-16 h-16 text-gold mb-8 opacity-80" />
              <h2 className="font-display text-5xl md:text-8xl font-bold mb-6 text-foreground drop-shadow-xl uppercase">РўВ°Р вЂєР СћР СћР В«РўС™ Р вЂќРЈВР РЋР СћРўВ®Р В </h2>
              <div className="w-12 h-1 bg-gold mb-6" />
              <p className="text-text-muted text-lg md:text-2xl max-w-lg font-heading tracking-widest leading-relaxed uppercase">
                Р вЂњР С•РЎРѓРЎвЂљР ВµР С—РЎР‚Р С‘Р С‘Р СРЎРѓРЎвЂљР Р†Р С• Р С‘ РЎС“Р Р†Р В°Р В¶Р ВµР Р…Р С‘Р Вµ. Р вЂ“Р С‘Р Р†Р В°РЎРЏ РЎРЊРЎвЂљР С‘Р С”Р В°, Р С”Р С•РЎвЂљР С•РЎР‚Р В°РЎРЏ РЎвЂћР С•РЎР‚Р СР С‘РЎР‚РЎС“Р ВµРЎвЂљ РЎРѓР Р†РЎРЏР В·РЎРЉ Р СР ВµР В¶Р Т‘РЎС“ Р В»РЎР‹Р Т‘РЎРЉР СР С‘.
              </p>
              <div className="mt-12 text-gold/60 font-heading font-bold text-sm tracking-[0.3em] uppercase">Р С™Р ВµР В»РЎвЂ“Р Р… РЎв‚¬Р В°Р в„–</div>
            </motion.div>

            {/* World 3 Content */}
            <motion.div style={{ opacity: op3 }} className="absolute w-full pointer-events-none">
              <KazakhOrnament variant="su" animate="draw" className="w-16 h-16 text-gold mb-8 opacity-80" />
              <h2 className="font-display text-5xl md:text-8xl font-bold mb-6 text-foreground drop-shadow-xl uppercase">РўВ°Р вЂєР В« Р вЂќР С’Р вЂєР С’</h2>
              <div className="w-12 h-1 bg-gold mb-6" />
              <p className="text-text-muted text-lg md:text-2xl max-w-lg font-heading tracking-widest leading-relaxed uppercase">
                Р РЋРЎвЂљРЎР‚Р В°РЎвЂљР ВµР С–Р С‘РЎРЏ Р С‘ Р С‘Р Р…РЎвЂљР ВµР В»Р В»Р ВµР С”РЎвЂљ. Р ВР Р…РЎвЂљР ВµР В»Р В»Р ВµР С”РЎвЂљРЎС“Р В°Р В»РЎРЉР Р…РЎвЂ№Р Вµ Р В±Р С‘РЎвЂљР Р†РЎвЂ№, РЎвЂљРЎР‚Р ВµР В±РЎС“РЎР‹РЎвЂ°Р С‘Р Вµ Р С–Р В»РЎС“Р В±Р С•Р С”Р С•Р С–Р С• Р СРЎвЂ№РЎв‚¬Р В»Р ВµР Р…Р С‘РЎРЏ.
              </p>
              <div className="mt-12 text-gold/60 font-heading font-bold text-sm tracking-[0.3em] uppercase">Р СћР С•РўвЂњРЎвЂ№Р В·РўвЂєРўВ±Р СР В°Р В»Р В°РўвЂє</div>
            </motion.div>
          </div>

        </div>
        
        {/* Section Global Title */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-40 hidden md:block">
          <div 
            className="text-sand font-display text-[150px] font-bold uppercase tracking-tighter opacity-10 leading-none select-none pointer-events-none"
            style={{ writingMode: 'vertical-rl' }}
          >
            РўВ®Р РЃ РЈВР вЂєР вЂўР Сљ
          </div>
        </div>

      </div>
    </div>
  )
}


