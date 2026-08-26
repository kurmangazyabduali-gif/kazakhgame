import * as Phaser from 'phaser'
import { ZHAMBY_LEVELS, ZHAMBY_LEVEL_COUNT } from '../levels/config'
import { JambyTarget } from './entities/JambyTarget'
import { ArrowManager, TrackedArrow } from './managers/ArrowManager'
import { InputManager } from './managers/InputManager'
import { CameraManager } from './managers/CameraManager'
import { UIManager } from './managers/UIManager'
import { HintManager } from './managers/HintManager'
import { RiderEntity } from './entities/RiderEntity'
import { gameAudio } from '@/lib/services/GameAudioService'

// Best score per level persists across scene restarts (and, via localStorage, across sessions)
// purely for the "ЖАҢА РЕКОРД" / "ЕҢ ЖАҚСЫСЫ" display — it is never sent anywhere and has
// no bearing on server-side score validation.
const BEST_SCORE_KEY = 'zhamby-atu-best-scores'

function loadBestScores(): Record<number, number> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(BEST_SCORE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveBestScore(level: number, score: number) {
  if (typeof window === 'undefined') return
  try {
    const scores = loadBestScores()
    if (!scores[level] || score > scores[level]) {
      scores[level] = score
      window.localStorage.setItem(BEST_SCORE_KEY, JSON.stringify(scores))
    }
  } catch {
    // Storage unavailable (private mode, quota) — best-score display just won't persist.
  }
}

export class MainScene extends Phaser.Scene {
  private currentLevel = 1
  private config = ZHAMBY_LEVELS[1]

  private bgSteppe!: Phaser.GameObjects.TileSprite
  private bgMountains!: Phaser.GameObjects.TileSprite
  private fgGrass!: Phaser.GameObjects.TileSprite

  private stuckArrows: { arrow: Phaser.Physics.Arcade.Image, offsetX: number, offsetY: number, angleOffset: number }[] = []

  private rider!: RiderEntity
  private target!: JambyTarget
  private decoyTarget: JambyTarget | null = null
  private echoTarget: JambyTarget | null = null

  private arrowManager!: ArrowManager
  private inputManager!: InputManager
  private cameraManager!: CameraManager
  private uiManager!: UIManager
  private hintManager!: HintManager

  private trajectoryGraphics!: Phaser.GameObjects.Graphics
  private windFlag!: Phaser.GameObjects.Image
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter

  private baseScrollX = 0
  private gameState: 'RIDING' | 'AIMING' | 'FLIGHT' | 'RESULT' = 'RIDING'
  private attemptsUsed = 0
  private hitsThisLevel = 0
  private hasPlayedDrawSfx = false

  // Ground line and jamby-lift-above-ground, computed once per level from the
  // actual viewport height so the target composition adapts to any aspect ratio
  // instead of clipping off the top on short/wide screens.
  private groundY = 0
  private jambyLift = 0

  constructor() {
    super('MainScene')
  }

  init(data: { level?: number }) {
    // Receive level from scene restart or launch
    if (data?.level) {
      this.currentLevel = Math.min(data.level, ZHAMBY_LEVEL_COUNT)
    }

    // Reset all state for the new level
    this.baseScrollX = 0
    this.gameState = 'RIDING'
    this.attemptsUsed = 0
    this.hitsThisLevel = 0
    this.hasPlayedDrawSfx = false
    this.stuckArrows = []
    this.decoyTarget = null
    this.echoTarget = null
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    this.config = ZHAMBY_LEVELS[this.currentLevel]

    // Single source of truth for "the ground line" — every entity (rider, target,
    // wind flag, dust) is planted relative to this, and the jamby's height above
    // it is clamped to the available headroom so it can never clip the top of
    // the viewport on short/wide screens.
    const groundY = h * 0.86
    // Max safe headroom the jamby could ever occupy without risking clipping the
    // top of the viewport — the per-level heightMultiplier scales a smaller baseline
    // *within* this ceiling, so "different height" levels have room to actually read
    // as higher/lower rather than all clamping to the same safe maximum.
    const maxSafeLift = Math.min(h * 0.5, groundY - h * 0.1)
    const jambyLift = maxSafeLift * 0.66
    this.groundY = groundY
    this.jambyLift = jambyLift

    // 1. Sky
    let skyKey = 'sky_sunset'
    let mountainsKey = 'mountains_sunset'
    let envTint = 0xffffff

    if (this.config.timeOfDay === 'DAY') { skyKey = 'sky_day'; mountainsKey = 'mountains_day'; envTint = 0xffffff }
    else if (this.config.timeOfDay === 'NIGHT') { skyKey = 'sky_night'; mountainsKey = 'mountains_night'; envTint = 0x8899bb }
    else { skyKey = 'sky_sunset'; mountainsKey = 'mountains_sunset'; envTint = 0xffddaa }

    this.add.image(w / 2, h / 2, skyKey).setDisplaySize(w, h).setScrollFactor(0).setDepth(0)

    // Sun / Moon / Stars
    if (this.config.timeOfDay === 'DAY') {
      const sunGlow = this.add.circle(w * 0.78, h * 0.14, 55, 0xffffaa, 0.18).setScrollFactor(0).setDepth(1)
      this.add.circle(w * 0.78, h * 0.14, 35, 0xfff5a0, 0.85).setScrollFactor(0).setDepth(1)
      this.tweens.add({ targets: sunGlow, alpha: { from: 0.12, to: 0.25 }, duration: 2000, yoyo: true, repeat: -1 })
    } else if (this.config.timeOfDay === 'NIGHT') {
      this.add.circle(w * 0.78, h * 0.12, 45, 0xffffee, 0.12).setScrollFactor(0).setDepth(1)
      this.add.circle(w * 0.78, h * 0.12, 30, 0xfffde0, 0.9).setScrollFactor(0).setDepth(1)
      for (let s = 0; s < 55; s++) {
        const sx = (Math.sin(s * 73.4) * 0.5 + 0.5) * w
        const sy = (Math.sin(s * 37.1) * 0.5 + 0.5) * h * 0.4
        const star = this.add.circle(sx, sy, 1 + (s % 2), 0xffffff, 0.5 + (s % 3) * 0.2)
          .setScrollFactor(0).setDepth(1)
        this.tweens.add({ targets: star, alpha: { from: 0.3, to: 1 }, duration: 900 + (s * 137 % 1200), yoyo: true, repeat: -1, delay: s * 60 })
      }
    }

    // Distant birds — drifting silhouettes, day/sunset only (feel out of place at night)
    if (this.config.timeOfDay !== 'NIGHT') {
      for (let b = 0; b < 4; b++) {
        const by = h * (0.1 + (b % 3) * 0.06)
        const bird = this.add.image(w * (0.15 + b * 0.22), by, 'bird')
          .setScrollFactor(0.05).setDepth(1).setAlpha(0.6).setScale(0.8 + (b % 2) * 0.3)
        this.tweens.add({
          targets: bird,
          x: bird.x + 60,
          y: by - 10,
          duration: 4000 + b * 600,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        })
      }
    }

    // Mountains parallax (manually scrolled) — palette is now baked per time-of-day
    // into the SVG itself, so no runtime tint is applied (that used to muddy the colors).
    this.bgMountains = this.add.tileSprite(w / 2, groundY - h * 0.34, w, h * 0.62, mountainsKey)
      .setOrigin(0.5, 1).setScrollFactor(0).setDepth(2)

    // Steppe ground — a single day-lit palette, tinted per time-of-day since
    // (unlike the mountains) it has no separate baked night/sunset artwork.
    this.bgSteppe = this.add.tileSprite(w / 2, h, w, h - groundY + h * 0.42, 'steppe')
      .setOrigin(0.5, 1).setScrollFactor(0).setDepth(3).setTint(envTint)

    // Fast foreground grass strip — sells speed via a higher scroll multiplier
    this.fgGrass = this.add.tileSprite(w / 2, h, w, h * 0.24, 'fg_grass')
      .setOrigin(0.5, 1).setScrollFactor(0).setDepth(9).setAlpha(0.9)

    // Wind direction/strength flag, planted beside the target
    this.windFlag = this.add.image(this.config.targetDistance - 60, groundY - jambyLift - 40, 'wind_flag')
      .setOrigin(0.5, 1).setDepth(6)

    // Weather
    if (this.config.weather === 'SNOW') {
      this.add.particles(0, 0, 'particle', {
        x: { min: -50, max: w + 50 }, y: { min: -10, max: 0 },
        lifespan: 5000,
        speedY: { min: 60, max: 130 },
        speedX: { min: this.config.windSpeed * 0.3, max: this.config.windSpeed * 0.5 },
        scale: { start: 0.25, end: 0.12 }, alpha: { start: 0.85, end: 0.2 },
        tint: 0xe8f4ff, quantity: 1, frequency: 80,
      }).setScrollFactor(0).setDepth(14)
    } else if (this.config.weather === 'RAIN') {
      this.add.particles(0, 0, 'particle', {
        x: { min: -50, max: w + 50 }, y: { min: -10, max: 0 },
        lifespan: 1200,
        speedY: { min: 500, max: 700 },
        speedX: { min: this.config.windSpeed * 0.2, max: this.config.windSpeed * 0.4 },
        scaleX: 0.08, scaleY: 0.6, alpha: { start: 0.65, end: 0.1 },
        tint: 0xaaccee, quantity: 3, frequency: 30,
      }).setScrollFactor(0).setDepth(14)
    }

    // 2. Setup Managers
    this.arrowManager = new ArrowManager(this, groundY)
    this.inputManager = new InputManager(this)
    this.cameraManager = new CameraManager(this)
    this.uiManager = new UIManager(this, this.currentLevel, this.config.attempts)
    this.uiManager.setWindLabel(this.config.windSpeed)
    this.hintManager = new HintManager(this)

    // 3. Setup Entities
    this.rider = new RiderEntity(this, w * 0.24, groundY)

    // Dust kicked up from the horse's hooves — a light, continuous emitter
    // that trails just behind the rider's ground contact point.
    this.dustEmitter = this.add.particles(0, 0, 'dust_particle', {
      speed: { min: 20, max: 60 },
      angle: { min: 200, max: 340 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.45, end: 0 },
      lifespan: 500,
      frequency: 55,
      quantity: 1,
    }).setDepth(6)

    const worldWidth = this.config.targetDistance + w * 2
    this.physics.world.setBounds(0, -h * 2, worldWidth, h * 4)

    // Per-level height challenge, still clamped to the safe on-screen headroom so a
    // "different height" or "difficult angle" level can never reintroduce top-of-viewport
    // clipping — the multiplier changes gameplay, not the composition safety margin.
    const effectiveLift = Phaser.Math.Clamp(jambyLift * this.config.heightMultiplier, h * 0.06, maxSafeLift)

    this.target = new JambyTarget(this, this.config.targetDistance, groundY, this.config.targetSize, 'jamby', effectiveLift, this.config.targetMotion)

    if (this.config.hasDecoy) {
      const decoyOffset = Phaser.Math.Between(0, 1) === 0 ? -140 : 140
      this.decoyTarget = new JambyTarget(this, this.config.targetDistance + decoyOffset, groundY, this.config.targetSize * 0.9, 'decoy', effectiveLift * 1.2)
    }

    if (this.config.hasChainTarget) {
      this.echoTarget = new JambyTarget(this, this.config.targetDistance + 220, groundY, this.config.targetSize * 0.75, 'echo', effectiveLift * 0.85)
    }

    // 4. Input Wiring
    this.trajectoryGraphics = this.add.graphics().setDepth(12)

    this.inputManager.onDragStart = () => {
      if (this.gameState !== 'RIDING' && this.gameState !== 'AIMING') return
      this.gameState = 'AIMING'
      this.hasPlayedDrawSfx = false
      this.hintManager.pause()
    }

    this.inputManager.onDragMove = (dragVector) => {
      if (this.gameState !== 'AIMING') return

      // InputManager reports a released-below-threshold tap as a zero-length
      // "move" rather than a proper onDragEnd — treat it as a cancelled aim so
      // the player returns to RIDING instead of getting stuck unable to draw again.
      if (dragVector.length() === 0 && !this.inputManager.isDragging) {
        this.time.timeScale = 1.0
        this.trajectoryGraphics.clear()
        this.rider.resetPose()
        this.gameState = 'RIDING'
        this.hintManager.resume()
        return
      }

      this.drawTrajectory(dragVector)
      this.rider.setDrawPower(dragVector)
      this.time.timeScale = dragVector.length() > 210 ? 0.28 : 1.0

      // One-shot draw-tension sound the moment the pull crosses the "committed" threshold.
      if (!this.hasPlayedDrawSfx && dragVector.length() > 20) {
        this.hasPlayedDrawSfx = true
        gameAudio.playSfx('bowDraw')
      }
    }

    this.inputManager.onDragEnd = (dragVector) => {
      if (this.gameState !== 'AIMING') return
      this.time.timeScale = 1.0
      this.trajectoryGraphics.clear()
      if (dragVector.length() > 20 && navigator.vibrate) navigator.vibrate(18)
      this.fireArrow(dragVector)
    }

    // Teach PULL -> AIM -> RELEASE without text: if the player sits idle while
    // riding, escalate through highlight -> sample trajectory -> ghost-hand hint.
    this.hintManager.start(() => ({
      jambyX: this.target.jamby.x,
      jambyY: this.target.jamby.y,
      riderX: this.rider.x,
      riderY: this.rider.y,
    }))
    this.events.once('shutdown', () => this.hintManager.destroy())

    // 5. Adapt to viewport changes (rotation, resize, devtools panel, etc.).
    // With Scale.RESIZE the canvas itself already tracks the container, but every
    // piece of this scene's composition (ground line, jamby lift, camera bounds)
    // was computed from the width/height at create() time — so a full relayout
    // needs a scene restart rather than trying to reposition everything live.
    // Debounced so a continuous drag-resize doesn't thrash restarts mid-gesture.
    let resizeTimer: Phaser.Time.TimerEvent | null = null
    const onResize = (gameSize: Phaser.Structs.Size) => {
      if (Math.abs(gameSize.width - w) < 2 && Math.abs(gameSize.height - h) < 2) return
      resizeTimer?.remove()
      resizeTimer = this.time.delayedCall(200, () => {
        if (this.gameState === 'FLIGHT') return // never interrupt a shot mid-flight
        this.scene.restart({ level: this.currentLevel })
      })
    }
    this.scale.on('resize', onResize)
    this.events.once('shutdown', () => {
      this.scale.off('resize', onResize)
      resizeTimer?.remove()
    })
  }

  update(time: number, delta: number) {
    const dt = delta / 1000

    // Automatic horse movement
    if (this.gameState !== 'FLIGHT') {
      this.baseScrollX += this.config.horseSpeed * dt
    }
    
    // Rider stays in same screen relative position when riding
    this.rider.x = this.baseScrollX + this.scale.width * 0.24

    this.cameraManager.updateRiding(this.baseScrollX)

    // Manual parallax scrolling — foreground grass scrolls fastest, sells speed
    if (this.bgMountains) this.bgMountains.tilePositionX = this.baseScrollX * 0.2
    if (this.bgSteppe) this.bgSteppe.tilePositionX = this.baseScrollX * 0.6
    if (this.fgGrass) this.fgGrass.tilePositionX = this.baseScrollX * 1.4

    // Dust puffs from hooves — only while galloping, not mid-flight or aiming
    if (this.dustEmitter) {
      this.dustEmitter.setPosition(this.rider.x - 10, this.rider.y + 4)
      this.dustEmitter.emitting = this.gameState === 'RIDING'
    }

    // Wind flag flutters proportionally to configured wind speed
    if (this.windFlag) {
      const flutter = Math.sin(time * 0.006) * Phaser.Math.Clamp(Math.abs(this.config.windSpeed) / 60, 1, 8)
      this.windFlag.setRotation(Phaser.Math.DegToRad(flutter * (this.config.windSpeed >= 0 ? 1 : -1)))
    }

    // Update Managers & Entities
    this.arrowManager.update()
    this.target.update(time, delta)
    this.decoyTarget?.update(time, delta)
    this.echoTarget?.update(time, delta)

    // Update stuck arrows to move with target
    this.stuckArrows.forEach(st => {
      st.arrow.setPosition(this.target.jamby.x + st.offsetX, this.target.jamby.y + st.offsetY)
      st.arrow.setRotation(this.target.jamby.rotation + st.angleOffset)
    })

    // Check bounds for arrows to reset if miss
    if (this.gameState === 'FLIGHT') {
      const activeArrow = this.arrowManager.activeArrows[0]
      if (activeArrow) {
        if (activeArrow.y > this.scale.height || activeArrow.x > this.target.x + 300) {
          // Miss
          this.handleMiss(activeArrow)
        }
      }
    }
  }

  private drawTrajectory(dragVector: Phaser.Math.Vector2) {
    this.trajectoryGraphics.clear()
    this.trajectoryGraphics.lineStyle(2, 0xffffff, 0.7)

    const bowTip = this.rider.getBowTipPosition()
    const startX = bowTip.x
    const startY = bowTip.y

    const powerMultiplier = 6 // Tune this for Angry Birds feel
    const vX = dragVector.x * powerMultiplier + this.config.horseSpeed
    const vY = dragVector.y * powerMultiplier

    this.trajectoryGraphics.beginPath()
    this.trajectoryGraphics.moveTo(startX, startY)

    let cx = startX
    let cy = startY
    let cvX = vX
    let cvY = vY
    const gravity = this.physics.world.gravity.y
    const wind = this.config.windSpeed

    // Draw first 60 steps (~1 second of flight)
    for (let i = 0; i < 40; i++) {
      cx += cvX * 0.05
      cy += cvY * 0.05
      cvX += wind * 0.05
      cvY += gravity * 0.05
      this.trajectoryGraphics.lineTo(cx, cy)
    }

    this.trajectoryGraphics.strokePath()
  }

  private fireArrow(dragVector: Phaser.Math.Vector2) {
    this.gameState = 'FLIGHT'

    this.rider.playRelease()
    gameAudio.playSfx('bowRelease')

    const powerMultiplier = 6
    const velocity = new Phaser.Math.Vector2(
      dragVector.x * powerMultiplier + this.config.horseSpeed,
      dragVector.y * powerMultiplier
    )

    const bowTip = this.rider.getBowTipPosition()
    const arrow = this.arrowManager.fire(
      bowTip.x,
      bowTip.y,
      velocity,
      this.config.windSpeed
    )

    this.cameraManager.followArrow(arrow)

    // Collision detection — real target, plus decoy/echo when the level has them
    this.physics.add.overlap(arrow, this.target.jamby, () => this.onHitTarget(arrow, this.target), undefined, this)
    if (this.decoyTarget) {
      this.physics.add.overlap(arrow, this.decoyTarget.jamby, () => this.onHitDecoy(arrow), undefined, this)
    }
    if (this.echoTarget) {
      this.physics.add.overlap(arrow, this.echoTarget.jamby, () => this.onHitTarget(arrow, this.echoTarget!, true), undefined, this)
    }
  }

  private onHitDecoy(arrowOb: Phaser.Physics.Arcade.Image) {
    if (this.gameState === 'RESULT') return
    this.gameState = 'RESULT'

    const arrow = arrowOb
    arrow.setVelocity(0, 0)
    arrow.setAcceleration(0, 0)
    ;(arrow.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)

    this.uiManager.addScore(0, false)
    gameAudio.playSfx('miss')

    this.cameras.main.shake(200, 0.015)
    this.cameras.main.flash(150, 180, 30, 20)
    if (navigator.vibrate) navigator.vibrate([30, 40, 30])

    const text = this.add.text(arrow.x, arrow.y - 50, 'ЖАЛҒАН НЫСАНА!\n-0', {
      fontSize: '30px',
      color: '#ff5544',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5).setDepth(20)

    this.tweens.add({
      targets: text,
      y: text.y - 100,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => text.destroy(),
    })

    this.arrowManager.destroyArrow(arrow as TrackedArrow)
    this.resetNextShot()
  }

  private onHitTarget(arrowOb: Phaser.Physics.Arcade.Image, target: JambyTarget, isChain = false) {
    if (this.gameState === 'RESULT') return
    this.gameState = 'RESULT'

    const arrow = arrowOb
    const impactVelocity = arrow.body!.velocity.clone()

    // Stop arrow
    arrow.setVelocity(0, 0)
    arrow.setAcceleration(0, 0)
    ;(arrow.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)

    // Store relative offsets to move with swinging Jamby (only the primary
    // target swings visibly enough to need arrows riding along with it)
    if (target === this.target) {
      this.stuckArrows.push({
        arrow,
        offsetX: arrow.x - target.jamby.x,
        offsetY: arrow.y - target.jamby.y,
        angleOffset: arrow.rotation - target.jamby.rotation,
      })
    }

    // Calculate accuracy (distance from center of Jamby)
    const distance = Phaser.Math.Distance.Between(arrow.x, arrow.y, target.jamby.x, target.jamby.y)
    const dy = arrow.y - target.jamby.y

    let hitType = 'MISS'
    let score = 0
    let isPerfect = false
    let isRopeCut = false

    if (dy < -20 && distance < 45) {
      hitType = 'ROPE CUT!'
      score = 500
      isPerfect = true
      isRopeCut = true
      target.cutRope()
    } else if (distance < 15) {
      hitType = 'PERFECT!'
      score = 250
      isPerfect = true
    } else if (distance < 35) {
      hitType = 'HIT'
      score = 100
    } else {
      hitType = 'GRAZE'
      score = 25
    }

    if (isChain) {
      score += 150
      hitType = `ТІЗБЕК! ${hitType}`
    }

    // Jamby reacts
    if (!isRopeCut) {
      target.hit(impactVelocity)
    }

    gameAudio.playSfx(isRopeCut ? 'ropeCut' : 'arrowImpact')
    this.uiManager.addScore(score, true)
    if (hitType !== 'GRAZE') this.hitsThisLevel++

    // Camera effect & Haptics
    if (isRopeCut) {
      this.cameras.main.shake(400, 0.028)
      this.cameras.main.flash(220, 255, 215, 100)
      this.time.timeScale = 0.08 // Deepest slow-mo — this is the best possible result
      if (navigator.vibrate) navigator.vibrate([60, 40, 60, 40, 90])
    } else if (isPerfect) {
      this.cameras.main.shake(300, 0.02)
      this.time.timeScale = 0.1
      if (navigator.vibrate) navigator.vibrate([50, 50, 50])
    } else {
      this.cameras.main.shake(150, 0.01)
      this.time.timeScale = 0.5
      if (navigator.vibrate) navigator.vibrate(50)
    }

    // Expanding golden ring on any strong hit — reads as impact "energy"
    if (isPerfect) {
      const ring = this.add.circle(arrow.x, arrow.y, 6, 0xffd700, 0)
        .setStrokeStyle(4, 0xffd700, 0.9).setDepth(19)
      this.tweens.add({
        targets: ring,
        radius: isRopeCut ? 130 : 80,
        alpha: { from: 0.9, to: 0 },
        duration: isRopeCut ? 650 : 450,
        ease: 'Cubic.easeOut',
        onComplete: () => ring.destroy(),
      })
    }

    // Particles — confetti burst on the best possible result, sparks otherwise
    if (isRopeCut) {
      const confettiColors = [0xffd700, 0xc1502e, 0x1b8378, 0xffffff]
      confettiColors.forEach((tint, i) => {
        const burst = this.add.particles(arrow.x, arrow.y, 'particle', {
          speed: { min: 180, max: 380 },
          angle: { min: 0, max: 360 },
          scale: { start: 0.6, end: 0 },
          gravityY: 400,
          lifespan: 1200,
          tint,
          quantity: 10,
        })
        this.time.delayedCall(i * 40, () => burst.explode(10))
        this.time.delayedCall(1300, () => burst.destroy())
      })
    } else {
      const particles = this.add.particles(arrow.x, arrow.y, 'particle', {
        speed: isPerfect ? 320 : 160,
        scale: { start: isPerfect ? 0.8 : 0.5, end: 0 },
        blendMode: 'ADD',
        lifespan: isPerfect ? 900 : 500,
        tint: isPerfect ? 0xffd700 : 0xffaa44,
      })
      particles.explode(isPerfect ? 50 : 25)
    }

    // Score Popup
    const text = this.add.text(arrow.x, arrow.y - 50, `${hitType}\n+${score}`, {
      fontSize: isPerfect ? '48px' : '32px',
      color: isPerfect ? '#ffd700' : '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(20)

    this.tweens.add({
      targets: text,
      y: text.y - 100,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => text.destroy()
    })
    
    this.time.delayedCall(isPerfect ? 300 : 150, () => {
      this.time.timeScale = 1.0
      this.resetNextShot()
    })
  }

  private handleMiss(arrow: Phaser.Physics.Arcade.Image) {
    if (this.gameState === 'RESULT') return
    this.gameState = 'RESULT'
    gameAudio.playSfx('miss')

    const text = this.add.text(arrow.x, arrow.y - 50, 'ӨТКІЗІП ЖІБЕРДІ', {
      fontSize: '30px',
      color: '#ff4444',
      fontStyle: 'bold',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setDepth(20)

    this.tweens.add({
      targets: text,
      y: text.y - 100,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => text.destroy()
    })

    this.uiManager.addScore(0, false)
    this.arrowManager.destroyArrow(arrow as TrackedArrow)
    this.resetNextShot()
  }

  private resetNextShot() {
    this.uiManager.markAttemptUsed(this.attemptsUsed)
    this.attemptsUsed++

    this.time.delayedCall(1000, () => {
      this.cameraManager.returnToRider()

      // Level complete when all attempts used
      if (this.attemptsUsed >= this.config.attempts) {
        // 3 stars = hit every attempt, 2 = at least half, 1 = at least one hit, 0 = none at all
        const stars = this.hitsThisLevel >= this.config.attempts
          ? 3
          : this.hitsThisLevel >= Math.ceil(this.config.attempts / 2)
            ? 2
            : this.hitsThisLevel > 0 ? 1 : 0

        const finalScore = this.uiManager.currentScore
        const bestScores = loadBestScores()
        const previousBest = bestScores[this.currentLevel] ?? 0
        saveBestScore(this.currentLevel, finalScore)

        this.uiManager.showLevelComplete(stars, previousBest, () => {
          const nextLevel = this.currentLevel + 1
          if (nextLevel > ZHAMBY_LEVEL_COUNT) {
            // Game complete - restart from level 1
            this.scene.restart({ level: 1 })
          } else {
            this.scene.restart({ level: nextLevel })
          }
        })
        return
      }

      // Move target ahead for next shot (same level, next attempt)
      this.target.x = this.rider.x + this.config.targetDistance
      this.target.pole.x = this.target.x
      this.target.jamby.x = this.target.x
      this.target.jamby.y = this.target.y - this.target.liftY
      this.target.isCut = false
      ;(this.target.jamby.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
      this.target.jamby.setVelocity(0, 0)

      // Move decoy/echo targets alongside the real one, if present
      if (this.decoyTarget) {
        this.decoyTarget.x = this.target.x + (Phaser.Math.Between(0, 1) === 0 ? -140 : 140)
        this.decoyTarget.pole.x = this.decoyTarget.x
        this.decoyTarget.jamby.x = this.decoyTarget.x
        this.decoyTarget.jamby.y = this.decoyTarget.y - this.decoyTarget.liftY
        this.decoyTarget.jamby.setVelocity(0, 0)
      }
      if (this.echoTarget) {
        this.echoTarget.x = this.target.x + 220
        this.echoTarget.pole.x = this.echoTarget.x
        this.echoTarget.jamby.x = this.echoTarget.x
        this.echoTarget.jamby.y = this.echoTarget.y - this.echoTarget.liftY
        this.echoTarget.jamby.setVelocity(0, 0)
      }

      // Move the wind flag to stand by the new target position
      if (this.windFlag) this.windFlag.x = this.target.x - 60

      // Expand physics world dynamically so we don't hit an invisible wall!
      const w = this.scale.width
      const h = this.scale.height
      this.physics.world.setBounds(0, -h * 2, this.target.x + w * 2, h * 4)

      // Clear stuck arrows
      this.stuckArrows.forEach(a => a.arrow.destroy())
      this.stuckArrows = []

      this.gameState = 'RIDING'
      this.hintManager.resume()
    })
  }
}
