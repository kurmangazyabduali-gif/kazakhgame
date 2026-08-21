/**
 * MOVE LOGIC
 *
 * Handles sowing (counter-clockwise distribution of stones).
 *
 * Board is modeled as a circular sequence of 18 positions:
 *   Positions 0-8:  Player 1's otaus (index 0 = leftmost for P1)
 *   Positions 9-17: Player 2's otaus (index 9 = P2's otau[0], index 17 = P2's otau[8])
 *
 * Counter-clockwise from Player 1's perspective: P1[0]→P1[1]→...→P1[8]→P2[0]→P2[1]→...→P2[8]→P1[0]
 * Counter-clockwise from Player 2's perspective: P2[0]→P2[1]→...→P2[8]→P1[0]→P1[1]→...→P1[8]→P2[0]
 *
 * Linear index encoding:
 *   P1 otau i → linear index i       (0..8)
 *   P2 otau i → linear index 9 + i   (9..17)
 */

import { BoardState, Player } from '../types'

export const TOTAL_POSITIONS = 18
export const P1_OFFSET = 0
export const P2_OFFSET = 9

/**
 * Convert (player, otauIndex) to linear board index.
 */
export function toLinear(player: Player, otauIndex: number): number {
  return player === 1 ? P1_OFFSET + otauIndex : P2_OFFSET + otauIndex
}

/**
 * Convert linear index to (player, otauIndex).
 */
export function fromLinear(linear: number): { player: Player; otauIndex: number } {
  const idx = ((linear % TOTAL_POSITIONS) + TOTAL_POSITIONS) % TOTAL_POSITIONS
  if (idx < P2_OFFSET) {
    return { player: 1, otauIndex: idx }
  }
  return { player: 2, otauIndex: idx - P2_OFFSET }
}

/**
 * Get stones at a given (player, otauIndex).
 */
export function getStones(board: BoardState, player: Player, otauIndex: number): number {
  return player === 1 ? board.player1Otaus[otauIndex] : board.player2Otaus[otauIndex]
}

/**
 * Create a deep copy of the board state.
 */
export function cloneBoard(board: BoardState): BoardState {
  return {
    player1Otaus: [...board.player1Otaus],
    player2Otaus: [...board.player2Otaus],
  }
}

/**
 * Set stones at a given (player, otauIndex) on a mutable board copy.
 */
export function setStones(
  board: BoardState,
  player: Player,
  otauIndex: number,
  count: number
): void {
  if (player === 1) {
    board.player1Otaus[otauIndex] = count
  } else {
    board.player2Otaus[otauIndex] = count
  }
}

export interface SowResult {
  board: BoardState
  lastPlayer: Player
  lastOtauIndex: number
  stonesDistributed: number
}

/**
 * Sow stones starting from a given otau.
 *
 * Per official rules:
 * - If the source has 1 stone, it is moved to the next otau.
 * - If the source has >1 stones, 1 stone stays in the source, the rest are sown.
 *
 * Returns the new board state and the position of the last stone placed.
 */
export function sowStones(
  board: BoardState,
  movingPlayer: Player,
  sourceOtauIndex: number
): SowResult {
  const newBoard = cloneBoard(board)
  const totalStones = getStones(newBoard, movingPlayer, sourceOtauIndex)

  let stonesToSow: number
  let startLinear: number

  if (totalStones === 1) {
    // Move the single stone to the next otau
    setStones(newBoard, movingPlayer, sourceOtauIndex, 0)
    stonesToSow = 1
    startLinear = toLinear(movingPlayer, sourceOtauIndex) + 1
  } else {
    // Leave 1 stone in source, sow the rest starting from the next position
    setStones(newBoard, movingPlayer, sourceOtauIndex, 1)
    stonesToSow = totalStones - 1
    startLinear = toLinear(movingPlayer, sourceOtauIndex) + 1
  }

  let lastLinear = startLinear

  for (let i = 0; i < stonesToSow; i++) {
    const pos = ((startLinear + i) % TOTAL_POSITIONS + TOTAL_POSITIONS) % TOTAL_POSITIONS
    const { player, otauIndex } = fromLinear(pos)
    const current = getStones(newBoard, player, otauIndex)
    setStones(newBoard, player, otauIndex, current + 1)
    lastLinear = pos
  }

  const last = fromLinear(((lastLinear % TOTAL_POSITIONS) + TOTAL_POSITIONS) % TOTAL_POSITIONS)

  return {
    board: newBoard,
    lastPlayer: last.player,
    lastOtauIndex: last.otauIndex,
    stonesDistributed: stonesToSow,
  }
}
