/**
 * TOGYZQUMALAK AI
 *
 * Three difficulty levels using the Rule Engine exclusively.
 * All difficulties use getLegalMoves() — no separate rule logic.
 */

import { TogyzqumalakState, TogyzqumalakMove, AIDifficulty } from '../engine/types'
import { TogyzqumalakEngine } from '../engine/TogyzqumalakEngine'
import { findBestMove } from './minimax'

export class TogyzAI {
  private difficulty: AIDifficulty

  constructor(difficulty: AIDifficulty = 'medium') {
    this.difficulty = difficulty
  }

  /**
   * Choose the best move based on difficulty level.
   * Returns null if no legal moves available.
   */
  chooseMove(state: TogyzqumalakState): TogyzqumalakMove | null {
    const moves = TogyzqumalakEngine.getLegalMoves(state)
    if (moves.length === 0) return null

    switch (this.difficulty) {
      case 'easy':
        return this.easyMove(state, moves)
      case 'medium':
        return this.mediumMove(state)
      case 'hard':
        return this.hardMove(state)
    }
  }

  /**
   * EASY: Pick the move that yields the best immediate capture or kazan gain.
   * Falls back to a random move if no captures available.
   */
  private easyMove(state: TogyzqumalakState, moves: TogyzqumalakMove[]): TogyzqumalakMove {
    const forPlayer = state.currentPlayer
    let bestMove = moves[0]
    let bestScore = -Infinity

    for (const move of moves) {
      const result = TogyzqumalakEngine.applyMove(state, move)
      // Evaluate only immediate gain (depth 1)
      const myKazan = forPlayer === 1 ? result.nextState.kazan.player1 : result.nextState.kazan.player2
      const prevKazan = forPlayer === 1 ? state.kazan.player1 : state.kazan.player2
      const gain = myKazan - prevKazan

      // Small jitter to avoid always picking same move in ties
      const score = gain + Math.random() * 0.5

      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    }

    return bestMove
  }

  /**
   * MEDIUM: Minimax with depth 2 (looks ahead 1 full round).
   */
  private mediumMove(state: TogyzqumalakState): TogyzqumalakMove {
    const result = findBestMove(state, 2)
    const moves = TogyzqumalakEngine.getLegalMoves(state)
    return result.move ?? moves[0]
  }

  /**
   * HARD: Minimax with depth 4-5 alpha-beta pruning.
   */
  private hardMove(state: TogyzqumalakState): TogyzqumalakMove {
    const result = findBestMove(state, 4)
    const moves = TogyzqumalakEngine.getLegalMoves(state)
    return result.move ?? moves[0]
  }

  /**
   * Async wrapper for use from React (runs synchronously but wrapped in Promise
   * to allow Web Worker migration later).
   */
  async chooseMoveAsync(state: TogyzqumalakState): Promise<TogyzqumalakMove | null> {
    // Artificial think delay for UX
    const delay = this.difficulty === 'easy' ? 400 : this.difficulty === 'medium' ? 800 : 1200
    await new Promise(resolve => setTimeout(resolve, delay))
    return this.chooseMove(state)
  }
}
