import * as Phaser from 'phaser'
import { PullQuality } from '../engine/types'
import { popupSpecForQuality } from './JuiceRules'

/**
 * Floating combo-text feedback for a single pull ("ТАМАША!", "ЖАҚСЫ!" …) —
 * spawned at the pulling team's position with a scale-punch-then-rise
 * animation. Distinct from RhythmMarker.flash(), which only recolors the
 * beat marker itself; this is the louder, harder-to-miss read of "what did
 * that pull just do."
 */
export class PopupText {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  spawn(x: number, y: number, quality: PullQuality) {
    const spec = popupSpecForQuality(quality)
    const isStrong = quality === 'PERFECT' || quality === 'GOOD'

    const label = this.scene.add.text(x, y, spec.text, {
      fontSize: isStrong ? '22px' : '16px',
      color: spec.colorHex,
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
      stroke: '#1a1208',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(180).setScale(0.4).setAlpha(0)

    this.scene.tweens.add({
      targets: label,
      scale: isStrong ? 1.15 : 0.95,
      alpha: 1,
      duration: 160,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: label,
          y: y - (isStrong ? 46 : 30),
          alpha: 0,
          scale: isStrong ? 1 : 0.85,
          duration: 480,
          delay: 120,
          ease: 'Sine.easeIn',
          onComplete: () => label.destroy(),
        })
      },
    })
  }
}
