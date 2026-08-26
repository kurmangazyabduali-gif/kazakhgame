import * as Phaser from 'phaser'
import { RIDER_SIZE, RIDER_BOW_TIP, RIDER_TORSO_CENTER_X } from '../assets/riderSvg'

/**
 * Kazakh mounted archer. The rider is now three whole-pose SVG textures
 * (idle / draw / release) instead of separately layered torso+bow+arrow
 * sprites — swapping the visible pose reads as one coherent figure rather
 * than a costume change, and each pose already has its bow, string and
 * (for draw) nocked arrow baked in at the correct anatomy.
 *
 * The rider texture canvas is wider than the torso itself (to give the bow
 * room to extend left in the idle pose and right in the draw/release poses
 * without being clipped), so the image origin is set from the torso's own
 * center rather than the texture's geometric center — otherwise the whole
 * figure would appear to shift sideways as the pose changes.
 */
export class RiderEntity extends Phaser.GameObjects.Container {
  public horse: Phaser.GameObjects.Sprite
  public poseIdle: Phaser.GameObjects.Image
  public poseDraw: Phaser.GameObjects.Image
  public poseRelease: Phaser.GameObjects.Image

  private releaseTimer: Phaser.Time.TimerEvent | null = null
  private readonly scaleFactor = 1.05

  // Container-local anchor for the rider sprite group (above/behind the saddle).
  private static readonly RIDER_LOCAL_X = -6
  private static readonly RIDER_LOCAL_Y = -118

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    // Horse — drawn at 340x240, scaled down to sit naturally in the scene.
    this.horse = scene.add.sprite(0, 0, 'horse_0')
    this.horse.setOrigin(0.48, 0.85) // roughly the barrel's center-bottom, where the saddle sits
    this.horse.setScale(1.05)
    this.horse.play('horse_gallop')

    // Origin X is the torso's own center as a fraction of the full (wider) texture
    // width, so the visible figure stays put across all three poses.
    const originX = RIDER_TORSO_CENTER_X / RIDER_SIZE.width
    const originY = 0.92

    const riderX = RiderEntity.RIDER_LOCAL_X
    const riderY = RiderEntity.RIDER_LOCAL_Y

    this.poseIdle = scene.add.image(riderX, riderY, 'rider_idle')
    this.poseIdle.setOrigin(originX, originY)
    this.poseIdle.setScale(this.scaleFactor)

    this.poseDraw = scene.add.image(riderX, riderY, 'rider_draw')
    this.poseDraw.setOrigin(originX, originY)
    this.poseDraw.setScale(this.scaleFactor)
    this.poseDraw.setVisible(false)

    this.poseRelease = scene.add.image(riderX, riderY, 'rider_release')
    this.poseRelease.setOrigin(originX, originY)
    this.poseRelease.setScale(this.scaleFactor)
    this.poseRelease.setVisible(false)

    this.add([this.horse, this.poseIdle, this.poseDraw, this.poseRelease])
    this.setDepth(8) // Must be above steppe (3) and mountains (2)
    scene.add.existing(this)
  }

  /** Anchor point (in world space) where a nocked/flying arrow should originate from. */
  getBowTipPosition(): Phaser.Math.Vector2 {
    const originX = RIDER_TORSO_CENTER_X / RIDER_SIZE.width
    const originY = 0.92

    // World position of the pose image's top-left corner, given its origin.
    const imgX = this.x + RiderEntity.RIDER_LOCAL_X - originX * RIDER_SIZE.width * this.scaleFactor
    const imgY = this.y + RiderEntity.RIDER_LOCAL_Y - originY * RIDER_SIZE.height * this.scaleFactor

    return new Phaser.Math.Vector2(
      imgX + RIDER_BOW_TIP.x * this.scaleFactor,
      imgY + RIDER_BOW_TIP.y * this.scaleFactor
    )
  }

  setDrawPower(powerVector: Phaser.Math.Vector2) {
    const power = powerVector.length()

    if (power > 20) {
      this.releaseTimer?.remove()
      this.poseIdle.setVisible(false)
      this.poseRelease.setVisible(false)
      this.poseDraw.setVisible(true)

      // Subtle lean into the draw, clamped so the rider never looks broken.
      const angle = Math.atan2(powerVector.y, powerVector.x)
      const lean = Phaser.Math.Clamp(angle * 0.12, -0.18, 0.18)
      this.poseDraw.setRotation(lean)
    } else {
      this.resetPose()
    }
  }

  /** Play the release/recoil frame briefly before settling back to idle. */
  playRelease() {
    this.releaseTimer?.remove()
    this.poseIdle.setVisible(false)
    this.poseDraw.setVisible(false)
    this.poseRelease.setVisible(true)
    this.poseRelease.setRotation(0)

    this.releaseTimer = this.scene.time.delayedCall(220, () => {
      this.poseRelease.setVisible(false)
      this.poseIdle.setVisible(true)
    })
  }

  resetPose() {
    this.releaseTimer?.remove()
    this.poseDraw.setVisible(false)
    this.poseRelease.setVisible(false)
    this.poseIdle.setVisible(true)
    this.poseDraw.setRotation(0)
  }
}
