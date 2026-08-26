import { describe, it, expect } from 'vitest'
import { classifyTiming, DEFAULT_MATCH_CONFIG } from '@/games/arqan-tartys/engine/types'

describe('Arqan Tartys — Rhythm timing windows', () => {
  it('an on-beat tap (0ms offset) is PERFECT', () => {
    expect(classifyTiming(0)).toBe('PERFECT')
  })

  it('a tap within the perfect window is PERFECT', () => {
    expect(classifyTiming(DEFAULT_MATCH_CONFIG.perfectWindowMs - 1)).toBe('PERFECT')
  })

  it('a tap just outside the perfect window but inside the good window is GOOD', () => {
    expect(classifyTiming(DEFAULT_MATCH_CONFIG.perfectWindowMs + 5)).toBe('GOOD')
  })

  it('a tap noticeably early (outside good window) is EARLY', () => {
    const offset = -(DEFAULT_MATCH_CONFIG.goodWindowMs * 1.4)
    expect(classifyTiming(offset)).toBe('EARLY')
  })

  it('a tap noticeably late (outside good window) is LATE', () => {
    const offset = DEFAULT_MATCH_CONFIG.goodWindowMs * 1.4
    expect(classifyTiming(offset)).toBe('LATE')
  })

  it('a tap far outside any window is a MISS', () => {
    expect(classifyTiming(5000)).toBe('MISS')
  })

  it('perfect window is strictly tighter than the good window', () => {
    expect(DEFAULT_MATCH_CONFIG.perfectWindowMs).toBeLessThan(DEFAULT_MATCH_CONFIG.goodWindowMs)
  })
})
