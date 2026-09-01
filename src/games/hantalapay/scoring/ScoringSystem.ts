import { AsykItem, RoundConfig, RoundResultData } from '../engine/types'

export class ScoringSystemCalculator {
  public calculateAsykPoints(item: AsykItem, comboStreak: number): { basePoints: number; comboMultiplier: number; totalPoints: number } {
    let base = item.isKhan ? 500 : 100

    // Orientation bonus
    if (item.orientation === 'ALSHY') base += 50
    else if (item.orientation === 'TAYKE') base += 30
    else if (item.orientation === 'BUK') base += 10

    const comboMultiplier = Math.min(3.0, 1.0 + (comboStreak - 1) * 0.15)
    const totalPoints = Math.round(base * comboMultiplier)

    return { basePoints: base, comboMultiplier, totalPoints }
  }

  public calculateRoundResult(
    roundConfig: RoundConfig,
    collectedAsyks: number,
    totalAsyks: number,
    khanCaptured: boolean,
    timeSpentSec: number,
    maxCombo: number,
    totalTaps: number,
    rawScore: number
  ): RoundResultData {
    const leftoverSec = Math.max(0, roundConfig.timeLimitSec - timeSpentSec)
    const speedBonus = Math.round(leftoverSec * 50)
    const finalScore = rawScore + speedBonus

    const accuracyPct = totalTaps > 0 ? Math.min(100, Math.round((collectedAsyks / totalTaps) * 100)) : 100

    let stars = 0
    if (finalScore >= roundConfig.targetScoreFor3Stars) stars = 3
    else if (finalScore >= roundConfig.targetScoreFor2Stars) stars = 2
    else if (finalScore >= roundConfig.targetScoreFor1Star) stars = 1
    else if (collectedAsyks > 0) stars = 1

    return {
      roundNumber: roundConfig.roundNumber,
      collectedAsyks,
      totalAsyks,
      khanCaptured,
      timeSpentSec: Math.round(timeSpentSec * 10) / 10,
      maxCombo,
      accuracyPct,
      score: finalScore,
      stars,
    }
  }

  public calculateXP(totalScore: number, totalStars: number): number {
    return Math.round(totalScore * 0.1) + totalStars * 150
  }
}

export const scoringCalculator = new ScoringSystemCalculator()
