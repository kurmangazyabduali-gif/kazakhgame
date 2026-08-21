import { 
  CulturalScenario, 
  ScenarioState, 
  ScenarioAction, 
  InteractionFeedback,
  ScenarioResult
} from './types'
import { buildKelinShaiResult, normalizeMetrics } from '../../kelin-shai/scoring'

export class ScenarioEngine {
  private scenario: CulturalScenario
  private state!: ScenarioState
  private isFinished: boolean = false

  // Callbacks for UI updates
  public onStateUpdate?: (state: ScenarioState) => void
  public onFeedback?: (feedback: InteractionFeedback) => void
  public onScenarioComplete?: (result: ScenarioResult) => void

  constructor(scenario: CulturalScenario) {
    this.scenario = scenario
  }

  public initialize(): void {
    this.scenario.initialize()
    
    const actorsMap = new Map(this.scenario.npcs.map(npc => [npc.id, npc]))
    const itemsMap = new Map(this.scenario.items.map(item => [item.id, item]))

    this.state = {
      currentStepIndex: 0,
      actors: actorsMap,
      items: itemsMap,
      completedActions: [],
      mistakes: 0,
      metrics: {
        hospitality: 100,
        etiquette: 100,
        tradition: 100,
        neatness: 100,
        speed: 100,
      },
      startTime: Date.now(),
      duration: 0
    }
    
    this.isFinished = false
    this.notifyStateUpdate()
  }

  public start(): void {
    if (!this.state) {
      this.initialize()
    }
    this.state.startTime = Date.now()
    this.notifyStateUpdate()
  }

  public getCurrentStep() {
    if (this.isFinished || this.state.currentStepIndex >= this.scenario.steps.length) {
      return null
    }
    return this.scenario.steps[this.state.currentStepIndex]
  }

  public performAction(action: ScenarioAction): InteractionFeedback | null {
    if (this.isFinished) return null
    
    const currentStep = this.getCurrentStep()
    if (!currentStep) return null

    // Check if the action is available in this step
    if (!currentStep.availableActions.includes(action.type)) {
      this.state.mistakes += 1
      this.notifyStateUpdate()
      const feedback: InteractionFeedback = { success: false, reaction: 'none', message: 'Это действие сейчас недоступно.' }
      this.onFeedback?.(feedback)
      return feedback
    }

    // Evaluate action against step rules
    const feedback = currentStep.onAction(action, this.state)
    
    // Apply score deltas
    if (feedback.scoreDelta) {
      if (feedback.scoreDelta.hospitality !== undefined) this.state.metrics.hospitality += feedback.scoreDelta.hospitality
      if (feedback.scoreDelta.etiquette !== undefined) this.state.metrics.etiquette += feedback.scoreDelta.etiquette
      if (feedback.scoreDelta.tradition !== undefined) this.state.metrics.tradition += feedback.scoreDelta.tradition
      if (feedback.scoreDelta.neatness !== undefined) this.state.metrics.neatness += feedback.scoreDelta.neatness
      if (feedback.scoreDelta.speed !== undefined) this.state.metrics.speed += feedback.scoreDelta.speed
      this.state.metrics = normalizeMetrics(this.state.metrics)
    }

    if (!feedback.success) {
      this.state.mistakes += 1
    }

    this.state.completedActions.push(action)
    
    // Notify feedback
    if (this.onFeedback) {
      this.onFeedback(feedback)
    }

    // Check if step is complete
    if (currentStep.isComplete(this.state)) {
      this.advanceStep()
    } else {
      this.notifyStateUpdate()
    }

    return feedback
  }

  private advanceStep(): void {
    this.state.currentStepIndex++
    
    if (this.state.currentStepIndex >= this.scenario.steps.length) {
      this.finish()
    } else {
      this.notifyStateUpdate()
    }
  }

  public finish(): ScenarioResult {
    this.isFinished = true
    this.state.duration = Math.floor((Date.now() - this.state.startTime) / 1000)
    
    const result = buildKelinShaiResult(
      this.state,
      this.scenario.steps.map((step) => step.id)
    )

    this.notifyStateUpdate()
    
    if (this.onScenarioComplete) {
      this.onScenarioComplete(result)
    }

    return result
  }

  public getStateSnapshot(): ScenarioState | null {
    if (!this.state) return null
    return { ...this.state }
  }

  private notifyStateUpdate(): void {
    if (this.onStateUpdate) {
      this.onStateUpdate({ ...this.state })
    }
  }
}
