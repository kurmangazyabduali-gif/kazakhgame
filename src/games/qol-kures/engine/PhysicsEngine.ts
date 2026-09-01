export type ArmPoseState = 
  | 'IDLE' 
  | 'GRIP' 
  | 'PRESS' 
  | 'STRAIN' 
  | 'RECOVER' 
  | 'COUNTER' 
  | 'NEAR_PIN' 
  | 'PIN' 
  | 'VICTORY' 
  | 'DEFEAT'

export interface PhysicsState {
  position: number       // -1.0 (AI pin) to 1.0 (Player pin)
  velocity: number
  playerStamina: number  // 0 to 100
  aiStamina: number      // 0 to 100
  playerFatigue: number  // 0 to 100
  aiFatigue: number      // 0 to 100
  momentum: number       // -100 to 100
  burstWindowProgress: number // 0 to 1
  burstWindowActive: boolean
  comebackActive: boolean
  comebackProgress: number
  isFinished: boolean
  winner: 'player' | 'ai' | null
  pinProgress: number    // 0 to 1.0 (holds for a moment in the pin zone before finishing)
  pinSide: 'player' | 'ai' | null
  poseStatePlayer: ArmPoseState
  poseStateAI: ArmPoseState
}

export class PhysicsEngine {
  private state: PhysicsState
  private difficulty: 'BALDYRGAN' | 'SHAKIRT' | 'SHEBER' | 'MAJSTER'
  
  // Physics parameters
  private inertia = 0.08
  private friction = 0.88
  private baseForce = 4.2
  private burstWindowTimer = 0
  private burstInterval = 2800 // ms between power windows
  private burstDuration = 700  // ms window stays open
  private pinThreshold = 0.95
  private pinHoldDuration = 0.8 // 800ms hold time required for win
  
  constructor(difficulty: 'BALDYRGAN' | 'SHAKIRT' | 'SHEBER' | 'MAJSTER' = 'SHAKIRT') {
    this.difficulty = difficulty
    this.state = this.getInitialState()
  }

  public getInitialState(): PhysicsState {
    return {
      position: 0,
      velocity: 0,
      playerStamina: 100,
      aiStamina: 100,
      playerFatigue: 0,
      aiFatigue: 0,
      momentum: 0,
      burstWindowProgress: 0,
      burstWindowActive: false,
      comebackActive: false,
      comebackProgress: 0,
      isFinished: false,
      winner: null,
      pinProgress: 0,
      pinSide: null,
      poseStatePlayer: 'IDLE',
      poseStateAI: 'IDLE'
    }
  }

  public getState(): PhysicsState {
    return { ...this.state }
  }

  public setState(state: Partial<PhysicsState>): void {
    this.state = { ...this.state, ...state }
  }

  public reset(difficulty?: 'BALDYRGAN' | 'SHAKIRT' | 'SHEBER' | 'MAJSTER'): void {
    if (difficulty) this.difficulty = difficulty
    this.state = this.getInitialState()
    this.burstWindowTimer = 0
  }

