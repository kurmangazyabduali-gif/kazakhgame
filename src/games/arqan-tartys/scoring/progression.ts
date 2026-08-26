import { AchievementId } from './achievements'

const STORAGE_KEY = 'arqan_tartys_progression'

export interface ArqanProgression {
  /** Highest level unlocked (1-indexed) — completing level N unlocks N+1. */
  unlockedLevel: number
  totalXP: number
  totalWins: number
  totalMatchesPlayed: number
  achievements: AchievementId[]
  /** Best (highest) perfect-pull streak ever recorded, for display. */
  bestStreak: number
  hasEverPulled: boolean
}

export const DEFAULT_PROGRESSION: ArqanProgression = {
  unlockedLevel: 1,
  totalXP: 0,
  totalWins: 0,
  totalMatchesPlayed: 0,
  achievements: [],
  bestStreak: 0,
  hasEverPulled: false,
}

/**
 * localStorage-backed progression, following the exact pattern established
 * in Zhamby Atu's best-score persistence: wrapped in try/catch so private
 * browsing / storage-quota errors degrade to an in-memory default instead
 * of throwing.
 */
export function loadProgression(): ArqanProgression {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESSION }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROGRESSION }
    const parsed = JSON.parse(raw) as Partial<ArqanProgression>
    return {
      ...DEFAULT_PROGRESSION,
      ...parsed,
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
    }
  } catch {
    return { ...DEFAULT_PROGRESSION }
  }
}

export function saveProgression(progression: ArqanProgression): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progression))
  } catch {
    // Private mode / quota exceeded — progression simply won't persist
    // this session, matching Zhamby Atu's fallback behavior.
  }
}

export function mergeNewAchievements(
  progression: ArqanProgression,
  newlyUnlocked: AchievementId[]
): ArqanProgression {
  if (newlyUnlocked.length === 0) return progression
  const set = new Set(progression.achievements)
  newlyUnlocked.forEach((id) => set.add(id))
  return { ...progression, achievements: Array.from(set) }
}
