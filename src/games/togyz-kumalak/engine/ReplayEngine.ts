import { TogyzqumalakState, TogyzqumalakMove } from './types'
import { TogyzqumalakEngine } from './TogyzqumalakEngine'

export class ReplayEngine {
  private initialState: TogyzqumalakState
  private moves: TogyzqumalakMove[]
  
  constructor(initialState: TogyzqumalakState, moves: TogyzqumalakMove[]) {
    this.initialState = initialState
    this.moves = moves
  }

  public getStateAt(moveIndex: number): TogyzqumalakState {
    let state = JSON.parse(JSON.stringify(this.initialState)) as TogyzqumalakState
    for (let i = 0; i < moveIndex; i++) {
      if (i >= this.moves.length) break
      const res = TogyzqumalakEngine.applyMove(state, this.moves[i])
      state = res.nextState
    }
    return state
  }

  public getTotalMoves(): number {
    return this.moves.length
  }
}
