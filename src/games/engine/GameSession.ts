import { NationalGame, GameResult } from '@/types/game'

export class GameSession {
  private game: NationalGame
  private startTime: number | null = null
  private status: 'idle' | 'running' | 'paused' | 'finished' = 'idle'
  private totalPausedTimeMs = 0
  private lastPauseTime: number | null = null

  constructor(game: NationalGame) {
    this.game = game
  }

  start() {
    if (this.status !== 'idle') return
    this.game.initialize()
    this.game.start()
    this.startTime = Date.now()
    this.totalPausedTimeMs = 0
    this.lastPauseTime = null
    this.status = 'running'
  }

  pause() {
    if (this.status !== 'running') return
    this.game.pause()
    this.lastPauseTime = Date.now()
    this.status = 'paused'
  }

  resume() {
    if (this.status !== 'paused') return
    this.game.resume()
    if (this.lastPauseTime) {
      this.totalPausedTimeMs += Date.now() - this.lastPauseTime
      this.lastPauseTime = null
    }
    this.status = 'running'
  }

  restart() {
    this.game.restart()
    this.startTime = Date.now()
    this.totalPausedTimeMs = 0
    this.lastPauseTime = null
    this.status = 'running'
  }

  finish(): GameResult | null {
    if (this.status !== 'running' && this.status !== 'paused') return null
    const result = this.game.finish()
    
    if (this.startTime && !result.duration) {
      result.duration = this.getElapsedMs()
    }
    
    this.status = 'finished'
    return result
  }

  getStatus() {
    return this.status
  }

  getElapsedMs(): number {
    if (!this.startTime) return 0
    const now = this.status === 'paused' && this.lastPauseTime ? this.lastPauseTime : Date.now()
    return now - this.startTime - this.totalPausedTimeMs
  }
}
