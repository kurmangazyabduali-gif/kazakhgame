import * as Phaser from 'phaser'
import { ZHAMBY_LEVELS } from '../levels/config'
import { JambyTarget } from './entities/JambyTarget'
import { ArrowManager } from './managers/ArrowManager'
import { InputManager } from './managers/InputManager'
import { CameraManager } from './managers/CameraManager'
import { UIManager } from './managers/UIManager'

export class MainScene extends Phaser.Scene {
  private currentLevel = 1
  private config = ZHAMBY_LEVELS[1]

  private bgSteppe!: Phaser.GameObjects.TileSprite

  private stuckArrows: { arrow: Phaser.Physics.Arcade.Image, offsetX: number, offsetY: number, angleOffset: number }[] = []

  private rider!: Phaser.GameObjects.Image
  private target!: JambyTarget
  
  private arrowManager!: ArrowManager
  private inputManager!: InputManager
  private cameraManager!: CameraManager
  private uiManager!: UIManager
  
  private trajectoryGraphics!: Phaser.GameObjects.Graphics
  
  private baseScrollX = 0
  private gameState: 'RIDING' | 'AIMING' | 'FLIGHT' | 'RESULT' = 'RIDING'
  private attemptsUsed = 0

  constructor() {
    super('MainScene')
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    this.config = ZHAMBY_LEVELS[this.currentLevel]

    // 1. Setup Parallax
    this.add.image(w/2, h/2, 'sky').setDisplaySize(w, h).setScrollFactor(0)
    this.add.tileSprite(w/2, h - 250, w, 200, 'mountains').setOrigin(0.5, 1).setScrollFactor(0.2)
    this.add.tileSprite(w/2, h, w, 250, 'steppe').setOrigin(0.5, 1).setScrollFactor(1).setTint(0xffffff)

    // 2. Setup Managers
    this.arrowManager = new ArrowManager(this)
    this.inputManager = new InputManager(this)
    this.cameraManager = new CameraManager(this)
    this.uiManager = new UIManager(this, this.currentLevel)

    // 3. Setup Entities
    this.rider = this.add.image(w * 0.2, h - 100, 'rider').setOrigin(0.5, 1)
    
    // Calculate world width dynamically based on target distance
    const worldWidth = this.config.targetDistance + w
    this.physics.world.setBounds(0, -h, worldWidth, h * 2) // Expand Y bounds for high arcs
    
    this.target = new JambyTarget(this, this.config.targetDistance, h - 200, this.config.targetSize)

    // 4. Input Wiring
    this.trajectoryGraphics = this.add.graphics().setDepth(10)
    
    this.inputManager.onDragStart = () => {
      if (this.gameState !== 'RIDING' && this.gameState !== 'AIMING') return
      this.gameState = 'AIMING'
    }
    
    this.inputManager.onDragMove = (dragVector) => {
      if (this.gameState !== 'AIMING') return
      this.drawTrajectory(dragVector)
    }

    this.inputManager.onDragEnd = (dragVector) => {
      if (this.gameState !== 'AIMING') return
      this.trajectoryGraphics.clear()
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
    
    let hitType = 'MISS'
    let score = 0
    let isPerfect = false

    if (distance < 15) {
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
    this.target.hit(impactVelocity)
    this.uiManager.addScore(score, true)

    // Camera effect
    if (isPerfect) {
      this.cameras.main.shake(300, 0.02)
      this.time.timeScale = 0.1 // Deep slow-mo
    } else {
      this.cameras.main.shake(150, 0.01)
      this.time.timeScale = 0.5 // Slight slow-mo
    }

    // Particles
    const particles = this.add.particles(arrow.x, arrow.y, 'arrow', {
      speed: isPerfect ? 300 : 150,
      scale: { start: isPerfect ? 0.5 : 0.3, end: 0 },
      blendMode: 'ADD',
      lifespan: isPerfect ? 800 : 400,
      tint: isPerfect ? 0xffd700 : 0xffffff
    })
    particles.explode(isPerfect ? 40 : 20)

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
      
      if (this.attemptsUsed >= this.config.attempts) {
        // Level complete
        const stars = 3 // Calculate based on accuracy/score
        this.uiManager.showLevelComplete(stars, () => {
          this.currentLevel++
          this.attemptsUsed = 0
          this.scene.restart()
        })
      } else {
        // Spawn next target visually if needed, but for now we just keep riding to the same target?
        // Wait, if it's the SAME target, we should reset its position further away!
        // The game design says multiple shots per level.
        this.target.x = this.rider.x + this.config.targetDistance
        this.target.pole.x = this.target.x
        this.target.jamby.x = this.target.x
        this.target.jamby.setVelocity(0, 0)
        
        // Remove stuck arrows visually for new target
        this.stuckArrows.forEach(a => a.arrow.destroy())
        this.stuckArrows = []

        this.gameState = 'RIDING'
      }
    })
  }
}
