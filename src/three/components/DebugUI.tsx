'use client'

import { Stats } from '@react-three/drei'
import { usePerformanceStore } from '../engine/PerformanceManager'

export function DebugUI() {
  const quality = usePerformanceStore(s => s.quality)
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      <Stats className="absolute top-0 left-0 z-50" />
      <div className="absolute bottom-4 left-4 z-50 bg-black/80 text-white text-xs font-mono p-3 rounded-lg pointer-events-none">
        <h4 className="font-bold text-primary mb-2 uppercase">3D Engine Debug</h4>
        <div>Quality: {quality}</div>
        <div className="text-muted-foreground mt-2">
          (Stats UI shown at top left)
        </div>
      </div>
    </>
  )
}
