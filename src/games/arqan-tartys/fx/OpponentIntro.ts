import * as Phaser from 'phaser'

const GOLD = '#d4af37'
const CREAM = '#f4e4c1'

/**
 * Pre-match opponent card — shown once before round 1 of a match (not the
 * one-time tutorial, which already has its own intro), so the AI reads as
 * a specific rival team with a name and a style to expect, rather than an
 * anonymous "Level N". Auto-dismisses; a tap skips ahead immediately.
 */
export class OpponentIntro {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  show(opponentName: string, opponentStyle: string, onComplete: () => void) {
    const cx = this.scene.scale.width / 2
    const cy = this.scene.scale.height / 2
    const depth = 220
    let dismissed = false

    const dim = this.scene.add.rectangle(cx, cy, this.scene.scale.width, this.scene.scale.height, 0x0d0904, 0)
      .setScrollFactor(0).setDepth(depth).setInteractive()
    this.scene.tweens.add({ targets: dim, fillAlpha: 0.72, duration: 260 })

    const vs = this.scene.add.text(cx, cy - 66, 'ҚАРСЫЛАС', {
      fontSize: '13px',
      color: '#c9a86a',
      fontFamily: 'Georgia, serif',
      letterSpacing: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1).setAlpha(0)

    const name = this.scene.add.text(cx, cy - 30, opponentName, {
      fontSize: '28px',
      color: GOLD,
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
      align: 'center',
      wordWrap: { width: this.scene.scale.width * 0.8 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1).setAlpha(0).setScale(0.85)

    const style = this.scene.add.text(cx, cy + 28, opponentStyle, {
      fontSize: '15px',
      color: CREAM,
      fontFamily: 'Georgia, serif',
      align: 'center',
      wordWrap: { width: this.scene.scale.width * 0.75 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 1).setAlpha(0)

    const objects = [dim, vs, name, style]

    this.scene.tweens.add({ targets: [vs, style], alpha: 1, duration: 260, delay: 120 })
    this.scene.tweens.add({ targets: name, alpha: 1, scale: 1, duration: 320, delay: 180, ease: 'Back.easeOut' })

    const finish = () => {
      if (dismissed) return
      dismissed = true
      this.scene.tweens.add({
        targets: objects,
        alpha: 0,
        duration: 240,
        onComplete: () => {
          objects.forEach((o) => o.destroy())
          onComplete()
        },
      })
    }

    dim.on('pointerdown', finish)
    this.scene.time.delayedCall(2200, finish)
  }
}
