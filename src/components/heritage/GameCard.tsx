import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'
import { CulturalBadge } from '../ui/heritage/CulturalBadge'
import { HeritageButton } from '../ui/heritage/HeritageButton'
import { MaterialSurface } from '../ui/heritage/MaterialSurface'

interface GameCardProps {
  title: string
  category: string
  description: string
  skills: string[]
  gameSlug: string
  visualMotif?: 'asyk-atu' | 'kelin-shai' | 'togyzqumalak' | 'jamby-atu' | 'kusbegilik'
  className?: string
  href?: string
  bestScore?: number
  status?: 'available' | 'completed' | 'locked'
}

export function GameCard({
  title,
  category,
  description,
  skills,
  visualMotif = 'asyk-atu',
  className,
  href,
  bestScore,
  status = 'available'
}: GameCardProps) {
  
  // Custom abstract visual motifs per game based on user requirements
  const getMotif = () => {
    switch(visualMotif) {
      case 'asyk-atu':
        return <div className="absolute -right-8 -top-8 text-terracotta opacity-20"><KazakhOrnament variant="geometric" className="w-48 h-48" /></div>
      case 'kelin-shai':
        return <div className="absolute right-0 top-0 text-gold opacity-10"><KazakhOrnament variant="su" className="w-32 h-32" /></div>
      case 'togyzqumalak':
        return <div className="absolute right-4 bottom-4 text-sand opacity-20"><KazakhOrnament variant="geometric" className="w-24 h-24" /></div>
      case 'jamby-atu':
        return <div className="absolute left-0 top-0 text-primary-muted opacity-30"><KazakhOrnament variant="tumar" className="w-40 h-40 transform -rotate-45" /></div>
      case 'kusbegilik':
        return <div className="absolute right-0 -bottom-8 text-gold opacity-10"><KazakhOrnament variant="su" className="w-48 h-48 transform rotate-180" /></div>
      default:
        return null
    }
  }

  const CardContent = (
    <MaterialSurface 
      material="felt" 
      className={cn(
        "group rounded-2xl border border-border/40 p-6 flex flex-col h-full hover:border-gold/50 hover:shadow-[0_0_30px_-5px_rgba(var(--color-gold),0.2)] transition-all duration-500",
        status === 'locked' && "opacity-50 grayscale",
        className
      )}
    >
      {/* Visual Accent Layer */}
      {getMotif()}
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-6">
        <CulturalBadge variant={status === 'completed' ? 'gold' : 'navy'}>
          {category}
        </CulturalBadge>
        {bestScore !== undefined && bestScore > 0 ? (
           <div className="text-right">
             <div className="text-xs font-bold uppercase text-text-muted">Рекорд</div>
             <div className="font-display font-bold text-xl text-gold">{bestScore} XP</div>
           </div>
        ) : (
          <KazakhOrnament variant="qoshqar-muiiz" level="subtle" className="w-8 h-8 group-hover:text-gold transition-colors duration-500" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        <h3 className="font-display font-bold text-3xl mb-2 text-foreground">{title}</h3>
        <p className="text-text-muted text-sm leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {skills.slice(0,3).map(skill => (
            <span key={skill} className="text-[10px] font-bold uppercase tracking-wider bg-surface-elevated px-2 py-1 rounded text-primary-muted">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 mt-auto pt-4 border-t border-border/30">
        <HeritageButton 
          variant={status === 'completed' ? 'secondary' : 'primary'} 
          className="w-full"
          tabIndex={-1}
        >
          {status === 'completed' ? 'ИГРАТЬ СНОВА' : 'ИГРАТЬ / PLAY'}
        </HeritageButton>
      </div>
    </MaterialSurface>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {CardContent}
      </Link>
    )
  }

  return CardContent
}
