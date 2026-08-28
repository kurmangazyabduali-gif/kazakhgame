import * as Phaser from 'phaser'
import { Side } from '../engine/types'

/**
 * Edge-triggered "МАТЧ-ПОЙНТ!" banner — fires once when either side first
 * crosses into match-point range (see JuiceRules.matchPointSide), not every
 * frame it stays true, so it reads as a single dramatic beat rather than a
 * flickering label glued to the HUD.
 */
export class MatchPointBanner {
  private scene: Phaser.Scene
  private lastSide: Side | null = null
  private onTrigger?: (side: Side) => void

  constructor(scene: Phaser.Scene, onTrigger?: (side: Side) => void) {
    this.scene = scene
    this.onTrigger = onTrigger
  }

  /** Call once per frame with the current matchPointSide() result. */
  notify(side: Side | null) {
    if (side && side !== this.lastSide) {
      this.show(side)
      this.onTrigger?.(side)
    }
    this.lastSide = side
  }

  private show(side: Side) {
    const cx = this.scene.scale.width / 2
    const cy = this.scene.scale.height * 0.3
    const isPlayer = side === 'PLAYER'

    const label = this.scene.add.text(cx, cy, 'МАТЧ-ПОЙНТ!', {
      fontSize: '28px',
      color: isPlayer ? '#d4af37' : '#c0392b',
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
      stroke: '#1a1208',
      strokeThickness: 4,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(195).setScale(0.5).setAlpha(0)

    this.scene.tweens.add({
      targets: label,
      scale: 1,
      alpha: 1,
      duration: 220,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: label,
          alpha: 0,
          y: cy - 20,
          duration: 380,
          delay: 900,
          onComplete: () => label.destroy(),
        })
      },
    })
  }

  /** Call on round reset so a fresh round can trigger the banner again. */
  reset() {
    this.lastSide = null
  }
}
