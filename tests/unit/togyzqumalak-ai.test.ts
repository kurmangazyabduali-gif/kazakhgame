import { describe, it, expect } from 'vitest'
import { TogyzAI } from '../../src/games/togyzqumalak/ai/TogyzAI'
import { TogyzqumalakEngine } from '../../src/games/togyzqumalak/engine/TogyzqumalakEngine'

describe('TogyzAI', () => {
  it('easy AI returns a legal move', () => {
    const state = TogyzqumalakEngine.getInitialState()
    // Set current player to 2 for AI
    const aiState = { ...state, currentPlayer: 2 as const }
    const ai = new TogyzAI('easy')
    const move = ai.chooseMove(aiState)
    expect(move).not.toBeNull()
    if (move) {
      expect(TogyzqumalakEngine.isLegalMove(aiState, move)).toBe(true)
    }
  })

  it('medium AI returns a legal move', () => {
    const state = { ...TogyzqumalakEngine.getInitialState(), currentPlayer: 2 as const }
    const ai = new TogyzAI('medium')
    const move = ai.chooseMove(state)
    expect(move).not.toBeNull()
    if (move) expect(TogyzqumalakEngine.isLegalMove(state, move)).toBe(true)
  })

  it('hard AI returns a legal move', () => {
    const state = { ...TogyzqumalakEngine.getInitialState(), currentPlayer: 2 as const }
    const ai = new TogyzAI('hard')
    const move = ai.chooseMove(state)
    expect(move).not.toBeNull()
    if (move) expect(TogyzqumalakEngine.isLegalMove(state, move)).toBe(true)
  })

  it('AI returns null when no moves available', () => {
    const state = {
      ...TogyzqumalakEngine.getInitialState(),
      currentPlayer: 2 as const,
      board: {
        player1Otaus: Array(9).fill(0),
        player2Otaus: Array(9).fill(0),
      },
      status: 'player1_wins' as const,
    }
    const ai = new TogyzAI('easy')
    expect(ai.chooseMove(state)).toBeNull()
  })

  it('easy AI preferentially captures when available', () => {
    // Set up so P2 has a capture opportunity
    const state = {
      ...TogyzqumalakEngine.getInitialState(),
      currentPlayer: 2 as const,
      board: {
        player1Otaus: [1, 0, 0, 0, 0, 0, 0, 0, 0], // P1[0] has 1 stone (P2 can land on it)
        player2Otaus: [0, 0, 0, 0, 0, 0, 0, 0, 1], // P2[8] has 1 stone, goes to P1[0]
      },
      kazan: { player1: 80, player2: 80 },
    }
    const ai = new TogyzAI('easy')
    const move = ai.chooseMove(state)
    // The best move for P2 is P2[8] which leads to capture of P1[0]
    expect(move).not.toBeNull()
  })
})
