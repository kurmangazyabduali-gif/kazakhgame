/**
 * TOGYZQUMALAK ENGINE (v2 - corrected sowing)
 *
 * The central Rule Engine for Togyzqumalak. All game logic is encapsulated here.
 * This module is completely independent of React, UI, and AI.
 *
 * Source: World Togyzqumalak Federation / World Nomad Games
 *
 * SOWING RULE (official):
 * - Player picks an otau with N stones.
 * - If N == 1: stone moves to the immediately next otau (source becomes 0).
 * - If N > 1:  source keeps 1 stone. The remaining (N-1) stones are distributed
 *              one-by-one counter-clockwise starting from the NEXT otau.
 *
 * LINEAR BOARD (counter-clockwise):
 *   index 0..8  → P1 otaus  (P1[0]→P1[1]→...→P1[8])
 *   index 9..17 → P2 otaus  (P2[0]→P2[1]→...→P2[8])
 *   Then wraps back to P1[0].
 */

import {
  TogyzqumalakState,
  TogyzqumalakMove,
  MoveResult,
  MoveRecord,
  Player,
  GameStatus,
  MoveEvent,
  BoardState,
  Kazan,
  Tuzdyk,
} from './types'
import { redirectTuzdykStone, canCreateTuzdyk } from './logic/tuzdykLogic'
import { handleAtsyrau, determineGameStatus, checkMidGameWin, hasNoMoves } from './logic/atsyrauLogic'
import { evaluateCapture } from './logic/captureLogic'

const TOTAL_STONES = 162
const OTAU_COUNT = 9
const INITIAL_STONES_PER_OTAU = 9
const TOTAL_POSITIONS = 18

function toLinear(player: Player, otauIndex: number): number {
  return player === 1 ? otauIndex : 9 + otauIndex
}

function fromLinear(linear: number): { player: Player; otauIndex: number } {
  const idx = ((linear % TOTAL_POSITIONS) + TOTAL_POSITIONS) % TOTAL_POSITIONS
  if (idx < 9) return { player: 1, otauIndex: idx }
  return { player: 2, otauIndex: idx - 9 }
}

function getStones(board: BoardState, player: Player, idx: number): number {
  return player === 1 ? board.player1Otaus[idx] : board.player2Otaus[idx]
}

function setStones(board: BoardState, player: Player, idx: number, count: number): void {
  if (player === 1) board.player1Otaus[idx] = count
  else board.player2Otaus[idx] = count
}

function cloneBoard(board: BoardState): BoardState {
  return { player1Otaus: [...board.player1Otaus], player2Otaus: [...board.player2Otaus] }
}

export class TogyzqumalakEngine {
  static getInitialState(): TogyzqumalakState {
    return {
      board: {
        player1Otaus: Array(OTAU_COUNT).fill(INITIAL_STONES_PER_OTAU),
        player2Otaus: Array(OTAU_COUNT).fill(INITIAL_STONES_PER_OTAU),
      },
      currentPlayer: 1,
      kazan: { player1: 0, player2: 0 },
      tuzdyk: { player1: null, player2: null },
      status: 'playing',
      moveNumber: 1,
      history: [],
    }
  }

  static getPracticeState(scenario: number): TogyzqumalakState {
    const base = this.getInitialState()
    switch (scenario) {
      case 1:
        return base
      case 2:
        // P1 can move from index 8 (1 stone) to P2[0] which has 1 → becomes 2 → capture
        return {
          ...base,
          board: {
            player1Otaus: [9, 9, 9, 9, 9, 9, 9, 9, 1],
            player2Otaus: [1, 9, 9, 9, 9, 9, 9, 9, 9],
          },
          kazan: { player1: 0, player2: 0 },
        }
      case 3:
        // P1 can move from index 8 (1 stone) to P2[0] which has 2 → becomes 3 → tuzdyk!
        return {
          ...base,
          board: {
            player1Otaus: [9, 9, 9, 9, 9, 9, 9, 9, 1],
            player2Otaus: [2, 9, 9, 9, 9, 9, 9, 9, 9],
          },
          kazan: { player1: 0, player2: 0 },
        }
      default:
        return base
    }
  }

  static getLegalMoves(state: TogyzqumalakState): TogyzqumalakMove[] {
    if (state.status !== 'playing') return []
    const { currentPlayer, board } = state
    const otaus = currentPlayer === 1 ? board.player1Otaus : board.player2Otaus
    return otaus
      .map((stones, i) => ({ player: currentPlayer, otauIndex: i, stones }))
      .filter(m => m.stones > 0)
      .map(m => ({ player: m.player, otauIndex: m.otauIndex }))
  }

