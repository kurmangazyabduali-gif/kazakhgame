import { describe, it, expect, beforeEach } from 'vitest'
import { HantalapayEngine } from '../../../src/games/hantalapay/engine/HantalapayEngine'
import { scatterPhysics } from '../../../src/games/hantalapay/physics/ScatterPhysics'
import { scoringCalculator } from '../../../src/games/hantalapay/scoring/ScoringSystem'
import { getRoundConfig, HANTALAPAY_ROUNDS } from '../../../src/games/hantalapay/rounds/roundConfigs'

describe('Hantalapay Game Engine & Physics Tests', () => {
  let engine: HantalapayEngine

  beforeEach(() => {
    engine = new HantalapayEngine()
    engine.setBounds(800, 600)
  })

  it('should initialize match at round 1 in READY state', () => {
    engine.startMatch()
    expect(engine.currentRoundNumber).toBe(1)
    expect(engine.state).toBe('COUNTDOWN')
    expect(engine.score).toBe(0)
  })

  it('should create 10 progressive round configurations', () => {
    expect(HANTALAPAY_ROUNDS.length).toBe(10)
    for (let i = 1; i <= 10; i++) {
      const cfg = getRoundConfig(i)
      expect(cfg.roundNumber).toBe(i)
      expect(cfg.asykCount).toBeGreaterThan(0)
    }
  })

  it('should generate scatter asyks with physics velocities and exactly 1 Khan', () => {
    const asyks = scatterPhysics.createScatterAsyks(20, true, 400, 300, 800, 600, 200, 400)
    expect(asyks.length).toBe(20)
    const khans = asyks.filter((a) => a.isKhan)
    expect(khans.length).toBe(1)
  })

  it('should simulate physics step and update positions without throwing', () => {
    const asyks = scatterPhysics.createScatterAsyks(10, true, 400, 300, 800, 600, 200, 400)
    const active = scatterPhysics.stepPhysics(asyks, 0.016, { width: 800, height: 600, margin: 40 })
    expect(typeof active).toBe('boolean')
  })

  it('should calculate asyk pickup points with combo multipliers', () => {
    const regularAsyk = {
      id: 'test-1',
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      radius: 18,
      rotation: 0,
      rotationSpeed: 0,
      orientation: 'ALSHY' as const,
      isKhan: false,
      isCollected: false,
      isCollectingAnimation: false,
      collectProgress: 0,
      collectStartX: 0,
      collectStartY: 0,
      scale: 1.0,
      colorHex: '#FFFFFF',
      opacity: 1.0,
    }

    const pts1 = scoringCalculator.calculateAsykPoints(regularAsyk, 1)
    expect(pts1.basePoints).toBe(150) // 100 base + 50 ALSHY
    expect(pts1.totalPoints).toBe(150)

    const ptsCombo = scoringCalculator.calculateAsykPoints(regularAsyk, 3)
    expect(ptsCombo.comboMultiplier).toBeGreaterThan(1.0)
    expect(ptsCombo.totalPoints).toBeGreaterThan(150)
  })

  it('should calculate Khan pickup points correctly', () => {
    const khanAsyk = {
      id: 'khan-1',
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      radius: 24,
      rotation: 0,
      rotationSpeed: 0,
      orientation: 'ALSHY' as const,
      isKhan: true,
      isCollected: false,
      isCollectingAnimation: false,
      collectProgress: 0,
      collectStartX: 0,
      collectStartY: 0,
      scale: 1.0,
      colorHex: '#D4AF37',
      opacity: 1.0,
    }

    const pts = scoringCalculator.calculateAsykPoints(khanAsyk, 1)
    expect(pts.basePoints).toBe(550) // 500 Khan + 50 ALSHY
  })

  it('should calculate star ratings deterministically', () => {
    const cfg = getRoundConfig(1)
    const res3 = scoringCalculator.calculateRoundResult(cfg, 12, 12, true, 5, 5, 12, 2000)
    expect(res3.stars).toBe(3)

    const res1 = scoringCalculator.calculateRoundResult(cfg, 5, 12, false, 15, 1, 10, 500)
    expect(res1.stars).toBe(1)
  })
})
