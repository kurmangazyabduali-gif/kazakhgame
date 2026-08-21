import { describe, it, expect } from 'vitest'
import { checkAchievements, ASYK_ACHIEVEMENTS } from '@/games/asyk-atu/achievements'
import { ThrowEvent } from '@/games/asyk-atu/types'

describe('Asyk Atu Achievements 2.0', () => {
  const hitEvent: ThrowEvent = {
    levelNumber: 1,
    throwNumber: 1,
    throwParams: { angleDeg: 10, powerPercent: 50, directionDeg: 10 },
    hitQuality: 'direct',
    targetsHit: 1,
    goldenHits: 0,
    combo: 1
  }

  const missEvent: ThrowEvent = {
    ...hitEvent,
    hitQuality: 'miss',
    targetsHit: 0,
    goldenHits: 0,
    combo: 0
  }

  it('awards FIRST_KNOCKOUT on first hit', () => {
    const achs = checkAchievements([hitEvent], 100)
    expect(achs).toContain(ASYK_ACHIEVEMENTS.FIRST_KNOCKOUT)
  })

  it('awards PERFECT_AIM for 5+ throws with 0 misses', () => {
    const events = [hitEvent, hitEvent, hitEvent, hitEvent, hitEvent]
    const achs = checkAchievements(events, 500)
    expect(achs).toContain(ASYK_ACHIEVEMENTS.PERFECT_AIM)
  })

  it('does not award PERFECT_AIM if there is a miss', () => {
    const events = [hitEvent, hitEvent, missEvent, hitEvent, hitEvent]
    const achs = checkAchievements(events, 400)
    expect(achs).not.toContain(ASYK_ACHIEVEMENTS.PERFECT_AIM)
  })

  it('awards COMBO_3', () => {
    const comboEvent = { ...hitEvent, combo: 3 }
    const achs = checkAchievements([comboEvent], 300)
    expect(achs).toContain(ASYK_ACHIEVEMENTS.COMBO_3)
  })

  it('awards MASTER for score >= 1000', () => {
    const achs = checkAchievements([hitEvent], 1200)
    expect(achs).toContain(ASYK_ACHIEVEMENTS.MASTER)
  })
})
