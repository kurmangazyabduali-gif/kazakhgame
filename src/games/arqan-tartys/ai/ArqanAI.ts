import { ForceEngine } from '../engine/ForceEngine'
import { AiDifficulty, DEFAULT_MATCH_CONFIG, MatchConfig } from '../engine/types'

export interface AiTierConfig {
  /** Standard deviation (ms) of timing noise added to the AI's tap — smaller
   *  is more accurate. */
  timingNoiseMs: number
  /** Probability [0..1] the AI reacts to the current beat at all (models
   *  "attention" — weaker tiers occasionally miss a beat entirely). */
  reactionChance: number
  /** How strongly danger (about to lose) biases the AI to prioritize the
   *  next beat rather than skip it — 0 = ignores danger, 1 = always reacts
   *  when in danger regardless of reactionChance. */
  dangerAwareness: number
  /** How strongly the AI reads the player's momentum/fatigue to adapt —
   *  0 = pure random, 1 = fully reactive (used by Шебер for comeback play). */
  adaptiveness: number
}

export const AI_TIERS: Record<AiDifficulty, AiTierConfig> = {
  // Балдырған — weak, mostly reflexive, frequently mistimes or skips beats.
  BALDYRGAN: {
    timingNoiseMs: 260,
    reactionChance: 0.62,
    dangerAwareness: 0.15,
    adaptiveness: 0.05,
  },
  // Шәкірт — reacts better, rarely skips a beat, some awareness of danger.
  SHAKIRT: {
    timingNoiseMs: 140,
    reactionChance: 0.82,
    dangerAwareness: 0.5,
    adaptiveness: 0.4,
  },
  // Шебер — master: tight timing, always reacts when behind, reads player
  // fatigue/rhythm to time its own pulls for maximum effect (real comebacks).
  SHEBER: {
    timingNoiseMs: 60,
    reactionChance: 0.94,
    dangerAwareness: 0.92,
    adaptiveness: 0.85,
  },
}

/** Deterministic PRNG (mulberry32) so AI behavior is reproducible in tests
 *  when seeded, while still feeling organic in real play with a random seed. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Box-Muller transform for approximately-normal timing noise. */
function gaussianNoise(rng: () => number, stdDev: number): number {
  const u1 = Math.max(rng(), 1e-9)
  const u2 = rng()
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return z0 * stdDev
}

export class ArqanAI {
  difficulty: AiDifficulty
  private rng: () => number
  private config: MatchConfig

  constructor(difficulty: AiDifficulty, seed = Date.now(), config: Partial<MatchConfig> = {}) {
    this.difficulty = difficulty
    this.rng = createRng(seed)
    this.config = { ...DEFAULT_MATCH_CONFIG, ...config }
  }

  /**
   * Decide whether the AI taps for the upcoming beat, and if so, at what
   * timing offset (ms, signed — negative early, positive late) from the
   * ideal beat. Reads live match state (rope position, both teams' fatigue,
   * player momentum) so behavior is NOT pure random, per spec.
   */
  decideBeat(engine: ForceEngine): { willPull: boolean; timingOffsetMs: number } {
    const tier = AI_TIERS[this.difficulty]
    const danger = engine.getDangerLevel('AI')

    // Danger-aware tiers become far more likely to commit to a beat when
    // close to losing — this is what makes a Шебер/Шәкірт comeback possible.
    const effectiveReactionChance = Math.min(
      1,
      tier.reactionChance + danger * tier.dangerAwareness * (1 - tier.reactionChance)
    )
    const willPull = this.rng() < effectiveReactionChance

    // Adaptive tiers tighten their own timing further when the player is
    // fatigued (pressing the advantage) or when the AI itself is fresh
    // relative to the player, mirroring a real opponent reading the room.
    const playerFatigueAdvantage = Math.max(0, engine.player.fatigue - engine.ai.fatigue)
    const adaptiveTightening = 1 - tier.adaptiveness * playerFatigueAdvantage * 0.6
    const effectiveNoise = tier.timingNoiseMs * Math.max(0.35, adaptiveTightening)

    const timingOffsetMs = gaussianNoise(this.rng, effectiveNoise)
    return { willPull, timingOffsetMs }
  }
}
