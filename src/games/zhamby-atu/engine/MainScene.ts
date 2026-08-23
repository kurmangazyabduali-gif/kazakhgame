import * as Phaser from 'phaser'
import { ZHAMBY_LEVELS } from '../levels/config'
import { JambyTarget } from './entities/JambyTarget'
import { ArrowManager } from './managers/ArrowManager'
import { InputManager } from './managers/InputManager'
import { CameraManager } from './managers/CameraManager'
import { UIManager } from './managers/UIManager'
import { RiderEntity } from './entities/RiderEntity'

export class MainScene extends Phaser.Scene {
  private currentLevel = 1
  private config = ZHAMBY_LEVELS[1]

  private bgSteppe!: Phaser.GameObjects.TileSprite
  private bgMountains!: Phaser.GameObjects.TileSprite

  private stuckArrows: { arrow: Phaser.Physics.Arcade.Image, offsetX: number, offsetY: number, angleOffset: number }[] = []

  private rider!: RiderEntity
  private target!: JambyTarget

  private arrowManager!: ArrowManager
  private inputManager!: InputManager
  private cameraManager!: CameraManager
  private uiManager!: UIManager

  private trajectoryGraphics!: Phaser.GameObjects.Graphics

  private baseScrollX = 0
  private gameState: 'RIDING' | 'AIMING' | 'FLIGHT' | 'RESULT' = 'RIDING'
  private attemptsUsed = 0
  private hitsThisLevel = 0

  constructor() {
    super('MainScene')
  }

  init(data: { level?: number }) {
    // Receive level from scene restart or launch
    if (data?.level) {
      this.currentLevel = Math.min(data.level, 15)
    }
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    this.config = ZHAMBY_LEVELS[this.currentLevel]

    // 1. Sky
    let skyKey = 'sky_sunset'
    let envTint = 0xffffff

    if (this.config.timeOfDay === 'DAY') { skyKey = 'sky_day'; envTint = 0xffffff }
    else if (this.config.timeOfDay === 'NIGHT') { skyKey = 'sky_night'; envTint = 0x8899bb }
    else { skyKey = 'sky_sunset'; envTint = 0xffddaa }

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

    // Mountains parallax (manually scrolled)
    this.bgMountains = this.add.tileSprite(w / 2, h - 140, w, 420, 'mountains')
      .setOrigin(0.5, 1).setScrollFactor(0).setDepth(2).setTint(envTint)

    // Steppe ground
    this.bgSteppe = this.add.tileSprite(w / 2, h, w, 340, 'steppe')
      .setOrigin(0.5, 1).setScrollFactor(0).setDepth(3).setTint(envTint)

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
    this.arrowManager = new ArrowManager(this)
    this.inputManager = new InputManager(this)
    this.cameraManager = new CameraManager(this)
    this.uiManager = new UIManager(this, this.currentLevel)

    // 3. Setup Entities
    this.rider = new RiderEntity(this, w * 0.22, h - 120)

    const worldWidth = this.config.targetDistance + w * 2
    this.physics.world.setBounds(0, -h * 2, worldWidth, h * 4)

    this.target = new JambyTarget(this, this.config.targetDistance, h - 120, this.config.targetSize)

    // 4. Input Wiring
    this.trajectoryGraphics = this.add.graphics().setDepth(12)

    this.inputManager.onDragStart = () => {
      if (this.gameState !== 'RIDING' && this.gameState !== 'AIMING') return
      this.gameState = 'AIMING'
    }

    this.inputManager.onDragMove = (dragVector) => {
      if (this.gameState !== 'AIMING') return
      this.drawTrajectory(dragVector)
      this.rider.setDrawPower(dragVector)
      this.time.timeScale = dragVector.length() > 210 ? 0.28 : 1.0
    }

    this.inputManager.onDragEnd = (dragVector) => {
      if (this.gameState !== 'AIMING') return
      this.time.timeScale = 1.0
      this.trajectoryGraphics.clear()
      this.rider.resetPose()
      if (dragVector.length() > 20 && navigator.vibrate) navigator.vibrate(18)
      this.fireArrow(dragVector)
    }
  }

