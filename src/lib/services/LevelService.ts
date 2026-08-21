export class LevelService {
  /**
   * Defines the user level titles based on the level number.
   */
  public static getLevelTitle(level: number): string {
    if (level >= 6) return 'Ұлы дала мұрагері'
    if (level >= 5) return 'Дәстүр білгірі'
    if (level >= 4) return 'Шебер'
    if (level >= 3) return 'Жас ойыншы'
    if (level >= 2) return 'Шәкірт'
    return 'Бала'
  }

  /**
   * Calculate level from XP.
   * Simple curve: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 300 XP, Level 4 = 600 XP, etc.
   * Formula: level = Math.floor(Math.sqrt(XP / 50)) + 1
   */
  public static calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 50)) + 1
  }

  /**
   * Calculate XP required for the NEXT level.
   */
  public static getXpForNextLevel(currentLevel: number): number {
    // Inverse of calculateLevel: xp = 50 * (level - 1)^2
    return 50 * Math.pow(currentLevel, 2)
  }

  /**
   * Determine if a user leveled up given their old XP and new XP.
   */
  public static didLevelUp(oldXp: number, newXp: number): boolean {
    return this.calculateLevel(oldXp) < this.calculateLevel(newXp)
  }
}
