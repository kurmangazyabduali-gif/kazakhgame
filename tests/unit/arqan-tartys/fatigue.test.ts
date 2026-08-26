import { describe, it, expect } from 'vitest'
import { ForceEngine } from '@/games/arqan-tartys/engine/ForceEngine'

describe('Arqan Tartys — Fatigue system', () => {
  it('repeated pulls increase fatigue', () => {
    const engine = new ForceEngine()
    engine.startRound()
    engine.beginPull()
    expect(engine.player.fatigue).toBe(0)
    engine.registerPull('PLAYER', engine.getNextBeatMs())
    const afterOne = engine.player.fatigue
    expect(afterOne).toBeGreaterThan(0)
    engine.advanceBeat()
    engine.registerPull('PLAYER', engine.getNextBeatMs())
    expect(engine.player.fatigue).toBeGreaterThan(afterOne)
  })

  it('high fatigue reduces the force of an otherwise-perfect pull', () => {
    const fresh = new ForceEngine()
    fresh.startRound()
    fresh.beginPull()
    const freshResult = fresh.registerPull('PLAYER', fresh.getNextBeatMs())

    const tired = new ForceEngine()
    tired.startRound()
    tired.beginPull()
    tired.player.fatigue = 0.9
    const tiredResult = tired.registerPull('PLAYER', tired.getNextBeatMs())

    expect(tiredResult.force).toBeLessThan(freshResult.force)
  })

  it('fatigue recovers over time while in RECOVERY state', () => {
    const engine = new ForceEngine()
    engine.startRound()
    engine.beginPull()
    engine.registerPull('PLAYER', engine.getNextBeatMs())
    const fatigueAfterPull = engine.player.fatigue
    expect(fatigueAfterPull).toBeGreaterThan(0)

    engine.enterRecovery()
    engine.tick(5000)
    expect(engine.player.fatigue).toBeLessThan(fatigueAfterPull)
  })

  it('fatigue never drops below zero during recovery', () => {
    const engine = new ForceEngine()
    engine.startRound()
    engine.enterRecovery()
    engine.tick(1_000_000)
    expect(engine.player.fatigue).toBe(0)
  })

  it('fatigue is capped at 1 (never exceeds full exhaustion)', () => {
    const engine = new ForceEngine()
    engine.startRound()
    engine.beginPull()
    for (let i = 0; i < 50; i++) {
      engine.registerPull('PLAYER', engine.getNextBeatMs() + 10_000) // repeated misses = high fatigue cost
    }
    expect(engine.player.fatigue).toBeLessThanOrEqual(1)
  })

  it('spamming without pauses tires the team faster than paced play (fatigue cost is nonzero per attempt)', () => {
    const engine = new ForceEngine()
    engine.startRound()
    engine.beginPull()
    const attempts = 5
    for (let i = 0; i < attempts; i++) {
      engine.registerPull('PLAYER', engine.getNextBeatMs())
      engine.advanceBeat()
    }
    // 5 pulls with nonzero fatigue-per-pull must accumulate noticeable fatigue.
    expect(engine.player.fatigue).toBeGreaterThan(0.2)
  })
})
