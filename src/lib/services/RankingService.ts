export class RankingService {
  /**
   * Calculates the Global Rank Score dynamically.
   * Rank Score = Total Game Score + (XP * 2)
   * This ensures the rank is heavily influenced by completing games (Score) 
   * and participating in the platform (XP from achievements, quests).
   */
  public static calculateGlobalRankScore(totalScore: number, xp: number): number {
    return (totalScore || 0) + ((xp || 0) * 2)
  }
}
