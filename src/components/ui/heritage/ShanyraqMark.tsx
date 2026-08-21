import React from 'react'
import { cn } from '@/lib/utils'

interface ShanyraqMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  spinning?: boolean
}

export function ShanyraqMark({ 
  size = 'md', 
  spinning = false,
  className,
  ...props 
}: ShanyraqMarkProps) {
  
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-48 h-48'
  }

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "text-gold",
        sizeMap[size],
        spinning && "animate-[spin_10s_linear_infinite]",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      
      {/* Crossbars (Uuyk/Tundyq abstraction) */}
      <path d="M 20 20 L 80 80 M 20 80 L 80 20" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
      <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      
      {/* Inner Ring */}
      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.9" />
    </svg>
  )
}
