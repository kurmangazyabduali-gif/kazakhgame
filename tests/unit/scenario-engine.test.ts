import { describe, it, expect, beforeEach } from 'vitest'
import { ScenarioEngine } from '../../src/games/engine/scenario/ScenarioEngine'
import { firstTeaScenario } from '../../src/games/kelin-shai/scenarios/first-tea'
import { ScenarioAction, ScenarioState } from '../../src/games/engine/scenario/types'

describe('ScenarioEngine', () => {
  let engine: ScenarioEngine

  beforeEach(() => {
    engine = new ScenarioEngine(firstTeaScenario)
    engine.initialize()
    engine.start()
  })

  it('should initialize with correct default state', () => {
    // We can't access private state directly, but we can verify via callbacks
    let currentState: ScenarioState | null = null
    engine.onStateUpdate = (state) => {
      currentState = state
    }
    engine.initialize() // trigger update
    
    expect(currentState!.currentStepIndex).toBe(0)
    expect(currentState!.metrics.hospitality).toBe(100)
    expect(currentState!.metrics.etiquette).toBe(100)
    expect(currentState!.mistakes).toBe(0)
  })

  it('should correctly process a valid action and advance step', () => {
    // Step 1: Greet guest
    const action: ScenarioAction = {
      id: 'test_action_1',
      type: 'greet',
      targetId: 'guest'
    }
    
    const feedback = engine.performAction(action)
    expect(feedback?.success).toBe(true)
    expect(feedback?.reaction).toBe('smile')
    
    // Check if advanced to Step 2
    const currentStep = engine.getCurrentStep()
    expect(currentStep?.id).toBe('step2_prepare_table')
  })

  it('should register a mistake for an invalid action', () => {
    // Step 1: Try pouring instead of greeting
    const action: ScenarioAction = {
      id: 'test_action_2',
      type: 'pour',
      targetId: 'cup1'
    }
    
    const feedback = engine.performAction(action)
    expect(feedback?.success).toBe(false)
    
    let currentState: ScenarioState | null = null
    engine.onStateUpdate = (state) => { currentState = state }
    // Force a dummy action just to get state if needed, or rely on performAction emitting it
    engine.performAction({ id: 'dummy', type: 'select' })
    
    expect(currentState!.mistakes).toBeGreaterThan(0)
  })

  it('should penalize serving an adult guest before the elder tea step is complete', () => {
    engine.performAction({ id: 'a1', type: 'greet', targetId: 'guest' })
    engine.performAction({ id: 'p1', type: 'place', itemId: 'bauyrsak', targetId: 'dastarkhan' })
    engine.performAction({ id: 'p2', type: 'place', itemId: 'qurt', targetId: 'dastarkhan' })
    engine.performAction({ id: 'p3', type: 'place', itemId: 'sweets', targetId: 'dastarkhan' })
    
    const action: ScenarioAction = {
      id: 'a2',
      type: 'give',
      targetId: 'guest',
      itemId: 'cup1'
    }
    
    const feedback = engine.performAction(action)
    expect(feedback?.success).toBe(false)
    expect(feedback?.scoreDelta?.tradition).toBeLessThan(0)
  })

  it('should complete scenario and calculate correct score', () => {
    // Complete the whole scenario optimally
    engine.performAction({ id: 'a1', type: 'greet', targetId: 'guest' }) // step 1 done
    engine.performAction({ id: 'p1', type: 'place', itemId: 'bauyrsak', targetId: 'dastarkhan' })
    engine.performAction({ id: 'p2', type: 'place', itemId: 'qurt', targetId: 'dastarkhan' })
    engine.performAction({ id: 'p3', type: 'place', itemId: 'sweets', targetId: 'dastarkhan' })
    engine.performAction({ id: 'a2', type: 'pour', targetId: 'cup1', value: 50 }) // fill cup
    engine.performAction({ id: 'a3', type: 'give', targetId: 'ene', itemId: 'cup1' }) // step 2 done
    engine.performAction({ id: 'a4', type: 'add_sugar', targetId: 'cup2' })
    engine.performAction({ id: 'a5', type: 'pour', targetId: 'cup2', value: 50 })
    engine.performAction({ id: 'a6', type: 'give', targetId: 'adult_guest', itemId: 'cup2' })
    engine.performAction({ id: 'a7', type: 'pour', targetId: 'cup3', value: 50 })
    engine.performAction({ id: 'a8', type: 'give', targetId: 'younger_guest', itemId: 'cup3' })
    
    // Now it should be finished
    const step = engine.getCurrentStep()
    expect(step).toBeNull()

    // Finish returns the result
    const result = engine.finish()
    expect(result.completed).toBe(true)
    expect(result.score).toBeGreaterThan(90)
    expect(result.achievements).toContain('kelin_first_tea')
  })
})
