import { AsykItem } from '../engine/types'

export class IdleDetectorEngine {
  private idleTimeSec: number = 0
  private idleThresholdSec: number = 2.0
  private highlightedAsykId: string | null = null

  public resetIdle() {
    this.idleTimeSec = 0
    this.highlightedAsykId = null
  }

  public update(dt: number, activeAsyks: AsykItem[]): { isIdle: boolean; targetAsyk: AsykItem | null } {
    const uncollected = activeAsyks.filter((a) => !a.isCollected)
    if (uncollected.length === 0) {
      this.resetIdle()
      return { isIdle: false, targetAsyk: null }
    }

    this.idleTimeSec += dt

    if (this.idleTimeSec >= this.idleThresholdSec) {
      // Pick Khan if available, otherwise first uncollected asyk
      const khan = uncollected.find((a) => a.isKhan)
      const target = khan || uncollected[0]
      this.highlightedAsykId = target.id

      return { isIdle: true, targetAsyk: target }
    }

    return { isIdle: false, targetAsyk: null }
  }

  public getHighlightedId(): string | null {
    return this.highlightedAsykId
  }
}

export const idleDetector = new IdleDetectorEngine()
