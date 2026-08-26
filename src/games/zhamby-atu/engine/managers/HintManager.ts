import * as Phaser from 'phaser'

/**
 * Teaches the "PULL -> AIM -> RELEASE" gesture without any text explanation.
 * If the player sits idle in the RIDING state for a few seconds, this escalates
 * through three stages: highlight the jamby (pulse/glow), show a sample
 * trajectory arc from rider to target, then a ghost hand miming the pull-back
 * gesture. Any real input cancels and resets the whole sequence.
 */
export class HintManager {
  private scene: Phaser.Scene
  private idleTimer: Phaser.Time.TimerEvent | null = null
  private stageTimers: Phaser.Time.TimerEvent[] = []

  private jambyGlow: Phaser.GameObjects.Arc | null = null
  private hintTrajectory: Phaser.GameObjects.Graphics | null = null
  private ghostHand: Phaser.GameObjects.Text | null = null
  private ghostTween: Phaser.Tweens.Tween | null = null

  private active = false

  /** Seconds of no input (while riding) before the hint sequence begins. */
  private static readonly IDLE_DELAY = 4500

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /** Call once per frame from MainScene.update with the current game state and
   *  the world-space points the hint should aim at. */
  start(getContext: () => { jambyX: number; jambyY: number; riderX: number; riderY: number }) {
    this.getContext = getContext
    this.armIdleTimer()
  }

  private getContext: () => { jambyX: number; jambyY: number; riderX: number; riderY: number } = () => ({ jambyX: 0, jambyY: 0, riderX: 0, riderY: 0 })

  private armIdleTimer() {
    this.idleTimer?.remove()
    this.idleTimer = this.scene.time.delayedCall(HintManager.IDLE_DELAY, () => this.beginSequence())
  }

  /** Call on any real player input (drag start, drag move, release) — cancels
   *  any showing hint and restarts the idle countdown. */
  notifyInput() {
    this.cancel()
    this.armIdleTimer()
  }

  /** Call when the game leaves the RIDING state (aiming/flight/result) so hints
   *  never show mid-shot; call notifyInput() again once back to RIDING. */
  pause() {
    this.idleTimer?.remove()
    this.idleTimer = null
    this.cancel()
  }

  resume() {
    this.armIdleTimer()
  }

  private beginSequence() {
    if (this.active) return
    this.active = true

    const stage1 = this.scene.time.delayedCall(0, () => this.showJambyHighlight())
    const stage2 = this.scene.time.delayedCall(1800, () => this.showTrajectoryHint())
    const stage3 = this.scene.time.delayedCall(3600, () => this.showGhostHand())
    this.stageTimers.push(stage1, stage2, stage3)
  }

  private showJambyHighlight() {
    const { jambyX, jambyY } = this.getContext()
    // Bright cyan/white ring — deliberately NOT gold, since the jamby disc itself
    // has a baked-in gold glow that a same-colored highlight would blend into and
    // disappear against. Scale-tweened (not radius-tweened — Arc geometry doesn't
    // redraw live off a radius tween) so the pulse is guaranteed to animate.
    this.jambyGlow = this.scene.add.circle(jambyX, jambyY, 50, 0x5be0ff, 0)
      .setStrokeStyle(4, 0x5be0ff, 1)
      .setDepth(50)
    this.scene.tweens.add({
      targets: this.jambyGlow,
      scale: { from: 0.85, to: 1.25 },
      alpha: { from: 1, to: 0.25 },
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private showTrajectoryHint() {
    const { jambyX, jambyY, riderX, riderY } = this.getContext()
    this.hintTrajectory = this.scene.add.graphics().setDepth(15)
    this.hintTrajectory.lineStyle(2, 0xffffff, 0.35)

    // A gentle, generic arc from the bow toward the jamby — illustrative only,
    // not a physically exact preview (the real drag-based preview handles that).
    const startX = riderX
    const startY = riderY - 90
    const midX = (startX + jambyX) / 2
    const midY = Math.min(startY, jambyY) - 90

    this.hintTrajectory.beginPath()
    this.hintTrajectory.moveTo(startX, startY)
    const steps = 24
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * jambyX
      const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * jambyY
      this.hintTrajectory.lineTo(x, y)
    }
    this.hintTrajectory.strokePath()

    this.scene.tweens.add({
      targets: this.hintTrajectory,
      alpha: { from: 0.15, to: 0.6 },
      duration: 900,
      yoyo: true,
      repeat: -1,
    })
  }

  private showGhostHand() {
    const { riderX, riderY } = this.getContext()
    const startX = riderX + 40
    const startY = riderY - 90
    const endX = riderX - 60
    const endY = riderY - 60

    this.ghostHand = this.scene.add.text(startX, startY, '✋', { fontSize: '40px' })
      .setOrigin(0.5).setDepth(16).setAlpha(0.85)

    this.ghostTween = this.scene.tweens.add({
      targets: this.ghostHand,
      x: endX,
      y: endY,
      duration: 900,
      hold: 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  /** Tear down whatever hint visuals are currently showing (any stage). */
  cancel() {
    this.active = false
    this.stageTimers.forEach((t) => t.remove())
    this.stageTimers = []

    this.jambyGlow?.destroy()
    this.jambyGlow = null

    this.hintTrajectory?.destroy()
    this.hintTrajectory = null

    this.ghostTween?.stop()
    this.ghostTween = null
    this.ghostHand?.destroy()
    this.ghostHand = null
  }

  destroy() {
    this.idleTimer?.remove()
    this.cancel()
  }
}
