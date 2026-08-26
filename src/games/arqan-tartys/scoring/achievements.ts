import { MatchResult } from '../engine/MatchManager'

export type AchievementId =
  | 'FIRST_PULL'
  | 'FIRST_WIN'
  | 'PERFECT_RHYTHM'
  | 'COMEBACK'
  | 'CLEAN_SWEEP'
  | 'ROPE_MASTER'

export interface AchievementDef {
  id: AchievementId
  nameKz: string
  descriptionKz: string
}

export const ACHIEVEMENTS: Record<AchievementId, AchievementDef> = {
  FIRST_PULL: { id: 'FIRST_PULL', nameKz: 'Бірінші рывок', descriptionKz: 'Алғаш рет арқанды тарттыңыз' },
  FIRST_WIN: { id: 'FIRST_WIN', nameKz: 'Бірінші жеңіс', descriptionKz: 'Алғашқы матчты жеңіп шықтыңыз' },
  PERFECT_RHYTHM: { id: 'PERFECT_RHYTHM', nameKz: 'Идеалды ырғақ', descriptionKz: 'Бір раундта 8 рет дәл ырғақпен тарттыңыз' },
  COMEBACK: { id: 'COMEBACK', nameKz: 'Камбек', descriptionKz: 'Жеңілу алдында жеңіске жеттіңіз' },
  CLEAN_SWEEP: { id: 'CLEAN_SWEEP', nameKz: 'Жеңіс 3:0', descriptionKz: 'Матчты 3:0 есебімен жеңдіңіз' },
  ROPE_MASTER: { id: 'ROPE_MASTER', nameKz: 'Арқан шебері', descriptionKz: '8-деңгейді жеңіп бітірдіңіз' },
}

const PERFECT_RHYTHM_THRESHOLD = 8

/**
 * Compute which achievements a completed match newly unlocks. Pure
 * function — takes the match result plus the set already unlocked so
 * callers (the Phaser scene, tests) can drive persistence separately.
 */
export function evaluateAchievements(
  result: MatchResult,
  context: { isFirstPullEver: boolean; isFirstWinEver: boolean; completedLevel: number; totalLevels: number },
  alreadyUnlocked: Set<AchievementId>
): AchievementId[] {
  const unlocked: AchievementId[] = []
  const add = (id: AchievementId) => {
    if (!alreadyUnlocked.has(id)) unlocked.push(id)
  }

  if (context.isFirstPullEver) add('FIRST_PULL')
  if (result.winner === 'PLAYER') {
    if (context.isFirstWinEver) add('FIRST_WIN')
    if (result.isCleanSweep) add('CLEAN_SWEEP')
    if (result.hadComeback) add('COMEBACK')
    if (context.completedLevel >= context.totalLevels) add('ROPE_MASTER')
  }
  const totalPerfect = result.rounds.reduce((sum, r) => sum + r.playerPerfectPulls, 0)
  if (totalPerfect >= PERFECT_RHYTHM_THRESHOLD) add('PERFECT_RHYTHM')

  return unlocked
}
