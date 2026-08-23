import * as Phaser from 'phaser'

export class JambyTarget {
  public pole: Phaser.GameObjects.Image
  public rope!: Phaser.GameObjects.Graphics
  public jamby: Phaser.Physics.Arcade.Image
  
  public x: number
  public y: number
  private initialY: number
  public isCut = false

  constructor(scene: Phaser.Scene, x: number, y: number, scale: number) {
    this.x = x
    this.y = y
    this.initialY = y

    // The pole
    this.pole = scene.add.image(x, y, 'target')
    this.pole.setOrigin(0.5, 1) // Origin at bottom
    
    // The jamby (the gold disc to hit)
    // We attach it physically to the top of the pole
    this.jamby = scene.physics.add.image(x, y - 160, 'target')
    this.jamby.setOrigin(0.5, 0.5)
    this.jamby.setScale(scale)
    
    // We only care about the jamby for collision, so we crop its hitbox
    this.jamby.body!.setSize(60, 60)
    this.jamby.body!.setOffset(20, 20)
    ;(this.jamby.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
    this.jamby.setImmovable(false) // Allow it to be pushed
    this.jamby.setMass(10)
    this.jamby.setDrag(100) // Air resistance so it stops swinging
  }

  // To simulate swinging, we apply a spring constraint using Arcade physics velocity
  update(time: number, delta: number) {
    if (!this.jamby.body || this.isCut) return
    const body = this.jamby.body as Phaser.Physics.Arcade.Body
    
    // Spring physics back to center
    const anchorX = this.x
    const anchorY = this.y - 160

    const dx = anchorX - this.jamby.x
    const dy = anchorY - this.jamby.y

    const springK = 5.0
    const damping = 0.9

    body.velocity.x += dx * springK * (delta / 1000)
    body.velocity.y += dy * springK * (delta / 1000)
    
    body.velocity.x *= damping
    body.velocity.y *= damping
  }

  hit(arrowVelocity: Phaser.Math.Vector2) {
    if (this.isCut) return
    // Transfer momentum to the jamby
    const force = arrowVelocity.clone().normalize().scale(500)
    if (this.jamby.body) {
      this.jamby.setVelocity(force.x, force.y)
    }
  }

  cutRope() {
    this.isCut = true
    ;(this.jamby.body as Phaser.Physics.Arcade.Body).setAllowGravity(true)
    this.jamby.setDrag(0)
  }
}
