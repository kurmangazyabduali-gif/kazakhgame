import React from 'react'
import { cn } from '@/lib/utils'

interface CulturalBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'terracotta' | 'navy' | 'ghost'
  children: React.ReactNode
  icon?: React.ReactNode
}

export function CulturalBadge({ 
  variant = 'gold', 
  children,
  icon,
  className,
  ...props 
}: CulturalBadgeProps) {
  
  const variantMap = {
    gold: 'bg-gold/10 text-gold border-gold/20',
    terracotta: 'bg-terracotta/10 text-terracotta border-terracotta/20',
    navy: 'bg-primary/10 text-primary border-primary/20 dark:text-primary-foreground',
    ghost: 'bg-transparent text-text-muted border-border/50',
  }

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
        variantMap[variant],
        className
      )} 
      {...props}
    >
      {icon && <span className="opacity-70">{icon}</span>}
      {children}
    </span>
  )
}
