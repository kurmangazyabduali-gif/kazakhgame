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
   * Async wrapper for use from React. 
   * Uses Web Worker for Medium and Hard to avoid UI blocking.
   */
  async chooseMoveAsync(state: TogyzqumalakState): Promise<TogyzqumalakMove | null> {
    const delay = this.difficulty === 'easy' ? 400 : 0
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }

    if (this.difficulty === 'easy') {
      const moves = TogyzqumalakEngine.getLegalMoves(state)
      if (moves.length === 0) return null
      return this.easyMove(state, moves)
    }

    // Use Web Worker for Medium and Hard
    const depth = this.difficulty === 'hard' ? 5 : 3
    
    return new Promise((resolve) => {
      try {
        const worker = new Worker(new URL('./ai.worker.ts', import.meta.url))
        const messageId = Math.random().toString(36).substring(7)
        
        worker.onmessage = (e) => {
          if (e.data.messageId === messageId) {
            worker.terminate()
            if (e.data.error) {
              console.error('AI Worker error:', e.data.error)
              resolve(this.chooseMove(state)) // fallback
            } else {
              resolve(e.data.move)
            }
          }
        }
        
        worker.onerror = (err) => {
          console.error('Worker failed:', err)
          worker.terminate()
          resolve(this.chooseMove(state)) // fallback
        }
        
        worker.postMessage({ state, depth, messageId })
      } catch (e) {
        // Fallback to synchronous if Worker is not supported in environment
        console.warn('Web Worker not supported or failed to initialize. Falling back to sync AI.')
        resolve(this.chooseMove(state))
      }
    })
  }
}
