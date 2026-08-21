/**
 * CAPTURE LOGIC
 *
 * Per official rules:
 * - Capture occurs only when the last stone lands on the OPPONENT's otau.
 * - The total stones in that otau (after receiving the last stone) must be EVEN.
 * - If both conditions are met, all stones in that otau are captured and added to the moving player's kazan.
 */

import { BoardState, Player, Tuzdyk, Kazan } from '../types'
import { getStones, setStones } from './moveLogic'

export interface CaptureResult {
  board: BoardState
  kazan: Kazan
  captured: number
  didCapture: boolean
}

/**
 * Evaluate and execute a capture after sowing.
 * @param board - The board state after sowing.
 * @param movingPlayer - The player who just moved.
 * @param lastPlayer - The player whose otau received the last stone.
 * @param lastOtauIndex - The index of the otau that received the last stone.
 * @param kazan - Current kazan state.
 * @param tuzdyk - Current tuzdyk state.
 */
export function evaluateCapture(
  board: BoardState,
  movingPlayer: Player,
  lastPlayer: Player,
  lastOtauIndex: number,
  kazan: Kazan,
  tuzdyk: Tuzdyk
): CaptureResult {
  const newBoard = { ...board, player1Otaus: [...board.player1Otaus], player2Otaus: [...board.player2Otaus] }
  const newKazan = { ...kazan }

  // Capture only if last stone landed on OPPONENT's side
  if (lastPlayer === movingPlayer) {
    return { board: newBoard, kazan: newKazan, captured: 0, didCapture: false }
  }

  const stonesInLastOtau = getStones(newBoard, lastPlayer, lastOtauIndex)

  // Check if the otau is a tuzdyk owned by the moving player
  // If it is a tuzdyk, stones go to the tuzdyk owner's kazan (handled in tuzdykLogic)
  // Here we only handle regular even-capture
  const isTuzdyk =
    movingPlayer === 1
      ? tuzdyk.player1 === lastOtauIndex
      : tuzdyk.player2 === lastOtauIndex

  if (isTuzdyk) {
    // Tuzdyk handling is separate; no regular capture here
    return { board: newBoard, kazan: newKazan, captured: 0, didCapture: false }
  }

  if (stonesInLastOtau % 2 === 0 && stonesInLastOtau > 0) {
    // Capture!
    const captured = stonesInLastOtau
    setStones(newBoard, lastPlayer, lastOtauIndex, 0)
    if (movingPlayer === 1) {
      newKazan.player1 += captured
    } else {
      newKazan.player2 += captured
    }
    return { board: newBoard, kazan: newKazan, captured, didCapture: true }
  }

  return { board: newBoard, kazan: newKazan, captured: 0, didCapture: false }
}
