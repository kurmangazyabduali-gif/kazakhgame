/**
 * TUZDYK LOGIC
 *
 * Per official rules:
 * 1. A tuzdyk is created when the last stone falls on the OPPONENT's otau and makes it exactly 3.
 * 2. Restrictions:
 *    a. A player can only have ONE tuzdyk per game.
 *    b. The 9th otau (index 8) of the opponent cannot be a tuzdyk.
 *    c. The otau cannot be symmetrical to the opponent's existing tuzdyk.
 *       (If opponent's tuzdyk is on your index N, you cannot make their index N your tuzdyk.)
 * 3. When a tuzdyk is created, the 3 stones in it are captured.
 * 4. For the rest of the game, any stone landing in a tuzdyk goes to the tuzdyk owner's kazan.
 */

import { BoardState, Player, Tuzdyk, Kazan, MoveEvent } from '../types'
import { getStones, setStones } from './moveLogic'

export interface TuzdykCheckResult {
  canCreateTuzdyk: boolean
  reason?: string
}

/**
 * Check whether a tuzdyk CAN be created at a given position.
 */
export function canCreateTuzdyk(
  movingPlayer: Player,
  lastOtauIndex: number,
  lastPlayer: Player,
  tuzdyk: Tuzdyk
): TuzdykCheckResult {
  // Must land on opponent's side
  if (lastPlayer === movingPlayer) {
    return { canCreateTuzdyk: false, reason: 'Must land on opponent side' }
  }

  // The 9th otau (index 8) cannot be a tuzdyk
  if (lastOtauIndex === 8) {
    return { canCreateTuzdyk: false, reason: 'Cannot tuzdyk the 9th otau' }
  }

  // Player can only have one tuzdyk
  if (movingPlayer === 1 && tuzdyk.player1 !== null) {
    return { canCreateTuzdyk: false, reason: 'Player 1 already has a tuzdyk' }
  }
  if (movingPlayer === 2 && tuzdyk.player2 !== null) {
    return { canCreateTuzdyk: false, reason: 'Player 2 already has a tuzdyk' }
  }

  // Cannot be symmetrical to opponent's tuzdyk
  // If opponent has a tuzdyk on their side at index X, it blocks the moving player
  // from creating one at the same index on their side.
  // 
  // In our model: P1's tuzdyk is an index on P2's row; P2's tuzdyk is an index on P1's row.
  // Symmetric check: if P2 already has their tuzdyk at index lastOtauIndex on P1's side,
  // then P1 cannot create tuzdyk at lastOtauIndex on P2's side.
  if (movingPlayer === 1 && tuzdyk.player2 === lastOtauIndex) {
    return { canCreateTuzdyk: false, reason: 'Symmetric to opponent tuzdyk' }
  }
  if (movingPlayer === 2 && tuzdyk.player1 === lastOtauIndex) {
    return { canCreateTuzdyk: false, reason: 'Symmetric to opponent tuzdyk' }
  }

  return { canCreateTuzdyk: true }
}

export interface TuzdykResult {
  board: BoardState
  kazan: Kazan
  tuzdyk: Tuzdyk
  tuzdykCreated: boolean
  tuzdykIndex: number | null
  events: MoveEvent[]
}

/**
 * Evaluate whether a tuzdyk should be created after sowing.
 * Also handles ongoing tuzdyk captures (stone landing in existing tuzdyk).
 */
