import { describe, it, expect } from 'vitest'
import { MatchManager } from '@/games/arqan-tartys/engine/MatchManager'

/** Drive a MatchManager round to completion by having one side spam
 *  perfect-timed pulls until it wins — a test helper, not game logic. */
function playRoundToWin(manager: MatchManager, winner: 'PLAYER' | 'AI') {
  manager.startNewRound()
  manager.beginPull()
  let guard = 0
  while (!manager.engine.checkWinner()) {
    guard++
    if (guard > 2000) throw new Error('round did not resolve — test helper runaway')
    manager.registerPull(winner, manager.engine.getNextBeatMs())
    manager.engine.advanceBeat()
  }
  return manager.checkRoundEnd()
}

describe('Arqan Tartys — Best of 3 match structure', () => {
  it('a match is not over after a single round win', () => {
    const manager = new MatchManager()
    playRoundToWin(manager, 'PLAYER')
    expect(manager.isMatchOver()).toBe(false)
    expect(manager.playerRoundsWon).toBe(1)
  })

  it('a player winning 2 rounds in a row clinches the match as a clean sweep', () => {
    const manager = new MatchManager()
    playRoundToWin(manager, 'PLAYER')
    playRoundToWin(manager, 'PLAYER')
    expect(manager.isMatchOver()).toBe(true)
    const result = manager.finishMatch()
    expect(result.winner).toBe('PLAYER')
    // 2:0 IS a clean sweep in best-of-3 — the loser never won a round.
    expect(result.isCleanSweep).toBe(true)
  })

  it('fatigue and momentum reset between rounds', () => {
    const manager = new MatchManager()
    playRoundToWin(manager, 'PLAYER')
    expect(manager.engine.player.fatigue).toBeGreaterThan(0)

    manager.startNewRound()
    expect(manager.engine.player.fatigue).toBe(0)
    expect(manager.engine.player.momentum).toBe(0)
  })

  it('a 2-1 split match resolves after exactly 3 rounds', () => {
    const manager = new MatchManager()
    playRoundToWin(manager, 'PLAYER')
    playRoundToWin(manager, 'AI')
    playRoundToWin(manager, 'PLAYER')
    expect(manager.rounds.length).toBe(3)
    expect(manager.isMatchOver()).toBe(true)
    const result = manager.finishMatch()
    expect(result.winner).toBe('PLAYER')
    expect(result.playerRoundsWon).toBe(2)
    expect(result.aiRoundsWon).toBe(1)
  })

  it('a clean 3:0 sweep is flagged as isCleanSweep', () => {
    const manager = new MatchManager()
    playRoundToWin(manager, 'AI')
    playRoundToWin(manager, 'AI')
    const result = manager.finishMatch()
    expect(result.isCleanSweep).toBe(true)
    expect(result.winner).toBe('AI')
  })

  it('round records track round number sequentially', () => {
    const manager = new MatchManager()
    playRoundToWin(manager, 'PLAYER')
    playRoundToWin(manager, 'AI')
    expect(manager.rounds[0].roundNumber).toBe(1)
    expect(manager.rounds[1].roundNumber).toBe(2)
  })
})
