'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Preload, useProgress } from '@react-three/drei'
import { usePerformanceStore } from '../engine/PerformanceManager'
import { PhysicsAdapter } from '../systems/PhysicsAdapter'

interface ThreeGameCanvasProps {
  children: React.ReactNode
  physicsEnabled?: boolean
  debugPhysics?: boolean
}

function Loader() {
  const { progress } = useProgress()
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xl font-bold font-mono">Жүктелуде... {Math.round(progress)}%</p>
      {progress === 100 && <p className="text-sm text-muted-foreground mt-2">Дайын!</p>}
    </div>
  )
}

export function ThreeGameCanvas({ children, physicsEnabled = false, debugPhysics = false }: ThreeGameCanvasProps) {
  const quality = usePerformanceStore((state) => state.quality)
  const dpr = quality === 'ULTRA' ? [1, 2] : quality === 'HIGH' ? [1, 1.5] : [1, 1]

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <Suspense fallback={<Loader />}>
        <Canvas
          shadows={quality !== 'LOW'}
          dpr={dpr as [number, number]}
          camera={{ position: [0, 5, 10], fov: 45 }}
          gl={{ antialias: quality !== 'LOW', powerPreference: 'high-performance' }}
        >
          {physicsEnabled ? (
            <PhysicsAdapter debug={debugPhysics}>
              {children}
            </PhysicsAdapter>
          ) : (
            children
          )}
          
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  )
}
