import React from 'react'
import { cn } from '@/lib/utils'
import { KazakhOrnament } from './KazakhOrnament'

interface OrnamentFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'gold' | 'subtle'
}

export function OrnamentFrame({ children, variant = 'gold', className, ...props }: OrnamentFrameProps) {
  const borderColor = variant === 'gold' ? 'border-gold/30' : 'border-border/20'
  const cornerColor = variant === 'gold' ? 'text-gold' : 'text-primary-muted'
  
  return (
    <div className={cn("relative p-6 border", borderColor, className)} {...props}>
      {/* Top Left Corner */}
      <div className={cn("absolute -top-3 -left-3 bg-background p-1", cornerColor)}>
        <KazakhOrnament variant="geometric" level="standard" className="w-4 h-4" />
      </div>
      {/* Top Right Corner */}
      <div className={cn("absolute -top-3 -right-3 bg-background p-1", cornerColor)}>
        <KazakhOrnament variant="geometric" level="standard" className="w-4 h-4" />
      </div>
      {/* Bottom Left Corner */}
      <div className={cn("absolute -bottom-3 -left-3 bg-background p-1", cornerColor)}>
        <KazakhOrnament variant="geometric" level="standard" className="w-4 h-4" />
      </div>
      {/* Bottom Right Corner */}
      <div className={cn("absolute -bottom-3 -right-3 bg-background p-1", cornerColor)}>
        <KazakhOrnament variant="geometric" level="standard" className="w-4 h-4" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
