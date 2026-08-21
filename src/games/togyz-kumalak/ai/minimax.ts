/**
 * MINIMAX with Alpha-Beta Pruning for Togyzqumalak
 */

import { TogyzqumalakState, TogyzqumalakMove, Player } from '../engine/types'
import { TogyzqumalakEngine } from '../engine/TogyzqumalakEngine'
import { evaluatePosition } from './evaluator'

export interface SearchResult {
  move: TogyzqumalakMove | null
  score: number
  nodesVisited: number
}

export function alphaBeta(
  state: TogyzqumalakState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  forPlayer: Player,
  nodesVisited: { count: number }
): number {
  nodesVisited.count++

  if (depth === 0 || state.status !== 'playing') {
    return evaluatePosition(state, forPlayer)
  }

  const moves = TogyzqumalakEngine.getLegalMoves(state)
  if (moves.length === 0) {
    return evaluatePosition(state, forPlayer)
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity
    for (const move of moves) {
      const result = TogyzqumalakEngine.applyMove(state, move)
      const evalScore = alphaBeta(result.nextState, depth - 1, alpha, beta, false, forPlayer, nodesVisited)
      maxEval = Math.max(maxEval, evalScore)
      alpha = Math.max(alpha, evalScore)
      if (beta <= alpha) break // β cutoff
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const move of moves) {
      const result = TogyzqumalakEngine.applyMove(state, move)
      const evalScore = alphaBeta(result.nextState, depth - 1, alpha, beta, true, forPlayer, nodesVisited)
      minEval = Math.min(minEval, evalScore)
      beta = Math.min(beta, evalScore)
      if (beta <= alpha) break // α cutoff
    }
    return minEval
  }
}

export function findBestMove(
  state: TogyzqumalakState,
  depth: number
): SearchResult {
  const forPlayer = state.currentPlayer
  const moves = TogyzqumalakEngine.getLegalMoves(state)
  if (moves.length === 0) return { move: null, score: 0, nodesVisited: 0 }

  let bestMove: TogyzqumalakMove = moves[0]
  let bestScore = -Infinity
  const nodesVisited = { count: 0 }

  for (const move of moves) {
    const result = TogyzqumalakEngine.applyMove(state, move)
    const score = alphaBeta(result.nextState, depth - 1, -Infinity, Infinity, false, forPlayer, nodesVisited)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return { move: bestMove, score: bestScore, nodesVisited: nodesVisited.count }
}
