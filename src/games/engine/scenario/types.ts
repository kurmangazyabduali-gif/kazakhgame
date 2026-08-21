import { GameResult } from '@/types/game'

export type ScenarioCategory = 'family' | 'guest' | 'tradition' | 'ceremony'

export interface NPC {
  id: string
  name: string
  role: string
  ageGroup: 'elder' | 'adult' | 'young' | 'child'
  relation: string
  position: { x: number; y: number }
  state?: 'idle' | 'waiting' | 'satisfied' | 'confused'
  preferences?: Record<string, unknown>
}

export interface Item {
  id: string
  name: string
  type: 'interactable' | 'decoration' | 'container'
  initialPosition: { x: number; y: number }
  state?: Record<string, unknown>
}

export interface CulturalRule {
  id: string
  scenario: string
  cultural_rule: string
  explanation: string
  source: string
  source_url: string | null
  verified: boolean
}

export interface ScenarioAction {
  id: string
  type: 'select' | 'pour' | 'give' | 'place' | 'greet' | 'add_sugar'
  targetId?: string
  itemId?: string
  value?: number // e.g., pour duration or amount
}

export type ReactionType = 'smile' | 'thanks' | 'wait' | 'surprise' | 'displeasure' | 'nod' | 'confused' | 'none'

export interface InteractionFeedback {
  success: boolean
  reaction: ReactionType
  message?: string
  scoreDelta?: Partial<EvaluationMetrics>
}

export interface ScenarioCondition {
  check: (state: ScenarioState, action: ScenarioAction) => InteractionFeedback
}

export interface ScenarioStep {
  id: string
  title: string
  description: string
  npcId?: string // Primary NPC involved
  availableActions: string[]
  expectedActions: string[]
  onAction: (action: ScenarioAction, state: ScenarioState) => InteractionFeedback
  isComplete: (state: ScenarioState) => boolean
}

export interface EvaluationMetrics {
  hospitality: number
  etiquette: number
  tradition: number
  neatness: number
  speed: number
}

export interface ScenarioResult extends GameResult {
  metrics: EvaluationMetrics
  mistakes: number
  completedSteps: string[]
}

export interface ScenarioState {
  currentStepIndex: number
  actors: Map<string, NPC>
  items: Map<string, Item>
  completedActions: ScenarioAction[]
  mistakes: number
  metrics: EvaluationMetrics
  startTime: number
  duration: number
}

export interface CulturalScenario {
  id: string
  slug: string
  title: string
  category: ScenarioCategory
  locales: string[]
  
  npcs: NPC[]
  items: Item[]
  steps: ScenarioStep[]
  culturalRules?: CulturalRule[]
  
  initialize(): void
}
