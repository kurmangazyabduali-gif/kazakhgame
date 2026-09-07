'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'
import { ShanyraqMark } from '../ui/heritage/ShanyraqMark'

interface NavItem {
  href: string
  label: string
  icon: string
  desc: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/games', label: 'ОЙЫНДАР', icon: '🎮', desc: 'Ұлттық дала ойындары мен турнирлер' },
  { href: '/map', label: 'ҚАЗАҚСТАН', icon: '🗺️', desc: 'Интерактивный 3D картасы' },
  { href: '/culture', label: 'МҰРА', icon: '📜', desc: 'Дәстүрлі киелі мұралар мен тарих' },
  { href: '/kyzylorda-museum', label: 'ҚЫЗЫЛОРДА', icon: '🏛️', desc: 'Сыр өңірінің виртуалды мұражайы' },
  { href: '/showcase', label: 'КӨРМЕ', icon: '🖼️', desc: 'Цифрлық мәдени көрме галереясы' },
  { href: '/championship', label: 'ЧЕМПИОНАТ', icon: '🏆', desc: 'Ұлттық лига турнирлер рейтингі' },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      {/* Navbar Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Навигация мәзірін ашу"
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 transition-all text-xs font-heading uppercase tracking-widest"
      >
        <span className="text-base">☰</span>
        <span>МӘЗІР</span>
      </button>

      {/* Fullpage Menu Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[999] w-screen h-[100dvh] bg-background/98 backdrop-blur-3xl flex flex-col justify-between p-6 overflow-y-auto"
          >
            {/* Background Kazakh Ornament Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
              <KazakhOrnament variant="qoshqar-muiiz" animate="spin" className="w-[600px] h-[600px] text-gold" />
            </div>

            {/* Top Bar inside Fullscreen Menu */}
            <div className="relative z-10 flex items-center justify-between pb-6 border-b border-gold/20">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                <ShanyraqMark size="sm" className="text-gold" />
                <span className="font-display text-2xl tracking-widest text-foreground uppercase">
                  ULY DALA
                </span>
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 bg-gold/15 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold/25 transition-all"
              >
                <span>✕</span> ЖАБУ
              </button>
            </div>

            {/* Main Navigation Links List */}
            <div className="relative z-10 py-6 my-auto space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/70 mb-4 px-1">
                ✦ БАҒЫТТАР (PAGES NAVIGATION)
              </div>

              <div className="grid grid-cols-1 gap-3">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 + 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                          isActive
                            ? 'border-gold bg-gold/15 text-gold shadow-[0_0_25px_rgba(212,175,55,0.2)] font-bold'
                            : 'border-border/30 bg-card/40 text-foreground/90 hover:border-gold/50 hover:bg-gold/5'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-xl shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <div className="font-heading text-base uppercase tracking-wider">
                              {item.label}
                            </div>
                            <div className="text-[11px] font-serif text-muted-foreground line-clamp-1">
                              {item.desc}
                            </div>
                          </div>
                        </div>

                        <div className="text-gold text-lg font-bold pl-2">→</div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Footer Details */}
            <div className="relative z-10 pt-6 border-t border-gold/20 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] font-mono tracking-widest uppercase">
                <span>✨</span> ҰЛТТЫҚ ДӘСТҮР МҮЛКІ
              </div>
              <p className="text-xs font-serif text-muted-foreground">
                © {new Date().getFullYear()} ULY DALA. Барлық құқықтар қорғалған.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
