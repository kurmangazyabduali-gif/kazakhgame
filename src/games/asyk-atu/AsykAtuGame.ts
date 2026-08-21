import { NationalGame, GameResult } from '@/types/game'
import { ASYK_CONFIG } from './config'
import { ThrowEvent, AsykGameState, AsykAtuPhase } from './types'
import { calculateTotalScore, calculateXP, calculateAccuracy } from './scoring'
import { checkAchievements } from './achievements'

export class AsykAtuGame implements NationalGame {
  id = 'asyk-atu'
  slug = ASYK_CONFIG.GAME_SLUG
  name = 'Асық ату'
  category = 'Ұлттық спорт' as const

  private events: ThrowEvent[] = []
  private onReadyCb?: () => void
  private isPaused = false

  public state: AsykGameState = {
    currentLevel: 1,
    maxLevels: 5,
    score: 0,
    accuracy: 0,
    totalTargetsCleared: 0,
    throwsUsed: 0,
    highestCombo: 0,
    events: []
  }

  initialize() {
    this.events = []
    this.isPaused = false
    this.state = {
      currentLevel: 1,
      maxLevels: 5,
      score: 0,
      accuracy: 0,
      totalTargetsCleared: 0,
      throwsUsed: 0,
      highestCombo: 0,
      events: []
    }
    if (this.onReadyCb) this.onReadyCb()
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

  recordThrow(event: ThrowEvent) {
    this.events.push(event)
    this.state.events.push(event)
    this.state.throwsUsed++
    this.state.totalTargetsCleared += event.targetsHit
    
    if (event.combo > this.state.highestCombo) {
      this.state.highestCombo = event.combo
    }

    this.state.score = calculateTotalScore(this.events)
    this.state.accuracy = calculateAccuracy(this.events)
  }

  advanceLevel() {
    this.state.currentLevel++
  }

  finish(): GameResult {
    const completed = this.state.currentLevel > this.state.maxLevels
    const xp = calculateXP(this.state.score, completed)
    // Achievements logic needs ThrowEvent instead of RoundEvent
    const achievements = checkAchievements(this.events, this.state.score)

    return {
      score: this.state.score,
      xp,
      accuracy: this.state.accuracy,
      completed,
      achievements,
      metadata: {
        levelsCompleted: this.state.currentLevel - 1,
        throwsUsed: this.state.throwsUsed,
        highestCombo: this.state.highestCombo,
        events: this.events
      }
    }
  }

  onReady(cb: () => void) {
    this.onReadyCb = cb
  }
}
