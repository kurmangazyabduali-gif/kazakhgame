'use client'

import { useCallback, useMemo, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Spectral, Golos_Text } from 'next/font/google'
import { KazakhstanMap } from '@/components/map/KazakhstanMap'
import { RegionPanel } from '@/components/map/RegionPanel'
import { REGIONS } from '@/lib/data/regions'
import { KazakhOrnament } from '@/components/ui/heritage/KazakhOrnament'
import { MapPin } from 'lucide-react'
import { discoverRegion, useDiscoveredRegions } from '@/lib/useDiscoveredRegions'

const spectral = Spectral({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const golos = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
})

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
    <div className={`${spectral.className} ${golos.className} uly-home w-full min-h-[calc(100vh-80px)] bg-[#FBF9F3] text-[#211C15] flex flex-col relative overflow-hidden home-grain`}>
      {/* Background Ambience / Dotgrid */}
      <div className="absolute inset-0 pointer-events-none home-dotgrid opacity-75 z-0" />
      
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 opacity-[0.04] pointer-events-none transform translate-x-1/4 -translate-y-1/4">
        <KazakhOrnament variant="qoshqar-muiiz" className="w-[600px] h-[600px] text-[var(--home-saffron)]" />
      </div>
      
      <div className="absolute bottom-0 left-0 opacity-[0.03] pointer-events-none transform -translate-x-1/4 translate-y-1/4">
        <KazakhOrnament variant="tumar" className="w-[800px] h-[800px] text-[var(--home-saffron)]" />
      </div>

      <div className="w-full max-w-[1920px] mx-auto p-6 md:p-8 flex flex-col flex-1 relative z-10">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left flex items-center justify-center md:justify-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--home-saffron-soft)] border border-[rgba(33,28,21,0.1)] flex items-center justify-center shrink-0">
             <MapPin className="w-8 h-8 text-[var(--home-saffron)]" />
          </div>
          <div>
            <h1 className="font-display-premium text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#211C15]">
              Мәдени Карта
            </h1>
            <p className="font-body-premium text-[var(--home-terracotta)] tracking-widest uppercase text-xs md:text-sm font-bold mt-2">
              Қазақстан өңірлері бойынша интерактивті саяхат.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Map Area */}
          <div className="flex-[3] lg:min-h-[600px] rounded-[2rem] border border-[rgba(33,28,21,0.1)] flex items-center justify-center p-4 lg:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(33,28,21,0.05)] bg-white/70 backdrop-blur-md">
            <KazakhstanMap 
              selectedRegionId={activeRegionId}
              discoveredRegions={discoveredRegions}
              onRegionSelect={handleRegionSelect}
            />
          </div>

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
    <Suspense fallback={<div className="p-12 text-center font-bold uppercase tracking-widest text-[var(--home-saffron)] animate-pulse">Загрузка карты...</div>}>
      <MapPageContent />
    </Suspense>
  )
}
