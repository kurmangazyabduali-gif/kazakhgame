'use client'

import { Sky, ContactShadows, Environment as DreiEnvironment } from '@react-three/drei'
import { usePerformanceStore } from '../engine/PerformanceManager'

interface EnvironmentProps {
  preset?: 'city' | 'park' | 'sunset' | 'dawn' | 'forest'
  showSky?: boolean
  sunPosition?: [number, number, number]
  groundColor?: string
}

export function Environment({ 
  preset = 'sunset', 
  showSky = true,
  sunPosition = [10, 20, 10],
  groundColor = '#a89f91' // Steppe dust color
}: EnvironmentProps) {
  const quality = usePerformanceStore(s => s.quality)
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={sunPosition} 
        intensity={1.5} 
        castShadow={quality !== 'LOW'}
        shadow-mapSize-width={quality === 'ULTRA' ? 2048 : 1024}
        shadow-mapSize-height={quality === 'ULTRA' ? 2048 : 1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {showSky && (
        <Sky 
          distance={450000} 
          sunPosition={sunPosition} 
          inclination={0} 
          azimuth={0.25} 
          mieCoefficient={0.005} 
          mieDirectionalG={0.8}
        />
      )}
      
      <DreiEnvironment preset={preset} />
      
      {quality !== 'LOW' && (
        <ContactShadows 
          resolution={1024} 
          scale={50} 
          blur={2} 
          opacity={0.5} 
          far={10} 
          color="#000000" 
        />
      )}

      {/* Fog for atmospheric depth */}
      <fog attach="fog" args={[groundColor, 10, 100]} />
    </>
  )
}
