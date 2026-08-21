'use client'

import { useSyncExternalStore } from 'react'

const DISCOVERED_REGIONS_KEY = 'uly_dala_discovered_regions'
const DISCOVERED_REGIONS_EVENT = 'uly-dala:discovered-regions-changed'
const EMPTY_REGIONS: string[] = []

let cachedRaw: string | null = null
let cachedRegions: string[] = EMPTY_REGIONS

function readDiscoveredRegions(): string[] {
  if (typeof window === 'undefined') return EMPTY_REGIONS

  const saved = localStorage.getItem(DISCOVERED_REGIONS_KEY)
  if (saved === cachedRaw) return cachedRegions

  cachedRaw = saved
  if (!saved) {
    cachedRegions = EMPTY_REGIONS
    return cachedRegions
  }

  try {
    const parsed: unknown = JSON.parse(saved)
    cachedRegions = Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : EMPTY_REGIONS
    return cachedRegions
  } catch {
    cachedRegions = EMPTY_REGIONS
    return cachedRegions
  }
}

function subscribeDiscoveredRegions(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const handleStorage = (event: StorageEvent) => {
    if (event.key === DISCOVERED_REGIONS_KEY) onStoreChange()
  }

  window.addEventListener(DISCOVERED_REGIONS_EVENT, onStoreChange)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(DISCOVERED_REGIONS_EVENT, onStoreChange)
    window.removeEventListener('storage', handleStorage)
  }
}

export function discoverRegion(id: string): void {
  const current = readDiscoveredRegions()
  if (current.includes(id)) return

  const next = [...current, id]
  localStorage.setItem(DISCOVERED_REGIONS_KEY, JSON.stringify(next))
  cachedRaw = JSON.stringify(next)
  cachedRegions = next
  window.dispatchEvent(new Event(DISCOVERED_REGIONS_EVENT))
  window.dispatchEvent(new CustomEvent('region_discovered', { detail: { regionId: id } }))
}

export function useDiscoveredRegions(): string[] {
  return useSyncExternalStore(subscribeDiscoveredRegions, readDiscoveredRegions, () => EMPTY_REGIONS)
}
