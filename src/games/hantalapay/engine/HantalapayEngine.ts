import {
  HantalapayState,
  AsykItem,
  ObstacleItem,
  RoundConfig,
  RoundResultData,
  MatchSummary,
} from './types'
import { getRoundConfig } from '../rounds/roundConfigs'
import { scatterPhysics } from '../physics/ScatterPhysics'
import { scoringCalculator } from '../scoring/ScoringSystem'
import { idleDetector } from '../hints/IdleDetector'
import { hantalapayAudio } from '../audio/HantalapayAudio'
import { particlePool } from '../entities/ParticlePool'

export class HantalapayEngine {
  public state: HantalapayState = 'READY'
  public currentRoundNumber: number = 1
  public totalRounds: number = 10
  public currentConfig: RoundConfig

  public asyks: AsykItem[] = []
  public obstacles: ObstacleItem[] = []

  public countdownSec: number = 3
  private countdownTimerMs: number = 0

  public roundTimerSec: number = 0
  public roundTimeSpentSec: number = 0

  public score: number = 0
  public roundScore: number = 0
  public comboStreak: number = 0
  private lastPickupTimeMs: number = 0

  public collectedCount: number = 0
  public totalTaps: number = 0
  public khanCapturedInRound: boolean = false

  public isSlowMoActive: boolean = false
  private slowMoTimerMs: number = 0

  public roundResultsHistory: RoundResultData[] = []
  public currentRoundResult: RoundResultData | null = null
  public finalMatchSummary: MatchSummary | null = null

  public bounds = { width: 1000, height: 700, margin: 40 }

  constructor() {
    this.currentConfig = getRoundConfig(1)
  }

  public setBounds(width: number, height: number) {
    this.bounds.width = Math.max(320, width)
    this.bounds.height = Math.max(320, height)
    this.bounds.margin = Math.min(40, width * 0.05)
  }

  public startMatch() {
    this.currentRoundNumber = 1
    this.score = 0
    this.roundResultsHistory = []
    this.finalMatchSummary = null
    this.startRound(1)
  }

  public startRound(roundNum: number) {
    this.currentRoundNumber = roundNum
    this.currentConfig = getRoundConfig(roundNum)
    this.roundScore = 0
    this.comboStreak = 0
    this.collectedCount = 0
    this.totalTaps = 0
    this.khanCapturedInRound = false
    this.roundTimeSpentSec = 0
    this.roundTimerSec = this.currentConfig.timeLimitSec

    this.state = 'COUNTDOWN'
    this.countdownSec = 3
    this.countdownTimerMs = 0
    idleDetector.resetIdle()
    particlePool.clear()

    // Spawn obstacles for this round
    this.obstacles = []
    const obstacleTypes: ('COIN' | 'PEBBLE' | 'COASTER')[] = ['COIN', 'PEBBLE', 'COASTER']
    for (let i = 0; i < this.currentConfig.obstacleCount; i++) {
      this.obstacles.push({
        id: `obs-${i}`,
        x: this.bounds.margin + Math.random() * (this.bounds.width - this.bounds.margin * 2),
        y: this.bounds.margin + Math.random() * (this.bounds.height - this.bounds.margin * 2),
        radius: 20 + Math.random() * 8,
        type: obstacleTypes[i % obstacleTypes.length],
        rotation: Math.random() * Math.PI * 2,
      })
    }
  }

  private triggerScatter() {
    this.state = 'SCATTERING'
    const originX = this.bounds.width / 2
    const originY = this.bounds.height / 2

    this.asyks = scatterPhysics.createScatterAsyks(
      this.currentConfig.asykCount,
      this.currentConfig.hasKhan,
      originX,
      originY,
      this.bounds.width,
      this.bounds.height,
      this.currentConfig.scatterForceMin,
      this.currentConfig.scatterForceMax
    )

    hantalapayAudio.playScatter()
    particlePool.spawnDustParticles(this.bounds.width, this.bounds.height, 25)
  }

  public handleTap(clientX: number, clientY: number): boolean {
    if (this.state !== 'PLAYING' && this.state !== 'SCATTERING') return false

    // Transition SCATTERING to PLAYING immediately on tap
    if (this.state === 'SCATTERING') {
      this.state = 'PLAYING'
    }

    this.totalTaps++
    idleDetector.resetIdle()

    const now = Date.now()
    if (now - this.lastPickupTimeMs > 1300) {
      this.comboStreak = 0
    }

    // 1. Check Hit on Obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      const obs = this.obstacles[i]
      const dist = Math.hypot(clientX - obs.x, clientY - obs.y)
      if (dist <= obs.radius + 10) {
        hantalapayAudio.playObstacleClick()
        this.comboStreak = 0
        particlePool.spawnScorePopup(obs.x, obs.y, 'ОБЫР! (MISS)', '#EF4444', 0.9)
        return true
      }
    }

    // 2. Check Hit on Asyks (forgiving hitbox padding of 14px for mobile touch)
    let hitIndex = -1
    let minDist = Infinity

    for (let i = 0; i < this.asyks.length; i++) {
      const item = this.asyks[i]
      if (item.isCollected) continue

      const dist = Math.hypot(clientX - item.x, clientY - item.y)
      if (dist <= item.radius + 14 && dist < minDist) {
        minDist = dist
        hitIndex = i
      }
    }

