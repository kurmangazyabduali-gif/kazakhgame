import { describe, it, expect } from 'vitest'
import { ArqanAI, AI_TIERS, createRng } from '@/games/arqan-tartys/ai/ArqanAI'
import { ForceEngine } from '@/games/arqan-tartys/engine/ForceEngine'

describe('Arqan Tartys — AI opponent', () => {
  it('createRng is deterministic for a given seed', () => {
    const rngA = createRng(42)
    const rngB = createRng(42)
    const seqA = [rngA(), rngA(), rngA()]
    const seqB = [rngB(), rngB(), rngB()]
    expect(seqA).toEqual(seqB)
  })

  it('Шебер has tighter timing noise than Шәкірт, which is tighter than Балдырған', () => {
    expect(AI_TIERS.SHEBER.timingNoiseMs).toBeLessThan(AI_TIERS.SHAKIRT.timingNoiseMs)
    expect(AI_TIERS.SHAKIRT.timingNoiseMs).toBeLessThan(AI_TIERS.BALDYRGAN.timingNoiseMs)
  })

  it('Шебер reacts to beats more reliably than Балдырған', () => {
    expect(AI_TIERS.SHEBER.reactionChance).toBeGreaterThan(AI_TIERS.BALDYRGAN.reactionChance)
  })

  it('AI decisions account for live match state (danger raises reaction likelihood)', () => {
    const engineSafe = new ForceEngine({ winThreshold: 100 })
    engineSafe.startRound()
    engineSafe.ropePosition = 0 // AI safe

    const engineDanger = new ForceEngine({ winThreshold: 100 })
    engineDanger.startRound()
    engineDanger.ropePosition = 95 // AI close to losing

    // Run many trials with the same seed sequence to compare aggregate
    // reaction rates rather than a single noisy sample.
    const trials = 500
    let safeReactions = 0
    let dangerReactions = 0
    const aiSafe = new ArqanAI('SHAKIRT', 7)
    const aiDanger = new ArqanAI('SHAKIRT', 7)
    for (let i = 0; i < trials; i++) {
      if (aiSafe.decideBeat(engineSafe).willPull) safeReactions++
      if (aiDanger.decideBeat(engineDanger).willPull) dangerReactions++
    }

    expect(dangerReactions).toBeGreaterThan(safeReactions)
  })

  it('AI is not pure random — a fixed seed reproduces the same decision sequence', () => {
    const engine = new ForceEngine()
    engine.startRound()

    const aiA = new ArqanAI('SHEBER', 123)
    const aiB = new ArqanAI('SHEBER', 123)

    const decisionsA = Array.from({ length: 5 }, () => aiA.decideBeat(engine))
    const decisionsB = Array.from({ length: 5 }, () => aiB.decideBeat(engine))

    expect(decisionsA).toEqual(decisionsB)
  })

  it('all three difficulty tiers are defined', () => {
    expect(Object.keys(AI_TIERS).sort()).toEqual(['BALDYRGAN', 'SHAKIRT', 'SHEBER'])
  })
})
