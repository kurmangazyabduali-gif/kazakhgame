import * as Phaser from 'phaser'
import { TargetMotion } from '../../levels/config'

export type TargetKind = 'jamby' | 'decoy' | 'echo'

export class JambyTarget {
  public pole: Phaser.GameObjects.Image
  public jamby: Phaser.Physics.Arcade.Image
  public kind: TargetKind

  public x: number
  public y: number
  public isCut = false

  /** Height the disc hangs above the pole's planted ground point — configurable per-scene
   *  so the composition can adapt the jamby's height to the actual viewport instead of
   *  risking it clipping the top of the screen on short/wide aspect ratios. */
  public liftY: number

  /** How the jamby's rest anchor moves over time — the spring constraint below chases
   *  this anchor, so motion reads as a natural swing/bob rather than a teleport. */
  public motion: TargetMotion
  private motionPhase = 0

  constructor(scene: Phaser.Scene, x: number, y: number, scale: number, kind: TargetKind = 'jamby', liftY = 160, motion: TargetMotion = 'NONE') {
    this.x = x
    this.y = y
    this.kind = kind
    this.liftY = liftY
    this.motion = motion
    // Randomize starting phase so multiple moving targets don't move in lockstep.
    this.motionPhase = Math.random() * Math.PI * 2

    const discKey = kind === 'decoy' ? 'target_disc_decoy' : 'target_disc'

    // The pole (skipped for echo targets — they're a second disc riding the same pole's silhouette)
    this.pole = scene.add.image(x, y, 'target_pole')
    this.pole.setOrigin(0.5, 1)
    this.pole.setDepth(7)
    if (kind === 'echo') this.pole.setVisible(false)

    // The jamby (the disc to hit)
    this.jamby = scene.physics.add.image(x, y - liftY, discKey)
    this.jamby.setOrigin(0.5, 0.5)
    this.jamby.setScale(scale)
    this.jamby.setDepth(7)

    this.jamby.body!.setSize(76, 76)
    this.jamby.body!.setOffset(12, 12)
    ;(this.jamby.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
    this.jamby.setImmovable(false)
    this.jamby.setMass(10)
    this.jamby.setDrag(100)
  }

  // Simulate swinging via a spring constraint applied through Arcade physics velocity.
  // The constraint's anchor point itself can move (SWAY / MOVE_Y) so the jamby drifts
  // through a real path instead of sitting dead-still until struck.
  update(_time: number, delta: number) {
    if (!this.jamby.body || this.isCut) return
    const body = this.jamby.body as Phaser.Physics.Arcade.Body

    this.motionPhase += (delta / 1000) * 1.6

    let anchorX = this.x
    const anchorY = this.y - this.liftY

    if (this.motion === 'SWAY') {
      anchorX += Math.sin(this.motionPhase) * 70
    }

    const anchorYFinal = this.motion === 'MOVE_Y'
      ? anchorY + Math.sin(this.motionPhase) * 60
      : anchorY

    const dx = anchorX - this.jamby.x
    const dy = anchorYFinal - this.jamby.y

    const springK = 5.0
    const damping = 0.9

    body.velocity.x += dx * springK * (delta / 1000)
    body.velocity.y += dy * springK * (delta / 1000)

    body.velocity.x *= damping
    body.velocity.y *= damping
  }

  hit(arrowVelocity: Phaser.Math.Vector2) {
    if (this.isCut) return
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

  destroy() {
    this.pole.destroy()
    this.jamby.destroy()
  }
}