  public tick(
    dtMs: number,
    playerPressing: boolean,
    aiPressing: boolean
  ): PhysicsState {
    if (this.state.isFinished) return this.state

    const dt = dtMs / 1000

    // 1. Stamina and Fatigue Drain / Recovery
    // Player
    if (playerPressing) {
      const drainRate = 22 + (this.state.playerFatigue * 0.18)
      this.state.playerStamina = Math.max(0, this.state.playerStamina - drainRate * dt)
      if (this.state.playerStamina === 0) {
        this.state.playerFatigue = Math.min(100, this.state.playerFatigue + 18 * dt)
      } else {
        this.state.playerFatigue = Math.min(100, this.state.playerFatigue + 6 * dt)
      }
    } else {
      const recoverRate = 32 - (this.state.playerFatigue * 0.12)
      this.state.playerStamina = Math.min(100, this.state.playerStamina + recoverRate * dt)
      this.state.playerFatigue = Math.max(0, this.state.playerFatigue - 4 * dt)
    }

    // AI
    if (aiPressing) {
      const drainRate = 22 + (this.state.aiFatigue * 0.18)
      this.state.aiStamina = Math.max(0, this.state.aiStamina - drainRate * dt)
      if (this.state.aiStamina === 0) {
        this.state.aiFatigue = Math.min(100, this.state.aiFatigue + 18 * dt)
      } else {
        this.state.aiFatigue = Math.min(100, this.state.aiFatigue + 6 * dt)
      }
    } else {
      const recoverRate = 32 - (this.state.aiFatigue * 0.12)
      this.state.aiStamina = Math.min(100, this.state.aiStamina + recoverRate * dt)
      this.state.aiFatigue = Math.max(0, this.state.aiFatigue - 4 * dt)
    }

    // 2. Base Force Calculations (factoring in stamina and fatigue)
    const playerStaminaFactor = this.state.playerStamina / 100
    const playerFatigueFactor = (100 - this.state.playerFatigue) / 100
    const playerForceEff = 0.35 + 0.65 * (playerStaminaFactor * playerFatigueFactor)
    const forcePlayer = playerPressing ? this.baseForce * playerForceEff : 0

    const aiStaminaFactor = this.state.aiStamina / 100
    const aiFatigueFactor = (100 - this.state.aiFatigue) / 100
    const aiForceEff = 0.35 + 0.65 * (aiStaminaFactor * aiFatigueFactor)
    
    // AI difficulty multiplier (pure strength factor is balanced; strategy/reaction scale in QolKuresAI.ts)
    let difficultyMult = 1.0
    if (this.difficulty === 'BALDYRGAN') difficultyMult = 0.75
    if (this.difficulty === 'SHAKIRT') difficultyMult = 0.95
    if (this.difficulty === 'SHEBER') difficultyMult = 1.15
    if (this.difficulty === 'MAJSTER') difficultyMult = 1.35

    const forceAI = aiPressing ? this.baseForce * aiForceEff * difficultyMult : 0

    // 3. Momentum calculations
    const rawDiff = forcePlayer - forceAI
    this.state.momentum = Math.max(-100, Math.min(100, this.state.momentum + rawDiff * 10 * dt))
    const momentumEffect = this.state.momentum * 0.018 // max 1.8 extra force

    // 4. Power burst windows
    this.burstWindowTimer += dtMs
    if (!this.state.burstWindowActive) {
      if (this.burstWindowTimer >= this.burstInterval) {
        this.state.burstWindowActive = true
        this.burstWindowTimer = 0
      }
    } else {
      this.state.burstWindowProgress = this.burstWindowTimer / this.burstDuration
      if (this.state.burstWindowProgress >= 1.0) {
        this.state.burstWindowActive = false
        this.state.burstWindowProgress = 0
        this.burstWindowTimer = 0
      }
    }

    // 5. Comeback window (Active when player is close to defeat: position < -0.65)
    if (this.state.position < -0.6) {
      if (!this.state.comebackActive) {
        this.state.comebackActive = true
        this.state.comebackProgress = 0
      } else {
        this.state.comebackProgress = Math.min(1.0, this.state.comebackProgress + dt * 1.6)
        if (this.state.comebackProgress >= 1.0) {
          this.state.comebackActive = false
          this.state.comebackProgress = 0
        }
      }
    } else {
      this.state.comebackActive = false
      this.state.comebackProgress = 0
    }

    // 6. Net Force & Arm Movement
    const netForce = (forcePlayer - forceAI) + (rawDiff > 0 ? momentumEffect : momentumEffect * 0.4)
    const accel = netForce * this.inertia
    this.state.velocity = (this.state.velocity * this.friction) + (accel * dt * 55)
    
    // Clamp movement
    this.state.position = Math.max(-1, Math.min(1, this.state.position + this.state.velocity * dt))

    // 7. PIN ZONE hold logic (Victory / Defeat holding timer)
    if (this.state.position >= this.pinThreshold) {
      // Player is attempting to pin AI
      if (this.state.pinSide !== 'player') {
        this.state.pinSide = 'player'
        this.state.pinProgress = 0
      } else {
        // Holding under pressure
        this.state.pinProgress = Math.min(1.0, this.state.pinProgress + dt / this.pinHoldDuration)
        if (this.state.pinProgress >= 1.0) {
          this.state.isFinished = true
          this.state.winner = 'player'
          this.state.position = 1.0
        }
      }
    } else if (this.state.position <= -this.pinThreshold) {
      // AI is attempting to pin Player
      if (this.state.pinSide !== 'ai') {
        this.state.pinSide = 'ai'
        this.state.pinProgress = 0
      } else {
        this.state.pinProgress = Math.min(1.0, this.state.pinProgress + dt / this.pinHoldDuration)
        if (this.state.pinProgress >= 1.0) {
          this.state.isFinished = true
          this.state.winner = 'ai'
          this.state.position = -1.0
        }
      }
    } else {
      // Pin is broken/neutralized
      this.state.pinSide = null
      this.state.pinProgress = 0
    }

    // 8. Determine Pose States for both Player and AI
    this.updatePoseStates(playerPressing, aiPressing)

    return this.state
  }