  update(time: number, delta: number) {
    const dt = delta / 1000

    // Automatic horse movement
    if (this.gameState !== 'FLIGHT') {
      this.baseScrollX += this.config.horseSpeed * dt
    }
    
    // Rider stays in same screen relative position when riding
    this.rider.x = this.baseScrollX + this.scale.width * 0.2
    
    this.cameraManager.updateRiding(this.baseScrollX)

    // Manual parallax scrolling
    if (this.bgMountains) this.bgMountains.tilePositionX = this.baseScrollX * 0.2
    if (this.bgSteppe) this.bgSteppe.tilePositionX = this.baseScrollX * 0.6

    // Update Managers & Entities
    this.arrowManager.update()
    this.target.update(time, delta)

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

    const startX = this.rider.x
    const startY = this.rider.y - 60

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
    
    const powerMultiplier = 6
    const velocity = new Phaser.Math.Vector2(
      dragVector.x * powerMultiplier + this.config.horseSpeed,
      dragVector.y * powerMultiplier
    )
    
    const arrow = this.arrowManager.fire(
      this.rider.x, 
      this.rider.y - 60, 
      velocity, 
      this.config.windSpeed
    )

    this.cameraManager.followArrow(arrow)

    // Collision detection
    this.physics.add.overlap(arrow, this.target.jamby, this.onHitTarget, undefined, this)
  }

  private onHitTarget(arrowOb: any, targetOb: any) {
    if (this.gameState === 'RESULT') return
    this.gameState = 'RESULT'

    const arrow = arrowOb as Phaser.Physics.Arcade.Image
    const impactVelocity = arrow.body!.velocity.clone()
    
    // Stop arrow
    arrow.setVelocity(0, 0)
    arrow.setAcceleration(0, 0)
    ;(arrow.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
    
    // Store relative offsets to move with swinging Jamby
    this.stuckArrows.push({
      arrow,
      offsetX: arrow.x - this.target.jamby.x,
      offsetY: arrow.y - this.target.jamby.y,
      angleOffset: arrow.rotation - this.target.jamby.rotation
    })
    
    // Calculate accuracy (distance from center of Jamby)
    const distance = Phaser.Math.Distance.Between(arrow.x, arrow.y, this.target.jamby.x, this.target.jamby.y)
    const dy = arrow.y - this.target.jamby.y
    
    let hitType = 'MISS'
    let score = 0
    let isPerfect = false
    let isRopeCut = false

    if (dy < -20 && distance < 45) {
      hitType = 'ROPE CUT!'
      score = 500
      isPerfect = true
      isRopeCut = true
      this.target.cutRope()
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

    // Jamby reacts
    if (!isRopeCut) {
      this.target.hit(impactVelocity)
    }
    
    this.uiManager.addScore(score, true)
    if (hitType !== 'GRAZE') this.hitsThisLevel++

    // Camera effect & Haptics
    if (isPerfect) {
      this.cameras.main.shake(300, 0.02)
      this.time.timeScale = 0.1 // Deep slow-mo
      if (navigator.vibrate) navigator.vibrate([50, 50, 50])
    } else {
      this.cameras.main.shake(150, 0.01)
      this.time.timeScale = 0.5 // Slight slow-mo
      if (navigator.vibrate) navigator.vibrate(50)
    }

    // Particles
    const particles = this.add.particles(arrow.x, arrow.y, 'particle', {
      speed: isPerfect ? 320 : 160,
      scale: { start: isPerfect ? 0.8 : 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: isPerfect ? 900 : 500,
      tint: isPerfect ? 0xffd700 : 0xffaa44
    })
    particles.explode(isPerfect ? 50 : 25)

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
    
    const text = this.add.text(arrow.x, arrow.y - 50, `MISS`, {
      fontSize: '32px',
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
    arrow.destroy()
    this.resetNextShot()
  }

  private resetNextShot() {
    this.attemptsUsed++

    this.time.delayedCall(1000, () => {
      this.cameraManager.returnToRider()

      // Level complete when all attempts used
      if (this.attemptsUsed >= this.config.attempts) {
        const stars = this.hitsThisLevel >= this.config.attempts
          ? 3
          : this.hitsThisLevel >= Math.ceil(this.config.attempts / 2)
            ? 2
            : this.hitsThisLevel > 0 ? 1 : 1

        this.uiManager.showLevelComplete(stars, () => {
          const nextLevel = this.currentLevel + 1
          if (nextLevel > 15) {
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
      this.target.jamby.y = this.target.y - 160
      this.target.isCut = false
      ;(this.target.jamby.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
      this.target.jamby.setVelocity(0, 0)

      // Clear stuck arrows
      this.stuckArrows.forEach(a => a.arrow.destroy())
      this.stuckArrows = []

      this.gameState = 'RIDING'
    })
  }
}
