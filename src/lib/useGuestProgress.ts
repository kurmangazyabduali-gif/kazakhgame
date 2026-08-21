'use client'

import { useSyncExternalStore } from 'react'
import { guestStorage, type GuestProgress, subscribeGuestProgress } from './guestStorage'

let cachedGuestProgress: GuestProgress | null = null
let cachedGuestProgressRaw: string | null = null

function readGuestProgress(): GuestProgress {
  if (typeof window === 'undefined') return guestStorage.get()

  const raw = localStorage.getItem('uly-dala:guest-progress')
  if (raw === cachedGuestProgressRaw && cachedGuestProgress) return cachedGuestProgress

  cachedGuestProgressRaw = raw
  cachedGuestProgress = guestStorage.get()
  return cachedGuestProgress
}

export function useGuestProgress(): GuestProgress | null {
  return useSyncExternalStore(
    subscribeGuestProgress,
    readGuestProgress,
    () => null
  )
}
