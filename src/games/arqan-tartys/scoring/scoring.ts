import { MatchResult } from './validateMatch'

export function calculateMatchXP(result: MatchResult, level: number): number {
  const winBonus = result.winner === 'PLAYER' ? 120 : 20
  const roundBonus = result.playerRoundsWon * 30
  const comebackBonus = result.hadComeback && result.winner === 'PLAYER' ? 60 : 0
  const sweepBonus = result.isCleanSweep && result.winner === 'PLAYER' ? 50 : 0
  const levelScale = 1 + (level - 1) * 0.08

  return Math.round((winBonus + roundBonus + comebackBonus + sweepBonus) * levelScale)
}
