'use client'

import { useCallback, useMemo, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { KazakhstanMap } from '@/components/map/KazakhstanMap'
import { RegionPanel } from '@/components/map/RegionPanel'
import { REGIONS } from '@/lib/data/regions'
import { MaterialSurface } from '@/components/ui/heritage/MaterialSurface'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'
import { MapPin } from 'lucide-react'
import { discoverRegion, useDiscoveredRegions } from '@/lib/useDiscoveredRegions'

function MapPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)
  const discoveredRegions = useDiscoveredRegions()

  const urlRegionId = useMemo(() => {
    const regionParam = searchParams.get('region')
    const gameParam = searchParams.get('game')

    if (regionParam && REGIONS[regionParam]) {
      return regionParam
    }

    if (gameParam) {
      return Object.keys(REGIONS).find(k => REGIONS[k].games.includes(gameParam)) ?? null
    }

    return null
  }, [searchParams])

  const handleRegionSelect = useCallback((id: string) => {
    setSelectedRegionId(id)
    
    // Track discovery
    discoverRegion(id)

    // Update URL without full refresh
    router.replace(`/map?region=${id}`, { scroll: false })
  }, [router])

  const activeRegionId = selectedRegionId ?? urlRegionId
  const selectedRegion = activeRegionId ? REGIONS[activeRegionId] : null

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-primary flex flex-col relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
        <KazakhOrnament variant="qoshqar-muiiz" className="w-[600px] h-[600px] text-gold" />
      </div>
      
      <div className="absolute bottom-0 left-0 opacity-5 pointer-events-none transform -translate-x-1/4 translate-y-1/4">
        <KazakhOrnament variant="tumar" className="w-[800px] h-[800px] text-gold" />
      </div>

      <div className="w-full max-w-[1920px] mx-auto p-6 md:p-8 flex flex-col flex-1 relative z-10">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
             <MapPin className="w-8 h-8 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight text-foreground">
              Культурная Карта
            </h1>
            <p className="font-heading text-gold tracking-widest uppercase text-sm md:text-base mt-2">
              Интерактивное путешествие по регионам Казахстана.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Map Area */}
          <MaterialSurface 
            material="nightSky" 
            className="flex-[3] lg:min-h-[600px] rounded-3xl border border-gold/20 flex items-center justify-center p-4 lg:p-12 relative overflow-hidden shadow-2xl"
          >
            <KazakhstanMap 
              selectedRegionId={activeRegionId}
              discoveredRegions={discoveredRegions}
              onRegionSelect={handleRegionSelect}
            />
          </MaterialSurface>

          {/* Info Panel */}
          <div className="flex-[2] lg:max-w-lg w-full">
            <RegionPanel region={selectedRegion} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold uppercase tracking-widest text-gold animate-pulse">Загрузка карты...</div>}>
      <MapPageContent />
    </Suspense>
  )
}