  static isLegalMove(state: TogyzqumalakState, move: TogyzqumalakMove): boolean {
    if (state.status !== 'playing') return false
    if (move.player !== state.currentPlayer) return false
    if (move.otauIndex < 0 || move.otauIndex >= OTAU_COUNT) return false
    return getStones(state.board, move.player, move.otauIndex) > 0
  }

  static applyMove(state: TogyzqumalakState, move: TogyzqumalakMove): MoveResult {
    if (!this.isLegalMove(state, move)) {
      throw new Error(`Illegal move: player ${move.player} otau ${move.otauIndex}`)
    }

    const events: MoveEvent[] = []
    const board = cloneBoard(state.board)
    let kazan: Kazan = { ...state.kazan }
    let tuzdyk: Tuzdyk = { ...state.tuzdyk }

    const sourceStones = getStones(board, move.player, move.otauIndex)
    const stonesLifted = sourceStones

    // ---- PHASE 1: SOWING ----
    let stonesToSow: number
    const sourceLinear = toLinear(move.player, move.otauIndex)

    if (sourceStones === 1) {
      // Move single stone to next otau
      setStones(board, move.player, move.otauIndex, 0)
      stonesToSow = 1
    } else {
      // Leave 1, sow the rest
      setStones(board, move.player, move.otauIndex, 1)
      stonesToSow = sourceStones - 1
    }

    const nextLinear = sourceLinear + 1

    let lastPos = fromLinear(nextLinear)

    for (let i = 0; i < stonesToSow; i++) {
      const pos = fromLinear(nextLinear + i)

      // Check tuzdyk redirection
      const redirect = redirectTuzdykStone(pos.player, pos.otauIndex, kazan, tuzdyk, board)
      if (redirect.redirected) {
        kazan = redirect.kazan
        const tuzdykOwner: Player = pos.player === 1 ? 2 : 1
        events.push({ type: 'tuzdyk_capture', otauIndex: pos.otauIndex, player: tuzdykOwner })
      } else {
        const cur = getStones(board, pos.player, pos.otauIndex)
        setStones(board, pos.player, pos.otauIndex, cur + 1)
      }

      lastPos = pos
    }

    const lastPlayer = lastPos.player
    const lastOtauIndex = lastPos.otauIndex

    // ---- PHASE 2: TUZDYK CHECK ----
    let tuzdykCreated = false
    let tuzdykIndex: number | null = null
    let capturedStones = 0

    if (lastPlayer !== move.player) {
      // On opponent's side — check tuzdyk first
      const stonesAtLast = getStones(board, lastPlayer, lastOtauIndex)

      if (stonesAtLast === 3) {
        const check = canCreateTuzdyk(move.player, lastOtauIndex, lastPlayer, tuzdyk)
        if (check.canCreateTuzdyk) {
          // Create tuzdyk
          setStones(board, lastPlayer, lastOtauIndex, 0)
          capturedStones = 3
          if (move.player === 1) {
            kazan.player1 += 3
            tuzdyk = { ...tuzdyk, player1: lastOtauIndex }
          } else {
            kazan.player2 += 3
            tuzdyk = { ...tuzdyk, player2: lastOtauIndex }
          }
          tuzdykCreated = true
          tuzdykIndex = lastOtauIndex
          events.push({ type: 'tuzdyk_created', otauIndex: lastOtauIndex, player: move.player })
        }
      }

      // ---- PHASE 3: CAPTURE CHECK (only if tuzdyk not created) ----
      if (!tuzdykCreated) {
        // Also check if last position is a tuzdyk belonging to moving player
        const movingPlayerTuzdyk = move.player === 1 ? tuzdyk.player1 : tuzdyk.player2
        if (movingPlayerTuzdyk === lastOtauIndex) {
          // All stones flow to moving player's kazan
          const stones = getStones(board, lastPlayer, lastOtauIndex)
          setStones(board, lastPlayer, lastOtauIndex, 0)
          capturedStones = stones
          if (move.player === 1) kazan.player1 += stones
          else kazan.player2 += stones
          events.push({ type: 'tuzdyk_capture', otauIndex: lastOtauIndex, player: move.player, stones })
        } else {
          // Regular even capture
          const captureResult = evaluateCapture(board, move.player, lastPlayer, lastOtauIndex, kazan, tuzdyk)
          if (captureResult.didCapture) {
            Object.assign(board, captureResult.board)
            board.player1Otaus = captureResult.board.player1Otaus
            board.player2Otaus = captureResult.board.player2Otaus
            kazan = captureResult.kazan
            capturedStones = captureResult.captured
            events.push({ type: 'capture', otauIndex: lastOtauIndex, player: move.player, stones: captureResult.captured })
          }
        }
      }
    } else {
      // Last stone landed on own side — check if it's an opponent's tuzdyk
      const opponentTuzdyk = move.player === 1 ? tuzdyk.player2 : tuzdyk.player1
      if (opponentTuzdyk === lastOtauIndex) {
        const stones = getStones(board, lastPlayer, lastOtauIndex)
        setStones(board, lastPlayer, lastOtauIndex, 0)
        const tuzdykOwner: Player = move.player === 1 ? 2 : 1
        if (tuzdykOwner === 1) kazan.player1 += stones
        else kazan.player2 += stones
        events.push({ type: 'tuzdyk_capture', otauIndex: lastOtauIndex, player: tuzdykOwner, stones })
      }
    }

    // ---- PHASE 4: MID-GAME WIN CHECK ----
    const midWin = checkMidGameWin(kazan)
    if (midWin) {
      const moveRecord = this.buildRecord(state, move, stonesLifted, lastPos, capturedStones, tuzdykCreated, tuzdykIndex, false)
      const nextState: TogyzqumalakState = {
        board,
        currentPlayer: move.player === 1 ? 2 : 1,
        kazan,
        tuzdyk,
        status: midWin,
        moveNumber: state.moveNumber + 1,
        history: [...state.history, moveRecord],
      }
      return { nextState, captured: capturedStones, tuzdykCreated, tuzdykIndex, gameEnded: true, winner: midWin === 'player1_wins' ? 1 : 2, isDraw: false, events: [...events, { type: 'game_over', message: midWin }], moveRecord }
    }

    // ---- PHASE 5: SWITCH PLAYER & ATSYRAU CHECK ----
    const nextPlayer: Player = move.player === 1 ? 2 : 1
    let nextStatus: GameStatus = 'playing'
    let gameEnded = false
    let winner: Player | null = null
    let isDraw = false

    const tempNextState: TogyzqumalakState = { board, currentPlayer: nextPlayer, kazan, tuzdyk, status: 'playing', moveNumber: state.moveNumber + 1, history: state.history }

    if (hasNoMoves(tempNextState, nextPlayer)) {
      const atsyrauResult = handleAtsyrau(tempNextState)
      board.player1Otaus = atsyrauResult.board.player1Otaus
      board.player2Otaus = atsyrauResult.board.player2Otaus
      kazan = atsyrauResult.kazan
      nextStatus = determineGameStatus(kazan)
      gameEnded = true
      isDraw = nextStatus === 'draw'
      winner = nextStatus === 'player1_wins' ? 1 : nextStatus === 'player2_wins' ? 2 : null
      events.push({ type: 'atsyrau', player: nextPlayer })
      events.push({ type: 'game_over', message: nextStatus })
    }

    const moveRecord = this.buildRecord(state, move, stonesLifted, lastPos, capturedStones, tuzdykCreated, tuzdykIndex, gameEnded && events.some(e => e.type === 'atsyrau'))

    const nextState: TogyzqumalakState = {
      board,
      currentPlayer: nextPlayer,
      kazan,
      tuzdyk,
      status: nextStatus,
      moveNumber: state.moveNumber + 1,
      history: [...state.history, moveRecord],
    }

    return { nextState, captured: capturedStones, tuzdykCreated, tuzdykIndex, gameEnded, winner, isDraw, events, moveRecord }
  }

