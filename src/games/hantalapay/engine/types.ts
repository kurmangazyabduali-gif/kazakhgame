export type HantalapayState =
  | 'READY'
  | 'COUNTDOWN'
  | 'SCATTERING'
  | 'PLAYING'
  | 'KHAN_HIGHLIGHT'
  | 'ROUND_RESULT'
  | 'MATCH_RESULT'

export type AsykOrientation = 'ALSHY' | 'TAYKE' | 'BUK' | 'SHIK'

export interface Vector2D {
  x: number
  y: number
}

export interface AsykItem {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  rotation: number
  rotationSpeed: number
  orientation: AsykOrientation
  isKhan: boolean
  isCollected: boolean
  isCollectingAnimation: boolean
  collectProgress: number // 0 to 1 for float-up animation
  collectStartX: number
  collectStartY: number
  scale: number
  colorHex: string
  opacity: number
}

export interface ObstacleItem {
  id: string
  x: number
  y: number
  radius: number
  type: 'COIN' | 'PEBBLE' | 'COASTER'
  rotation: number
}

export interface FloatingParticle {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  life: number
  maxLife: number
  text?: string
  scale?: number
}

export interface RoundConfig {
  roundNumber: number
  titleKz: string
  asykCount: number
  hasKhan: boolean
  khanHiddenDelayMs: number // time before Khan is active/revealed
  timeLimitSec: number
  scatterForceMin: number
  scatterForceMax: number
  obstacleCount: number
  targetScoreFor3Stars: number
  targetScoreFor2Stars: number
  targetScoreFor1Star: number
  carpetBgVariant: 'red-tekemet' | 'blue-syrmak' | 'gold-dastarkhan'
}

export interface RoundResultData {
  roundNumber: number
  collectedAsyks: number
  totalAsyks: number
  khanCaptured: boolean
  timeSpentSec: number
  maxCombo: number
  accuracyPct: number
  score: number
  stars: number
}

export interface MatchSummary {
  totalScore: number
  totalStars: number
  totalCollected: number
  totalKhansCaptured: number
  roundsCompleted: number
  xpEarned: number
  accuracyPct: number
}
