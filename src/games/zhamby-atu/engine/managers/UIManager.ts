import * as Phaser from 'phaser'

export class UIManager {
  private scene: Phaser.Scene
  
  private scoreText!: Phaser.GameObjects.Text
  private levelText!: Phaser.GameObjects.Text
  private comboText!: Phaser.GameObjects.Text

  private score = 0
  private combo = 0

  constructor(scene: Phaser.Scene, level: number) {
    this.scene = scene

    // Use fixed camera space for UI
    this.levelText = scene.add.text(20, 20, `LEVEL ${level.toString().padStart(2, '0')}`, {
      fontSize: '24px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setScrollFactor(0).setDepth(100)

    this.scoreText = scene.add.text(20, 50, `SCORE: 0`, {
      fontSize: '20px',
      color: '#ffffff'
    }).setScrollFactor(0).setDepth(100)

    this.comboText = scene.add.text(20, 80, `COMBO x0`, {
      fontSize: '20px',
      color: '#ffaa00'
    }).setScrollFactor(0).setDepth(100).setAlpha(0)
  }

  addScore(points: number, isHit: boolean) {
    if (isHit) {
      this.combo++
      this.score += points * this.combo
    } else {
      this.combo = 0
    }

    this.scoreText.setText(`SCORE: ${this.score}`)
    
    if (this.combo > 1) {
      this.comboText.setText(`COMBO x${this.combo}`)
      this.comboText.setAlpha(1)
      this.scene.tweens.add({
        targets: this.comboText,
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: 'Back.easeOut'
      })
    } else {
      this.comboText.setAlpha(0)
    }
  }

  showLevelComplete(stars: number, onNext: () => void) {
    const cx = this.scene.scale.width / 2
    const cy = this.scene.scale.height / 2

    const bg = this.scene.add.rectangle(cx, cy, 400, 300, 0x000000, 0.8)
      .setScrollFactor(0).setDepth(200)

    const title = this.scene.add.text(cx, cy - 100, 'LEVEL COMPLETE', {
      fontSize: '32px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200)

    const scoreT = this.scene.add.text(cx, cy - 30, `SCORE: ${this.score}`, {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200)

    const starText = '⭐'.repeat(stars)
    const starsObj = this.scene.add.text(cx, cy + 30, starText, {
      fontSize: '48px'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200)

    const btn = this.scene.add.text(cx, cy + 100, '[ NEXT LEVEL ]', {
      fontSize: '24px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200).setInteractive({ useHandCursor: true })

    btn.on('pointerdown', () => {
      bg.destroy()
      title.destroy()
      scoreT.destroy()
      starsObj.destroy()
      btn.destroy()
      onNext()
    })
  }
}
