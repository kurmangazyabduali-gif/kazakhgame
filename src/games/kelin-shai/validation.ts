import { z } from 'zod'
import { ScenarioEngine } from '../engine/scenario/ScenarioEngine'
import type { ScenarioAction, ScenarioResult } from '../engine/scenario/types'
import { firstTeaScenario } from './scenarios/first-tea'

const actionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['select', 'pour', 'give', 'place', 'greet', 'add_sugar']),
  targetId: z.string().optional(),
  itemId: z.string().optional(),
  value: z.number().min(0).max(100).optional(),
})

export const kelinShaiSubmitSchema = z.object({
  sessionId: z.string().uuid(),
  result: z.object({
    metadata: z.object({
      actions: z.array(actionSchema).min(1).max(40),
    }),
  }),
})

export function validateKelinShaiResult(input: unknown): ScenarioResult {
  const payload = kelinShaiSubmitSchema.parse(input)
  const actions = payload.result.metadata.actions as ScenarioAction[]
  const engine = new ScenarioEngine(firstTeaScenario)

  engine.initialize()
  engine.start()

  for (const action of actions) {
    engine.performAction(action)
    if (!engine.getCurrentStep()) break
  }

  const result = engine.finish()
  if (!result.completed) {
    throw new Error('Scenario was not completed')
  }

  return result
}
