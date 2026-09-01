import { PhysicsState } from '../engine/PhysicsEngine'

export class QolKuresAI {
  private difficulty: 'BALDYRGAN' | 'SHAKIRT' | 'SHEBER' | 'MAJSTER'
  private decisionTimer = 0
  private decisionInterval = 120 // ms between AI action decisions
  private isPressing = false

  // Burst timers
  private targetBurstTime = 0
  private wantsBurst = false

  constructor(difficulty: 'BALDYRGAN' | 'SHAKIRT' | 'SHEBER' | 'MAJSTER' = 'SHAKIRT') {
    this.difficulty = difficulty
  }

  public reset(difficulty?: 'BALDYRGAN' | 'SHAKIRT' | 'SHEBER' | 'MAJSTER'): void {
    if (difficulty) this.difficulty = difficulty
    this.decisionTimer = 0
    this.isPressing = false
    this.wantsBurst = false
  }

  /**
   * Updates AI logic and returns whether AI is pressing
   */
  public update(dtMs: number, state: PhysicsState): { isPressing: boolean; triggerBurst: boolean } {
    this.decisionTimer += dtMs
    let triggerBurst = false

    // 1. Periodic Decision Making for Continuous Pressure
    if (this.decisionTimer >= this.decisionInterval) {
      this.decisionTimer = 0
      this.isPressing = this.decidePressure(state)
    }

    // 2. Timing burst execution logic
    if (state.burstWindowActive) {
      if (!this.wantsBurst) {
        // Decide whether to attempt a burst this cycle based on difficulty
        let burstChance = 0.15
        if (this.difficulty === 'SHAKIRT') burstChance = 0.45
        if (this.difficulty === 'SHEBER') burstChance = 0.8
        if (this.difficulty === 'MAJSTER') burstChance = 0.95

        if (Math.random() < burstChance) {
          this.wantsBurst = true
          // Set target timing inside progress (perfect center is 0.5)
          let offset = 0.25
          if (this.difficulty === 'SHAKIRT') offset = 0.12
          if (this.difficulty === 'SHEBER') offset = 0.04
          if (this.difficulty === 'MAJSTER') offset = 0.01 // near instant perfect hit!
          
          this.targetBurstTime = 0.5 + (Math.random() * 2 - 1) * offset
        } else {
          this.wantsBurst = false
        }
      } else {
        // Track progress to execute burst
        if (state.burstWindowProgress >= this.targetBurstTime) {
          triggerBurst = true
          this.wantsBurst = false
        }
      }
    } else {
      this.wantsBurst = false
    }

    return {
      isPressing: this.isPressing,
      triggerBurst
    }
  }

  private decidePressure(state: PhysicsState): boolean {
    const { position, playerStamina, aiStamina } = state

    // Critical stamina threshold
    if (aiStamina < 5) return false

    // Baldyrgan (Beginner AI)
    if (this.difficulty === 'BALDYRGAN') {
      if (aiStamina < 30 && Math.random() < 0.6) return false
      return Math.random() < 0.55
    }

    // Shakirt (Intermediate AI)
    if (this.difficulty === 'SHAKIRT') {
      if (aiStamina < 20) return false
      if (position > 0.3) return Math.random() < 0.8 // defend harder
      return Math.random() < 0.65
    }

    // Sheber (Expert AI)
    if (this.difficulty === 'SHEBER') {
      if (aiStamina < 15) return false
      
      // Counter player's fatigue
      if (playerStamina < 30) return true // push hard if player is tired!

      // Defend aggressively
      if (position > 0.4) return true

      // Dynamic rest
      if (aiStamina < playerStamina && position < -0.1) {
        return Math.random() < 0.35 // rest while safe
      }

      return Math.random() < 0.75
    }

    // Majster (Master AI)
    // Intelligent stamina management, predicts player's fatigue, performs counters
    if (aiStamina < 12) return false // rest only when critical

    // If player is almost pinning AI, exert maximum emergency counter-force
    if (position > 0.7) {
      return true
    }

    // Exploit player's fatigue aggressively
    if (playerStamina < 40) {
      return Math.random() < 0.95
    }

    // If safe, conserve energy to maintain high force efficiency
    if (aiStamina < playerStamina - 15 && position < -0.3) {
      return Math.random() < 0.25
    }

    return Math.random() < 0.85
  }
}
