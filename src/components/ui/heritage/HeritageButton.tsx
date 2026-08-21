import React from 'react'
import { cn } from '@/lib/utils'

interface HeritageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'cultural'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  children: React.ReactNode
}

export const HeritageButton = React.forwardRef<HTMLButtonElement, HeritageButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    
    const sizeMap = {
      sm: "h-9 px-4 text-xs rounded-md",
      md: "h-11 px-6 text-sm rounded-md",
      lg: "h-14 px-8 text-base rounded-lg",
      icon: "h-10 w-10 rounded-md",
    }

    const variantMap = {
      primary: "bg-primary text-primary-foreground hover:bg-primary-muted hover:shadow-[0_0_20px_-5px_var(--color-primary)]",
      secondary: "bg-surface-elevated text-foreground border border-border hover:bg-surface hover:text-gold",
      ghost: "hover:bg-surface-elevated hover:text-foreground text-text-muted",
      gold: "bg-gold text-primary hover:bg-gold-muted hover:shadow-[0_0_20px_-5px_var(--color-gold)]",
      cultural: "bg-transparent border border-gold/50 text-gold hover:bg-gold/10 hover:border-gold",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeMap[size], variantMap[variant], className)}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        
        {/* Subtle hover effect (ornament reveal or glow) */}
        {(variant === 'primary' || variant === 'gold' || variant === 'cultural') && (
          <span className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0, transparent 50%)' }} />
        )}
      </button>
    )
  }
)
HeritageButton.displayName = "HeritageButton"
