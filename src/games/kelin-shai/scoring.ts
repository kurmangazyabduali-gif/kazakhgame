import type { EvaluationMetrics, ScenarioAction, ScenarioResult, ScenarioState } from '../engine/scenario/types'

export function clampMetric(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function normalizeMetrics(metrics: EvaluationMetrics): EvaluationMetrics {
  return {
    hospitality: clampMetric(metrics.hospitality),
    etiquette: clampMetric(metrics.etiquette),
    tradition: clampMetric(metrics.tradition),
    neatness: clampMetric(metrics.neatness),
    speed: clampMetric(metrics.speed),
  }
}

export function calculateKelinShaiScore(metrics: EvaluationMetrics): number {
  const normalized = normalizeMetrics(metrics)
  return Math.round(
    normalized.hospitality * 0.28 +
      normalized.etiquette * 0.24 +
      normalized.tradition * 0.24 +
      normalized.neatness * 0.16 +
      normalized.speed * 0.08
  )
}

export function calculateKelinShaiXP(score: number, mistakes: number): number {
  const completionBonus = 45
  const mistakePenalty = Math.min(30, mistakes * 5)
  return Math.max(20, Math.round(score * 1.55 + completionBonus - mistakePenalty))
}

export function deriveActionQuality(actions: ScenarioAction[]) {
  const pourActions = actions.filter((action) => action.type === 'pour')
  const idealPours = pourActions.filter(
    (action) => typeof action.value === 'number' && action.value >= 35 && action.value <= 75
  )

  return {
    pourCount: pourActions.length,
    idealPourCount: idealPours.length,
    servedElderFirst: actions.some((action, index) => {
      if (action.type !== 'give' || action.targetId !== 'ene') return false
      const firstGiveIndex = actions.findIndex((candidate) => candidate.type === 'give')
      return firstGiveIndex === index
    }),
  }
}

export function buildKelinShaiResult(state: ScenarioState, completedSteps: string[]): ScenarioResult {
  const metrics = normalizeMetrics(state.metrics)
  const score = calculateKelinShaiScore(metrics)

  return {
    score,
    xp: calculateKelinShaiXP(score, state.mistakes),
    duration: state.duration,
    completed: true,
    achievements: evaluateKelinShaiAchievements(state, score),
    metrics,
    mistakes: state.mistakes,
    completedSteps,
    metadata: {
      actionsTaken: state.completedActions.length,
      actions: state.completedActions,
    },
  }
}

export function evaluateKelinShaiAchievements(state: ScenarioState, score: number): string[] {
  const achievements = ['kelin_first_tea']
  const quality = deriveActionQuality(state.completedActions)

  if (state.metrics.hospitality >= 90) achievements.push('kelin_hospitality')
  if (state.metrics.neatness >= 90 && quality.idealPourCount === quality.pourCount) achievements.push('kelin_neat')
  if (quality.servedElderFirst && state.metrics.tradition >= 85) achievements.push('kelin_tradition')
  if (score >= 92 && state.mistakes <= 1) achievements.push('kelin_master')

  return achievements
}
