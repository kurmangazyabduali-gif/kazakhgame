import * as Phaser from 'phaser'
import { PullQuality } from '../engine/types'

/**
 * One-shot particle bursts for Arqan Tartys — ground dust kicked up by a
 * pull, and a celebratory salute on round/match wins. Reuses the
 * `dustParticle` texture BootScene already loads (previously unused), so
 * this adds no new asset weight.
 *
 * Every burst is a throwaway emitter: explode() once, then destroy after
 * its particles have finished their lifespan — matches the disposable-burst
 * pattern already proven in this codebase (see zhamby-atu's confetti/spark
 * bursts) rather than keeping long-lived emitters around per character.
 */
export class ParticleFX {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /** Dust kicked up from a team's front foot when a pull lands — quantity
   *  and spread scale with quality so a PERFECT pull visibly kicks up more
   *  ground than a glancing EARLY/LATE tap. A MISS kicks up nothing; there
   *  was no real force behind it. */
  pullDust(x: number, y: number, quality: PullQuality) {
    if (quality === 'MISS') return

    const strength = quality === 'PERFECT' ? 1 : quality === 'GOOD' ? 0.6 : 0.32
    const quantity = Math.round(4 + strength * 10)
    const lifespan = 380 + strength * 220

    const emitter = this.scene.add.particles(x, y, 'dustParticle', {
      speed: { min: 20 + strength * 40, max: 60 + strength * 90 },
      angle: { min: 200, max: 340 },
      scale: { start: 0.35 + strength * 0.35, end: 0 },
      alpha: { start: 0.5, end: 0 },
      lifespan,
      quantity,
      gravityY: 60,
    }).setDepth(9)

    emitter.explode(quantity)
    this.scene.time.delayedCall(lifespan + 100, () => emitter.destroy())
  }

  /** Ornament-style victory salute — a radial burst of small tinted marks
   *  (reusing the same round dust sprite, so it reads as stylized confetti
   *  rather than a generic particle shower) at the winning team's position.
   *  `big` distinguishes a full match win from a single round win. */
  salute(x: number, y: number, big: boolean) {
    const colors = [0xd4af37, 0xf4e4c1, 0xc9a86a]
    const ringCount = big ? 3 : 1
    const perRing = big ? 22 : 14

    for (let ring = 0; ring < ringCount; ring++) {
      this.scene.time.delayedCall(ring * 90, () => {
        const emitter = this.scene.add.particles(x, y, 'dustParticle', {
          speed: { min: 120 + ring * 40, max: 260 + ring * 60 },
          angle: { min: 0, max: 360 },
          scale: { start: big ? 0.6 : 0.42, end: 0 },
          alpha: { start: 0.9, end: 0 },
          lifespan: big ? 1100 : 750,
          gravityY: 220,
          tint: colors,
          blendMode: 'ADD',
        }).setDepth(210)

        emitter.explode(perRing)
        this.scene.time.delayedCall((big ? 1100 : 750) + 100, () => emitter.destroy())
      })
    }
  }
}
