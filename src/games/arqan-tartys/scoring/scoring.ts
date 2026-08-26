import { MatchResult } from '../engine/MatchManager'

/** XP awarded for a completed match — win bonus, per-round bonus, and a
 *  rhythm-quality bonus so precise play is rewarded beyond just winning. */
export function calculateMatchXP(result: MatchResult, level: number): number {
  const winBonus = result.winner === 'PLAYER' ? 120 : 20
  const roundBonus = result.playerRoundsWon * 30
  const perfectBonus = result.rounds.reduce((sum, r) => sum + r.playerPerfectPulls, 0) * 4
  const comebackBonus = result.hadComeback && result.winner === 'PLAYER' ? 60 : 0
  const sweepBonus = result.isCleanSweep && result.winner === 'PLAYER' ? 50 : 0
  const levelScale = 1 + (level - 1) * 0.08

  return Math.round((winBonus + roundBonus + perfectBonus + comebackBonus + sweepBonus) * levelScale)
}
