import * as Phaser from 'phaser'

export interface TrackedArrow extends Phaser.Physics.Arcade.Image {
  trail?: Phaser.GameObjects.Particles.ParticleEmitter
  shadow?: Phaser.GameObjects.Image
}

export class ArrowManager {
  private scene: Phaser.Scene
  public activeArrows: TrackedArrow[] = []
  private groundY: number

  constructor(scene: Phaser.Scene, groundY: number) {
    this.scene = scene
    this.groundY = groundY
  }

  fire(x: number, y: number, velocity: Phaser.Math.Vector2, windX: number) {
    const arrow = this.scene.physics.add.image(x, y, 'arrow') as TrackedArrow
    arrow.setDepth(5)

    arrow.body!.setSize(40, 10)
    arrow.body!.setOffset(10, 0)

    arrow.setVelocity(velocity.x, velocity.y)
    arrow.setAccelerationX(windX)

    // Arrow trail (juice)
    const trail = this.scene.add.particles(0, 0, 'particle', {
      scale: { start: 0.18, end: 0 },
      alpha: { start: 0.6, end: 0 },
      tint: 0xffc060,
      lifespan: 250,
      blendMode: 'ADD',
    })
    trail.startFollow(arrow)
    arrow.trail = trail

    // Ground shadow — tracks the arrow's x position at a fixed ground y,
    // scaling up as the arrow gets closer to the ground for a sense of height.
    const shadow = this.scene.add.image(x, this.groundY, 'shadow_blob').setDepth(4).setAlpha(0.5)
    arrow.shadow = shadow

    this.activeArrows.push(arrow)
    return arrow
  }

  update() {
    this.activeArrows.forEach((arrow) => {
      if (!arrow.active || !arrow.body) return

      const body = arrow.body as Phaser.Physics.Arcade.Body

      if (arrow.shadow) {
        const heightAboveGround = Math.max(0, this.groundY - arrow.y)
        const shrink = Phaser.Math.Clamp(1 - heightAboveGround / 900, 0.25, 1)
        arrow.shadow.setPosition(arrow.x, this.groundY)
        arrow.shadow.setScale(shrink)
        arrow.shadow.setAlpha(0.5 * shrink)
      }

      if (body.velocity.x === 0 && body.velocity.y === 0) {
        arrow.trail?.stop()
        return
      }

      arrow.setRotation(Math.atan2(body.velocity.y, body.velocity.x))

      if (arrow.y > this.scene.scale.height + 500) {
        this.destroyArrow(arrow)
      }
    })

    this.activeArrows = this.activeArrows.filter((a) => a.active)
  }

  destroyArrow(arrow: TrackedArrow) {
    arrow.shadow?.destroy()
    arrow.trail?.destroy()
    arrow.destroy()
  }
}
