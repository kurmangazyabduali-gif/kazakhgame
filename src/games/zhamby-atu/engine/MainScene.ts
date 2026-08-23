import * as Phaser from 'phaser'

export class MainScene extends Phaser.Scene {
  private horseSpeed = 200
  private distanceToTarget = 2000
  
  private rider!: Phaser.GameObjects.Image
  private target!: Phaser.Physics.Arcade.Image
  private arrows: Phaser.Physics.Arcade.Image[] = []
  
  private isDragging = false
  private dragStart = new Phaser.Math.Vector2()
  private trajectoryGraphics!: Phaser.GameObjects.Graphics
  
  // Parallax layers
  private bgSky!: Phaser.GameObjects.Image
  private bgMountains!: Phaser.GameObjects.TileSprite
  private bgSteppe!: Phaser.GameObjects.TileSprite

  constructor() {
    super('MainScene')
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height

    // 1. Setup Parallax Background
    this.bgSky = this.add.image(w/2, h/2, 'sky').setDisplaySize(w, h).setScrollFactor(0)
    
    this.bgMountains = this.add.tileSprite(w/2, h - 250, w, 200, 'mountains')
      .setOrigin(0.5, 1)
      .setScrollFactor(0.2) // Moves slower than camera

    this.bgSteppe = this.add.tileSprite(w/2, h, w, 250, 'steppe')
      .setOrigin(0.5, 1)
      .setScrollFactor(1) // Moves with camera
      .setTint(0xffffff)

    // 2. Setup World Bounds
    const worldWidth = this.distanceToTarget + w
    this.physics.world.setBounds(0, 0, worldWidth, h)

    // 3. Setup Target
    this.target = this.physics.add.image(this.distanceToTarget, h - 200, 'target')
    this.target.setOrigin(0.5, 1) // Origin at bottom of pole
    this.target.setImmovable(true)
    ;(this.target.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)

    // 4. Setup Rider
    this.rider = this.add.image(w * 0.2, h - 100, 'rider').setOrigin(0.5, 1)

    // 5. Setup Camera
    this.cameras.main.setBounds(0, 0, worldWidth, h)
    // We don't follow the rider exactly, we just move the camera right automatically

    // 6. Setup Controls
    this.input.on('pointerdown', this.onPointerDown, this)
    this.input.on('pointermove', this.onPointerMove, this)
    this.input.on('pointerup', this.onPointerUp, this)

    this.trajectoryGraphics = this.add.graphics()
    this.trajectoryGraphics.setDepth(10)
  }

  update(time: number, delta: number) {
    const dt = delta / 1000

    // Automatic scrolling
    this.cameras.main.scrollX += this.horseSpeed * dt
    this.rider.x = this.cameras.main.scrollX + this.scale.width * 0.2

    // Parallax updating (TileSprites need manual tilePositionX update if scrollFactor is used, 
    // but Phaser 3 handles it automatically if setScrollFactor is used correctly. 
    // We'll just rely on setScrollFactor for now.)

    // Arrow Physics Update (Rotation based on velocity)
    this.arrows.forEach(arrow => {
      if (arrow.active && arrow.body) {
        const v = arrow.body.velocity
        if (v.x !== 0 || v.y !== 0) {
          arrow.setRotation(Math.atan2(v.y, v.x))
        }
      }
    })
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    this.isDragging = true
    this.dragStart.set(pointer.x, pointer.y)
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.isDragging) return
    
    const dragEnd = new Phaser.Math.Vector2(pointer.x, pointer.y)
    const dragVector = this.dragStart.clone().subtract(dragEnd)
    
    this.drawTrajectory(dragVector)
  }

  private onPointerUp(pointer: Phaser.Input.Pointer) {
    if (!this.isDragging) return
    this.isDragging = false
    this.trajectoryGraphics.clear()

    const dragEnd = new Phaser.Math.Vector2(pointer.x, pointer.y)
    const dragVector = this.dragStart.clone().subtract(dragEnd)
    
    // Minimum drag threshold
    if (dragVector.length() < 20) return

    this.fireArrow(dragVector)
  }

  private drawTrajectory(dragVector: Phaser.Math.Vector2) {
    this.trajectoryGraphics.clear()
    this.trajectoryGraphics.lineStyle(2, 0xffffff, 0.5)

    const startX = this.rider.x
    const startY = this.rider.y - 60 // Roughly bow height

    const powerMultiplier = 5 // Tune this
    const vX = dragVector.x * powerMultiplier + this.horseSpeed // Add horse momentum
    const vY = dragVector.y * powerMultiplier

    this.trajectoryGraphics.beginPath()
    this.trajectoryGraphics.moveTo(startX, startY)

    // Simulate 60 frames of flight
    let cx = startX
    let cy = startY
    let cvX = vX
    let cvY = vY
    const gravity = this.physics.world.gravity.y

    for (let i = 0; i < 30; i++) {
      cx += cvX * 0.05
      cy += cvY * 0.05
      cvY += gravity * 0.05
      this.trajectoryGraphics.lineTo(cx, cy)
    }

    this.trajectoryGraphics.strokePath()
  }

  private fireArrow(dragVector: Phaser.Math.Vector2) {
    const startX = this.rider.x
    const startY = this.rider.y - 60

    const arrow = this.physics.add.image(startX, startY, 'arrow')
    this.arrows.push(arrow)

    const powerMultiplier = 5
    const vX = dragVector.x * powerMultiplier + this.horseSpeed
    const vY = dragVector.y * powerMultiplier

    arrow.setVelocity(vX, vY)
    arrow.setGravityY(this.physics.world.gravity.y)
    
    // Setup collision with target
    this.physics.add.overlap(arrow, this.target, this.onHitTarget, undefined, this)
  }

  private onHitTarget(arrowOb: any, targetOb: any) {
    const arrow = arrowOb as Phaser.Physics.Arcade.Image
    
    // Stop arrow
    arrow.setVelocity(0, 0)
    ;(arrow.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
    arrow.active = false

    // Particle effect
    const particles = this.add.particles(arrow.x, arrow.y, 'arrow', {
      speed: 100,
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      lifespan: 300
    })
    particles.explode(10)

    console.log("HIT!")
  }
}
