export type HitQuality = 'direct' | 'strong' | 'miss'
export type AsykFace = 'alshy' | 'tayke' | 'buk' | 'chik'
export type AsykAtuPhase = 'INTRO' | 'AIM' | 'THROWING' | 'SETTLING' | 'LEVEL_COMPLETE' | 'GAME_COMPLETE'

export interface ThrowParams {
  angleDeg: number
  powerPercent: number
  directionDeg: number
}

export interface ThrowEvent {
  levelNumber: number
  throwNumber: number
  throwParams: ThrowParams
  hitQuality: HitQuality
  targetsHit: number
  goldenHits?: number
  combo: number
  landedFace?: AsykFace
  alshyBonus?: boolean
}

export interface AsykGameState {
  currentLevel: number
  maxLevels: number
  score: number
  accuracy: number
  totalTargetsCleared: number
  throwsUsed: number
  highestCombo: number
  events: ThrowEvent[]
}
