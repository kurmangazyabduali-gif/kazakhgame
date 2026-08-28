import { describe, it, expect } from 'vitest'
import {
  hitStopMsForQuality,
  shakeSpecForQuality,
  popupSpecForQuality,
  dangerVignetteIntensity,
  matchPointSide,
  fatigueTintColor,
} from '@/games/arqan-tartys/fx/JuiceRules'

describe('Arqan Tartys — JuiceRules', () => {
  describe('hitStopMsForQuality', () => {
    it('only a PERFECT pull triggers hit-stop', () => {
      expect(hitStopMsForQuality('PERFECT')).toBeGreaterThan(0)
      expect(hitStopMsForQuality('GOOD')).toBe(0)
      expect(hitStopMsForQuality('EARLY')).toBe(0)
      expect(hitStopMsForQuality('LATE')).toBe(0)
      expect(hitStopMsForQuality('MISS')).toBe(0)
    })

    it('hit-stop is short enough to read as a punch, not lag', () => {
      expect(hitStopMsForQuality('PERFECT')).toBeLessThanOrEqual(120)
    })
  })

  describe('shakeSpecForQuality', () => {
    it('shake intensity decreases monotonically with quality tier', () => {
      const perfect = shakeSpecForQuality('PERFECT', 'PLAYER')
      const good = shakeSpecForQuality('GOOD', 'PLAYER')
      const early = shakeSpecForQuality('EARLY', 'PLAYER')
      const miss = shakeSpecForQuality('MISS', 'PLAYER')
      expect(perfect.intensity).toBeGreaterThan(good.intensity)
      expect(good.intensity).toBeGreaterThan(early.intensity)
      expect(early.intensity).toBeGreaterThan(miss.intensity)
      expect(miss.intensity).toBe(0)
    })

    it('direction is +1 for PLAYER and -1 for AI', () => {
      expect(shakeSpecForQuality('PERFECT', 'PLAYER').direction).toBe(1)
      expect(shakeSpecForQuality('PERFECT', 'AI').direction).toBe(-1)
    })

    it('a MISS never shakes the screen', () => {
      const miss = shakeSpecForQuality('MISS', 'PLAYER')
      expect(miss.durationMs).toBe(0)
      expect(miss.intensity).toBe(0)
    })
  })

  describe('popupSpecForQuality', () => {
    it('every quality tier has distinct popup text', () => {
      const qualities = ['PERFECT', 'GOOD', 'EARLY', 'LATE', 'MISS'] as const
      const texts = new Set(qualities.map((q) => popupSpecForQuality(q).text))
      expect(texts.size).toBe(qualities.length)
    })

    it('MISS uses the warning color family, PERFECT uses gold', () => {
      expect(popupSpecForQuality('PERFECT').colorHex).toBe('#d4af37')
      expect(popupSpecForQuality('MISS').colorHex).toBe('#8a3a2a')
    })
  })

  describe('dangerVignetteIntensity', () => {
    it('is zero while safely below the danger threshold', () => {
      expect(dangerVignetteIntensity(0)).toBe(0)
      expect(dangerVignetteIntensity(0.3)).toBe(0)
    })

    it('ramps from 0 to 1 between the threshold and full danger', () => {
      const low = dangerVignetteIntensity(0.7)
      const high = dangerVignetteIntensity(0.9)
      expect(low).toBeGreaterThan(0)
      expect(high).toBeGreaterThan(low)
      expect(dangerVignetteIntensity(1)).toBe(1)
    })

    it('clamps out-of-range input instead of throwing or going negative', () => {
      expect(dangerVignetteIntensity(-5)).toBe(0)
      expect(dangerVignetteIntensity(5)).toBe(1)
    })
  })

  describe('matchPointSide', () => {
    it('is null while the rope is comfortably centered', () => {
      expect(matchPointSide(0, 100)).toBeNull()
      expect(matchPointSide(50, 100)).toBeNull()
    })

    it('flags PLAYER once close enough to the positive win threshold', () => {
      expect(matchPointSide(90, 100)).toBe('PLAYER')
      expect(matchPointSide(100, 100)).toBe('PLAYER')
    })

    it('flags AI once close enough to the negative win threshold', () => {
      expect(matchPointSide(-90, 100)).toBe('AI')
      expect(matchPointSide(-100, 100)).toBe('AI')
    })

    it('never throws on a zero win threshold', () => {
      expect(matchPointSide(0, 0)).toBeNull()
    })
  })

  describe('fatigueTintColor', () => {
    it('is pure white (no tint) below the fatigue-tint threshold', () => {
      expect(fatigueTintColor(0)).toBe(0xffffff)
      expect(fatigueTintColor(0.4)).toBe(0xffffff)
    })

    it('drifts away from white as fatigue climbs past the threshold', () => {
      const mid = fatigueTintColor(0.8)
      const max = fatigueTintColor(1)
      expect(mid).not.toBe(0xffffff)
      expect(max).not.toBe(0xffffff)
      // Fully fatigued should be at least as far from white as mid-fatigue.
      expect(max).toBeLessThanOrEqual(mid)
    })

    it('clamps fatigue outside [0,1] instead of producing an invalid color', () => {
      const result = fatigueTintColor(5)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(0xffffff)
    })
  })
})
