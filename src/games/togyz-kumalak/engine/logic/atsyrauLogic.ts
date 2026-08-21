/**
 * ATSYRAU LOGIC
 *
 * Atsyrau occurs when the current player has no stones in any of their otaus.
 * When this happens:
 * - The game ends.
 * - The OTHER player collects ALL remaining stones from their own otaus into their kazan.
 */

import { TogyzqumalakState, GameStatus, Player, Kazan } from '../types'

/**
 * Check if a player has no valid moves (all otaus are empty).
 */
export function hasNoMoves(state: TogyzqumalakState, player: Player): boolean {
  const otaus = player === 1 ? state.board.player1Otaus : state.board.player2Otaus
  return otaus.every((s) => s === 0)
}

export interface AtsyrauResult {
  kazan: Kazan
  board: TogyzqumalakState['board']
  atsyrauOccurred: boolean
}

/**
 * Handle atsyrau: if the current player has no moves, the opponent sweeps remaining stones.
 */
export function handleAtsyrau(state: TogyzqumalakState): AtsyrauResult {
  const { currentPlayer, board, kazan } = state
  const newKazan = { ...kazan }
  const newBoard = {
    player1Otaus: [...board.player1Otaus],
    player2Otaus: [...board.player2Otaus],
  }

  if (!hasNoMoves(state, currentPlayer)) {
    return { kazan: newKazan, board: newBoard, atsyrauOccurred: false }
  }

  // Opponent sweeps their remaining stones
  const opponent: Player = currentPlayer === 1 ? 2 : 1
  if (opponent === 1) {
    const remaining = newBoard.player1Otaus.reduce((a, b) => a + b, 0)
    newKazan.player1 += remaining
    newBoard.player1Otaus = newBoard.player1Otaus.map(() => 0)
  } else {
    const remaining = newBoard.player2Otaus.reduce((a, b) => a + b, 0)
    newKazan.player2 += remaining
    newBoard.player2Otaus = newBoard.player2Otaus.map(() => 0)
  }

  return { kazan: newKazan, board: newBoard, atsyrauOccurred: true }
}

/**
 * Determine the game status after all stones are counted.
 */
export function determineGameStatus(kazan: Kazan): GameStatus {
  if (kazan.player1 > 81) return 'player1_wins'
  if (kazan.player2 > 81) return 'player2_wins'
  if (kazan.player1 === 81 && kazan.player2 === 81) return 'draw'
  // Game should have ended at atsyrau — figure out winner by count
  if (kazan.player1 > kazan.player2) return 'player1_wins'
  if (kazan.player2 > kazan.player1) return 'player2_wins'
  return 'draw'
}

/**
 * Check mid-game win condition (player has captured 82+ stones).
 */
export function checkMidGameWin(kazan: Kazan): GameStatus | null {
  if (kazan.player1 >= 82) return 'player1_wins'
  if (kazan.player2 >= 82) return 'player2_wins'
  return null
}