  static getGameStatus(state: TogyzqumalakState): GameStatus {
    return state.status
  }

  static getWinner(state: TogyzqumalakState): Player | null {
    if (state.status === 'player1_wins') return 1
    if (state.status === 'player2_wins') return 2
    return null
  }

  static validateInvariant(state: TogyzqumalakState): boolean {
    const boardStones =
      state.board.player1Otaus.reduce((a, b) => a + b, 0) +
      state.board.player2Otaus.reduce((a, b) => a + b, 0)
    return boardStones + state.kazan.player1 + state.kazan.player2 === TOTAL_STONES
  }

  private static buildRecord(
    state: TogyzqumalakState,
    move: TogyzqumalakMove,
    stonesLifted: number,
    lastPos: { player: Player; otauIndex: number },
    captured: number,
    tuzdykCreated: boolean,
    tuzdykIndex: number | null,
    atsyrau: boolean
  ): MoveRecord {
    return {
      moveNumber: state.moveNumber,
      player: move.player,
      otauIndex: move.otauIndex,
      stonesLifted,
      lastPosition: { player: lastPos.player, otauIndex: lastPos.otauIndex },
      captured,
      tuzdykCreated,
      tuzdykIndex,
      atsyrau,
      timestamp: Date.now(),
    }
  }
}
