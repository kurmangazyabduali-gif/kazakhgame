import { NationalGame, GameResult } from '@/types/game'
import { loadProgression } from './scoring/progression'

/**
 * Lifecycle/bookkeeping shell satisfying the NationalGame interface (per
 * AGENTS.md rule #9). The actual rendering, physics, input, and match flow
 * live entirely in the Phaser engine/ scenes (see ArqanTartysGame.tsx for
 * the React mount point) — this class exists so Arqan Tartys registers
 * like every other game module even though, like Zhamby Atu, its moment-
 * to-moment gameplay is driven by Phaser rather than by this class calling
 * back into React state.
 */
export class ArqanTartysGame implements NationalGame {
  id = 'arqan-tartys'
  slug = 'arqan-tartys'
  name = 'Арқан тартыс'
  category = 'Ұлттық спорт' as const

  private isPaused = false

  initialize() {
    this.isPaused = false
  }

  start() {
    this.isPaused = false
  }

  pause() {
    this.isPaused = true
  }

  resume() {
    this.isPaused = false
  }

  restart() {
    this.initialize()
    this.start()
  }

  finish(): GameResult {
    const progression = loadProgression()
    return {
      score: progression.totalXP,
      xp: progression.totalXP,
      completed: progression.totalWins > 0,
      achievements: progression.achievements,
      metadata: {
        unlockedLevel: progression.unlockedLevel,
        totalWins: progression.totalWins,
        totalMatchesPlayed: progression.totalMatchesPlayed,
      },
    }
  }
}
