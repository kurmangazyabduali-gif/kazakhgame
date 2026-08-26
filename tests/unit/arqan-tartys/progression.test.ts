import { describe, it, expect } from 'vitest'
import { calculateMatchXP } from '@/games/arqan-tartys/scoring/scoring'
import { evaluateAchievements, ACHIEVEMENTS } from '@/games/arqan-tartys/scoring/achievements'
import { DEFAULT_PROGRESSION, mergeNewAchievements } from '@/games/arqan-tartys/scoring/progression'
import { MatchResult } from '@/games/arqan-tartys/engine/MatchManager'

function makeResult(overrides: Partial<MatchResult> = {}): MatchResult {
  return {
    winner: 'PLAYER',
    playerRoundsWon: 2,
    aiRoundsWon: 0,
    rounds: [
      { roundNumber: 1, winner: 'PLAYER', playerBestStreak: 3, aiBestStreak: 1, playerPerfectPulls: 4, aiPerfectPulls: 1, wasComeback: false },
      { roundNumber: 2, winner: 'PLAYER', playerBestStreak: 5, aiBestStreak: 2, playerPerfectPulls: 5, aiPerfectPulls: 2, wasComeback: true },
    ],
    bestRhythmPulls: 5,
    hadComeback: true,
    isCleanSweep: true,
    ...overrides,
  }
}

describe('Arqan Tartys — Progression persistence', () => {
  it('a win awards more XP than a loss', () => {
    const win = calculateMatchXP(makeResult({ winner: 'PLAYER' }), 1)
    const loss = calculateMatchXP(makeResult({ winner: 'AI', playerRoundsWon: 0, aiRoundsWon: 2 }), 1)
    expect(win).toBeGreaterThan(loss)
  })

  it('higher levels scale XP upward', () => {
    const result = makeResult()
    const level1XP = calculateMatchXP(result, 1)
    const level8XP = calculateMatchXP(result, 8)
    expect(level8XP).toBeGreaterThan(level1XP)
  })

  it('FIRST_PULL unlocks on a player\'s first-ever pull regardless of outcome', () => {
    const unlocked = evaluateAchievements(
      makeResult({ winner: 'AI', playerRoundsWon: 0, aiRoundsWon: 2, isCleanSweep: false, hadComeback: false }),
      { isFirstPullEver: true, isFirstWinEver: false, completedLevel: 1, totalLevels: 8 },
      new Set()
    )
    expect(unlocked).toContain('FIRST_PULL')
  })

  it('CLEAN_SWEEP only unlocks for a 3:0 player win', () => {
    const sweep = evaluateAchievements(
      makeResult({ winner: 'PLAYER', isCleanSweep: true }),
      { isFirstPullEver: false, isFirstWinEver: false, completedLevel: 3, totalLevels: 8 },
      new Set()
    )
    expect(sweep).toContain('CLEAN_SWEEP')

    const notSweep = evaluateAchievements(
      makeResult({ winner: 'PLAYER', isCleanSweep: false }),
      { isFirstPullEver: false, isFirstWinEver: false, completedLevel: 3, totalLevels: 8 },
      new Set()
    )
    expect(notSweep).not.toContain('CLEAN_SWEEP')
  })

  it('ROPE_MASTER unlocks only when the final level is completed with a win', () => {
    const finalLevelWin = evaluateAchievements(
      makeResult({ winner: 'PLAYER' }),
      { isFirstPullEver: false, isFirstWinEver: false, completedLevel: 8, totalLevels: 8 },
      new Set()
    )
    expect(finalLevelWin).toContain('ROPE_MASTER')

    const earlyLevelWin = evaluateAchievements(
      makeResult({ winner: 'PLAYER' }),
      { isFirstPullEver: false, isFirstWinEver: false, completedLevel: 3, totalLevels: 8 },
      new Set()
    )
    expect(earlyLevelWin).not.toContain('ROPE_MASTER')
  })

  it('already-unlocked achievements are not re-emitted', () => {
    const unlocked = evaluateAchievements(
      makeResult(),
      { isFirstPullEver: true, isFirstWinEver: true, completedLevel: 8, totalLevels: 8 },
      new Set(['FIRST_PULL', 'FIRST_WIN'])
    )
    expect(unlocked).not.toContain('FIRST_PULL')
    expect(unlocked).not.toContain('FIRST_WIN')
  })

  it('mergeNewAchievements is idempotent and deduplicates', () => {
    const merged = mergeNewAchievements(DEFAULT_PROGRESSION, ['FIRST_PULL'])
    const mergedAgain = mergeNewAchievements(merged, ['FIRST_PULL'])
    expect(mergedAgain.achievements).toEqual(['FIRST_PULL'])
  })

  it('every achievement id referenced by evaluateAchievements has a definition', () => {
    const ids = Object.keys(ACHIEVEMENTS)
    expect(ids).toEqual(
      expect.arrayContaining(['FIRST_PULL', 'FIRST_WIN', 'PERFECT_RHYTHM', 'COMEBACK', 'CLEAN_SWEEP', 'ROPE_MASTER'])
    )
  })

  it('DEFAULT_PROGRESSION starts a fresh player at level 1 with no XP', () => {
    expect(DEFAULT_PROGRESSION.unlockedLevel).toBe(1)
    expect(DEFAULT_PROGRESSION.totalXP).toBe(0)
    expect(DEFAULT_PROGRESSION.achievements).toEqual([])
  })
})
