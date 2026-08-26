import { describe, it, expect } from 'vitest'
import { ForceEngine } from '@/games/arqan-tartys/engine/ForceEngine'
import { qualityBaseForce, classifyTiming, DEFAULT_MATCH_CONFIG } from '@/games/arqan-tartys/engine/types'

describe('Arqan Tartys — Force system', () => {
  it('a perfect-timed pull yields greater force than a good-timed pull', () => {
    const engine = new ForceEngine()
    engine.startRound()
    engine.beginPull()

    const perfect = engine.registerPull('PLAYER', engine.getNextBeatMs())
    expect(perfect.quality).toBe('PERFECT')

    const engine2 = new ForceEngine()
    engine2.startRound()
    engine2.beginPull()
    const good = engine2.registerPull('PLAYER', engine2.getNextBeatMs() + DEFAULT_MATCH_CONFIG.goodWindowMs * 0.8)
    expect(good.quality).toBe('GOOD')

    expect(perfect.force).toBeGreaterThan(good.force)
  })

  it('a missed pull contributes zero force', () => {
    const engine = new ForceEngine()
    engine.startRound()
    engine.beginPull()
    const miss = engine.registerPull('PLAYER', engine.getNextBeatMs() + 10_000)
    expect(miss.quality).toBe('MISS')
    expect(miss.force).toBe(0)
  })

  it('qualityBaseForce ranks PERFECT > GOOD > EARLY/LATE > MISS', () => {
    expect(qualityBaseForce('PERFECT')).toBeGreaterThan(qualityBaseForce('GOOD'))
    expect(qualityBaseForce('GOOD')).toBeGreaterThan(qualityBaseForce('EARLY'))
    expect(qualityBaseForce('EARLY')).toBe(qualityBaseForce('LATE'))
    expect(qualityBaseForce('EARLY')).toBeGreaterThan(qualityBaseForce('MISS'))
    expect(qualityBaseForce('MISS')).toBe(0)
  })

  it('a successful player pull shifts ropePosition toward the player (positive)', () => {
    const engine = new ForceEngine()
    engine.startRound()
    engine.beginPull()
    const before = engine.ropePosition
    engine.registerPull('PLAYER', engine.getNextBeatMs())
    expect(engine.ropePosition).toBeGreaterThan(before)
  })

  it('a successful AI pull shifts ropePosition toward the AI (negative)', () => {
    const engine = new ForceEngine()
    engine.startRound()
    engine.beginPull()
    const before = engine.ropePosition
    engine.registerPull('AI', engine.getNextBeatMs())
    expect(engine.ropePosition).toBeLessThan(before)
  })

  it('classifyTiming buckets symmetric early/late offsets identically', () => {
    expect(classifyTiming(-150)).toBe(classifyTiming(150))
  })
})
