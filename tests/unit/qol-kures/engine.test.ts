import { describe, it, expect, beforeEach } from 'vitest'
import { PhysicsEngine } from '../../../src/games/qol-kures/engine/PhysicsEngine'
import { QolKuresAI } from '../../../src/games/qol-kures/ai/QolKuresAI'
import { calculateMatchScore } from '../../../src/games/qol-kures/scoring/scoring'

describe('Qol Kures PhysicsEngine', () => {
  let engine: PhysicsEngine

  beforeEach(() => {
    engine = new PhysicsEngine('SHAKIRT')
  })

  it('should initialize with correct default state values', () => {
    const state = engine.getState()
    expect(state.position).toBe(0)
    expect(state.playerStamina).toBe(100)
    expect(state.aiStamina).toBe(100)
    expect(state.isFinished).toBe(false)
  })

  it('should decrease player stamina when player is pressing', () => {
    const state = engine.tick(100, true, false) // 100ms
    expect(state.playerStamina).toBeLessThan(100)
    expect(state.aiStamina).toBe(100)
  })

  it('should recover player stamina when player rests', () => {
    engine.setState({ playerStamina: 50 })
    const state = engine.tick(100, false, false)
    expect(state.playerStamina).toBeGreaterThan(50)
  })

  it('should shift position based on force difference', () => {
    const state = engine.tick(500, true, false)
    expect(state.position).toBeGreaterThan(0)
  })

  it('should hold pin pressure before victory is finalized', () => {
    engine.setState({ position: 0.99 })
    // First tick starts pin hold
    let state = engine.tick(100, true, false) // 100ms
    expect(state.pinSide).toBe('player')
    expect(state.isFinished).toBe(false)

    // Tick enough time (800ms) to complete pin
    state = engine.tick(800, true, false)
    expect(state.isFinished).toBe(true)
    expect(state.winner).toBe('player')
  })

  it('should register a perfect timing burst correctly', () => {
    engine.setState({
      burstWindowActive: true,
      burstWindowProgress: 0.5 // perfect center
    })
    const quality = engine.triggerBurst()
    expect(quality).toBe('PERFECT')
  })

  it('should fail comeback when position is neutral', () => {
    const success = engine.triggerComeback()
    expect(success).toBe(false)
  })

  it('should trigger comeback when player is near defeat', () => {
    engine.setState({ position: -0.8, comebackActive: true })
    const success = engine.triggerComeback()
    expect(success).toBe(true)
  })
})

describe('Qol Kures AI agent', () => {
  let ai: QolKuresAI

  beforeEach(() => {
    ai = new QolKuresAI('MAJSTER')
  })

  it('should decide not to press when stamina is critical', () => {
    const state = {
      position: 0,
      velocity: 0,
      playerStamina: 100,
      aiStamina: 2, // critical
      playerFatigue: 0,
      aiFatigue: 0,
      momentum: 0,
      burstWindowProgress: 0,
      burstWindowActive: false,
      comebackActive: false,
      comebackProgress: 0,
      isFinished: false,
      winner: null,
      pinProgress: 0,
      pinSide: null,
      poseStatePlayer: 'IDLE' as const,
      poseStateAI: 'IDLE' as const
    }

    const decision = ai.update(100, state)
    expect(decision.isPressing).toBe(false)
  })
})

describe('Qol Kures Scoring rules', () => {
  it('should compute zero stars on defeat', () => {
    const res = calculateMatchScore(false, 1, 2, 0, 80, false, 'SHAKIRT')
    expect(res.stars).toBe(0)
    expect(res.score).toBeLessThan(500)
  })

  it('should compute stars and XP multiplier for Majster clean sheet', () => {
    const res = calculateMatchScore(true, 2, 0, 3, 95, false, 'MAJSTER')
    expect(res.stars).toBe(3)
    expect(res.xpEarned).toBeGreaterThan(200)
    expect(res.unlockedAchievements).toContain('Победа 3:0')
    expect(res.unlockedAchievements).toContain('Мастер Қол күрес')
    expect(res.unlockedAchievements).toContain('Победа над Майстер')
  })
})
