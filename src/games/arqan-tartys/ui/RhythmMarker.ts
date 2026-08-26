import * as Phaser from 'phaser'
import { MatchConfig } from '../engine/types'

/**
 * Bottom-of-screen rhythm indicator: a moving marker sweeps toward a fixed
 * target ring on each beat; tapping when the marker is inside the ring is
 * a good/perfect pull. This is the primary visual the spec calls for so
 * the player immediately understands *when* to press, independent of the
 * text tutorial.
 */
export class RhythmMarker {
  private scene: Phaser.Scene
  private track!: Phaser.GameObjects.Graphics
  private targetRing!: Phaser.GameObjects.Arc
  private perfectRing!: Phaser.GameObjects.Arc
  private marker!: Phaser.GameObjects.Arc
  private pullLabel!: Phaser.GameObjects.Text
  private trackY: number
  private trackLeft: number
  private trackRight: number

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const w = scene.scale.width
    const h = scene.scale.height
    this.trackY = h - 64
    this.trackLeft = w * 0.5 - 140
    this.trackRight = w * 0.5 + 140

    this.track = scene.add.graphics().setScrollFactor(0).setDepth(150)
    this.track.lineStyle(3, 0x1a1208, 0.4)
    this.track.strokeRoundedRect(this.trackLeft, this.trackY - 3, this.trackRight - this.trackLeft, 6, 3)

    this.targetRing = scene.add.circle(this.trackRight, this.trackY, 16, 0x000000, 0)
      .setStrokeStyle(3, 0xf4e4c1, 0.7).setScrollFactor(0).setDepth(151)
    this.perfectRing = scene.add.circle(this.trackRight, this.trackY, 8, 0x000000, 0)
      .setStrokeStyle(2, 0xd4af37, 0.9).setScrollFactor(0).setDepth(151)

    this.marker = scene.add.circle(this.trackLeft, this.trackY, 9, 0xd4af37).setScrollFactor(0).setDepth(152)

    this.pullLabel = scene.add.text(w / 2, this.trackY - 30, 'PULL ●', {
      fontSize: '15px',
      color: '#f4e4c1',
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(151)
  }

  /** progress in [0,1] — 0 = beat just started, 1 = beat lands now. */
  update(progress: number) {
    const clamped = Phaser.Math.Clamp(progress, 0, 1)
    const x = Phaser.Math.Linear(this.trackLeft, this.trackRight, clamped)
    this.marker.setPosition(x, this.trackY)
  }

  /** Flash feedback when a pull lands, colored/sized by quality. */
  flash(quality: 'PERFECT' | 'GOOD' | 'EARLY' | 'LATE' | 'MISS') {
    const color = quality === 'PERFECT' ? 0xd4af37 : quality === 'GOOD' ? 0xf4e4c1 : quality === 'MISS' ? 0x8a3a2a : 0xc9a86a
    this.marker.setFillStyle(color)
    this.scene.tweens.add({
      targets: this.marker,
      scale: { from: 1.6, to: 1 },
      duration: 220,
      ease: 'Back.easeOut',
    })
    this.scene.tweens.add({
      targets: this.targetRing,
      scale: { from: 1.4, to: 1 },
      duration: 260,
      ease: 'Sine.easeOut',
    })
  }

  /** Hint-mode: make the target ring pulse more visibly after a player
   *  mistimes repeatedly, per spec's error-hint escalation. */
  setHintEmphasis(emphasized: boolean) {
    if (emphasized) {
      this.scene.tweens.add({
        targets: [this.targetRing, this.perfectRing],
        alpha: { from: 0.5, to: 1 },
        duration: 500,
        yoyo: true,
        repeat: -1,
      })
    } else {
      this.scene.tweens.killTweensOf([this.targetRing, this.perfectRing])
      this.targetRing.setAlpha(1)
      this.perfectRing.setAlpha(1)
    }
  }

  reposition(config: Pick<MatchConfig, 'beatIntervalMs'>) {
    void config
    const w = this.scene.scale.width
    const h = this.scene.scale.height
    this.trackY = h - 64
    this.trackLeft = w * 0.5 - 140
    this.trackRight = w * 0.5 + 140
    this.track.clear()
    this.track.lineStyle(3, 0x1a1208, 0.4)
    this.track.strokeRoundedRect(this.trackLeft, this.trackY - 3, this.trackRight - this.trackLeft, 6, 3)
    this.targetRing.setPosition(this.trackRight, this.trackY)
    this.perfectRing.setPosition(this.trackRight, this.trackY)
    this.pullLabel.setPosition(w / 2, this.trackY - 30)
  }

  destroy() {
    this.track.destroy()
    this.targetRing.destroy()
    this.perfectRing.destroy()
    this.marker.destroy()
    this.pullLabel.destroy()
  }
}
