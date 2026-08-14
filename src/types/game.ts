export type GameCategory = 'Ұлттық спорт' | 'Ұлттық дәстүр' | 'Стратегия'

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
  finish(): GameResult
}
