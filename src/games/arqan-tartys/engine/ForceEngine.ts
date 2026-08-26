import {
  ArqanState,
  DEFAULT_MATCH_CONFIG,
  MatchConfig,
  PullResult,
  Side,
  TeamMatchState,
  classifyTiming,
  qualityBaseForce,
} from './types'

function freshTeamState(): TeamMatchState {
  return {
    force: 0,
    fatigue: 0,
    momentum: 0,
    bestStreak: 0,
    pullsAttempted: 0,
    perfectPulls: 0,
  }
}

/**
 * Drives one round of Arqan Tartys: rope position, both teams' force/
 * fatigue/momentum, and the round-level state machine. AI decisions and
 * round/match bookkeeping (best-of-3) live in ai/ and scoring/ respectively
 * and call into this engine rather than duplicating its math.
 */
export class ForceEngine {
  config: MatchConfig
  state: ArqanState = 'READY'

  /** Rope center position: 0 = center, +winThreshold = player win,
   *  -winThreshold = AI win. */
  ropePosition = 0

  player: TeamMatchState = freshTeamState()
  ai: TeamMatchState = freshTeamState()

  /** ms elapsed since the round's first beat — used to schedule the next
   *  ideal beat and to compute tap timing offsets. */
  private roundClockMs = 0
  private nextBeatAtMs: number

  constructor(config: Partial<MatchConfig> = {}) {
    this.config = { ...DEFAULT_MATCH_CONFIG, ...config }
    this.nextBeatAtMs = this.config.beatIntervalMs
  }

  reset() {
    this.state = 'READY'
    this.ropePosition = 0
    this.player = freshTeamState()
    this.ai = freshTeamState()
    this.roundClockMs = 0
    this.nextBeatAtMs = this.config.beatIntervalMs
  }

  startRound() {
    this.state = 'ROUND_START'
    this.ropePosition = 0
    this.player.fatigue = 0
    this.ai.fatigue = 0
    this.player.momentum = 0
    this.ai.momentum = 0
    this.player.pullsAttempted = 0
    this.ai.pullsAttempted = 0
    this.player.perfectPulls = 0
    this.ai.perfectPulls = 0
    this.roundClockMs = 0
    this.nextBeatAtMs = this.config.beatIntervalMs
  }

  /** Transition into active pulling once the round-start intro has played. */
  beginPull() {
    this.state = 'PULL'
  }

  /** Advance the round clock. Call every frame with the elapsed ms.
   *  Handles passive fatigue recovery while no one is actively pulling. */
  tick(deltaMs: number) {
    this.roundClockMs += deltaMs
    if (this.state === 'RECOVERY') {
      this.player.fatigue = Math.max(0, this.player.fatigue - this.config.fatigueRecoveryPerMs * deltaMs)
      this.ai.fatigue = Math.max(0, this.ai.fatigue - this.config.fatigueRecoveryPerMs * deltaMs)
    }
  }

  /** The ideal beat timestamp closest to `now` — exposed so UI can render
   *  the upcoming rhythm marker countdown. */
  getNextBeatMs(): number {
    return this.nextBeatAtMs
  }

  /** Advance the beat schedule forward once a beat has passed. Called by
   *  the scene/AI driver on its own timer independent of player input. */
  advanceBeat() {
    this.nextBeatAtMs += this.config.beatIntervalMs
  }

  /**
   * Register a pull attempt from `side` at `atMs` (the round clock time the
   * tap landed). Returns the resulting PullResult so callers can drive
   * animation/sound/screen-shake off it.
   */
  registerPull(side: Side, atMs: number): PullResult {
    const timingOffsetMs = atMs - this.nextBeatAtMs
    const quality = classifyTiming(timingOffsetMs, this.config)
    const team = side === 'PLAYER' ? this.player : this.ai

    team.pullsAttempted += 1

    const fatigueMultiplier = 1 - team.fatigue * 0.75
    const momentumMultiplier = 1 + Math.min(team.momentum, this.config.maxMomentum) * this.config.momentumBonusPerStreak
    const base = qualityBaseForce(quality)
    const force = Math.max(0, base * fatigueMultiplier * momentumMultiplier)

    team.force = force

    if (quality === 'PERFECT' || quality === 'GOOD') {
      team.momentum = Math.min(this.config.maxMomentum, team.momentum + 1)
      team.bestStreak = Math.max(team.bestStreak, team.momentum)
      if (quality === 'PERFECT') team.perfectPulls += 1
    } else {
      team.momentum = 0
    }

    // Fatigue cost scales down for well-timed pulls (rewards rhythm over spam).
    const fatigueCost = this.config.fatiguePerPull * (quality === 'MISS' ? 1.4 : quality === 'PERFECT' ? 0.7 : 1)
    team.fatigue = Math.min(1, team.fatigue + fatigueCost)

    const opponent = side === 'PLAYER' ? this.ai : this.player
    const netForce = force - opponent.force * 0.35
    const direction = side === 'PLAYER' ? 1 : -1
    this.ropePosition = clamp(
      this.ropePosition + direction * netForce * this.config.forceToRopeScale,
      -this.config.winThreshold,
      this.config.winThreshold
    )

    return { quality, force, timingOffsetMs }
  }

  /** True once the rope has crossed a win threshold. */
  checkWinner(): Side | null {
    if (this.ropePosition >= this.config.winThreshold) return 'PLAYER'
    if (this.ropePosition <= -this.config.winThreshold) return 'AI'
    return null
  }

  enterRecovery() {
    this.state = 'RECOVERY'
  }

  enterRoundResult() {
    this.state = 'ROUND_RESULT'
  }

  enterMatchResult() {
    this.state = 'MATCH_RESULT'
  }

  /** How close a team is to losing, 0 (safe) .. 1 (about to lose) — used by
   *  the comeback mechanic and AI difficulty tiers. */
  getDangerLevel(side: Side): number {
    const signed = side === 'PLAYER' ? this.ropePosition : -this.ropePosition
    return Math.max(0, Math.min(1, -signed / this.config.winThreshold))
  }
}

// Local clamp helper — kept as a plain function (no Phaser.Math import) so
// engine/ stays framework-free and independently unit-testable.
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
