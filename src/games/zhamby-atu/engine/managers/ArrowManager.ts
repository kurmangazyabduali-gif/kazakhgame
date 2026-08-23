import * as Phaser from 'phaser'

export class ArrowManager {
  private scene: Phaser.Scene
  public activeArrows: Phaser.Physics.Arcade.Image[] = []

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  fire(x: number, y: number, velocity: Phaser.Math.Vector2, windX: number) {
    const arrow = this.scene.physics.add.image(x, y, 'arrow')
    arrow.setDepth(5)
    
    // Setup physics body
    arrow.body!.setSize(40, 10)
    arrow.body!.setOffset(10, 0)
    
    // Apply velocity
    arrow.setVelocity(velocity.x, velocity.y)
    
    // Wind is simulated by applying constant acceleration
    arrow.setAccelerationX(windX)

    this.activeArrows.push(arrow)
    return arrow
  }

  update() {
    this.activeArrows.forEach(arrow => {
      if (!arrow.active || !arrow.body) return

      const body = arrow.body as Phaser.Physics.Arcade.Body
      
      // Stop updating rotation if it hit something (velocity is zero)
      if (body.velocity.x === 0 && body.velocity.y === 0) return

      // Rotate to match velocity vector (Air resistance/ aerodynamics)
      arrow.setRotation(Math.atan2(body.velocity.y, body.velocity.x))
      
      // Cleanup arrows that fall off screen deeply
      if (arrow.y > this.scene.scale.height + 500) {
        arrow.destroy()
      }
    })
    
    this.activeArrows = this.activeArrows.filter(a => a.active)
  }
}