    if (hitIndex !== -1) {
      const item = this.asyks[hitIndex]
      item.isCollected = true
      item.isCollectingAnimation = true
      item.collectProgress = 0
      item.collectStartX = item.x
      item.collectStartY = item.y

      this.collectedCount++
      this.comboStreak++
      this.lastPickupTimeMs = now

      const pts = scoringCalculator.calculateAsykPoints(item, this.comboStreak)
      this.roundScore += pts.totalPoints
      this.score += pts.totalPoints

      if (item.isKhan) {
        this.khanCapturedInRound = true
        hantalapayAudio.playKhanPickup()
        particlePool.spawnSparkles(item.x, item.y, '#D4AF37', 24)
        particlePool.spawnScorePopup(item.x, item.y, '👑 ХАН БОНУС! +500', '#FFF3C4', 1.4)

        // Trigger Khan Highlight Slow-mo
        this.state = 'KHAN_HIGHLIGHT'
        this.isSlowMoActive = true
        this.slowMoTimerMs = 0
      } else {
        hantalapayAudio.playAsykPickup(this.comboStreak)
        particlePool.spawnSparkles(item.x, item.y, item.colorHex, 10)
        const text = this.comboStreak > 2 ? `+${pts.totalPoints} (${this.comboStreak}x!)` : `+${pts.totalPoints}`
        particlePool.spawnScorePopup(item.x, item.y, text, '#FAF5ED', 1.0)
      }

      // Check if all asyks collected
      if (this.collectedCount >= this.asyks.length) {
        this.finishRound()
      }

      return true
    }

    return false
  }

  public step(deltaMs: number) {
    const timeSec = Date.now() / 1000

    // Handle Slow-motion effect on Khan Capture
    let effectiveDt = deltaMs / 1000
    if (this.isSlowMoActive) {
      effectiveDt *= 0.25
      this.slowMoTimerMs += deltaMs
      if (this.slowMoTimerMs >= 1000) {
        this.isSlowMoActive = false
        if (this.state === 'KHAN_HIGHLIGHT') {
          this.state = 'PLAYING'
        }
      }
    }

    // Step 1: Countdown
    if (this.state === 'COUNTDOWN') {
      this.countdownTimerMs += deltaMs
      if (this.countdownTimerMs >= 1000) {
        this.countdownTimerMs = 0
        this.countdownSec--
        if (this.countdownSec > 0) {
          hantalapayAudio.playCountdownTick(false)
        } else if (this.countdownSec === 0) {
          hantalapayAudio.playCountdownTick(true)
          this.triggerScatter()
        }
      }
      return
    }

    // Step 2: Physics step
    if (this.state === 'SCATTERING' || this.state === 'PLAYING') {
      const active = scatterPhysics.stepPhysics(this.asyks, effectiveDt, {
        width: this.bounds.width,
        height: this.bounds.height,
        margin: this.bounds.margin,
      })

      if (this.state === 'SCATTERING' && !active) {
        this.state = 'PLAYING'
      }
    }

    // Step 3: Round Timer
    if (this.state === 'PLAYING') {
      this.roundTimeSpentSec += effectiveDt
      this.roundTimerSec -= effectiveDt
      if (this.roundTimerSec <= 0) {
        this.roundTimerSec = 0
        this.finishRound()
        return
      }

      // Update Idle Detector
      idleDetector.update(effectiveDt, this.asyks)
    }

    // Step 4: Floating Pickup Animation step
    for (let i = 0; i < this.asyks.length; i++) {
      const item = this.asyks[i]
      if (item.isCollectingAnimation) {
        item.collectProgress += effectiveDt * 2.5
        if (item.collectProgress >= 1.0) {
          item.isCollectingAnimation = false
        }
      }
    }

    // Step 5: Particles step
    particlePool.updateAndDraw
  }

  public finishRound() {
    this.state = 'ROUND_RESULT'
    const result = scoringCalculator.calculateRoundResult(
      this.currentConfig,
      this.collectedCount,
      this.asyks.length,
      this.khanCapturedInRound,
      this.roundTimeSpentSec,
      this.comboStreak,
      this.totalTaps,
      this.roundScore
    )

    this.currentRoundResult = result
    this.roundResultsHistory.push(result)
    hantalapayAudio.playRoundWin()
  }

  public finishMatch() {
    this.state = 'MATCH_RESULT'

    let totalScore = 0
    let totalStars = 0
    let totalCollected = 0
    let khansCount = 0

    this.roundResultsHistory.forEach((r) => {
      totalScore += r.score
      totalStars += r.stars
      totalCollected += r.collectedAsyks
      if (r.khanCaptured) khansCount++
    })

    const xpEarned = scoringCalculator.calculateXP(totalScore, totalStars)

    this.finalMatchSummary = {
      totalScore,
      totalStars,
      totalCollected,
      totalKhansCaptured: khansCount,
      roundsCompleted: this.roundResultsHistory.length,
      xpEarned,
      accuracyPct: 90,
    }

    hantalapayAudio.playRoundWin()
  }
}

export const hantalapayEngine = new HantalapayEngine()
