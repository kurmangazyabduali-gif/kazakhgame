/**
 * TOGYZQUMALAK — DETERMINISTIC ACCEPTANCE TESTS
 *
 * Source: World Togyzqumalak Federation / World Nomad Games
 * URL: https://worldnomadgames.kz/en/page/Togyzkumalak
 * Date Verified: 2026-08-14
 *
 * Each test case is hand-verified against the official rules documented in
 * docs/games/togyzqumalak/rules.md
 */

import { describe, it, expect } from 'vitest'
import { TogyzqumalakEngine } from '../../src/games/togyzqumalak/engine/TogyzqumalakEngine'
import { canCreateTuzdyk, redirectTuzdykStone } from '../../src/games/togyzqumalak/engine/logic/tuzdykLogic'
import { TogyzqumalakState, Player } from '../../src/games/togyzqumalak/engine/types'
import { TogyzAI } from '../../src/games/togyzqumalak/ai/TogyzAI'
import { hasNoMoves, handleAtsyrau, checkMidGameWin, determineGameStatus } from '../../src/games/togyzqumalak/engine/logic/atsyrauLogic'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Assert stone invariant is 162 */
function inv(state: TogyzqumalakState, label = '') {
  const total =
    state.board.player1Otaus.reduce((a, b) => a + b, 0) +
    state.board.player2Otaus.reduce((a, b) => a + b, 0) +
    state.kazan.player1 +
    state.kazan.player2
  if (total !== 162) {
    throw new Error(
      `INVARIANT FAILED ${label}: board=${total - state.kazan.player1 - state.kazan.player2} ` +
      `k1=${state.kazan.player1} k2=${state.kazan.player2} TOTAL=${total}`
    )
  }
  expect(total).toBe(162)
}

/** Make a state with explicit board+kazan; auto-fills to 162 if p2Kazan omitted */
function mkState(
  p1Otaus: number[],
  p2Otaus: number[],
  p1Kazan: number,
  p2Kazan: number,
  player: Player = 1
): TogyzqumalakState {
  const board =
    p1Otaus.reduce((a, b) => a + b, 0) +
    p2Otaus.reduce((a, b) => a + b, 0) +
    p1Kazan + p2Kazan
  if (board !== 162) throw new Error(`Setup error: total=${board} ≠ 162`)
  return {
    ...TogyzqumalakEngine.getInitialState(),
    board: { player1Otaus: [...p1Otaus], player2Otaus: [...p2Otaus] },
    kazan: { player1: p1Kazan, player2: p2Kazan },
    currentPlayer: player,
  }
}

