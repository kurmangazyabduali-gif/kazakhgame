import { TogyzqumalakEngine } from '../engine/TogyzqumalakEngine'
import { TogyzqumalakState, MoveRecord, GameMode, Player } from '../engine/types'

export interface ValidationResult {
  valid: boolean
  reason?: string
  finalState?: TogyzqumalakState
  winner?: Player | null
  isDraw?: boolean
  capturedTotal?: number
  tuzdykCreated?: boolean
}

export function validateAndReplayGame(
  mode: GameMode,
  practiceScenario: number,
  moveHistory: MoveRecord[],
  humanPlayer: Player = 1
): ValidationResult {
  // 1. Establish the authoritative initial state
  let state = mode === 'practice'
    ? TogyzqumalakEngine.getPracticeState(practiceScenario)
    : TogyzqumalakEngine.getInitialState()

  let totalCaptured = 0
  let tuzdykCreatedByHuman = false

  // 2. Replay all moves in history
  for (let i = 0; i < moveHistory.length; i++) {
    const record = moveHistory[i]
    
    // Check if the game is already over
    if (state.status !== 'playing') {
      return { valid: false, reason: `Move ${i} attempted after game ended` }
    }

    // Check player turn sequence
    if (record.player !== state.currentPlayer) {
      return { valid: false, reason: `Move ${i} out of turn. Expected player ${state.currentPlayer}, got ${record.player}` }
    }

    // Check if move is legal
    const move = { player: record.player, otauIndex: record.otauIndex }
    if (!TogyzqumalakEngine.isLegalMove(state, move)) {
      return { valid: false, reason: `Move ${i} is illegal: player ${record.player}, otau ${record.otauIndex}` }
    }

    // Apply move and get result
    const result = TogyzqumalakEngine.applyMove(state, move)
    
    // Accumulate metrics if the move was by the human player
    if (record.player === humanPlayer) {
      totalCaptured += result.captured
      if (result.tuzdykCreated) {
        tuzdykCreatedByHuman = true
      }
    }

    state = result.nextState
  }

  // 3. Validation successful
  const isDraw = state.status === 'draw'
  const winner = state.status === 'player1_wins' ? 1 : state.status === 'player2_wins' ? 2 : null

  return {
    valid: true,
    finalState: state,
    winner,
    isDraw,
    capturedTotal: totalCaptured,
    tuzdykCreated: tuzdykCreatedByHuman
  }
}