  private updatePoseStates(playerPressing: boolean, aiPressing: boolean): void {
    const p = this.state.position

    // Player pose
    if (this.state.isFinished) {
      this.state.poseStatePlayer = this.state.winner === 'player' ? 'VICTORY' : 'DEFEAT'
      this.state.poseStateAI = this.state.winner === 'ai' ? 'VICTORY' : 'DEFEAT'
      return
    }

    if (this.state.pinSide === 'player') {
      this.state.poseStatePlayer = 'PIN'
      this.state.poseStateAI = 'NEAR_PIN'
    } else if (this.state.pinSide === 'ai') {
      this.state.poseStatePlayer = 'NEAR_PIN'
      this.state.poseStateAI = 'PIN'
    } else {
      // Player
      if (p > 0.4) {
        this.state.poseStatePlayer = 'PRESS'
      } else if (p < -0.4) {
        this.state.poseStatePlayer = 'STRAIN'
      } else if (playerPressing) {
        this.state.poseStatePlayer = 'COUNTER'
      } else if (this.state.playerStamina < 30) {
        this.state.poseStatePlayer = 'RECOVER'
      } else {
        this.state.poseStatePlayer = 'IDLE'
      }

      // AI
      if (p < -0.4) {
        this.state.poseStateAI = 'PRESS'
      } else if (p > 0.4) {
        this.state.poseStateAI = 'STRAIN'
      } else if (aiPressing) {
        this.state.poseStateAI = 'COUNTER'
      } else if (this.state.aiStamina < 30) {
        this.state.poseStateAI = 'RECOVER'
      } else {
        this.state.poseStateAI = 'IDLE'
      }
    }
  }

  /**
   * Evaluates and registers a burst tap attempt
   */
  public triggerBurst(): 'PERFECT' | 'GOOD' | 'LATE' | 'EARLY' | 'MISS' {
    if (!this.state.burstWindowActive || this.state.isFinished) {
      return 'MISS'
    }

    const p = this.state.burstWindowProgress
    let quality: 'PERFECT' | 'GOOD' | 'LATE' | 'EARLY' | 'MISS' = 'MISS'
    let forceMultiplier = 0

    if (p >= 0.42 && p <= 0.58) {
      quality = 'PERFECT'
      forceMultiplier = 3.2
    } else if (p >= 0.25 && p < 0.42) {
      quality = 'EARLY'
      forceMultiplier = 1.4
    } else if (p > 0.58 && p <= 0.75) {
      quality = 'LATE'
      forceMultiplier = 1.4
    } else if (p > 0.1 && p <= 0.9) {
      quality = 'GOOD'
      forceMultiplier = 2.0
    }

    if (quality !== 'MISS') {
      this.state.velocity += forceMultiplier * 0.48
      this.state.momentum = Math.min(100, this.state.momentum + 35)
      this.state.playerStamina = Math.max(5, this.state.playerStamina - 6)
      this.state.burstWindowActive = false
      this.state.burstWindowProgress = 0
      this.burstWindowTimer = 0
    }

    return quality
  }

  /**
   * Triggers a comeback recovery push
   */
  public triggerComeback(): boolean {
    if (!this.state.comebackActive || this.state.isFinished) return false

    this.state.velocity += 2.0
    this.state.momentum = Math.min(60, this.state.momentum + 45)
    this.state.playerStamina = Math.min(100, this.state.playerStamina + 30)
    
    this.state.comebackActive = false
    this.state.comebackProgress = 0
    return true
  }
}
