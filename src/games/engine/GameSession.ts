import { NationalGame, GameResult } from '@/types/game'

export class GameSession {
  private game: NationalGame
  private startTime: number | null = null
  private status: 'idle' | 'running' | 'paused' | 'finished' = 'idle'

  constructor(game: NationalGame) {
    this.game = game
  }

  start() {
    if (this.status !== 'idle') return
    this.game.initialize()
    this.game.start()
    this.startTime = Date.now()
    this.status = 'running'
  }

  pause() {
    if (this.status !== 'running') return
    this.game.pause()
    this.status = 'paused'
  }

  resume() {
    if (this.status !== 'paused') return
    this.game.resume()
    this.status = 'running'
  }

  finish(): GameResult | null {
    if (this.status !== 'running' && this.status !== 'paused') return null
    const result = this.game.finish()
    
    if (this.startTime && !result.duration) {
      result.duration = Date.now() - this.startTime
    }
    
    this.status = 'finished'
    return result
  }

  getStatus() {
    return this.status
  }
}
