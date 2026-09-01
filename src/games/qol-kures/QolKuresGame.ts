import { NationalGame, GameResult } from '@/types/game'
import { useQolKuresStore } from './store/useQolKuresStore'

export class QolKuresGame implements NationalGame {
  id = 'qol-kures'
  slug = 'qol-kures'
  name = 'Қол күрес'
  category = 'Ұлттық спорт' as const

  private isPaused = false

  initialize() {
    this.isPaused = false
    const store = useQolKuresStore.getState()
    store.selectLevel(1) // defaults to level 1
  }

  start() {
    this.isPaused = false
    const store = useQolKuresStore.getState()
    store.startMatch()
  }

  pause() {
    this.isPaused = true
    useQolKuresStore.setState({ gameStatus: 'READY' })
  }

  resume() {
    this.isPaused = false
    useQolKuresStore.setState({ gameStatus: 'PLAYING' })
  }

  restart() {
    this.initialize()
    this.start()
  }

  finish(): GameResult {
    const store = useQolKuresStore.getState()
    const scoreRes = store.scoreResult

    return {
      score: scoreRes?.score || 0,
      xp: scoreRes?.xpEarned || 0,
      completed: (scoreRes?.stars || 0) > 0,
      achievements: scoreRes?.unlockedAchievements || [],
      metadata: {
        levelId: store.levelId,
        playerWins: store.playerWins,
        aiWins: store.aiWins
      }
    }
  }
}
