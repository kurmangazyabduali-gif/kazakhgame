import React from 'react'
import { cn } from '@/lib/utils'

interface RegionMarkerProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean
  label: string
}

export function RegionMarker({ active = false, label, className, ...props }: RegionMarkerProps) {
  return (
    <button
      className={cn(
        "group relative flex items-center justify-center focus:outline-none",
        className
      )}
      {...props}
    >
      {/* Outer Pulse */}
      {active && (
        <span className="absolute w-12 h-12 bg-gold/20 rounded-full animate-ping opacity-75" />
      )}
      
      {/* Marker core */}
      <span className={cn(
        "relative z-10 w-4 h-4 rounded-full transition-all duration-300",
        active ? "bg-gold scale-125 shadow-lg shadow-gold/80" : "bg-gold/50 group-hover:bg-gold/80"
      )} />
      
      {/* Label tooltip */}
      <span className={cn(
        "absolute top-full mt-2 px-2 py-1 rounded bg-surface border border-gold/30 text-xs font-bold whitespace-nowrap text-gold uppercase tracking-wider transition-all duration-300 pointer-events-none",
        active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
      )}>
        {label}
      </span>
    </button>
  )
}
