import * as Phaser from 'phaser'
import { PoseState } from '../characters/characterSvg'
import { teamATextureKey, teamBTextureKey } from '../engine/BootScene'
import { fatigueTintColor } from '../fx/JuiceRules'

export type TeamSide = 'A' | 'B'

/**
 * Renders and animates the 4 athletes for one side of the rope. Team A
 * (player, left) faces right-to-left in its authored art (pulling toward
 * negative x); Team B (right) is the mirrored flip of the same textures,
 * so the roster reads as genuinely different people on both sides without
 * doubling the SVG asset count.
 */
export class TeamEntity {
  private scene: Phaser.Scene
  private side: TeamSide
  private sprites: Phaser.GameObjects.Sprite[] = []
  private currentPose: PoseState = 'IDLE'
  private breathTweens: Phaser.Tweens.Tween[] = []
  private groundY = 0

  /** Sprites are authored at 160x220 (see CHARACTER_SIZE) — scaled down and
   *  slightly shrunk per queue position (nearer-the-rope characters render
   *  larger) so 4 athletes read as a distinct pulling line instead of an
   *  overlapping cluster at typical game viewport widths. */
  private static readonly BASE_SCALE = 0.62

  constructor(scene: Phaser.Scene, side: TeamSide, anchorX: number, groundY: number, spacing: number) {
    this.scene = scene
    this.side = side
    this.groundY = groundY

    for (let i = 0; i < 4; i++) {
      const key = side === 'A' ? teamATextureKey(i, 'IDLE') : teamBTextureKey(i, 'IDLE')
      // Stagger characters back from the rope line so the team reads as a
      // queue pulling together, not one figure. Team A queues to the left
      // (negative x offset), Team B to the right (positive x offset).
      const direction = side === 'A' ? -1 : 1
      const x = anchorX + direction * (i * spacing)
      const scale = TeamEntity.BASE_SCALE * (1 - i * 0.06)
      const sprite = this.scene.add.sprite(x, groundY, key).setOrigin(0.5, 1).setScale(scale)
      if (side === 'B') sprite.setFlipX(true)
      sprite.setDepth(10 + (4 - i)) // frontmost (rope-nearest) draws on top
      this.sprites.push(sprite)
    }

    this.startBreathing()
  }

  /** Subtle, desynced idle life: each of the 4 athletes rises and settles
   *  on its own phase (offset by index) so the roster reads as 4 separate
   *  people breathing, not one sprite cloned 4 times moving in lockstep. */
  private startBreathing() {
    this.stopBreathing()
    this.sprites.forEach((sprite, i) => {
      const tween = this.scene.tweens.add({
        targets: sprite,
        y: this.groundY - (2 + (i % 2)),
        duration: 1400 + i * 180,
        delay: i * 220,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })
      this.breathTweens.push(tween)
    })
  }

  private stopBreathing() {
    this.breathTweens.forEach((t) => t.stop())
    this.breathTweens = []
  }

  /** Fatigue-driven tint (see JuiceRules.fatigueTintColor) — exhaustion
   *  reads on the athletes themselves as the round wears on, not only in
   *  the HUD fatigue bar. `fatigue` is the team's 0..1 ForceEngine value. */
  setFatigue(fatigue: number) {
    const tint = fatigueTintColor(fatigue)
    this.sprites.forEach((sprite) => sprite.setTint(tint))
  }

  setPose(pose: PoseState) {
    if (pose === this.currentPose) return
    this.currentPose = pose
    this.sprites.forEach((sprite, i) => {
      const key = this.side === 'A' ? teamATextureKey(i, pose) : teamBTextureKey(i, pose)
      sprite.setTexture(key)
    })
  }

  /** Micro-shake on a strong pull — brief per-sprite jitter for game feel. */
  playPullImpulse(strength: number) {
    this.sprites.forEach((sprite, i) => {
      this.scene.tweens.add({
        targets: sprite,
        x: sprite.x + (this.side === 'A' ? -1 : 1) * strength * 3,
        duration: 90,
        yoyo: true,
        delay: i * 15,
        ease: 'Sine.easeOut',
      })
    })
  }

  setPositions(anchorX: number, groundY: number, spacing: number) {
    this.groundY = groundY
    const direction = this.side === 'A' ? -1 : 1
    this.sprites.forEach((sprite, i) => {
      sprite.setPosition(anchorX + direction * (i * spacing), groundY)
    })
    // Restart breathing against the new baseline Y so the running tweens
    // don't keep interpolating toward a pre-resize target.
    this.startBreathing()
  }

  /** Approximate width of the roster's queue span in world units, used by
   *  MainScene to keep both teams' rope anchor comfortably clear of the
   *  frontmost character regardless of viewport width. */
  static estimatedQueueSpan(spacing: number): number {
    return 3 * spacing + 70
  }

  getFrontHandPosition(): { x: number; y: number } {
    // The frontmost (rope-nearest) character — index 0 — is where the rope
    // visually meets the team.
    const front = this.sprites[0]
    return { x: front.x, y: front.y - 90 }
  }

  /** Ground-contact point of the frontmost character — sprites use origin
   *  (0.5, 1), so `.y` is already the foot/ground line. Used to anchor dust
   *  particle bursts at a pull. */
  getFrontFootPosition(): { x: number; y: number } {
    const front = this.sprites[0]
    return { x: front.x, y: front.y }
  }

  destroy() {
    this.stopBreathing()
    this.sprites.forEach((s) => s.destroy())
  }
}
