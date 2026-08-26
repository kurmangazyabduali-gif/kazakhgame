import { AiDifficulty, MatchConfig } from '../engine/types'

export interface ArqanLevelConfig {
  level: number
  /** Short label describing the ONE new mechanic/challenge this level adds. */
  challenge: string
  aiDifficulty: AiDifficulty
  /** Per-level overrides layered onto DEFAULT_MATCH_CONFIG. */
  matchConfig: Partial<MatchConfig>
  /** Whether this level shows the first-time tutorial overlay. */
  isTutorial?: boolean
}

// Eight levels, each introducing one clearly new challenge over the last,
// per spec: tutorial -> weak AI -> faster rhythm -> stronger team ->
// fatigue-critical -> AI comeback -> fast rhythm windows -> final challenge.
export const ARQAN_LEVELS: Record<number, ArqanLevelConfig> = {
  1: {
    level: 1,
    challenge: 'Оқыту — ырғаққа үйрену (tutorial — learn the rhythm)',
    aiDifficulty: 'BALDYRGAN',
    isTutorial: true,
    matchConfig: {
      beatIntervalMs: 1050,
      goodWindowMs: 300,
      perfectWindowMs: 140,
      fatiguePerPull: 0.06,
    },
  },
  2: {
    level: 2,
    challenge: 'Әлсіз қарсылас (weak AI opponent)',
    aiDifficulty: 'BALDYRGAN',
    matchConfig: {
      beatIntervalMs: 950,
      goodWindowMs: 260,
      perfectWindowMs: 120,
    },
  },
  3: {
    level: 3,
    challenge: 'Жылдам ырғақ (faster rhythm)',
    aiDifficulty: 'BALDYRGAN',
    matchConfig: {
      beatIntervalMs: 780,
      goodWindowMs: 220,
      perfectWindowMs: 100,
    },
  },
  4: {
    level: 4,
    challenge: 'Күшті команда (stronger opposing team)',
    aiDifficulty: 'SHAKIRT',
    matchConfig: {
      beatIntervalMs: 760,
      goodWindowMs: 210,
      perfectWindowMs: 95,
    },
  },
  5: {
    level: 5,
    challenge: 'Шаршау шешуші рөл атқарады (fatigue becomes critical)',
    aiDifficulty: 'SHAKIRT',
    matchConfig: {
      beatIntervalMs: 740,
      fatiguePerPull: 0.13,
      fatigueRecoveryPerMs: 0.00022,
      goodWindowMs: 200,
      perfectWindowMs: 90,
    },
  },
  6: {
    level: 6,
    challenge: 'AI камбек жасай алады (AI can comeback)',
    aiDifficulty: 'SHAKIRT',
    matchConfig: {
      beatIntervalMs: 720,
      fatiguePerPull: 0.12,
      goodWindowMs: 190,
      perfectWindowMs: 85,
      momentumBonusPerStreak: 0.05,
    },
  },
  7: {
    level: 7,
    challenge: 'Тез ырғақ терезелері (fast rhythm windows)',
    aiDifficulty: 'SHEBER',
    matchConfig: {
      beatIntervalMs: 620,
      goodWindowMs: 160,
      perfectWindowMs: 70,
      fatiguePerPull: 0.11,
    },
  },
  8: {
    level: 8,
    challenge: 'Соңғы сынақ — шебер қарсылас (final challenge — master AI)',
    aiDifficulty: 'SHEBER',
    matchConfig: {
      beatIntervalMs: 560,
      goodWindowMs: 140,
      perfectWindowMs: 60,
      fatiguePerPull: 0.12,
      fatigueRecoveryPerMs: 0.00024,
      momentumBonusPerStreak: 0.055,
    },
  },
}

export const ARQAN_LEVEL_COUNT = Object.keys(ARQAN_LEVELS).length
