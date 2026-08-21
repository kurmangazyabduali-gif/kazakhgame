// ============================================================
// TOGYZQUMALAK ENGINE — TYPES
// Source: World Togyzqumalak Federation / World Nomad Games
// ============================================================

export type Player = 1 | 2

export type GameStatus = 'playing' | 'player1_wins' | 'player2_wins' | 'draw'

export type GameMode = 'practice' | 'match'

export type AIDifficulty = 'easy' | 'medium' | 'hard'

/**
 * OtauIndex: 0-8 for each player's row.
 * Player 1 owns indices 0-8 (left to right from player 1's perspective).
 * Player 2 owns indices 0-8 (left to right from player 2's perspective).
 *
 * Physical board layout (viewed from above):
 *  P2:  [8][7][6][5][4][3][2][1][0]  ← player 2's otaus (reversed visually)
 *  P1:  [0][1][2][3][4][5][6][7][8]  ← player 1's otaus
 *
 * Counter-clockwise sowing means:
 *  P1: 0 → 1 → 2 → ... → 8 → P2:0 → P2:1 → ... → P2:8 → P1:0 → ...
 */
export interface BoardState {
  /** player1Otaus[i] = stones in player 1's i-th otau */
  player1Otaus: number[]
  /** player2Otaus[i] = stones in player 2's i-th otau */
  player2Otaus: number[]
}

export interface Tuzdyk {
  player1: number | null // otau index (0-8) on player2's side that P1 captured as tuzdyk
  player2: number | null // otau index (0-8) on player1's side that P2 captured as tuzdyk
}

export interface Kazan {
  player1: number
  player2: number
}

export interface TogyzqumalakState {
  board: BoardState
  currentPlayer: Player
  kazan: Kazan
  tuzdyk: Tuzdyk
  status: GameStatus
  moveNumber: number
  history: MoveRecord[]
}

export interface TogyzqumalakMove {
  player: Player
  otauIndex: number // 0-8, index in the player's own row
}

export interface MoveRecord {
  moveNumber: number
  player: Player
  otauIndex: number
  stonesLifted: number
  lastPosition: { player: Player; otauIndex: number }
  captured: number
  tuzdykCreated: boolean
  tuzdykIndex: number | null
  atsyrau: boolean
  timestamp: number
}

export interface MoveEvent {
  type:
    | 'sow'
    | 'capture'
    | 'tuzdyk_created'
    | 'tuzdyk_capture'
    | 'atsyrau'
    | 'game_over'
  otauIndex?: number
  player?: Player
  stones?: number
  message?: string
}

export interface MoveResult {
  nextState: TogyzqumalakState
  captured: number
  tuzdykCreated: boolean
  tuzdykIndex: number | null
  gameEnded: boolean
  winner: Player | null
  isDraw: boolean
  events: MoveEvent[]
  moveRecord: MoveRecord
}
