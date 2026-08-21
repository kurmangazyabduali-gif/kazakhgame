import { describe, it, expect } from 'vitest'
import { calculateTotalScore, calculateXP, calculateAccuracy } from '@/games/asyk-atu/scoring'
import { ThrowEvent } from '@/games/asyk-atu/types'

describe('Asyk Atu Scoring 2.0', () => {
  const baseEvent: ThrowEvent = {
    levelNumber: 1,
    throwNumber: 1,
    throwParams: { angleDeg: 10, powerPercent: 50, directionDeg: 10 },
    hitQuality: 'direct',
    targetsHit: 1,
    goldenHits: 0,
    combo: 1
  }

  it('calculates a direct hit correctly', () => {
    // 100 (direct) + 1 * 50 (target hit) = 150
    expect(calculateTotalScore([baseEvent])).toBe(150)
  })

  it('calculates a strong hit correctly', () => {
    // 50 (strong) + 1 * 50 (target hit) = 100
    expect(calculateTotalScore([{ ...baseEvent, hitQuality: 'strong' }])).toBe(100)
  })

  it('calculates a miss correctly', () => {
    expect(calculateTotalScore([{ ...baseEvent, hitQuality: 'miss', targetsHit: 0 }])).toBe(0)
  })

  it('applies combo multiplier', () => {
    const comboEvent: ThrowEvent = { ...baseEvent, targetsHit: 3, combo: 3 }
    // 100 (direct) + 3 * 50 (target hit) = 250. Combo 3x -> 750
    expect(calculateTotalScore([comboEvent])).toBe(750)
  })

  it('calculates XP with completion bonus', () => {
    const score = 500
    // 500 / 10 = 50. + 100 bonus = 150
    expect(calculateXP(score, true)).toBe(150)
    expect(calculateXP(score, false)).toBe(50)
  })

  it('calculates accuracy', () => {
    const events: ThrowEvent[] = [
      baseEvent, // hit (targetsHit: 1)
      { ...baseEvent, hitQuality: 'miss', targetsHit: 0 }, // miss
      baseEvent, // hit
      baseEvent // hit
    ]
    expect(calculateAccuracy(events)).toBe(75) // 3/4 = 75%
  })
})
