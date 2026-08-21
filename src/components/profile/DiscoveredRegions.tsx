'use client'

import { REGIONS } from '@/lib/data/regions'
import { MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useDiscoveredRegions } from '@/lib/useDiscoveredRegions'

export function DiscoveredRegions() {
  const discoveredIds = useDiscoveredRegions()

  const discoveredRegions = discoveredIds.map(id => REGIONS[id]).filter(Boolean)

  return (
    <div className="mt-8 bg-card border rounded-3xl p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> Исследованные регионы
        </h3>
        <Link href="/map" className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1 hover:underline">
          Открыть карту <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {discoveredRegions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discoveredRegions.map(region => (
            <div key={region.id} className="flex items-start gap-4 p-4 rounded-xl border bg-secondary/20">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold uppercase tracking-wider text-sm">{region.name}</h4>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{region.nameEn}</div>
                {region.games.length > 0 ? (
                  <div className="text-xs font-semibold text-primary">Игр найдено: {region.games.length}</div>
                ) : (
                  <div className="text-xs text-muted-foreground">Традиции изучены</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-muted/50 rounded-xl border border-dashed">
          <p className="text-muted-foreground font-medium mb-4">Вы еще не исследовали ни одного региона на карте.</p>
          <Link href="/map" className="px-6 py-2 bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-colors inline-block">
            Начать путешествие
          </Link>
        </div>
      )}
    </div>
  )
}
