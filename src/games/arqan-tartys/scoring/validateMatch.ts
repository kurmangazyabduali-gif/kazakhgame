import { ForceEngine } from '../engine/ForceEngine'
import { MatchManager, MatchResult } from '../engine/MatchManager'
import { ArqanAI } from '../ai/ArqanAI'
import { ARQAN_LEVELS } from '../levels/config'
import { AiDifficulty, Side } from '../engine/types'

/** A single logged pull, exactly as the client's InputManager recorded it —
 *  this is the raw, low-trust data submitted to the server. */
export interface PullEvent {
  side: Side
  /** ms since that round's PULL state began. */
  atMs: number
  roundNumber: number
}

export interface MatchSubmission {
  level: number
  events: PullEvent[]
  /** Seed the client used for its own AI decisions this match — replayed
   *  server-side so the AI's pulls are reproduced deterministically rather
   *  than trusted from the client's event log directly. Only the PLAYER's
   *  events are trusted as "what the human did"; AI pulls are always
   *  re-simulated server-side, never taken from the client. */
   aiSeed: number
}

export interface ValidationFailure {
  valid: false
  reason: string
}

export interface ValidationSuccess {
  valid: true
  result: MatchResult
  score: number
}

const MAX_EVENTS = 4000
const MAX_ROUNDS = 3

/**
 * Recompute a full match server-side from a raw pull-event log, per the
 * project rule that scores must never be trusted from the client. The
 * server:
 *  - re-simulates the AI independently (client-submitted AI "pulls" are
 *    ignored entirely — only PLAYER-side events are read from the payload),
 *  - replays PLAYER events through the same ForceEngine/MatchManager logic
 *    used client-side, so rope movement, timing quality, fatigue, momentum,
 *    round winners, and the match winner are all derived server-side,
 *  - rejects payloads with an implausible number of events or an unknown
 *    level.
 */
export function validateMatchSubmission(
  submission: MatchSubmission
): ValidationFailure | ValidationSuccess {
  const { level, events, aiSeed } = submission

  const levelConfig = ARQAN_LEVELS[level]
  if (!levelConfig) {
    return { valid: false, reason: `Unknown level: ${level}` }
  }
  if (!Array.isArray(events) || events.length === 0 || events.length > MAX_EVENTS) {
    return { valid: false, reason: 'Invalid or implausible event count' }
  }
  if (typeof aiSeed !== 'number' || !Number.isFinite(aiSeed)) {
    return { valid: false, reason: 'Invalid AI seed' }
  }

  // Only trust PLAYER-authored events from the client. AI behavior is
  // always re-derived server-side from the seed, never taken from the
  // submitted log — this closes the obvious "submit fabricated AI pulls
  // that always miss" cheat vector.
  const playerEvents = events
    .filter((e) => e.side === 'PLAYER')
    .filter((e) => typeof e.atMs === 'number' && Number.isFinite(e.atMs) && e.atMs >= 0 && e.atMs < 10 * 60 * 1000)
    .filter((e) => Number.isInteger(e.roundNumber) && e.roundNumber >= 1 && e.roundNumber <= MAX_ROUNDS)
    .sort((a, b) => a.roundNumber - b.roundNumber || a.atMs - b.atMs)

  if (playerEvents.length === 0) {
    return { valid: false, reason: 'No valid player events submitted' }
  }

  const manager = new MatchManager(levelConfig.matchConfig)
  const ai = new ArqanAI(levelConfig.aiDifficulty as AiDifficulty, aiSeed, levelConfig.matchConfig)

  let roundNumber = 1
  let safetyTicks = 0
  const SAFETY_TICK_LIMIT = 200_000 // generous ceiling against pathological/malicious input causing an infinite loop

  while (!manager.isMatchOver() && roundNumber <= MAX_ROUNDS) {
    manager.startNewRound()
    manager.beginPull()

    const roundEvents = playerEvents.filter((e) => e.roundNumber === roundNumber)
    let eventIdx = 0
    let clockMs = 0
    const TICK_MS = 16

    while (true) {
      safetyTicks++
      if (safetyTicks > SAFETY_TICK_LIMIT) {
        return { valid: false, reason: 'Simulation exceeded safety tick limit' }
      }

      manager.tick(TICK_MS)
      clockMs += TICK_MS

      // Replay any player events whose timestamp has now elapsed.
      while (eventIdx < roundEvents.length && roundEvents[eventIdx].atMs <= clockMs) {
        manager.registerPull('PLAYER', roundEvents[eventIdx].atMs)
        eventIdx++
      }

      // AI acts on its own beat schedule, independent of client input.
      if (clockMs >= manager.engine.getNextBeatMs()) {
        const decision = ai.decideBeat(manager.engine)
        if (decision.willPull) {
          manager.registerPull('AI', manager.engine.getNextBeatMs() + decision.timingOffsetMs)
        }
        manager.engine.advanceBeat()
      }

      const roundRecord = manager.checkRoundEnd()
      if (roundRecord) break

      // A round that runs implausibly long (far beyond what fatigue/rhythm
      // mechanics should allow) is treated as invalid rather than hung.
      if (clockMs > 5 * 60 * 1000) {
        return { valid: false, reason: `Round ${roundNumber} did not resolve within a plausible duration` }
      }
      // No more player events left and the AI has also had ample time to
      // finish the round on its own — avoid spinning forever on a payload
      // that simply stopped submitting events mid-round.
      if (eventIdx >= roundEvents.length && clockMs > 90_000) {
        return { valid: false, reason: `Round ${roundNumber} stalled — insufficient events to resolve it` }
      }
    }

    roundNumber++
  }

  if (!manager.isMatchOver()) {
    return { valid: false, reason: 'Match did not reach a valid conclusion' }
  }

  const result = manager.finishMatch()
  const score = computeServerScore(result)

  return { valid: true, result, score }
}

function computeServerScore(result: MatchResult): number {
  const roundScore = result.playerRoundsWon * 100
  const perfectScore = result.rounds.reduce((sum, r) => sum + r.playerPerfectPulls, 0) * 15
  const winBonus = result.winner === 'PLAYER' ? 200 : 0
  const sweepBonus = result.isCleanSweep && result.winner === 'PLAYER' ? 100 : 0
  return roundScore + perfectScore + winBonus + sweepBonus
}

// Re-exported so the API route doesn't need to reach into engine/ directly.
export { ForceEngine }