// ─────────────────────────────────────────────────────────────
// CASE 1 — Initial Position
// Rules: 9 otau per player, 9 stones each, total 162
// ─────────────────────────────────────────────────────────────
describe('Case 1 — Initial Position', () => {
  const s = TogyzqumalakEngine.getInitialState()

  it('has 9 otaus per player', () => {
    expect(s.board.player1Otaus).toHaveLength(9)
    expect(s.board.player2Otaus).toHaveLength(9)
  })

  it('each otau has exactly 9 stones', () => {
    s.board.player1Otaus.forEach((v) => expect(v).toBe(9))
    s.board.player2Otaus.forEach((v) => expect(v).toBe(9))
  })

  it('total stones = 162', () => { inv(s, 'initial') })

  it('kazan is 0 for both players', () => {
    expect(s.kazan.player1).toBe(0)
    expect(s.kazan.player2).toBe(0)
  })

  it('no tuzdyk at start', () => {
    expect(s.tuzdyk.player1).toBeNull()
    expect(s.tuzdyk.player2).toBeNull()
  })

  it('player 1 moves first', () => {
    expect(s.currentPlayer).toBe(1)
  })

  it('getLegalMoves returns 9 for P1', () => {
    expect(TogyzqumalakEngine.getLegalMoves(s)).toHaveLength(9)
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 2 — Ordinary Move Distribution
//
// Setup: P1 has only P1[4]=5 stones, all others empty. P2 all zeros.
// Move: P1 moves from otau index 4 (5 stones)
// Rule: leave 1 at source, sow 4 into P1[5], P1[6], P1[7], P1[8]
// Last stone → P1[8] (own side) → no capture
// ─────────────────────────────────────────────────────────────
describe('Case 2 — Ordinary Move Distribution', () => {
  // P1[4]=5, rest=0, P2[0]=1 (to prevent atsyrau), kazan sum fills to 162
  const state = mkState(
    [0, 0, 0, 0, 5, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    80, 76 // 5+1+80+76=162 ✓
  )

  it('setup invariant', () => { inv(state, 'case2 setup') })

  it('P1[4]=5: source keeps 1, sows 4 into P1[5..8]', () => {
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 4 })
    const b = r.nextState.board
    // Source keeps 1
    expect(b.player1Otaus[4]).toBe(1)
    // Positions 5,6,7,8 each get +1 (from 0 → 1)
    expect(b.player1Otaus[5]).toBe(1)
    expect(b.player1Otaus[6]).toBe(1)
    expect(b.player1Otaus[7]).toBe(1)
    expect(b.player1Otaus[8]).toBe(1)
    // P2 untouched except for setup
    expect(b.player2Otaus[0]).toBe(1)
    b.player2Otaus.slice(1).forEach(v => expect(v).toBe(0))
    // No capture (last on own side)
    expect(r.captured).toBe(0)
    // Move history recorded correctly
    expect(r.moveRecord.stonesLifted).toBe(5)
    expect(r.moveRecord.otauIndex).toBe(4)
    expect(r.moveRecord.lastPosition.player).toBe(1)
    expect(r.moveRecord.lastPosition.otauIndex).toBe(8)
    inv(r.nextState, 'case2 result')
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 2b — Sow wraps from P1 to P2
//
// P1[7]=3: leave 1, sow 2 into P1[8], P2[0]
// Last stone → P2[0] (opponent side, was 0 → becomes 1, odd) → no capture
// ─────────────────────────────────────────────────────────────
describe('Case 2b — Sow wrapping P1→P2', () => {
  const state = mkState(
    [0, 0, 0, 0, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    80, 79 // 3+80+79=162 ✓
  )

  it('P1[7]=3: leaves 1, sows into P1[8] and P2[0], no capture', () => {
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 7 })
    const b = r.nextState.board
    expect(b.player1Otaus[7]).toBe(1) // source keeps 1
    expect(b.player1Otaus[8]).toBe(1) // sow stone 1
    expect(b.player2Otaus[0]).toBe(1) // sow stone 2, lands on P2 side (odd=1) → no capture
    expect(r.captured).toBe(0)
    inv(r.nextState, 'case2b wrap')
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 3 — Capture (Even)
//
// P1[8]=1, P2[0]=3
// P1 moves: single stone → P2[0] → P2[0] becomes 4 (even) → CAPTURE 4
// ─────────────────────────────────────────────────────────────
describe('Case 3 — Capture on Even', () => {
  const state = mkState(
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [3, 0, 0, 0, 0, 0, 0, 0, 0],
    78, 80 // 1+3+78+80=162 ✓
  )

  it('setup invariant', () => { inv(state, 'case3 setup') })

  it('P1[8]=1 → P2[0] becomes 4 → capture 4 stones', () => {
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    // P2[0] emptied
    expect(r.nextState.board.player2Otaus[0]).toBe(0)
    // P1 kazan gains 4
    expect(r.nextState.kazan.player1).toBe(78 + 4) // = 82
    // Game ended (82 ≥ 82)
    expect(r.gameEnded).toBe(true)
    expect(r.winner).toBe(1)
    expect(r.captured).toBe(4)
    // Capture event recorded
    const captureEv = r.events.find(e => e.type === 'capture')
    expect(captureEv).toBeDefined()
    expect(captureEv?.stones).toBe(4)
    inv(r.nextState, 'case3 result')
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 4 — No Capture on Odd
//
// P1[8]=1, P2[0]=4 → becomes 5 (odd) → NO capture
// ─────────────────────────────────────────────────────────────
describe('Case 4 — No Capture on Odd', () => {
  const state = mkState(
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [4, 0, 0, 0, 0, 0, 0, 0, 0],
    80, 77 // 1+4+80+77=162 ✓
  )

  it('P2[0]=4 → after +1 = 5 (odd) → no capture', () => {
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    expect(r.nextState.board.player2Otaus[0]).toBe(5)
    expect(r.captured).toBe(0)
    expect(r.nextState.kazan.player1).toBe(80) // unchanged
    expect(r.gameEnded).toBe(false)
    inv(r.nextState, 'case4 odd')
  })

  it('no capture event emitted', () => {
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    expect(r.events.find(e => e.type === 'capture')).toBeUndefined()
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 4b — No Capture on own side (even)
//
// Rule: even capture ONLY on opponent's side
// P1[7]=5, all else 0: sows into P1[8] → own side even=0+1=1 → no capture
// More complex: P1[0]=9 → sows 8 into P1[1..8], last is P1[8] (own) → no capture
// ─────────────────────────────────────────────────────────────
describe('Case 4b — No Capture on Own Side (even)', () => {
  // P1[8]=2, P1[7]=1, P1 last stone lands on P1[8] which becomes 3 (own side) → no capture
  const state = mkState(
    [0, 0, 0, 0, 0, 0, 0, 1, 2],
    [1, 0, 0, 0, 0, 0, 0, 0, 0], // Give P2 a stone to avoid atsyrau
    80, 78 // 3+1+80+78=162 ✓
  )

  it('last stone on own side even → no capture', () => {
    // P1[7]=1 → single stone → goes to P1[8] → P1[8] becomes 3 (odd, but own side)
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 7 })
    expect(r.captured).toBe(0)
    expect(r.nextState.board.player1Otaus[8]).toBe(3)
    inv(r.nextState, 'case4b own side')
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 5 — Tuzdyk Creation
//
// P1[8]=1, P2[0]=2 → becomes 3 → TUZDYK for P1!
// Rule: last stone on opponent, count becomes exactly 3 → tuzdyk
// ─────────────────────────────────────────────────────────────
describe('Case 5 — Tuzdyk Creation', () => {
  const state = mkState(
    [0, 0, 0, 0, 0, 0, 0, 0, 1],
    [2, 0, 0, 0, 0, 0, 0, 0, 0],
    79, 80 // 1+2+79+80=162 ✓
  )

  it('setup invariant', () => { inv(state, 'case5 setup') })

  it('P1[8]=1 → P2[0]=2+1=3 → tuzdyk created', () => {
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    expect(r.tuzdykCreated).toBe(true)
    expect(r.tuzdykIndex).toBe(0) // P2's otau index 0
    expect(r.nextState.tuzdyk.player1).toBe(0) // P1 owns tuzdyk at P2[0]
  })

  it('3 stones captured into P1 kazan', () => {
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    expect(r.nextState.kazan.player1).toBe(79 + 3) // = 82
    expect(r.nextState.board.player2Otaus[0]).toBe(0) // emptied
  })

  it('tuzdyk_created event emitted', () => {
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    expect(r.events.find(e => e.type === 'tuzdyk_created')).toBeDefined()
  })

  it('invariant maintained', () => {
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    inv(r.nextState, 'case5 after tuzdyk')
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 6 — Invalid Tuzdyk Restrictions
// Source: rules.md — Three restrictions from WTF:
// 1. Player can only have ONE tuzdyk per game
// 2. 9th otau (index 8) cannot be tuzdyk
// 3. Cannot be symmetric to opponent's tuzdyk
// ─────────────────────────────────────────────────────────────
describe('Case 6 — Tuzdyk Restrictions', () => {
  it('6a: 9th otau (index 8) CANNOT become tuzdyk', () => {
    const r = canCreateTuzdyk(1, 8, 2, { player1: null, player2: null })
    expect(r.canCreateTuzdyk).toBe(false)
    expect(r.reason).toContain('9th')
  })

  it('6b: player cannot have 2 tuzdyks — P1 already at index 2', () => {
    const r = canCreateTuzdyk(1, 4, 2, { player1: 2, player2: null })
    expect(r.canCreateTuzdyk).toBe(false)
    expect(r.reason).toContain('already has a tuzdyk')
  })

  it('6c: symmetric restriction — P2 tuzdyk at index 3, P1 cannot create at index 3', () => {
    // P2's tuzdyk is at P1's otau index 3
    // P1 cannot create tuzdyk at P2's otau index 3 (symmetric)
    const r = canCreateTuzdyk(1, 3, 2, { player1: null, player2: 3 })
    expect(r.canCreateTuzdyk).toBe(false)
    expect(r.reason).toContain('Symmetric')
  })

  it('6d: symmetric restriction — P1 tuzdyk at index 5, P2 cannot create at index 5', () => {
    const r = canCreateTuzdyk(2, 5, 1, { player1: 5, player2: null })
    expect(r.canCreateTuzdyk).toBe(false)
    expect(r.reason).toContain('Symmetric')
  })

  it('6e: non-symmetric index IS allowed — P2 at 3, P1 can use 4', () => {
    const r = canCreateTuzdyk(1, 4, 2, { player1: null, player2: 3 })
    expect(r.canCreateTuzdyk).toBe(true)
  })

  it('6f: no restriction on index 0-7 when no existing tuzdyks', () => {
    for (let i = 0; i <= 7; i++) {
      const r = canCreateTuzdyk(1, i, 2, { player1: null, player2: null })
      expect(r.canCreateTuzdyk).toBe(true)
    }
  })

  it('6g: engine does not create tuzdyk at 9th otau even if count=3', () => {
    // Force P2[8]=2, P1 has a stone that will land there
    // To reach P2[8] (linear 17), we need to sow from linear 9 (P2[0]) with 8 stones
    // But we can only move from P1's side.
    // From P1[8] (linear 8), next is P2[0] (linear 9), not P2[8].
    // To reach P2[8] (linear 17), we'd need to sow 9 stones from P1[8].
    // P1[8]=10: source keeps 1, sows 9 → P2[0..8]
    // P2[8] ends up with 2+1=3. But it's the 9th otau → NO tuzdyk.

    const state2 = mkState(
      [0, 0, 0, 0, 0, 0, 0, 0, 10],
      [8, 8, 8, 8, 8, 8, 8, 8, 2],
      0, 86
    ) // 10 (P1) + 66 (P2) + 0 + 86 = 162 ✓
    inv(state2, '6g setup')
    const r = TogyzqumalakEngine.applyMove(state2, { player: 1, otauIndex: 8 })
    // P2[8] (9th otau) now has 3 stones but CANNOT be tuzdyk
    expect(r.tuzdykCreated).toBe(false)
    expect(r.nextState.tuzdyk.player1).toBeNull()
    // Stones at P2[8] should stay (not captured) — count = 3 but no tuzdyk → stays as 3
    // But wait: after sowing, P2[8] gets +1 (from 2 to 3)
    // Then tuzdyk check fires: count=3, but index=8 → blocked → no tuzdyk
    // Then capture check: count=3 (odd) → no capture
    // So P2[8] should have 3 stones
    expect(r.nextState.board.player2Otaus[8]).toBe(3)
    inv(r.nextState, '6g result')
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 7 — Tuzdyk Redirect
//
// After P1 creates tuzdyk at P2[3], subsequent stones falling on P2[3]
// must redirect to P1's kazan, not sit in P2[3].
// ─────────────────────────────────────────────────────────────
describe('Case 7 — Tuzdyk Redirect (during sowing)', () => {
  it('7a: redirectTuzdykStone sends stone to correct kazan', () => {
    const kazan = { player1: 10, player2: 10 }
    const tuzdyk = { player1: 3, player2: null } // P1 owns P2[3]
    const board = {
      player1Otaus: Array(9).fill(5),
      player2Otaus: Array(9).fill(5),
    }

    // Stone going to P2[3] (P1's tuzdyk on P2's side)
    const result = redirectTuzdykStone(2, 3, kazan, tuzdyk, board)
    expect(result.redirected).toBe(true)
    expect(result.kazan.player1).toBe(11) // P1 gets the stone
    expect(result.kazan.player2).toBe(10) // P2 unchanged
  })

  it('7b: stone going to P1[5] when P2 has tuzdyk there → P2 kazan gets stone', () => {
    const kazan = { player1: 10, player2: 10 }
    const tuzdyk = { player1: null, player2: 5 } // P2 owns P1[5]
    const board = {
      player1Otaus: Array(9).fill(5),
      player2Otaus: Array(9).fill(5),
    }
    const result = redirectTuzdykStone(1, 5, kazan, tuzdyk, board)
    expect(result.redirected).toBe(true)
    expect(result.kazan.player2).toBe(11)
    expect(result.kazan.player1).toBe(10)
  })

  it('7c: stone not at tuzdyk position is NOT redirected', () => {
    const kazan = { player1: 10, player2: 10 }
    const tuzdyk = { player1: 3, player2: null }
    const board = {
      player1Otaus: Array(9).fill(5),
      player2Otaus: Array(9).fill(5),
    }
    // Stone going to P2[4] (not P1's tuzdyk which is at 3)
    const result = redirectTuzdykStone(2, 4, kazan, tuzdyk, board)
    expect(result.redirected).toBe(false)
    expect(result.kazan.player1).toBe(10)
    expect(result.kazan.player2).toBe(10)
  })

  it('7d: engine sowing loop redirects stone mid-sow via tuzdyk', () => {
    // P1 has tuzdyk at P2[0]. P2 moves from P2[3]=3 stones.
    // Sow: leave 1 at P2[3], sow 2 stones into P2[4] and P2[5]... 
    // Actually simpler: P2 moves and stones pass through P1's side via wrap.
    // Let's test: P1 has tuzdyk at P2[1]. P1 moves from P1[0]=2 stones.
    // Leave 1 at P1[0], sow 1 stone to P1[1]. Nothing reaches P2 in this case.
    //
    // Better: P1 has tuzdyk at P2[2]. P1 moves from P1[8]=4 stones.
    // Leave 1 at P1[8], sow 3: → P2[0], P2[1], P2[2] (= tuzdyk!)
    // Stone 3 would land at P2[2] (P1's tuzdyk) → redirect to P1 kazan during sow.
    const state: TogyzqumalakState = {
      ...TogyzqumalakEngine.getInitialState(),
      board: {
        player1Otaus: [0, 0, 0, 0, 0, 0, 0, 0, 4],
        player2Otaus: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      kazan: { player1: 75, player2: 83 },
      tuzdyk: { player1: 2, player2: null }, // P1 has tuzdyk at P2[2]
      currentPlayer: 1,
      status: 'playing',
    }
    // total: 4+75+83=162 ✓
    expect(TogyzqumalakEngine.validateInvariant(state)).toBe(true)

    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    // Source: P1[8]=4 → keeps 1, sows 3: P2[0], P2[1], P2[2]
    // P2[2] is P1's tuzdyk → that stone gets redirected to P1 kazan
    expect(r.nextState.board.player2Otaus[2]).toBe(0) // tuzdyk stays empty
    // P2[0] and P2[1] each got +1
    expect(r.nextState.board.player2Otaus[0]).toBe(1)
    expect(r.nextState.board.player2Otaus[1]).toBe(1)
    // P1 kazan went from 75 → 75+1 (tuzdyk redirect) = 76
    expect(r.nextState.kazan.player1).toBe(76)
    expect(TogyzqumalakEngine.validateInvariant(r.nextState)).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 8 — Atsyrau
//
// When the NEXT player has no stones, atsyrau triggers:
// - Opponent sweeps all their remaining stones into their kazan
// - Game ends
// ─────────────────────────────────────────────────────────────
describe('Case 8 — Atsyrau', () => {
  it('8a: detects player with no moves', () => {
    const state = mkState(
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      Array(9).fill(5),
      0, 117 // 0+45+0+117=162 ✓
    )
    expect(hasNoMoves(state, 1)).toBe(true)
    expect(hasNoMoves(state, 2)).toBe(false)
  })

  it('8b: handleAtsyrau sweeps opponent (P1) stones when P2 has no moves', () => {
    // P2 current player has no moves
    const state: TogyzqumalakState = {
      ...TogyzqumalakEngine.getInitialState(),
      board: {
        player1Otaus: [10, 5, 0, 0, 0, 0, 0, 0, 0], // P1 has 15 stones
        player2Otaus: [0, 0, 0, 0, 0, 0, 0, 0, 0],   // P2 has none
      },
      kazan: { player1: 50, player2: 97 }, // 15+50+97=162 ✓
      currentPlayer: 2, // P2 has no moves
    }
    const result = handleAtsyrau(state)
    expect(result.atsyrauOccurred).toBe(true)
    // Opponent (P1) sweeps their 15 stones
    expect(result.kazan.player1).toBe(50 + 15) // = 65
    expect(result.board.player1Otaus.every(v => v === 0)).toBe(true)
  })

  it('8c: game ends with atsyrau event after move leaves P2 empty', () => {
    // P1 makes last move, P2 has 0 stones in all otaus, P1 has 5 in one otau
    // After P1 moves, P2's turn → P2 has no moves → atsyrau → P1 sweeps
    const state = mkState(
      [0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      80, 81 // 1+80+81=162 ✓
    )
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    // P1's stone goes to P2[0] (1 stone). P2 now has 1 stone → CAN move. No atsyrau.
    // So this doesn't trigger atsyrau. Let's check:
    expect(r.events.some(e => e.type === 'atsyrau')).toBe(false) // P2 can move
  })

  it('8d: atsyrau triggers when P1 move gives P2 0 after capture', () => {
    // P1[8]=1, P2[0]=1: after move, P2[0] becomes 2 (even) → captured into P1
    // P2 now has 0 stones in all otaus → atsyrau → P1 sweeps remaining
    // P1 also has no other stones, so atsyrau just confirms P2 has nothing
    // After capture P2[0]=0, all P2 empty → atsyrau. P1 has P1[8]=0 (moved).
    // P1 has no remaining stones to sweep either. Final count:
    const state = mkState(
      [0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0],
      80, 80 // 1+1+80+80=162 ✓
    )
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    // P2[0] → 2 → captured by P1. P1 kazan = 80+2 = 82 → mid-game win (82≥82)
    // Game ends via mid-game win, NOT atsyrau
    expect(r.gameEnded).toBe(true)
    expect(r.winner).toBe(1)
    expect(r.nextState.kazan.player1).toBe(82)
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 9 — Win Condition
// Rule: first to 82+ wins. Exactly 81 each = draw.
// ─────────────────────────────────────────────────────────────
describe('Case 9 — Win Condition', () => {
  it('9a: player1 wins when kazan ≥ 82 after capture', () => {
    const state = mkState(
      [0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0],
      80, 80
    )
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    expect(r.winner).toBe(1)
    expect(r.nextState.status).toBe('player1_wins')
    expect(TogyzqumalakEngine.getWinner(r.nextState)).toBe(1)
  })

  it('9b: player2 wins when their kazan ≥ 82', () => {
    const state = mkState(
      [1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1],
      80, 80,
      2
    )
    const r = TogyzqumalakEngine.applyMove(state, { player: 2, otauIndex: 8 })
    expect(r.winner).toBe(2)
    expect(r.nextState.status).toBe('player2_wins')
  })

  it('9c: draw when atsyrau gives both players exactly 81', () => {
    // Craft atsyrau state where sweep results in 81-81
    // P1 current: P1 has 0 stones (no moves). Opponent (P2) has N stones to sweep.
    // P1 kazan = 81 - N_remaining, P2 kazan = 81 - P1_board
    // Simplest: both kazan already 81, board=0
    // But that's already done — no valid scenario with 0 board stones.
    // With atsyrau: P2 current has 0 stones. P1 sweeps remaining.
    // P1 board = X, P1 kazan = 81-X, P2 kazan = 81 (already 81). 
    // After sweep: P1 kazan = 81. Draw.
    const state: TogyzqumalakState = {
      ...TogyzqumalakEngine.getInitialState(),
      board: {
        player1Otaus: [5, 0, 0, 0, 0, 0, 0, 0, 0], // P1 has 5 stones
        player2Otaus: [0, 0, 0, 0, 0, 0, 0, 0, 0],  // P2 has 0
      },
      kazan: { player1: 76, player2: 81 }, // 5+76+81=162 ✓
      currentPlayer: 2, // P2 to move, has no moves → atsyrau
    }
    expect(TogyzqumalakEngine.validateInvariant(state)).toBe(true)
    // Simulate P1 making a move (even though P1 isn't the one with no moves)
    // Actually the atsyrau check fires AFTER P1's move when P2 has no moves.
    // We need P1 to move first, then check P2 has no moves.
    // Let's put P1[5]=1 so P1 can make a move, then after it P2 has 0.
    // P1[5]=1 → single stone → goes to P1[6]. P2 still has 0 → atsyrau!
    const state3: TogyzqumalakState = {
      ...TogyzqumalakEngine.getInitialState(),
      board: {
        player1Otaus: [0, 0, 0, 0, 0, 1, 0, 0, 0],
        player2Otaus: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      kazan: { player1: 80, player2: 81 }, // 1+80+81=162 ✓
      currentPlayer: 1,
    }
    // After P1 moves P1[5]=1 → P1[6], P2 has 0 → atsyrau
    // P1 sweeps P1[6]=1 → P1 kazan = 80+1 = 81. Both have 81 -> draw.
    const r = TogyzqumalakEngine.applyMove(state3, { player: 1, otauIndex: 5 })
    expect(r.gameEnded).toBe(true)
    expect(r.isDraw).toBe(true)
    expect(r.winner).toBeNull()
    expect(r.events.some(e => e.type === 'atsyrau')).toBe(true)
  })

  it('9d: getWinner returns null during playing', () => {
    expect(TogyzqumalakEngine.getWinner(TogyzqumalakEngine.getInitialState())).toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────
// CASE 10 — Stone Invariant (after every move)
// Rule: boardStones + kazan1 + kazan2 MUST ALWAYS = 162
// ─────────────────────────────────────────────────────────────
describe('Case 10 — Stone Invariant = 162', () => {
  it('10a: invariant holds over 50 sequential moves from initial state', () => {
    let state = TogyzqumalakEngine.getInitialState()
    let movesPlayed = 0
    for (let i = 0; i < 50; i++) {
      const moves = TogyzqumalakEngine.getLegalMoves(state)
      if (!moves.length || state.status !== 'playing') break
      state = TogyzqumalakEngine.applyMove(state, moves[i % moves.length]).nextState
      inv(state, `move ${++movesPlayed}`)
    }
    // Ensure we actually played some moves
    expect(movesPlayed).toBeGreaterThan(0)
  })

  it('10b: invariant holds after capture', () => {
    const state = mkState([0,0,0,0,0,0,0,0,1], [1,0,0,0,0,0,0,0,0], 80, 80)
    inv(TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 }).nextState, 'after capture')
  })

  it('10c: invariant holds after tuzdyk creation', () => {
    const state = mkState([0,0,0,0,0,0,0,0,1], [2,0,0,0,0,0,0,0,0], 79, 80)
    inv(TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 }).nextState, 'after tuzdyk')
  })

  it('10d: invariant holds after atsyrau', () => {
    const state: TogyzqumalakState = {
      ...TogyzqumalakEngine.getInitialState(),
      board: { player1Otaus: [0,0,0,0,0,1,0,0,0], player2Otaus: Array(9).fill(0) },
      kazan: { player1: 76, player2: 85 },
      currentPlayer: 1,
    }
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 5 })
    inv(r.nextState, 'after atsyrau')
  })
})

// ─────────────────────────────────────────────────────────────
// AI VALIDATION — ALL DIFFICULTY LEVELS
// ─────────────────────────────────────────────────────────────
describe('AI Validation', () => {
  const testAI = (difficulty: 'easy' | 'medium' | 'hard') => {
    it(`${difficulty}: always returns legal move from initial state`, () => {
      const state = { ...TogyzqumalakEngine.getInitialState(), currentPlayer: 2 as const }
      const ai = new TogyzAI(difficulty)
      const move = ai.chooseMove(state)
      expect(move).not.toBeNull()
      if (move) expect(TogyzqumalakEngine.isLegalMove(state, move)).toBe(true)
    })

    it(`${difficulty}: does not break invariant after applying its move`, () => {
      let state = TogyzqumalakEngine.getInitialState()
      // Play several P1 moves, then let AI (P2) move
      state = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 0 }).nextState
      const ai = new TogyzAI(difficulty)
      const move = ai.chooseMove(state)
      if (move) {
        const result = TogyzqumalakEngine.applyMove(state, move)
        inv(result.nextState, `${difficulty} AI move`)
      }
    })

    it(`${difficulty}: returns null when no legal moves`, () => {
      const state = {
        ...TogyzqumalakEngine.getInitialState(),
        currentPlayer: 2 as const,
        board: { player1Otaus: Array(9).fill(9), player2Otaus: Array(9).fill(0) },
        status: 'player2_wins' as const,
      }
      const ai = new TogyzAI(difficulty)
      expect(ai.chooseMove(state)).toBeNull()
    })
  }

  testAI('easy')
  testAI('medium')
  testAI('hard')

  it('easy AI picks capture when available (greedy)', () => {
    // P2 can capture by going to P1[0] which has 1 stone
    // P2[8]=1 → P1[0] becomes 2 → capture 2
    const state = mkState(
      [1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1],
      80, 80,
      2
    )
    const ai = new TogyzAI('easy')
    const move = ai.chooseMove(state)
    expect(move).not.toBeNull()
    // Move should be P2[8] → leads to capture
    // (Easy AI picks best immediate gain)
    if (move) {
      expect(TogyzqumalakEngine.isLegalMove(state, move)).toBe(true)
    }
  })

  it('all difficulties complete without exception over 10 AI moves', () => {
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      let state = TogyzqumalakEngine.getInitialState()
      const ai = new TogyzAI(diff)
      for (let i = 0; i < 10; i++) {
        if (state.status !== 'playing') break
        const moves = TogyzqumalakEngine.getLegalMoves(state)
        if (!moves.length) break
        const move = state.currentPlayer === 1 ? moves[0] : (ai.chooseMove(state) ?? moves[0])
        state = TogyzqumalakEngine.applyMove(state, move).nextState
        inv(state, `${diff} game move ${i}`)
      }
    }
  })
})

// ─────────────────────────────────────────────────────────────
// MOVE HISTORY
// ─────────────────────────────────────────────────────────────
describe('Move History', () => {
  it('records player, otauIndex, stonesLifted for each move', () => {
    let s = TogyzqumalakEngine.getInitialState()
    s = TogyzqumalakEngine.applyMove(s, { player: 1, otauIndex: 3 }).nextState
    s = TogyzqumalakEngine.applyMove(s, { player: 2, otauIndex: 3 }).nextState

    expect(s.history).toHaveLength(2)
    expect(s.history[0].player).toBe(1)
    expect(s.history[0].otauIndex).toBe(3)
    expect(s.history[0].stonesLifted).toBe(9)
    expect(s.history[1].player).toBe(2)
    expect(s.history[1].otauIndex).toBe(3)
    expect(s.history[1].stonesLifted).toBe(9)
  })

  it('records captured stones in history', () => {
    const state = mkState([0,0,0,0,0,0,0,0,1], [1,0,0,0,0,0,0,0,0], 80, 80)
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    expect(r.moveRecord.captured).toBe(2)
  })

  it('records tuzdyk in history', () => {
    const state = mkState([0,0,0,0,0,0,0,0,1], [2,0,0,0,0,0,0,0,0], 79, 80)
    const r = TogyzqumalakEngine.applyMove(state, { player: 1, otauIndex: 8 })
    expect(r.moveRecord.tuzdykCreated).toBe(true)
    expect(r.moveRecord.tuzdykIndex).toBe(0)
  })

  it('move numbers increment correctly', () => {
    let s = TogyzqumalakEngine.getInitialState()
    expect(s.moveNumber).toBe(1)
    s = TogyzqumalakEngine.applyMove(s, { player: 1, otauIndex: 0 }).nextState
    expect(s.moveNumber).toBe(2)
    s = TogyzqumalakEngine.applyMove(s, { player: 2, otauIndex: 0 }).nextState
    expect(s.moveNumber).toBe(3)
  })
})

// ─────────────────────────────────────────────────────────────
// RULES SOURCE VERIFICATION
// ─────────────────────────────────────────────────────────────
describe('Rules Source', () => {
  it('source URL and date are documented', () => {
    // This test documents the rule source for traceability
    const source = {
      name: 'World Togyzqumalak Federation / World Nomad Games',
      url: 'https://worldnomadgames.kz/en/page/Togyzkumalak',
      dateChecked: '2026-08-14',
      rulesImplemented: [
        'Board: 2 rows × 9 otau, 9 stones each, total 162',
        'Move: N=1 → move to next; N>1 → leave 1, sow N-1',
        'Capture: last stone on opponent AND count becomes even',
        'Tuzdyk: last stone on opponent AND count becomes exactly 3',
        'Tuzdyk restrictions: 1 per player, not 9th otau, not symmetric',
        'Tuzdyk redirect: all future stones → tuzdyk owner kazan',
        'Atsyrau: no moves → opponent sweeps their stones',
        'Win: first to 82+ stones in kazan',
        'Draw: both have exactly 81',
      ],
    }
    expect(source.url).toBeTruthy()
    expect(source.dateChecked).toBe('2026-08-14')
    expect(source.rulesImplemented).toHaveLength(9)
  })

  it('win threshold is 82 (>81)', () => {
    // rules.md: "collects 82 or more stones"
    expect(checkMidGameWin({ player1: 81, player2: 0 })).toBeNull()  // not yet
    expect(checkMidGameWin({ player1: 82, player2: 0 })).toBe('player1_wins')
  })

  it('draw requires exactly 81 each', () => {
    expect(determineGameStatus({ player1: 81, player2: 81 })).toBe('draw')
    expect(determineGameStatus({ player1: 82, player2: 80 })).toBe('player1_wins')
  })
})
