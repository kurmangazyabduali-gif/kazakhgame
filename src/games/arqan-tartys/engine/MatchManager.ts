import { ForceEngine } from './ForceEngine'
import { ArqanState, MatchConfig, Side } from './types'

export interface RoundRecord {
  roundNumber: number
  winner: Side
  playerBestStreak: number
  aiBestStreak: number
  playerPerfectPulls: number
  aiPerfectPulls: number
  /** True if the winning side was behind (danger >= 0.5) at any point this
   *  round and still won — a comeback. */
  wasComeback: boolean
}

export interface MatchResult {
  winner: Side
  playerRoundsWon: number
  aiRoundsWon: number
  rounds: RoundRecord[]
  bestRhythmPulls: number
  hadComeback: boolean
  isCleanSweep: boolean // 3:0 (either direction)
}

export const ROUNDS_TO_WIN = 2
const MAX_ROUNDS = 3

/**
 * Orchestrates a best-of-3 match: owns a ForceEngine per round (fatigue and
 * momentum reset each round per spec), tracks round wins, and produces the
 * final MatchResult once a side reaches ROUNDS_TO_WIN.
 */
export class MatchManager {
  engine: ForceEngine
  rounds: RoundRecord[] = []
  private maxDangerThisRound: { PLAYER: number; AI: number } = { PLAYER: 0, AI: 0 }

  constructor(config: Partial<MatchConfig> = {}) {
    this.engine = new ForceEngine(config)
  }

  /** Convenience passthrough — MatchManager owns one ForceEngine per round,
   *  and its match config stays constant across rounds within a match. */
  get config(): MatchConfig {
    return this.engine.config
  }

  get state(): ArqanState {
    return this.engine.state
  }

  get currentRoundNumber(): number {
    return this.rounds.length + 1
  }

  get playerRoundsWon(): number {
    return this.rounds.filter((r) => r.winner === 'PLAYER').length
  }

  get aiRoundsWon(): number {
    return this.rounds.filter((r) => r.winner === 'AI').length
  }

  startNewRound() {
    this.engine.startRound()
    this.maxDangerThisRound = { PLAYER: 0, AI: 0 }
  }

  beginPull() {
    this.engine.beginPull()
  }

  tick(deltaMs: number) {
    this.engine.tick(deltaMs)
    if (this.engine.state === 'PULL') {
      this.maxDangerThisRound.PLAYER = Math.max(this.maxDangerThisRound.PLAYER, this.engine.getDangerLevel('PLAYER'))
      this.maxDangerThisRound.AI = Math.max(this.maxDangerThisRound.AI, this.engine.getDangerLevel('AI'))
    }
  }

  registerPull(side: Side, atMs: number) {
    return this.engine.registerPull(side, atMs)
  }

  /** Call once per frame during PULL — resolves the round if a winner has
   *  emerged, transitioning the state machine to ROUND_RESULT. */
  checkRoundEnd(): RoundRecord | null {
    const winner = this.engine.checkWinner()
    if (!winner) return null

    const loser: Side = winner === 'PLAYER' ? 'AI' : 'PLAYER'
    const record: RoundRecord = {
      roundNumber: this.currentRoundNumber,
      winner,
      playerBestStreak: this.engine.player.bestStreak,
      aiBestStreak: this.engine.ai.bestStreak,
      playerPerfectPulls: this.engine.player.perfectPulls,
      aiPerfectPulls: this.engine.ai.perfectPulls,
      wasComeback: this.maxDangerThisRound[winner] >= 0.5,
    }
    void loser
    this.rounds.push(record)
    this.engine.enterRoundResult()
    return record
  }

  /** True once either side has clinched the match (best of 3). */
  isMatchOver(): boolean {
    return this.playerRoundsWon >= ROUNDS_TO_WIN || this.aiRoundsWon >= ROUNDS_TO_WIN || this.rounds.length >= MAX_ROUNDS
  }

  finishMatch(): MatchResult {
    this.engine.enterMatchResult()
    const winner: Side = this.playerRoundsWon > this.aiRoundsWon ? 'PLAYER' : 'AI'
    const bestRhythmPulls = Math.max(
      0,
      ...this.rounds.map((r) => (winner === 'PLAYER' ? r.playerPerfectPulls : r.aiPerfectPulls))
    )
    return {
      winner,
      playerRoundsWon: this.playerRoundsWon,
      aiRoundsWon: this.aiRoundsWon,
      rounds: [...this.rounds],
      bestRhythmPulls,
      hadComeback: this.rounds.some((r) => r.wasComeback),
      isCleanSweep:
        (this.playerRoundsWon === ROUNDS_TO_WIN && this.aiRoundsWon === 0) ||
        (this.aiRoundsWon === ROUNDS_TO_WIN && this.playerRoundsWon === 0),
    }
  }

  reset() {
    this.rounds = []
    this.engine.reset()
    this.maxDangerThisRound = { PLAYER: 0, AI: 0 }
  }
}
