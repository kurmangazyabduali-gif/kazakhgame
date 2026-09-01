'use client'

import { useMemo, useState } from 'react'
import { useGuestProgress } from '@/lib/useGuestProgress'
import { MaterialSurface } from '@/components/ui/heritage/MaterialSurface'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'
import { OrnamentDivider } from '@/components/ui/heritage/OrnamentDivider'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function GamesLibraryPage() {
  const progress = useGuestProgress()
  const [activeCategory, setActiveCategory] = useState('ALL')

  const bestScores = useMemo(() => {
    const history = progress?.gameHistory || []
    const scores: Record<string, number> = {}
    history.forEach((session) => {
      if (!scores[session.gameId] || session.score > scores[session.gameId]) {
        scores[session.gameId] = session.score
      }
    })
    return scores
  }, [progress])

  const allGames = [
    { 
      slug: 'hantalapay', 
      name: 'Ханталапай', 
      category: 'Дәстүр', 
      description: 'Асықтарды шашып, Ханды бірінші болып іліп кет! Реакция мен шапшаңдыққа құрылған ұлттық ойын.', 
      difficulty: 'Орташа (Medium)',
      players: '1',
      duration: '3-5 мин',
      image: '/images/games/asyk-atu.jpg',
      status: (bestScores['hantalapay'] !== undefined ? 'completed' : 'available')
    },
    { 
      slug: 'asyk-atu', 
      name: 'Асық ату', 
      category: 'Спорт', 
      description: 'Традиционная игра кочевников. Выбивайте асыки точными бросками, развивая глазомер и стратегию.', 
      difficulty: 'Орташа (Medium)',
      players: '1',
      duration: '5-10 мин',
      image: '/images/games/asyk-atu.jpg',
      status: (bestScores['asyk-atu'] !== undefined ? 'completed' : 'available')
    },
    { 
      slug: 'togyz-kumalak', 
      name: 'Тоғызқұмалақ', 
      category: 'Стратегия', 
      description: '«Алгебра чабанов». Интеллектуальная настольная игра, требующая сложного математического расчета.', 
      difficulty: 'Қиын (Hard)',
      players: '1 vs AI',
      duration: '10-20 мин',
      image: '/images/games/togyzqumalak.jpg',
      status: (bestScores['togyz-kumalak'] !== undefined ? 'completed' : 'available')
    },
    { 
      slug: 'zhamby-atu', 
      name: 'Жамбы ату', 
      category: 'Спорт', 
      description: 'Искусство стрельбы из лука на скаку. Продемонстрируйте превосходную реакцию.', 
      difficulty: 'Қиын (Hard)',
      players: '1',
      duration: '5 мин',
      image: '/images/games/jamby-atu.jpg',
      status: (bestScores['zhamby-atu'] !== undefined ? 'completed' : 'available')
    },
    { 
      slug: 'arqan-tartys', 
      name: 'Арқан тартыс', 
      category: 'Спорт', 
      description: 'Күш пен ырғаққа құрылған дәстүрлі арқан тартыс ойыны. Командалық рухты сезініңіз.', 
      difficulty: 'Орташа (Medium)',
      players: 'Командалық',
      duration: '5-10 мин',
      image: '/images/games/arqan-tartys-bg.jpg',
      status: (bestScores['arqan-tartys'] !== undefined ? 'completed' : 'available')
    },
    { 
      slug: 'qol-kures', 
      name: 'Қол күрес', 
      category: 'Спорт', 
      description: 'Күш, шыдамдылық пен дұрыс тактикаға негізделген дәстүрлі қол күрес белдесуі.', 
      difficulty: 'Орташа (Medium)',
      players: '1 vs AI',
      duration: '3-5 мин',
      image: '/images/games/qol-kures.jpg',
      status: (bestScores['qol-kures'] !== undefined ? 'completed' : 'available')
    }
  ]

  const categories = ['ALL', 'Спорт', 'Дәстүр', 'Стратегия']
  
  const filteredGames = activeCategory === 'ALL' 
    ? allGames 
    : allGames.filter(g => g.category.toLowerCase() === activeCategory.toLowerCase())

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      
      {/* Header Area */}
      <MaterialSurface material="nightSky" className="py-24 border-b border-border/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
           <KazakhOrnament variant="qoshqar-muiiz" animate="spin" className="w-[800px] h-[800px] text-gold" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-mono tracking-widest uppercase mb-6"
          >
            <span>✨</span> ҰЛТТЫҚ ОЙЫНДАР КИЕЛІ МҰРАСЫ
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-5xl md:text-7xl text-foreground uppercase tracking-wider mb-6"
          >
            ОЙЫНДАР КАТАЛОГЫ
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto font-light"
          >
            Ғасырлар бойы сұрыпталған дала ойындары. Жылдамдық, логика, күш пен реакцияны дамытуға арналған сандық платформа.
          </motion.p>
        </div>
      </MaterialSurface>

      {/* Filter & Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full font-heading text-sm uppercase tracking-widest transition-all duration-300 relative border ${
                activeCategory === cat
                  ? 'border-gold text-gold bg-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                  : 'border-border/40 text-foreground/60 hover:text-foreground hover:border-border'
              }`}
            >
              {cat === 'ALL' ? 'БАРЛЫҚ ОЙЫНДАР' : cat}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, idx) => (
              <motion.div
                key={game.slug}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link href={`/games/${game.slug}`} className="block h-full group">
                  <MaterialSurface 
                    material="felt" 
                    className="h-full border border-border/20 group-hover:border-gold/50 transition-all duration-500 rounded-2xl overflow-hidden flex flex-col justify-between group-hover:-translate-y-2 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                  >
                    <div>
                      {/* Card Image Banner */}
                      <div className="relative h-48 w-full overflow-hidden bg-muted/20">
                        <Image 
                          src={game.image} 
                          alt={game.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md border border-gold/30 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-gold">
                          {game.category}
                        </div>

                        {/* Status Badge */}
                        {game.status === 'completed' && (
                          <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                            <span>✓</span> ОЙНАЛДЫ
                          </div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <h3 className="font-display text-2xl text-foreground uppercase tracking-wider group-hover:text-gold transition-colors duration-300 mb-2">
                          {game.name}
                        </h3>
                        <p className="font-serif text-sm text-foreground/70 line-clamp-2 leading-relaxed mb-6">
                          {game.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Info */}
                    <div className="px-6 pb-6 pt-4 border-t border-border/10 flex items-center justify-between text-xs font-mono text-foreground/50">
                      <div>Сложность: <span className="text-foreground/80">{game.difficulty}</span></div>
                      <div className="text-gold group-hover:translate-x-1 transition-transform duration-300">
                        ОЙНАУ →
                      </div>
                    </div>
                  </MaterialSurface>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <OrnamentDivider variant="standard" className="my-20 opacity-30" />
      </div>
    </div>
  )
}
