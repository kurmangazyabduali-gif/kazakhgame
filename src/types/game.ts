export type GameCategory = 'Ұлттық спорт' | 'Ұлттық дәстүр' | 'Стратегия'
export type GameLifecycle = 'INITIALIZING' | 'READY' | 'PLAYING' | 'PAUSED' | 'FINISHED'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export interface RoundResult {
  roundNumber: number
  score: number
  accuracy: number
  metadata?: Record<string, unknown>
}

export interface GameResult {
  score: number
  xp: number
  duration?: number
  accuracy?: number
  completed: boolean
  achievements: string[]
  metadata?: Record<string, unknown>
}

export interface NationalGame {
  id: string
  slug: string
  name: string
  category: GameCategory

  initialize(): void
  start(): void
  pause(): void
  resume(): void
  restart(): void
  finish(): GameResult
}
