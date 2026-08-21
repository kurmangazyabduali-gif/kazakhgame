import React from 'react'
import { cn } from '@/lib/utils'
import { KazakhOrnament } from '../ui/heritage/KazakhOrnament'

interface ProgressCardProps {
  title: string
  value: string | number
  label?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function ProgressCard({
  title,
  value,
  label,
  icon,
  className
}: ProgressCardProps) {
  return (
    <div className={cn("relative overflow-hidden bg-surface hover:bg-surface-elevated transition-colors duration-500 border border-gold/10 hover:border-gold/30 rounded-3xl p-6 shadow-sm hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] group", className)}>
      <div className="absolute right-0 top-0 opacity-5 text-gold pointer-events-none transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
        <KazakhOrnament variant="qoshqar-muiiz" className="w-40 h-40" />
      </div>
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        {icon && (
          <div className="w-12 h-12 rounded-xl border border-gold/20 bg-background text-gold flex items-center justify-center shadow-inner group-hover:bg-gold/10 transition-colors">
            {icon}
          </div>
        )}
        <h4 className="font-heading font-bold text-text-muted uppercase tracking-widest text-xs">{title}</h4>
      </div>
      
      <div className="relative z-10 flex flex-col items-start">
        <div className="font-display font-bold text-5xl text-foreground mb-1 drop-shadow-sm">{value}</div>
        {label && <div className="text-xs font-heading tracking-widest text-gold uppercase mt-2">{label}</div>}
      </div>
    </div>
  )
}
