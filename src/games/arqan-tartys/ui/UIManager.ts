import * as Phaser from 'phaser'
import { MatchResult } from '../engine/MatchManager'

const GOLD = '#d4af37'
const INK = '#241a10'
const CREAM = '#f4e4c1'
// Numeric equivalents for Graphics/Shape APIs (setStrokeStyle, fillStyle,
// etc.) which take 0xRRGGBB numbers rather than CSS hex strings.
const GOLD_NUM = 0xd4af37

/**
 * Minimalist HUD: title, round indicator, PLAYER/AI progress bars (rope
 * position + fatigue), and the bottom rhythm strip the player taps
 * against. Kept separate from RhythmMarker (which owns the actual beat
 * countdown animation) so the HUD's static chrome doesn't redraw every
 * frame.
 */
export class UIManager {
  private scene: Phaser.Scene
  private roundText!: Phaser.GameObjects.Text
  private playerBar!: Phaser.GameObjects.Graphics
  private aiBar!: Phaser.GameObjects.Graphics
  private playerFatigueBar!: Phaser.GameObjects.Graphics
  private aiFatigueBar!: Phaser.GameObjects.Graphics
  private scoreDots: Phaser.GameObjects.Text[] = []

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const w = scene.scale.width

    scene.add.text(w / 2, 20, 'АРҚАН ТАРТЫС', {
      fontSize: '22px',
      color: GOLD,
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100)

    this.roundText = scene.add.text(w / 2, 46, 'ROUND 1/3', {
      fontSize: '14px',
      color: CREAM,
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100)

    // Progress bars — background tracks
    scene.add.rectangle(w * 0.5 - 160, 78, 140, 10, 0x1a1208, 0.5).setOrigin(0, 0.5).setScrollFactor(0).setDepth(99)
    scene.add.rectangle(w * 0.5 + 20, 78, 140, 10, 0x1a1208, 0.5).setOrigin(0, 0.5).setScrollFactor(0).setDepth(99)
    this.playerBar = scene.add.graphics().setScrollFactor(0).setDepth(100)
    this.aiBar = scene.add.graphics().setScrollFactor(0).setDepth(100)

    // Fatigue bars, thinner, below the rope-position bars
    scene.add.rectangle(w * 0.5 - 160, 92, 140, 5, 0x1a1208, 0.4).setOrigin(0, 0.5).setScrollFactor(0).setDepth(99)
    scene.add.rectangle(w * 0.5 + 20, 92, 140, 5, 0x1a1208, 0.4).setOrigin(0, 0.5).setScrollFactor(0).setDepth(99)
    this.playerFatigueBar = scene.add.graphics().setScrollFactor(0).setDepth(100)
    this.aiFatigueBar = scene.add.graphics().setScrollFactor(0).setDepth(100)

    scene.add.text(w * 0.5 - 160, 66, 'СІЗ', { fontSize: '11px', color: GOLD, fontFamily: 'Georgia, serif' }).setScrollFactor(0).setDepth(100)
    scene.add.text(w * 0.5 + 160, 66, 'AI', { fontSize: '11px', color: '#7fb3e0', fontFamily: 'Georgia, serif' }).setOrigin(1, 0).setScrollFactor(0).setDepth(100)
  }

  update(ropePosition: number, winThreshold: number, playerFatigue: number, aiFatigue: number) {
    const w = this.scene.scale.width
    // ropePosition in [-threshold, +threshold] -> [0,1] player advantage share
    const playerShare = Phaser.Math.Clamp((ropePosition + winThreshold) / (2 * winThreshold), 0, 1)

    this.playerBar.clear()
    this.playerBar.fillStyle(0xd4af37, 1)
    this.playerBar.fillRect(w * 0.5 - 160, 73, 140 * playerShare, 10)

    this.aiBar.clear()
    this.aiBar.fillStyle(0x4a90c4, 1)
    const aiShare = 1 - playerShare
    this.aiBar.fillRect(w * 0.5 + 160 - 140 * aiShare, 73, 140 * aiShare, 10)

    this.playerFatigueBar.clear()
    this.playerFatigueBar.fillStyle(0xc0392b, 0.85)
    this.playerFatigueBar.fillRect(w * 0.5 - 160, 89.5, 140 * playerFatigue, 5)

    this.aiFatigueBar.clear()
    this.aiFatigueBar.fillStyle(0xc0392b, 0.85)
    this.aiFatigueBar.fillRect(w * 0.5 + 20, 89.5, 140 * aiFatigue, 5)
  }

  setRound(round: number, playerWins: number, aiWins: number) {
    this.roundText.setText(`ROUND ${round}/3   ${playerWins} : ${aiWins}`)
  }

  /** Full-screen victory/defeat/round-result overlay per spec's reward
   *  screen (Round wins, Best rhythm, Best comeback, XP). */
  showMatchResult(result: MatchResult, xpEarned: number, onContinue: () => void) {
    const cx = this.scene.scale.width / 2
    const cy = this.scene.scale.height / 2
    const depth = 200
    const won = result.winner === 'PLAYER'

    const dim = this.scene.add.rectangle(cx, cy, this.scene.scale.width * 1.4, this.scene.scale.height * 1.4, 0x000000, 0)
      .setScrollFactor(0).setDepth(depth)
    this.scene.tweens.add({ targets: dim, fillAlpha: 0.75, duration: 350 })

    const panel = this.scene.add.rectangle(cx, cy, 400, 360, 0x1a1208, 0.96)
      .setScrollFactor(0).setDepth(depth + 1).setStrokeStyle(2, GOLD_NUM, 0.7).setScale(0.85).setAlpha(0)

    const title = this.scene.add.text(cx, cy - 140, won ? 'ЖЕҢІС' : 'ЖЕҢІЛІС', {
      fontSize: '34px',
      color: won ? GOLD : '#c0392b',
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 2).setAlpha(0)

    const totalPerfect = result.rounds.reduce((sum, r) => sum + r.playerPerfectPulls, 0)
    const lines = [
      `Раунд есебі: ${result.playerRoundsWon} : ${result.aiRoundsWon}`,
      `Үздік ырғақ: ${totalPerfect} дәл соққы`,
      result.hadComeback ? 'Үздік камбек: ИӘ' : 'Камбек: жоқ',
      `XP: +${xpEarned}`,
    ]

    const statsText = this.scene.add.text(cx, cy - 60, lines.join('\n'), {
      fontSize: '16px',
      color: CREAM,
      fontFamily: 'Georgia, serif',
      align: 'center',
      lineSpacing: 10,
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(depth + 2).setAlpha(0)

    const btn = this.scene.add.text(cx, cy + 140, '[ ЖАЛҒАСТЫРУ ]', {
      fontSize: '18px',
      color: INK,
      backgroundColor: GOLD,
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
      padding: { x: 16, y: 9 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth + 2).setAlpha(0).setInteractive({ useHandCursor: true })

    const cleanup = () => {
      ;[dim, panel, title, statsText, btn].forEach((o) => o.destroy())
    }
    btn.on('pointerdown', () => { cleanup(); onContinue() })
    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#fff3b0' }))
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: GOLD }))

    this.scene.tweens.add({ targets: panel, scale: 1, alpha: 1, duration: 380, ease: 'Back.easeOut' })
    this.scene.tweens.add({ targets: title, alpha: 1, duration: 300, delay: 200 })
    this.scene.tweens.add({ targets: statsText, alpha: 1, duration: 300, delay: 450 })
    this.scene.tweens.add({ targets: btn, alpha: 1, duration: 300, delay: 700 })
  }

  showRoundResult(roundNumber: number, winner: 'PLAYER' | 'AI', onContinue: () => void) {
    const cx = this.scene.scale.width / 2
    const cy = this.scene.scale.height / 2
    const depth = 190
    const text = this.scene.add.text(cx, cy, `РАУНД ${roundNumber}: ${winner === 'PLAYER' ? 'СІЗ ЖЕҢДІҢІЗ' : 'AI ЖЕҢДІ'}`, {
      fontSize: '26px',
      color: winner === 'PLAYER' ? GOLD : '#c0392b',
      fontStyle: 'bold',
      fontFamily: 'Georgia, serif',
      backgroundColor: '#1a1208cc',
      padding: { x: 24, y: 14 },
    }).setOrigin(0.5).setScrollFactor(0).setDepth(depth).setAlpha(0).setScale(0.8)

    this.scene.tweens.add({ targets: text, alpha: 1, scale: 1, duration: 300, ease: 'Back.easeOut' })
    this.scene.time.delayedCall(1600, () => {
      this.scene.tweens.add({ targets: text, alpha: 0, duration: 300, onComplete: () => { text.destroy(); onContinue() } })
    })
  }

  destroy() {
    this.scoreDots.forEach((d) => d.destroy())
  }
}
