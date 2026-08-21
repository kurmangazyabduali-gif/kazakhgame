const STORAGE_KEY = 'uly-dala:guest-progress'
const CHANGE_EVENT = 'uly-dala:guest-progress-changed'

export interface GameHistoryEntry {
  gameId: string
  score: number
  xpEarned: number
  timestamp: string
}

export interface GuestProgress {
  xp: number
  gamesPlayed: number
  bestScores: Record<string, number>
  achievements: string[]
  discoveredRegions: string[]
  gameHistory: GameHistoryEntry[]
  createdAt: string
}

const DEFAULT_PROGRESS: GuestProgress = {
  xp: 0,
  gamesPlayed: 0,
  bestScores: {},
  achievements: [],
  discoveredRegions: [],
  gameHistory: [],
  createdAt: new Date().toISOString()
}

export const guestStorage = {
  get(): GuestProgress {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) }
      }
    } catch (e) {
      console.warn('Failed to read guest storage', e)
    }
    return DEFAULT_PROGRESS
  },

  save(progress: GuestProgress): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
      window.dispatchEvent(new Event(CHANGE_EVENT))
    } catch (e) {
      console.warn('Failed to write guest storage', e)
    }
  },

  saveGameResult(gameSlug: string, score: number, xp: number): void {
    const progress = this.get()
    
    progress.gamesPlayed += 1
    progress.xp += xp
    
    const currentBest = progress.bestScores[gameSlug] || 0
    if (score > currentBest) {
      progress.bestScores[gameSlug] = score
    }
    
    progress.gameHistory = progress.gameHistory || []
    progress.gameHistory.unshift({
      gameId: gameSlug,
      score,
      xpEarned: xp,
      timestamp: new Date().toISOString()
    })
    
    // keep only last 50
    if (progress.gameHistory.length > 50) {
      progress.gameHistory.pop()
    }
    
    this.save(progress)
  },
  
  unlockAchievement(achievementId: string): void {
    const progress = this.get()
    if (!progress.achievements.includes(achievementId)) {
      progress.achievements.push(achievementId)
      this.save(progress)
    }
  },

  discoverRegion(regionId: string): void {
    const progress = this.get()
    if (!progress.discoveredRegions.includes(regionId)) {
      progress.discoveredRegions.push(regionId)
      this.save(progress)
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }
}

export function subscribeGuestProgress(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onStoreChange()
  }

  window.addEventListener(CHANGE_EVENT, onStoreChange)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange)
    window.removeEventListener('storage', handleStorage)
  }
}
