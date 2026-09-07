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
  icon?: string
}

const NAV_ITEMS: NavItem[] = [
  { href: '/games', label: 'ОЙЫНДАР', icon: '🎮' },
  { href: '/map', label: 'ҚАЗАҚСТАН', icon: '🗺️' },
  { href: '/culture', label: 'МҰРА', icon: '📜' },
  { href: '/kyzylorda-museum', label: 'ҚЫЗЫЛОРДА', icon: '🏛️' },
  { href: '/showcase', label: 'КӨРМЕ', icon: '🖼️' },
  { href: '/championship', label: 'ЧЕМПИОНАТ', icon: '🏆' },
]

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll when open
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
      {/* Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Навигация мәзірін ашу"
        className="relative z-50 p-2.5 rounded-xl border border-gold/30 bg-background/80 text-foreground hover:text-gold transition-colors focus:outline-none shadow-md flex items-center justify-center"
      >
        <div className="w-6 h-5 relative flex flex-col justify-between items-center">
          <motion.span
            animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-gold rounded-full block origin-center transition-transform"
          />
          <motion.span
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-gold rounded-full block transition-opacity"
          />
          <motion.span
            animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-gold rounded-full block origin-center transition-transform"
          />
        </div>
      </button>

      {/* Mobile Drawer Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl flex flex-col justify-between p-6 pt-24 overflow-y-auto"
          >
            {/* Background Kazakh Ornament Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
              <KazakhOrnament variant="qoshqar-muiiz" animate="spin" className="w-[500px] h-[500px] text-gold" />
            </div>

            {/* Header branding */}
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 pb-6 border-b border-gold/20">
                <ShanyraqMark size="sm" className="text-gold" />
                <span className="font-display text-xl tracking-widest text-foreground uppercase">
                  ULY DALA
                </span>
                <span className="ml-auto text-xs font-mono text-gold/70 border border-gold/30 px-2.5 py-0.5 rounded-full">
                  МӘЗІР
                </span>
              </div>

              {/* Navigation Links Grid */}
              <nav className="flex flex-col gap-3">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 + 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 font-heading text-sm uppercase tracking-wider ${
                          isActive
                            ? 'border-gold bg-gold/15 text-gold shadow-[0_0_20px_rgba(212,175,55,0.15)] font-bold'
                            : 'border-border/30 text-foreground/80 hover:text-foreground hover:border-gold/40 hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        <span className="text-xs text-gold/60">→</span>
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
            </div>

            {/* Footer metadata in menu */}
            <div className="relative z-10 pt-8 border-t border-gold/15 text-center space-y-2 text-xs font-serif text-foreground/60">
              <div className="font-mono text-[10px] text-gold uppercase tracking-widest">
                ✨ ҰЛЫ ДАЛА МӘДЕНИ МҰРАСЫ
              </div>
              <p>Қазақстанның ұлттық ойындары мен тарихы</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
