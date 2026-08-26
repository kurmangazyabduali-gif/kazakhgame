import * as Phaser from 'phaser'

const GOLD = '#ffd700'
const INK = '#1a1208'

export class UIManager {
  private scene: Phaser.Scene

  private hudBg!: Phaser.GameObjects.Rectangle
  private levelText!: Phaser.GameObjects.Text
  private scoreText!: Phaser.GameObjects.Text
  private comboText!: Phaser.GameObjects.Text
  private attemptIcons: Phaser.GameObjects.Text[] = []
  private windLabel!: Phaser.GameObjects.Text

  private score = 0
  private combo = 0
  private totalAttempts: number

  constructor(scene: Phaser.Scene, level: number, totalAttempts: number) {
    this.scene = scene
    this.totalAttempts = totalAttempts

    // Backing panel so text stays legible over any sky/weather combination.
    this.hudBg = scene.add.rectangle(0, 0, 260, 118, 0x0a0704, 0.42)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(99).setStrokeStyle(1, 0xffd700, 0.25)
      .setPosition(14, 14)

    this.levelText = scene.add.text(30, 24, `ДЕҢГЕЙ ${level.toString().padStart(2, '0')}`, {
      fontSize: '20px',
      color: GOLD,
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
    }).setScrollFactor(0).setDepth(100)

    this.scoreText = scene.add.text(30, 52, `ҰПАЙ: 0`, {
      fontSize: '17px',
      color: '#ffffff',
      fontFamily: 'Georgia, serif',
    }).setScrollFactor(0).setDepth(100)

    this.comboText = scene.add.text(30, 76, '', {
      fontSize: '16px',
      color: '#ffaa00',
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
    }).setScrollFactor(0).setDepth(100).setAlpha(0)

    // Attempt pips — one per shot, dim out as they're spent.
    for (let i = 0; i < totalAttempts; i++) {
      const icon = scene.add.text(30 + i * 22, 98, '➹', {
        fontSize: '18px',
        color: GOLD,
      }).setScrollFactor(0).setDepth(100)
      this.attemptIcons.push(icon)
    }

    // Wind readout, top-right — paired with the animated flag drawn by MainScene.
    this.windLabel = scene.add.text(scene.scale.width - 20, 24, '', {
      fontSize: '13px',
      color: '#d8c8a8',
      fontFamily: 'Georgia, serif',
      align: 'right',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100)
  }

  setWindLabel(windSpeed: number) {
    if (Math.abs(windSpeed) < 10) {
      this.windLabel.setText('ЖЕЛ: ТЫНЫШ')
      return
    }
    const dir = windSpeed > 0 ? '→' : '←'
    const strength = Math.min(5, Math.ceil(Math.abs(windSpeed) / 100))
    this.windLabel.setText(`ЖЕЛ ${dir} ${'▮'.repeat(strength)}${'▯'.repeat(5 - strength)}`)
  }

  markAttemptUsed(index: number) {
    const icon = this.attemptIcons[index]
    if (!icon) return
    this.scene.tweens.add({
      targets: icon,
      alpha: 0.2,
      scale: 0.7,
      duration: 250,
      ease: 'Power1',
    })
  }

  addScore(points: number, isHit: boolean) {
    if (isHit) {
      this.combo++
      this.score += points * this.combo
    } else {
      this.combo = 0
    }

    this.scoreText.setText(`ҰПАЙ: ${this.score}`)

    if (this.combo > 1) {
      this.comboText.setText(`ТІЗБЕК x${this.combo}`)
      this.comboText.setAlpha(1)
      this.scene.tweens.add({
        targets: this.comboText,
        scale: { from: 1.6, to: 1 },
        duration: 320,
        ease: 'Back.easeOut',
      })
    } else {
      this.scene.tweens.add({ targets: this.comboText, alpha: 0, duration: 200 })
    }
  }

  get currentScore() {
    return this.score
  }

  showLevelComplete(stars: number, bestScore: number, onNext: () => void) {
    const cx = this.scene.scale.width / 2
    const cy = this.scene.scale.height / 2
    const depth = 200

    const dim = this.scene.add.rectangle(cx, cy, this.scene.scale.width * 1.4, this.scene.scale.height * 1.4, 0x000000, 0)
      .setScrollFactor(0).setDepth(depth)
    this.scene.tweens.add({ targets: dim, fillAlpha: 0.72, duration: 350 })

    const panel = this.scene.add.rectangle(cx, cy, 420, 340, 0x120c06, 0.96)
      .setScrollFactor(0).setDepth(depth + 1).setStrokeStyle(2, 0xffd700, 0.6)
      .setScale(0.85).setAlpha(0)

    const isNewBest = this.score >= bestScore
    const title = this.scene.add.text(cx, cy - 128, stars > 0 ? 'ДЕҢГЕЙ ӨТТІ!' : 'ҚАЙТА КӨРІҢІЗ', {
      fontSize: '30px',
      color: GOLD,
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 2).setAlpha(0)

    // Stars fly in one at a time with a bounce.
    const starGap = 56
    const starObjs: Phaser.GameObjects.Text[] = []
    for (let i = 0; i < 3; i++) {
      const filled = i < stars
      const star = this.scene.add.text(cx + (i - 1) * starGap, cy - 68, filled ? '★' : '☆', {
        fontSize: '46px',
        color: filled ? GOLD : '#4a4030',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 2).setScale(0).setAlpha(0)
      starObjs.push(star)
    }

    const scoreLabel = this.scene.add.text(cx, cy + 4, '', {
      fontSize: '26px',
      color: '#ffffff',
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 2).setAlpha(0)

    const bestLabel = this.scene.add.text(cx, cy + 40, isNewBest ? 'ЖАҢА РЕКОРД!' : `ЕҢ ЖАҚСЫСЫ: ${bestScore}`, {
      fontSize: '14px',
      color: isNewBest ? '#ffcf5c' : '#9a8c70',
      fontStyle: isNewBest ? 'bold' : 'normal',
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 2).setAlpha(0)

    const btn = this.scene.add.text(cx, cy + 110, '[ КЕЛЕСІ ДЕҢГЕЙ ]', {
      fontSize: '20px',
      color: INK,
      backgroundColor: '#ffd700',
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
      padding: { x: 18, y: 10 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 2).setAlpha(0)
      .setInteractive({ useHandCursor: true })

    const cleanup = () => {
      ;[dim, panel, title, scoreLabel, bestLabel, btn, ...starObjs].forEach((o) => o.destroy())
    }
    btn.on('pointerdown', () => { cleanup(); onNext() })
    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#fff3b0' }))
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#ffd700' }))

    this.scene.tweens.add({ targets: panel, scale: 1, alpha: 1, duration: 380, ease: 'Back.easeOut' })
    this.scene.tweens.add({ targets: title, alpha: 1, duration: 300, delay: 200 })

    starObjs.forEach((star, i) => {
      this.scene.tweens.add({
        targets: star,
        scale: 1,
        alpha: 1,
        duration: 380,
        delay: 420 + i * 160,
        ease: 'Back.easeOut',
        onComplete: () => {
          if (i < stars) {
            this.scene.tweens.add({ targets: star, angle: { from: -8, to: 8 }, duration: 180, yoyo: true, repeat: 1 })
          }
        },
      })
    })

    this.scene.time.delayedCall(420 + stars * 160 + 200, () => {
      scoreLabel.setAlpha(1)
      const counter = { val: 0 }
      this.scene.tweens.add({
        targets: counter,
        val: this.score,
        duration: 700,
        ease: 'Cubic.easeOut',
        onUpdate: () => scoreLabel.setText(`ҰПАЙ: ${Math.round(counter.val)}`),
      })
      this.scene.tweens.add({ targets: bestLabel, alpha: 1, duration: 300, delay: 500 })
      this.scene.tweens.add({ targets: btn, alpha: 1, duration: 300, delay: 750 })
    })
  }
}
