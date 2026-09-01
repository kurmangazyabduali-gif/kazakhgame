import { guestStorage } from '@/lib/guestStorage'

export interface MatchScoreResult {
  score: number
  stars: number
  xpEarned: number
  unlockedAchievements: string[]
}

/**
 * Calculates score and stars based on match achievements
 */
export function calculateMatchScore(
  win: boolean,
  roundsWon: number,
  roundsLost: number,
  perfectPushes: number,
  staminaEfficiency: number, // 0..100
  comebackTriggered: boolean,
  difficulty: 'BALDYRGAN' | 'SHAKIRT' | 'SHEBER' | 'MAJSTER'
): MatchScoreResult {
  if (!win) {
    return {
      score: 100 * roundsWon,
      stars: 0,
      xpEarned: 20 * roundsWon,
      unlockedAchievements: []
    }
  }

  // Base score
  let baseScore = 1000
  let diffMultiplier = 1.0
  if (difficulty === 'BALDYRGAN') diffMultiplier = 0.8
  if (difficulty === 'SHAKIRT') diffMultiplier = 1.0
  if (difficulty === 'SHEBER') diffMultiplier = 1.4
  if (difficulty === 'MAJSTER') diffMultiplier = 1.8

  // Rounds bonus (win 2-0 is better than 2-1)
  const roundBonus = roundsLost === 0 ? 500 : 200

  // Perfect hits bonus
  const perfectBonus = perfectPushes * 150

  // Comeback multiplier
  const comebackBonus = comebackTriggered ? 300 : 0

  // Stamina conservation bonus
  const staminaBonus = Math.floor(staminaEfficiency * 4.5)

  const finalScore = Math.floor((baseScore + roundBonus + perfectBonus + comebackBonus + staminaBonus) * diffMultiplier)

  // Calculate stars: 3 stars for clean sheets/high score, 2 for decent, 1 for struggle
  let stars = 1
  if (finalScore >= 1900) {
    stars = 3
  } else if (finalScore >= 1200) {
    stars = 2
  }

  // Calculate XP
  const xpEarned = Math.floor(finalScore / 10)

  // Determine achievements
  const unlockedAchievements: string[] = []
  
  // Rule achievements
  unlockedAchievements.push('Первая победа')
  
  if (perfectPushes >= 3) {
    unlockedAchievements.push('Perfect Push')
  }
  
  if (comebackTriggered) {
    unlockedAchievements.push('Камбек')
    unlockedAchievements.push('Perfect Counter')
  }
  
  if (roundsLost === 0) {
    unlockedAchievements.push('Победа 3:0')
  }

  if (difficulty === 'SHEBER') {
    unlockedAchievements.push('Победа над Шебер')
  }

  if (difficulty === 'MAJSTER') {
    unlockedAchievements.push('Победа над Майстер')
    unlockedAchievements.push('Мастер Қол күрес')
  }

  return {
    score: finalScore,
    stars,
    xpEarned,
    unlockedAchievements
  }
}

export function saveQolKuresResult(
  score: number,
  xp: number,
  achievements: string[]
): void {
  // Save match scores to guest storage
  guestStorage.saveGameResult('qol-kures', score, xp)
  
  // Unlock achievements
  achievements.forEach(ach => {
    guestStorage.unlockAchievement(ach)
  })
}
