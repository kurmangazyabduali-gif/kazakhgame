import * as Phaser from 'phaser'

/**
 * Full-screen pulsing red edge-vignette that ramps in once the PLAYER team
 * is meaningfully close to losing a round. Distinct from the fatigue bar
 * (a small HUD readout) — this is a peripheral, hard-to-miss "you're about
 * to lose" signal, per the request that danger should be *felt*, not just
 * legible in a corner meter.
 *
 * Only reacts to PLAYER danger (not AI danger) — the vignette is a warning
 * to the person playing, not a running commentary on the opponent's state.
 */
export class DangerVignette {
  private scene: Phaser.Scene
  private graphics: Phaser.GameObjects.Graphics
  private currentIntensity = 0
  private pulsePhase = 0

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.graphics = scene.add.graphics().setScrollFactor(0).setDepth(140)
  }

  /** intensity in [0,1] — 0 hides the vignette entirely, 1 is the most
   *  urgent it gets. Call once per frame. */
  update(intensity: number, deltaMs: number) {
    this.currentIntensity = Phaser.Math.Linear(this.currentIntensity, intensity, 0.08)
    this.graphics.clear()
    if (this.currentIntensity <= 0.01) return

    this.pulsePhase += deltaMs * 0.006
    const pulse = 0.7 + Math.sin(this.pulsePhase) * 0.3
    const alpha = this.currentIntensity * 0.4 * pulse

    const w = this.scene.scale.width
    const h = this.scene.scale.height
    const thickness = Math.min(120, w * 0.09) * this.currentIntensity

    this.graphics.fillStyle(0x8a1a10, alpha)
    this.graphics.fillRect(0, 0, w, thickness)
    this.graphics.fillRect(0, h - thickness, w, thickness)
    this.graphics.fillRect(0, 0, thickness, h)
    this.graphics.fillRect(w - thickness, 0, thickness, h)
  }

  /** Snap the vignette off immediately (e.g. at the start of a fresh round)
   *  instead of letting it ease out over several frames. */
  hide() {
    this.currentIntensity = 0
    this.pulsePhase = 0
    this.graphics.clear()
  }

  destroy() {
    this.graphics.destroy()
  }
}
