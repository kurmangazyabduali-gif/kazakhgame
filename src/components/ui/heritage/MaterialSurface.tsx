import React from 'react'
import { cn } from '@/lib/utils'
import { designTokens, DesignTokenMaterial } from '@/lib/design-system/tokens'

interface MaterialSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  material?: DesignTokenMaterial | 'none'
  children: React.ReactNode
}

export function MaterialSurface({ 
  material = 'none', 
  className,
  children,
  ...props 
}: MaterialSurfaceProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        material !== 'none' && designTokens.materials[material],
        className
      )} 
      {...props}
    >
      {/* We use a subtle CSS noise texture overlay to simulate materials if CSS gradient isn't enough */}
      {material !== 'none' && material !== 'nightSky' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}
