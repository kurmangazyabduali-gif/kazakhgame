import { ThrowEvent } from './types'

export const ASYK_ACHIEVEMENTS = {
  FIRST_KNOCKOUT: 'asyk_first_knockout',
  PERFECT_AIM: 'asyk_perfect_aim', // 100% accuracy in a level or game
  COMBO_3: 'asyk_combo_3', // 3 targets in one throw
  COMBO_5: 'asyk_combo_5', // 5 targets in one throw
  LEVEL_1_MASTER: 'asyk_level_1_master',
  LEVEL_5_MASTER: 'asyk_level_5_master',
  MASTER: 'asyk_master' // Score > 1000
}

export function checkAchievements(events: ThrowEvent[], totalScore: number): string[] {
  const achievements = new Set<string>()

  const targetsHit = events.reduce((sum, e) => sum + e.targetsHit, 0)
  if (targetsHit > 0) {
    achievements.add(ASYK_ACHIEVEMENTS.FIRST_KNOCKOUT)
  }

  // If hit something every throw and completed all levels (approximated here by total throws >= 5)
  if (events.length >= 5 && events.every(e => e.targetsHit > 0)) {
    achievements.add(ASYK_ACHIEVEMENTS.PERFECT_AIM)
  }

  if (events.some(e => e.combo >= 3)) achievements.add(ASYK_ACHIEVEMENTS.COMBO_3)
  if (events.some(e => e.combo >= 5)) achievements.add(ASYK_ACHIEVEMENTS.COMBO_5)

  const levelsCompleted = new Set(events.map(e => e.levelNumber))
  if (levelsCompleted.has(1)) achievements.add(ASYK_ACHIEVEMENTS.LEVEL_1_MASTER)
  if (levelsCompleted.has(5)) achievements.add(ASYK_ACHIEVEMENTS.LEVEL_5_MASTER)

  if (totalScore >= 1000) {
    achievements.add(ASYK_ACHIEVEMENTS.MASTER)
  }

  return Array.from(achievements)
}
