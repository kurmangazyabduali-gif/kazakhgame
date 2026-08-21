import { describe, it, expect } from 'vitest'
import { TogyzqumalakEngine } from '@/games/togyz-kumalak/engine/TogyzqumalakEngine'
import { TogyzqumalakState, Player, BoardState } from '@/games/togyz-kumalak/engine/types'
import { hasNoMoves } from '@/games/togyz-kumalak/engine/logic/atsyrauLogic'

describe('Togyzqumalak Game Engine v2', () => {
  it('Initial board: correct number of stones', () => {
    const state = TogyzqumalakEngine.getInitialState()
    expect(state.board.player1Otaus).toHaveLength(9)
    expect(state.board.player2Otaus).toHaveLength(9)
    
    // Each pit has 9 stones initially
    state.board.player1Otaus.forEach(stones => expect(stones).toBe(9))
    state.board.player2Otaus.forEach(stones => expect(stones).toBe(9))
    
    expect(state.kazan.player1).toBe(0)
    expect(state.kazan.player2).toBe(0)
    expect(state.currentPlayer).toBe(1)
    
    expect(TogyzqumalakEngine.validateInvariant(state)).toBe(true)
  })

  it('Legal move & Turn switching', () => {
    let state = TogyzqumalakEngine.getInitialState()
    
    // P1 moves from pit 0
    expect(TogyzqumalakEngine.isLegalMove(state, { player: 1, otauIndex: 0 })).toBe(true)
    
    const result = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 0 })
    state = result.nextState
    
    // Pit 0 should have 1 stone left
    expect(state.board.player1Otaus[0]).toBe(1)
    
    // Pits 1..8 should have 10 stones
    for(let i=1; i<=8; i++) {
      expect(state.board.player1Otaus[i]).toBe(10)
    }
    // Pit 0 of P2 should have 9 stones (it did not reach P2's side)
    expect(state.board.player2Otaus[0]).toBe(9)
    
    // P2's pits 1..8 should still have 9 stones
    for(let i=1; i<=8; i++) {
      expect(state.board.player2Otaus[i]).toBe(9)
    }
    
    expect(state.currentPlayer).toBe(2)
    expect(TogyzqumalakEngine.validateInvariant(state)).toBe(true)
  })

  it('Illegal move blocked', () => {
    const state = TogyzqumalakEngine.getInitialState()
    
    const p2State = { ...state, currentPlayer: 2 as Player }
    expect(TogyzqumalakEngine.isLegalMove(p2State, { player: 1, otauIndex: 0 })).toBe(false)
    
    const emptyState = TogyzqumalakEngine.getInitialState()
    emptyState.board.player1Otaus[0] = 0
    expect(TogyzqumalakEngine.isLegalMove(emptyState, { player: 1, otauIndex: 0 })).toBe(false)
  })

  it('Distribution (single stone)', () => {
    let state = TogyzqumalakEngine.getInitialState()
    state.board.player1Otaus[0] = 1
    
    const result = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 0 })
    state = result.nextState
    
    expect(state.board.player1Otaus[0]).toBe(0)
    expect(state.board.player1Otaus[1]).toBe(10)
  })

  it('Capture (Even stones)', () => {
    let state = TogyzqumalakEngine.getInitialState()
    state.board.player1Otaus[8] = 2
    state.board.player2Otaus[0] = 9
    
    const result = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    state = result.nextState
    
    expect(result.captured).toBe(10)
    expect(state.board.player1Otaus[8]).toBe(1)
    expect(state.board.player2Otaus[0]).toBe(0)
    expect(state.kazan.player1).toBe(10)
  })

  it('Tuzdyk creation and behavior', () => {
    let state = TogyzqumalakEngine.getInitialState()
    state.board.player1Otaus[8] = 2
    state.board.player2Otaus[0] = 2
    
    let result = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    state = result.nextState
    
    expect(result.tuzdykCreated).toBe(true)
    expect(result.tuzdykIndex).toBe(0)
    expect(state.tuzdyk.player1).toBe(0)
    expect(state.board.player2Otaus[0]).toBe(0)
    expect(state.kazan.player1).toBe(3)
    
    state.board.player2Otaus[8] = 2
    result = TogyzqumalakEngine.applyMove(state, { player: 2, otauIndex: 8 })
    state = result.nextState
    
    state.board.player1Otaus[8] = 2
    const prevKazan = state.kazan.player1
    result = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    state = result.nextState
    
    expect(state.board.player2Otaus[0]).toBe(0)
    expect(state.kazan.player1).toBe(prevKazan + 1)
  })

  it('Atsyrau & Game Over', () => {
    let state = TogyzqumalakEngine.getInitialState()
    state.board.player1Otaus = Array(9).fill(0)
    state.currentPlayer = 2
    state.board.player2Otaus[0] = 2
    
    const result = TogyzqumalakEngine.applyMove(state, { player: 2, otauIndex: 0 })
    state = result.nextState
    
    expect(result.gameEnded).toBe(true)
    expect(state.status).not.toBe('playing')
    expect(state.kazan.player2).toBeGreaterThan(0)
    expect(state.board.player2Otaus.every(s => s === 0)).toBe(true)
  })

  it('Determinism', () => {
    const state1 = TogyzqumalakEngine.getInitialState()
    const r1_1 = TogyzqumalakEngine.applyMove(state1, { player: 1, otauIndex: 0 })
    const r1_2 = TogyzqumalakEngine.applyMove(r1_1.nextState, { player: 2, otauIndex: 8 })
    
    const state2 = TogyzqumalakEngine.getInitialState()
    const r2_1 = TogyzqumalakEngine.applyMove(state2, { player: 1, otauIndex: 0 })
    const r2_2 = TogyzqumalakEngine.applyMove(r2_1.nextState, { player: 2, otauIndex: 8 })
    
    expect(r1_2.nextState.board).toEqual(r2_2.nextState.board)
    expect(r1_2.nextState.kazan).toEqual(r2_2.nextState.kazan)
    expect(r1_2.nextState.history.length).toEqual(r2_2.nextState.history.length)
  })
})
