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
      slug: 'kelin-shai', 
      name: 'Келін шай', 
      category: 'Дәстүр', 
      description: 'Познайте искусство гостеприимства. Правильная заварка и подача чая в казахской семье.', 
      difficulty: 'Оңай (Easy)',
      players: '1',
      duration: '3-5 мин',
      image: '/images/games/kelin-shai.jpg',
      status: (bestScores['kelin-shai'] !== undefined ? 'completed' : 'available')
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
      slug: 'jamby-atu', 
      name: 'Жамбы ату', 
      category: 'Спорт', 
      description: 'Искусство стрельбы из лука на скаку. Продемонстрируйте превосходную реакцию.', 
      difficulty: 'Қиын (Hard)',
      players: '1',
      duration: '5 мин',
      image: '/images/games/jamby-atu.jpg',
      status: 'locked'
    },
    { 
      slug: 'kusbegilik', 
      name: 'Құсбегілік', 
      category: 'Дәстүр', 
      description: 'Саятшылық. Управляйте полетом ловчей птицы в бескрайних степях Казахстана.', 
      difficulty: 'Орташа (Medium)',
      players: '1',
      duration: '5-10 мин',
      image: '/images/games/kusbegilik.jpg',
      status: 'locked'
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
          <KazakhOrnament variant="tumar" animate="float" className="w-12 h-12 text-gold mx-auto mb-6 opacity-60" />
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 text-foreground uppercase tracking-widest drop-shadow-lg">
            Ойындар Атласы
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto text-lg font-heading tracking-widest">
            DIGITAL NATIONAL GAMES ATLAS
          </p>
        </div>
      </MaterialSurface>

      <div className="w-full max-w-7xl mx-auto p-6 pt-16 pb-32">
        
        {/* Category Filters */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-16 no-scrollbar justify-center">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full whitespace-nowrap text-sm font-bold uppercase tracking-widest transition-all duration-500 border ${
                activeCategory === cat 
                  ? 'bg-gold text-primary border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                  : 'bg-surface text-text-muted border-border/50 hover:border-gold/50 hover:text-gold hover:shadow-lg'
              }`}
            >
              {cat === 'ALL' ? 'Барлығы' : cat}
            </button>
          ))}
        </div>

        {/* Game Atlas Grid */}
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, i) => (
              <motion.div
                key={game.slug}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <AtlasGameCard 
                  game={game}
                  bestScore={bestScores[game.slug] || 0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <OrnamentDivider level="subtle" className="mt-32" />
      </div>
    </div>
  )
}

interface AtlasGame {
  slug: string
  name: string
  category: string
  description: string
  difficulty: string
  players: string
  duration: string
  image: string
  status: string
}

function AtlasGameCard({ game, bestScore }: { game: AtlasGame, bestScore: number }) {
  const isLocked = game.status === 'locked'
  
  return (
    <Link 
      href={isLocked ? '#' : `/games/info/${game.slug}`} 
      className={`group relative h-[450px] w-full rounded-3xl overflow-hidden block border border-border/20 bg-surface transition-all duration-[800ms] ${isLocked ? 'cursor-not-allowed opacity-80' : 'hover:border-gold/40 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'}`}
    >
      {/* Background Cinematic Image */}
      <div className="absolute inset-0 w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]">
        <Image src={game.image} alt={game.name} fill className={`object-cover mix-blend-luminosity grayscale ${!isLocked && 'group-hover:grayscale-0'} transition-all duration-[1200ms] opacity-40`} />
      </div>
      
      {/* Gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Animated Ornament on Hover */}
      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150">
        <KazakhOrnament variant="geometric" animate="draw" className="w-16 h-16 text-gold" />
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 p-10 flex flex-col justify-end">
        
        {/* Top left category & status badge */}
        <div className="absolute top-8 left-8 flex gap-3">
          <span className="px-4 py-1.5 rounded-full bg-background/50 border border-gold/30 text-gold font-heading text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            {game.category}
          </span>
          {isLocked && (
            <span className="px-4 py-1.5 rounded-full bg-background/50 border border-border/50 text-text-muted font-heading text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              Құлыптаулы
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-5xl font-bold text-foreground mb-4 drop-shadow-md">
          {game.name}
        </h3>
        
        {/* Short description */}
        <p className="text-text-muted text-lg leading-relaxed mb-8 max-w-md">
          {game.description}
        </p>
        
        {/* Metadata section (reveals on hover) */}
        <div className="h-0 overflow-hidden opacity-0 group-hover:h-[80px] group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-border/30">
            <div>
              <span className="block text-[10px] text-text-muted font-heading uppercase tracking-widest mb-1">Сложность</span>
              <span className="block text-sm text-foreground font-bold">{game.difficulty}</span>
            </div>
            <div>
              <span className="block text-[10px] text-text-muted font-heading uppercase tracking-widest mb-1">Игроки</span>
              <span className="block text-sm text-foreground font-bold">{game.players}</span>
            </div>
            <div>
              <span className="block text-[10px] text-text-muted font-heading uppercase tracking-widest mb-1">Время</span>
              <span className="block text-sm text-foreground font-bold">{game.duration}</span>
            </div>
            <div>
              <span className="block text-[10px] text-text-muted font-heading uppercase tracking-widest mb-1">Лучший Счет</span>
              <span className="block text-sm text-gold font-bold">{bestScore > 0 ? bestScore : '—'}</span>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 text-gold font-heading text-sm font-bold uppercase tracking-widest">
            {isLocked ? 'Келесі жаңартуда' : 'Толығырақ'} 
            {!isLocked && <span className="transform translate-x-0 group-hover:translate-x-3 transition-transform duration-500">→</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
