/**
 * Shared type definitions for the Arqan Tartys match engine.
 * Kept framework-free so engine/, ai/, and scoring/ can all import from
 * here without pulling in Phaser.
 */

/** Required top-level match state machine, per spec. */
export type ArqanState =
  | 'READY'
  | 'ROUND_START'
  | 'PULL'
  | 'RECOVERY'
  | 'ROUND_RESULT'
  | 'MATCH_RESULT'

export type Side = 'PLAYER' | 'AI'

export type AiDifficulty = 'BALDYRGAN' | 'SHAKIRT' | 'SHEBER'

/** Quality bucket of a single tap/pull, derived from timing offset against
 *  the rhythm window. */
export type PullQuality = 'PERFECT' | 'GOOD' | 'EARLY' | 'LATE' | 'MISS'

export interface PullResult {
  quality: PullQuality
  /** Force this single pull contributes, already scaled by fatigue (0..1). */
  force: number
  /** Signed timing offset in ms from the ideal beat (negative = early). */
  timingOffsetMs: number
}

export interface TeamMatchState {
  /** Instantaneous pulling force for the current tick (0..1 scale). */
  force: number
  /** 0 (fresh) .. 1 (exhausted). Reduces effective force as it rises. */
  fatigue: number
  /** Consecutive successful (GOOD or better) pulls — drives comeback swings. */
  momentum: number
  /** Longest streak this round, for scoring/achievements. */
  bestStreak: number
  /** Total pulls attempted this round. */
  pullsAttempted: number
  /** Perfect-quality pulls this round, for the "Best rhythm" stat. */
  perfectPulls: number
}

export interface MatchConfig {
  /** World-space range the rope center can travel, symmetric around 0.
   *  ropePosition of +range = PLAYER_WINS, -range = AI_WINS. */
  winThreshold: number
  /** ms between ideal beats — smaller = faster required rhythm. */
  beatIntervalMs: number
  /** ms half-width of the "GOOD" timing window around the beat. */
  goodWindowMs: number
  /** ms half-width of the (tighter, inside goodWindow) "PERFECT" window. */
  perfectWindowMs: number
  /** Fatigue added per pull attempt (scaled down for well-timed pulls). */
  fatiguePerPull: number
  /** Fatigue recovered per ms while not pulling (RECOVERY state). */
  fatigueRecoveryPerMs: number
  /** How strongly momentum amplifies force (multiplier per momentum point). */
  momentumBonusPerStreak: number
  /** Momentum cap — prevents runaway snowballing. */
  maxMomentum: number
  /** How much a single pull's net-force delta shifts ropePosition. */
  forceToRopeScale: number
}

export const DEFAULT_MATCH_CONFIG: MatchConfig = {
  winThreshold: 100,
  beatIntervalMs: 900,
  goodWindowMs: 220,
  perfectWindowMs: 90,
  fatiguePerPull: 0.09,
  fatigueRecoveryPerMs: 0.00028,
  momentumBonusPerStreak: 0.045,
  maxMomentum: 8,
  forceToRopeScale: 3.2,
}

export function qualityBaseForce(quality: PullQuality): number {
  switch (quality) {
    case 'PERFECT':
      return 1
    case 'GOOD':
      return 0.62
    case 'EARLY':
    case 'LATE':
      return 0.3
    case 'MISS':
      return 0
  }
}

/** Classify a tap's timing offset (ms, signed) against the rhythm windows. */
export function classifyTiming(
  timingOffsetMs: number,
  config: MatchConfig = DEFAULT_MATCH_CONFIG
): PullQuality {
  const abs = Math.abs(timingOffsetMs)
  if (abs <= config.perfectWindowMs) return 'PERFECT'
  if (abs <= config.goodWindowMs) return 'GOOD'
  if (abs <= config.goodWindowMs * 1.8) return timingOffsetMs < 0 ? 'EARLY' : 'LATE'
  return 'MISS'
}
