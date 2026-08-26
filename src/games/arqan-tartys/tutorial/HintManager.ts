import * as Phaser from 'phaser'
import { RhythmMarker } from '../ui/RhythmMarker'

/**
 * Error-driven hint escalation (distinct from the one-time intro
 * tutorial): tracks consecutive mistimed pulls and, past a threshold,
 * makes the rhythm marker pulse more visibly — a short, wordless nudge
 * rather than another block of instructions, per spec ("NOT long
 * instructions").
 */
export class HintManager {
  private scene: Phaser.Scene
  private rhythmMarker: RhythmMarker
  private consecutiveMisses = 0
  private emphasisActive = false

  private static readonly MISS_THRESHOLD = 2

  constructor(scene: Phaser.Scene, rhythmMarker: RhythmMarker) {
    this.scene = scene
    this.rhythmMarker = rhythmMarker
  }

  notifyPullResult(quality: 'PERFECT' | 'GOOD' | 'EARLY' | 'LATE' | 'MISS') {
    if (quality === 'PERFECT' || quality === 'GOOD') {
      this.consecutiveMisses = 0
      this.setEmphasis(false)
      return
    }
    this.consecutiveMisses += 1
    if (this.consecutiveMisses >= HintManager.MISS_THRESHOLD) {
      this.setEmphasis(true)
    }
  }

  private setEmphasis(active: boolean) {
    if (active === this.emphasisActive) return
    this.emphasisActive = active
    this.rhythmMarker.setHintEmphasis(active)
  }

  reset() {
    this.consecutiveMisses = 0
    this.setEmphasis(false)
  }
}
