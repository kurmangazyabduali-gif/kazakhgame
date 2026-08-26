export type TargetMotion = 'NONE' | 'SWAY' | 'MOVE_Y'

export interface ZhambyLevelConfig {
  level: number
  /** Short label describing the ONE new mechanic this level introduces — shown nowhere
   *  yet but kept alongside the numbers so the progression's intent stays legible. */
  challenge: string
  horseSpeed: number
  targetDistance: number
  targetSize: number // Scale multiplier
  windSpeed: number // Negative for left, positive for right
  targetMotion: TargetMotion
  /** Multiplier on the jamby's height above ground — 1 = normal, >1 = noticeably higher,
   *  <1 = lower, closer to the rider's eyeline. Drives the "different height" and
   *  "difficult angle" challenges. */
  heightMultiplier: number
  attempts: number
  timeOfDay: 'DAY' | 'SUNSET' | 'NIGHT'
  weather: 'NONE' | 'RAIN' | 'SNOW'
  /** A decoy jamby placed near the real one — hitting it costs points instead of earning them. */
  hasDecoy?: boolean
  /** From this level's config a second, smaller "echo" jamby trails the real one — hit both in one pass for a chain bonus. */
  hasChainTarget?: boolean
}

// Ten levels, each built around ONE clearly new challenge over the last — not just a
// smaller target. Earlier mechanics stay present (at an easy setting) as later levels
// layer on, so the final level is a genuine combination of everything learned so far.
export const ZHAMBY_LEVELS: Record<number, ZhambyLevelConfig> = {
  1: {
    level: 1, challenge: 'Үлкен нысана (big target — learn the controls)',
    horseSpeed: 110, targetDistance: 750, targetSize: 1.6, windSpeed: 0,
    targetMotion: 'NONE', heightMultiplier: 1, attempts: 5, timeOfDay: 'DAY', weather: 'NONE',
  },
  2: {
    level: 2, challenge: 'Алыс нысана (distant target)',
    horseSpeed: 130, targetDistance: 1500, targetSize: 1.3, windSpeed: 0,
    targetMotion: 'NONE', heightMultiplier: 1, attempts: 5, timeOfDay: 'DAY', weather: 'NONE',
  },
  3: {
    level: 3, challenge: 'Басқа биіктік (different height — jamby hangs much higher)',
    horseSpeed: 140, targetDistance: 1300, targetSize: 1.15, windSpeed: 0,
    targetMotion: 'NONE', heightMultiplier: 1.55, attempts: 5, timeOfDay: 'DAY', weather: 'NONE',
  },
  4: {
    level: 4, challenge: 'Жылдамдық (high horse speed — less time to aim)',
    horseSpeed: 320, targetDistance: 1700, targetSize: 1.1, windSpeed: 0,
    targetMotion: 'NONE', heightMultiplier: 1, attempts: 5, timeOfDay: 'DAY', weather: 'NONE',
  },
  5: {
    level: 5, challenge: 'Жел (wind — compensate your aim)',
    horseSpeed: 200, targetDistance: 1700, targetSize: 1.0, windSpeed: -220,
    targetMotion: 'NONE', heightMultiplier: 1, attempts: 5, timeOfDay: 'SUNSET', weather: 'NONE',
  },
  6: {
    level: 6, challenge: 'Қозғалмалы жамбы (moving jamby — swings side to side)',
    horseSpeed: 200, targetDistance: 1700, targetSize: 1.0, windSpeed: 0,
    targetMotion: 'SWAY', heightMultiplier: 1, attempts: 5, timeOfDay: 'SUNSET', weather: 'NONE',
  },
  7: {
    level: 7, challenge: 'Қиын бұрыш (difficult angle — low and close, steep shot)',
    horseSpeed: 220, targetDistance: 900, targetSize: 0.85, windSpeed: 0,
    targetMotion: 'NONE', heightMultiplier: 0.45, attempts: 5, timeOfDay: 'SUNSET', weather: 'NONE',
  },
  8: {
    level: 8, challenge: 'Аралас қиындықтар (combined: speed + wind + height)',
    horseSpeed: 280, targetDistance: 1900, targetSize: 0.85, windSpeed: 180,
    targetMotion: 'NONE', heightMultiplier: 1.3, attempts: 5, timeOfDay: 'SUNSET', weather: 'RAIN',
    hasDecoy: true,
  },
  9: {
    level: 9, challenge: 'Қатты жел (strong wind — the dominant challenge)',
    horseSpeed: 250, targetDistance: 2000, targetSize: 0.8, windSpeed: -420,
    targetMotion: 'SWAY', heightMultiplier: 1, attempts: 5, timeOfDay: 'NIGHT', weather: 'NONE',
    hasChainTarget: true,
  },
  10: {
    level: 10, challenge: 'Соңғы сынақ (final challenge — everything at once)',
    horseSpeed: 340, targetDistance: 2400, targetSize: 0.65, windSpeed: -320,
    targetMotion: 'MOVE_Y', heightMultiplier: 1.35, attempts: 6, timeOfDay: 'NIGHT', weather: 'SNOW',
    hasDecoy: true, hasChainTarget: true,
  },
}

export const ZHAMBY_LEVEL_COUNT = Object.keys(ZHAMBY_LEVELS).length
