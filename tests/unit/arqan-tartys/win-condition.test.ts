import { describe, it, expect } from 'vitest'
import { ForceEngine } from '@/games/arqan-tartys/engine/ForceEngine'

describe('Arqan Tartys — Win condition', () => {
  it('no winner while the rope is within the threshold', () => {
    const engine = new ForceEngine({ winThreshold: 100 })
    engine.startRound()
    engine.ropePosition = 50
    expect(engine.checkWinner()).toBeNull()
  })

  it('player wins when ropePosition reaches +winThreshold', () => {
    const engine = new ForceEngine({ winThreshold: 100 })
    engine.startRound()
    engine.ropePosition = 100
    expect(engine.checkWinner()).toBe('PLAYER')
  })

  it('AI wins when ropePosition reaches -winThreshold', () => {
    const engine = new ForceEngine({ winThreshold: 100 })
    engine.startRound()
    engine.ropePosition = -100
    expect(engine.checkWinner()).toBe('AI')
  })

  it('winner is never random — deterministic given the same ropePosition', () => {
    const results = new Set<string | null>()
    for (let i = 0; i < 10; i++) {
      const engine = new ForceEngine({ winThreshold: 100 })
      engine.startRound()
      engine.ropePosition = 100
      results.add(engine.checkWinner())
    }
    expect(results.size).toBe(1)
    expect(results.has('PLAYER')).toBe(true)
  })

  it('danger level rises toward 1 as a team approaches losing', () => {
    const engine = new ForceEngine({ winThreshold: 100 })
    engine.startRound()
    engine.ropePosition = -90 // AI is close to winning -> PLAYER in danger
    expect(engine.getDangerLevel('PLAYER')).toBeGreaterThan(0.8)
    expect(engine.getDangerLevel('AI')).toBe(0)
  })
})
