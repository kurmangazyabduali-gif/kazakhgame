import { describe, it, expect } from 'vitest'
import { validateMatchSubmission, PullEvent } from '@/games/arqan-tartys/scoring/validateMatch'
import { ARQAN_LEVELS } from '@/games/arqan-tartys/levels/config'

/**
 * Build a plausible-looking player event log by tapping on every beat for
 * enough rounds to win — used to exercise the server-side replay path.
 * Uses level 1's actual beatIntervalMs (not a generic default) since the
 * validator replays events against that level's own match config, and
 * generates enough beats to overcome a real (if weak) opposing AI within
 * the validator's plausible-duration ceiling.
 */
function buildWinningEvents(rounds: number, level = 1): PullEvent[] {
  const beatMs = ARQAN_LEVELS[level].matchConfig.beatIntervalMs ?? 900
  const events: PullEvent[] = []
  for (let r = 1; r <= rounds; r++) {
    for (let i = 1; i <= 260; i++) {
      events.push({ side: 'PLAYER', atMs: beatMs * i, roundNumber: r })
    }
  }
  return events
}

describe('Arqan Tartys — Server-side match validation', () => {
  it('rejects an unknown level', () => {
    const result = validateMatchSubmission({ level: 99, events: buildWinningEvents(1), aiSeed: 1 })
    expect(result.valid).toBe(false)
  })

  it('rejects an empty event log', () => {
    const result = validateMatchSubmission({ level: 1, events: [], aiSeed: 1 })
    expect(result.valid).toBe(false)
  })

  it('rejects an implausibly large event count', () => {
    const hugeEvents = Array.from({ length: 5000 }, (_, i) => ({ side: 'PLAYER' as const, atMs: i, roundNumber: 1 }))
    const result = validateMatchSubmission({ level: 1, events: hugeEvents, aiSeed: 1 })
    expect(result.valid).toBe(false)
  })

  it('ignores AI-side events submitted by the client entirely', () => {
    // A malicious client could submit fabricated AI events that never pull —
    // the server must re-simulate the AI itself rather than trusting these.
    const events: PullEvent[] = [
      { side: 'AI', atMs: 999_999, roundNumber: 1 }, // fabricated: AI "never reacts"
      ...buildWinningEvents(2),
    ]
    const withFabricated = validateMatchSubmission({ level: 1, events, aiSeed: 5 })
    const withoutFabricated = validateMatchSubmission({ level: 1, events: buildWinningEvents(2), aiSeed: 5 })

    // Same seed, same player events (fabricated AI event is discarded either
    // way) -> identical outcome, proving the AI event was never used.
    expect(withFabricated.valid).toBe(true)
    expect(withoutFabricated.valid).toBe(true)
    if (withFabricated.valid && withoutFabricated.valid) {
      expect(withFabricated.result.winner).toBe(withoutFabricated.result.winner)
    }
  })

  it('produces a valid, deterministic result for a plausible winning log', () => {
    const result = validateMatchSubmission({ level: 1, events: buildWinningEvents(2), aiSeed: 42 })
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.result.playerRoundsWon).toBeGreaterThanOrEqual(2)
      expect(result.score).toBeGreaterThan(0)
    }
  })

  it('the same submission replayed twice yields the same score (deterministic simulation)', () => {
    const events = buildWinningEvents(2)
    const first = validateMatchSubmission({ level: 1, events, aiSeed: 77 })
    const second = validateMatchSubmission({ level: 1, events, aiSeed: 77 })
    expect(first.valid).toBe(true)
    expect(second.valid).toBe(true)
    if (first.valid && second.valid) {
      expect(first.score).toBe(second.score)
      expect(first.result.winner).toBe(second.result.winner)
    }
  })

  it('rejects a submission with an invalid aiSeed', () => {
    const result = validateMatchSubmission({ level: 1, events: buildWinningEvents(1), aiSeed: NaN })
    expect(result.valid).toBe(false)
  })
})
