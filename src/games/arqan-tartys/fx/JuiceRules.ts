import { PullQuality, Side } from '../engine/types'

/**
 * Pure "game feel" rules — every number here is a design decision, but none
 * of it touches match state or Phaser. Kept framework-free and
 * unit-testable so the juice layer (fx/*) can stay dumb: it just asks these
 * functions "what should happen" and plays it back.
 */

export interface ShakeSpec {
  durationMs: number
  intensity: number
  /** +1 = shake reads as pulling toward Team A/left, -1 = toward Team B/right. */
  direction: 1 | -1
}

export interface PopupSpec {
  text: string
  colorHex: string
}

/** Freeze-frame duration on a PERFECT pull — the classic "hit stop" that
 *  sells impact. Short and only on the best-quality tier so it reads as a
 *  punch, not lag. */
export function hitStopMsForQuality(quality: PullQuality): number {
  return quality === 'PERFECT' ? 55 : 0
}

/** Camera/screen shake shaped by pull quality, directional toward whichever
 *  side just pulled so a strong Team B pull visibly reads differently from
 *  a strong Team A pull rather than a generic omnidirectional rattle. */
export function shakeSpecForQuality(quality: PullQuality, side: Side): ShakeSpec {
  const direction: 1 | -1 = side === 'PLAYER' ? 1 : -1
  switch (quality) {
    case 'PERFECT':
      return { durationMs: 140, intensity: 0.008, direction }
    case 'GOOD':
      return { durationMs: 90, intensity: 0.004, direction }
    case 'EARLY':
    case 'LATE':
      return { durationMs: 60, intensity: 0.0018, direction }
    case 'MISS':
      return { durationMs: 0, intensity: 0, direction }
  }
}

/** Popup combo-text per quality tier, in Kazakh per the platform's existing
 *  UI language, with a color that matches the rhythm marker's own quality
 *  palette so the two feedback surfaces agree. */
export function popupSpecForQuality(quality: PullQuality): PopupSpec {
  switch (quality) {
    case 'PERFECT':
      return { text: 'ТАМАША!', colorHex: '#d4af37' }
    case 'GOOD':
      return { text: 'ЖАҚСЫ!', colorHex: '#f4e4c1' }
    case 'EARLY':
      return { text: 'ЕРТЕ!', colorHex: '#c9a86a' }
    case 'LATE':
      return { text: 'КЕШ!', colorHex: '#c9a86a' }
    case 'MISS':
      return { text: 'ӨТКІЗІП АЛДЫҢ', colorHex: '#8a3a2a' }
  }
}

/** Danger vignette ramps in only once a team is meaningfully close to
 *  losing (not from the first inch of disadvantage) and reaches full
 *  intensity right at the loss threshold. */
const DANGER_VIGNETTE_THRESHOLD = 0.6
export function dangerVignetteIntensity(dangerLevel: number): number {
  const clamped = Math.max(0, Math.min(1, dangerLevel))
  if (clamped <= DANGER_VIGNETTE_THRESHOLD) return 0
  return (clamped - DANGER_VIGNETTE_THRESHOLD) / (1 - DANGER_VIGNETTE_THRESHOLD)
}

/** A side is "on match point" once it's close enough to the win threshold
 *  that one more strong pull could plausibly finish the round — used to
 *  trigger the match-point banner/camera punch-in. Margin-based rather than
 *  force-based so it stays honest regardless of momentum/fatigue tuning. */
const MATCH_POINT_MARGIN_RATIO = 0.14
export function matchPointSide(ropePosition: number, winThreshold: number): Side | null {
  if (winThreshold <= 0) return null
  if (ropePosition >= winThreshold * (1 - MATCH_POINT_MARGIN_RATIO)) return 'PLAYER'
  if (ropePosition <= -winThreshold * (1 - MATCH_POINT_MARGIN_RATIO)) return 'AI'
  return null
}

/** Fatigue-driven character tint: neutral (no tint) until a team is
 *  genuinely tiring, then blends toward a pale, drained tone so exhaustion
 *  reads on the athletes themselves rather than only in the HUD bar.
 *  Returns a Phaser-style 0xRRGGBB tint. */
const FATIGUE_TINT_START = 0.55
export function fatigueTintColor(fatigue: number): number {
  const clamped = Math.max(0, Math.min(1, fatigue))
  if (clamped <= FATIGUE_TINT_START) return 0xffffff
  const t = (clamped - FATIGUE_TINT_START) / (1 - FATIGUE_TINT_START)
  const from = { r: 0xff, g: 0xff, b: 0xff }
  const to = { r: 0xb8, g: 0xad, b: 0xa0 }
  const r = Math.round(from.r + (to.r - from.r) * t)
  const g = Math.round(from.g + (to.g - from.g) * t)
  const b = Math.round(from.b + (to.b - from.b) * t)
  return (r << 16) | (g << 8) | b
}

/** Slow-motion applied to the pull that wins the whole match — a short,
 *  smooth ramp so the winning moment gets weight before the result screen
 *  appears. `factor` scales the simulation clock (not real frame time), and
 *  `realMs` is how long (real wall time) the ramp holds before returning to
 *  normal speed. */
export const MATCH_WIN_SLOWMO_FACTOR = 0.22
export const MATCH_WIN_SLOWMO_REAL_MS = 650
