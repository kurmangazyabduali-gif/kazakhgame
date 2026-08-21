/**
 * TOGYZQUMALAK EVALUATOR
 *
 * Evaluates a game position from a given player's perspective.
 * Returns a score where positive = favorable for the evaluating player.
 */

import { TogyzqumalakState, Player } from '../engine/types'

const KAZAN_WEIGHT = 2.0
const CAPTURE_THREAT_WEIGHT = 1.5
const TUZDYK_BONUS = 20
const TUZDYK_THREAT_WEIGHT = 5

export function evaluatePosition(state: TogyzqumalakState, forPlayer: Player): number {
  if (state.status === 'player1_wins') return forPlayer === 1 ? 10000 : -10000
  if (state.status === 'player2_wins') return forPlayer === 2 ? 10000 : -10000
  if (state.status === 'draw') return 0

  // Material: kazan advantage
  const myKazan = forPlayer === 1 ? state.kazan.player1 : state.kazan.player2
  const oppKazan = forPlayer === 1 ? state.kazan.player2 : state.kazan.player1
  let score = (myKazan - oppKazan) * KAZAN_WEIGHT

  // Tuzdyk bonus
  const myTuzdyk = forPlayer === 1 ? state.tuzdyk.player1 : state.tuzdyk.player2
  const oppTuzdyk = forPlayer === 1 ? state.tuzdyk.player2 : state.tuzdyk.player1
  if (myTuzdyk !== null) score += TUZDYK_BONUS
  if (oppTuzdyk !== null) score -= TUZDYK_BONUS

  // Capture threats: count even opponent otaus (potential captures on next move)
  const myOtaus = forPlayer === 1 ? state.board.player1Otaus : state.board.player2Otaus
  const oppOtaus = forPlayer === 1 ? state.board.player2Otaus : state.board.player1Otaus

  // Count how many of my otaus have stones (mobility)
  const myMobility = myOtaus.filter(s => s > 0).length
  score += myMobility * 0.1

  // Penalize even opponent otaus (they could be captured next turn by opponent)
  for (const stones of oppOtaus) {
    if (stones > 0 && stones % 2 === 0) score += CAPTURE_THREAT_WEIGHT
    if (stones === 3 && myTuzdyk === null) score += TUZDYK_THREAT_WEIGHT // tuzdyk opportunity
  }

  // Penalize even own otaus (opponent can capture them)
  for (const stones of myOtaus) {
    if (stones > 0 && stones % 2 === 0) score -= CAPTURE_THREAT_WEIGHT * 0.5
  }

  return score
}
