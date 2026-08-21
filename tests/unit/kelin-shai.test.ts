import { describe, expect, it } from 'vitest'
import { ScenarioEngine } from '@/games/engine/scenario/ScenarioEngine'
import { firstTeaScenario } from '@/games/kelin-shai/scenarios/first-tea'
import { calculateKelinShaiScore, calculateKelinShaiXP } from '@/games/kelin-shai/scoring'
import { calculateTeaFillAmount, isRespectfulTeaAmount } from '@/games/kelin-shai/entities/Teapot'
import { validateKelinShaiResult } from '@/games/kelin-shai/validation'
import type { ScenarioAction } from '@/games/engine/scenario/types'

const successfulActions: ScenarioAction[] = [
  { id: 'a1', type: 'greet', targetId: 'guest' },
  { id: 'p1', type: 'place', itemId: 'bauyrsak', targetId: 'dastarkhan' },
  { id: 'p2', type: 'place', itemId: 'qurt', targetId: 'dastarkhan' },
  { id: 'p3', type: 'place', itemId: 'sweets', targetId: 'dastarkhan' },
  { id: 'a2', type: 'pour', itemId: 'teapot', targetId: 'cup1', value: 50 },
  { id: 'a3', type: 'give', itemId: 'cup1', targetId: 'ene' },
  { id: 'a4', type: 'add_sugar', itemId: 'sugar', targetId: 'cup2' },
  { id: 'a5', type: 'pour', itemId: 'teapot', targetId: 'cup2', value: 55 },
  { id: 'a6', type: 'give', itemId: 'cup2', targetId: 'adult_guest' },
  { id: 'a7', type: 'pour', itemId: 'teapot', targetId: 'cup3', value: 48 },
  { id: 'a8', type: 'give', itemId: 'cup3', targetId: 'younger_guest' },
]

describe('Kelin Shai scoring and tea mechanics', () => {
  it('calculates score and XP from hospitality metrics', () => {
    const score = calculateKelinShaiScore({
      hospitality: 94,
      etiquette: 91,
      tradition: 88,
      neatness: 84,
      speed: 80,
    })

    expect(score).toBe(89)
    expect(calculateKelinShaiXP(score, 0)).toBeGreaterThan(170)
  })

  it('turns pour duration into a bounded tea amount', () => {
    expect(calculateTeaFillAmount(0)).toBe(0)
    expect(calculateTeaFillAmount(1100)).toBe(50)
    expect(calculateTeaFillAmount(4000)).toBe(100)
    expect(isRespectfulTeaAmount(50)).toBe(true)
    expect(isRespectfulTeaAmount(95)).toBe(false)
  })
})

describe('Kelin Shai scenario validation', () => {
  it('completes the scenario through real actions', () => {
    const engine = new ScenarioEngine(firstTeaScenario)
    engine.initialize()
    engine.start()

    successfulActions.forEach((action) => engine.performAction(action))
    expect(engine.getCurrentStep()).toBeNull()

    const result = engine.finish()
    expect(result.completed).toBe(true)
    expect(result.score).toBeGreaterThanOrEqual(90)
    expect(result.achievements).toEqual(expect.arrayContaining(['kelin_first_tea', 'kelin_tradition']))
  })

  it('replays submitted actions server-side instead of trusting client score', () => {
    const result = validateKelinShaiResult({
      sessionId: '11111111-1111-4111-8111-111111111111',
      result: {
        score: 1,
        xp: 9999,
        metadata: {
          actions: successfulActions,
        },
      },
    })

    expect(result.score).toBeGreaterThan(1)
    expect(result.xp).toBeLessThan(9999)
  })
})