export function evaluateTuzdyk(
  board: BoardState,
  movingPlayer: Player,
  lastPlayer: Player,
  lastOtauIndex: number,
  kazan: Kazan,
  tuzdyk: Tuzdyk
): TuzdykResult {
  const newBoard = { ...board, player1Otaus: [...board.player1Otaus], player2Otaus: [...board.player2Otaus] }
  const newKazan = { ...kazan }
  const newTuzdyk = { ...tuzdyk }
  const events: MoveEvent[] = []
  let tuzdykCreated = false
  let tuzdykIndex: number | null = null

  // --- Handle ongoing tuzdyk captures ---
  // If any stone just landed in the opponent's tuzdyk, those stones go to the tuzdyk owner.
  // This is handled per-stone during sowing in the engine, but we handle the last stone here.
  // (Continuous tuzdyk capture is handled in the engine's sow loop.)

  if (lastPlayer !== movingPlayer) {
    // Check if last position is an existing tuzdyk belonging to the MOVING player
    const movingPlayerTuzdyk = movingPlayer === 1 ? tuzdyk.player1 : tuzdyk.player2
    if (movingPlayerTuzdyk === lastOtauIndex) {
      // All stones in this otau (including last stone) go to moving player's kazan
      const stones = getStones(newBoard, lastPlayer, lastOtauIndex)
      setStones(newBoard, lastPlayer, lastOtauIndex, 0)
      if (movingPlayer === 1) newKazan.player1 += stones
      else newKazan.player2 += stones
      events.push({ type: 'tuzdyk_capture', otauIndex: lastOtauIndex, player: movingPlayer, stones })
      return { board: newBoard, kazan: newKazan, tuzdyk: newTuzdyk, tuzdykCreated: false, tuzdykIndex: null, events }
    }

    // --- Try to create a new tuzdyk ---
    const stonesInLastOtau = getStones(newBoard, lastPlayer, lastOtauIndex)
    if (stonesInLastOtau === 3) {
      const check = canCreateTuzdyk(movingPlayer, lastOtauIndex, lastPlayer, newTuzdyk)
      if (check.canCreateTuzdyk) {
        // Create tuzdyk: capture the 3 stones
        setStones(newBoard, lastPlayer, lastOtauIndex, 0)
        if (movingPlayer === 1) {
          newKazan.player1 += 3
          newTuzdyk.player1 = lastOtauIndex
        } else {
          newKazan.player2 += 3
          newTuzdyk.player2 = lastOtauIndex
        }
        tuzdykCreated = true
        tuzdykIndex = lastOtauIndex
        events.push({
          type: 'tuzdyk_created',
          otauIndex: lastOtauIndex,
          player: movingPlayer,
          message: `Player ${movingPlayer} created a tuzdyk at opponent's otau ${lastOtauIndex}`,
        })
      }
    }
  } else {
    // Last stone on own side — check if it landed on the OPPONENT's tuzdyk (on our side)
    const opponentTuzdykOnOurSide = movingPlayer === 1 ? tuzdyk.player2 : tuzdyk.player1
    if (opponentTuzdykOnOurSide === lastOtauIndex) {
      // Stones go to the opponent (tuzdyk owner)
      const stones = getStones(newBoard, lastPlayer, lastOtauIndex)
      setStones(newBoard, lastPlayer, lastOtauIndex, 0)
      const tuzdykOwner: Player = movingPlayer === 1 ? 2 : 1
      if (tuzdykOwner === 1) newKazan.player1 += stones
      else newKazan.player2 += stones
      events.push({ type: 'tuzdyk_capture', otauIndex: lastOtauIndex, player: tuzdykOwner, stones })
    }
  }

  return { board: newBoard, kazan: newKazan, tuzdyk: newTuzdyk, tuzdykCreated, tuzdykIndex, events }
}

/**
 * During sowing, if a stone is placed in a tuzdyk otau, redirect it to the tuzdyk owner's kazan.
 * Returns the new kazan state.
 */
export function redirectTuzdykStone(
  stoneGoingToPlayer: Player,
  stoneGoingToOtauIndex: number,
  kazan: Kazan,
  tuzdyk: Tuzdyk,
  board: BoardState
): { kazan: Kazan; board: BoardState; redirected: boolean } {
  const newKazan = { ...kazan }
  const newBoard = { ...board, player1Otaus: [...board.player1Otaus], player2Otaus: [...board.player2Otaus] }

  // Check if the target otau is P1's tuzdyk (on P2's side)
  if (stoneGoingToPlayer === 2 && tuzdyk.player1 === stoneGoingToOtauIndex) {
    // Stone should NOT go to the otau; redirect to P1's kazan
    // (We prevent the stone from being placed there by the sow loop)
    newKazan.player1 += 1
    return { kazan: newKazan, board: newBoard, redirected: true }
  }

  // Check if the target otau is P2's tuzdyk (on P1's side)
  if (stoneGoingToPlayer === 1 && tuzdyk.player2 === stoneGoingToOtauIndex) {
    newKazan.player2 += 1
    return { kazan: newKazan, board: newBoard, redirected: true }
  }

  return { kazan: newKazan, board: newBoard, redirected: false }
}
