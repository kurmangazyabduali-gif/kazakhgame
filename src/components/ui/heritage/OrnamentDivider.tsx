import React from 'react'
import { cn } from '@/lib/utils'
import { KazakhOrnament } from './KazakhOrnament'

interface OrnamentDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 'subtle' | 'standard'
}

export function OrnamentDivider({ level = 'standard', className, ...props }: OrnamentDividerProps) {
  return (
    <div 
      className={cn("flex items-center justify-center w-full my-8", className)} 
      {...props}
    >
      <div className={cn("flex-1 h-[1px]", level === 'subtle' ? 'bg-border/30' : 'bg-gold/20')} />
      <div className="mx-4 text-gold flex gap-2">
        <KazakhOrnament variant="geometric" level={level} className="w-4 h-4" />
        <KazakhOrnament variant="geometric" level={level} className="w-4 h-4" />
        <KazakhOrnament variant="geometric" level={level} className="w-4 h-4" />
      </div>
      <div className={cn("flex-1 h-[1px]", level === 'subtle' ? 'bg-border/30' : 'bg-gold/20')} />
    </div>
  )
}
