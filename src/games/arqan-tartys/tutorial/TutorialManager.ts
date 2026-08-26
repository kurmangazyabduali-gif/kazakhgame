import * as Phaser from 'phaser'

const GOLD = '#d4af37'
const INK = '#1a1208'

/**
 * First-match tutorial: ТАРТ! -> "Нажми в ритм" -> "Сохраняй силу" ->
 * "Не утомляй команду", with a ghost hand demonstrating the first pull.
 * Only shown once per player (caller checks progression before invoking).
 */
export class TutorialManager {
  private scene: Phaser.Scene
  private overlayObjects: Phaser.GameObjects.GameObject[] = []
  private ghostHand: Phaser.GameObjects.Text | null = null
  private ghostTween: Phaser.Tweens.Tween | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /** Runs the 4-step intro sequence, calling onComplete once dismissed
   *  (either by the player tapping through or the sequence finishing). */
  playIntro(rhythmMarkerY: number, onComplete: () => void) {
    const cx = this.scene.scale.width / 2
    const cy = this.scene.scale.height / 2
    const depth = 250

    const steps = [
      { text: 'ТАРТ!', sub: '' },
      { text: 'Нажми в ритм', sub: 'Тап дәл белгіде' },
      { text: 'Сохраняй силу', sub: 'Демалуды ұмытпа' },
      { text: 'Не утомляй команду', sub: 'Тым жиі баспа' },
    ]

    const title = this.scene.add.text(cx, cy - 20, '', {
      fontSize: '30px',
      color: GOLD,
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth).setAlpha(0)

    const sub = this.scene.add.text(cx, cy + 24, '', {
      fontSize: '15px',
      color: '#f4e4c1',
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth).setAlpha(0)

    this.overlayObjects.push(title, sub)

    let i = 0
    const showStep = () => {
      if (i >= steps.length) {
        this.scene.tweens.add({
          targets: [title, sub],
          alpha: 0,
          duration: 300,
          onComplete: () => {
            title.destroy()
            sub.destroy()
            this.showGhostHand(rhythmMarkerY, onComplete)
          },
        })
        return
      }
      const step = steps[i]
      title.setText(step.text)
      sub.setText(step.sub)
      this.scene.tweens.add({ targets: [title, sub], alpha: 1, duration: 250 })
      this.scene.time.delayedCall(1400, () => {
        this.scene.tweens.add({
          targets: [title, sub],
          alpha: 0,
          duration: 200,
          onComplete: () => {
            i++
            showStep()
          },
        })
      })
    }
    showStep()
  }

  private showGhostHand(rhythmMarkerY: number, onComplete: () => void) {
    const w = this.scene.scale.width
    const targetX = w * 0.5 + 140

    this.ghostHand = this.scene.add.text(w * 0.5 - 140, rhythmMarkerY - 40, '✋', {
      fontSize: '40px',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(250).setAlpha(0.9)
    this.overlayObjects.push(this.ghostHand)

    this.ghostTween = this.scene.tweens.add({
      targets: this.ghostHand,
      x: targetX,
      y: rhythmMarkerY,
      duration: 900,
      ease: 'Sine.easeIn',
      onComplete: () => {
        this.scene.tweens.add({
          targets: this.ghostHand,
          scale: 1.4,
          alpha: 0,
          duration: 250,
          onComplete: () => {
            this.cleanup()
            onComplete()
          },
        })
      },
    })
  }

  private cleanup() {
    this.overlayObjects.forEach((o) => o.destroy())
    this.overlayObjects = []
    this.ghostTween = null
    this.ghostHand = null
  }

  skip() {
    this.scene.tweens.killAll()
    this.cleanup()
  }
}

export function achievementToast(scene: Phaser.Scene, nameKz: string) {
  const w = scene.scale.width
  const toast = scene.add.text(w / 2, 100, `🏆 ${nameKz}`, {
    fontSize: '16px',
    color: INK,
    backgroundColor: '#d4af37',
    fontFamily: 'Georgia, serif',
    padding: { x: 14, y: 8 },
  }).setOrigin(0.5).setScrollFactor(0).setDepth(300).setAlpha(0).setY(80)

  scene.tweens.add({ targets: toast, alpha: 1, y: 100, duration: 350, ease: 'Back.easeOut' })
  scene.time.delayedCall(2200, () => {
    scene.tweens.add({ targets: toast, alpha: 0, y: 80, duration: 300, onComplete: () => toast.destroy() })
  })
}
