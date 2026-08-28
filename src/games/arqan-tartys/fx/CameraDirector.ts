import * as Phaser from 'phaser'
import { ShakeSpec } from './JuiceRules'

/**
 * Owns every camera-level "feel" effect: a gentle lean toward whichever
 * side currently holds the rope advantage, a directional kick on strong
 * pulls (layered on top of Phaser's own randomized shake), hit-stop
 * freeze-frames, and match-winning slow-motion.
 *
 * Deliberately never touches camera zoom: most of this scene's HUD
 * (UIManager, RhythmMarker, popups, banners) is anchored with
 * setScrollFactor(0), which cancels camera *scroll* but NOT camera *zoom*
 * — zooming the main camera would blur/misalign that whole HUD layer. Pan
 * (scroll) is scroll-factor-safe, so every effect here works by scrolling,
 * never zooming.
 *
 * The hit-stop/slow-mo clock returned by beginFrame() is a SIMULATION-time
 * scale, not a rendering trick: callers must feed the returned value into
 * every sim-clock accumulator (ForceEngine.tick, InputManager.tick, the
 * round clock) so recorded pull timestamps stay internally consistent —
 * the server's match replay only cares about that simulation clock, never
 * real wall-clock duration, so scaling it uniformly is safe.
 */
export class CameraDirector {
  private scene: Phaser.Scene
  private camera: Phaser.Cameras.Scene2D.Camera

  private panX = 0
  private targetPanX = 0
  private kickOffsetX = 0

  private hitStopRemainingMs = 0
  private slowMoRemainingMs = 0
  private slowMoFactor = 1

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.camera = scene.cameras.main
  }

  /** Call once per real rendered frame, before advancing any simulation.
   *  Returns the ms of simulation time to advance this frame. */
  beginFrame(realDeltaMs: number): number {
    if (this.hitStopRemainingMs > 0) {
      this.hitStopRemainingMs = Math.max(0, this.hitStopRemainingMs - realDeltaMs)
      return 0
    }
    if (this.slowMoRemainingMs > 0) {
      this.slowMoRemainingMs = Math.max(0, this.slowMoRemainingMs - realDeltaMs)
      return realDeltaMs * this.slowMoFactor
    }
    return realDeltaMs
  }

  triggerHitStop(ms: number) {
    if (ms > 0) this.hitStopRemainingMs = Math.max(this.hitStopRemainingMs, ms)
  }

  triggerSlowMo(factor: number, realMs: number) {
    this.slowMoFactor = factor
    this.slowMoRemainingMs = realMs
  }

  /** Directional kick on top of Phaser's own randomized shake, so a strong
   *  Team A pull reads differently from a strong Team B pull rather than a
   *  generic omnidirectional rattle. */
  impulse(spec: ShakeSpec) {
    if (spec.durationMs <= 0 || spec.intensity <= 0) return
    this.kickOffsetX += spec.direction * spec.intensity * 900
    this.camera.shake(spec.durationMs, spec.intensity * 0.6)
  }

  /** Smoothly lean the view toward whichever side holds the advantage
   *  (ropeShare in [-1, 1]) and decay the directional kick. Call once per
   *  rendered frame regardless of hit-stop/slow-mo state. */
  update(ropeShare: number) {
    const w = this.scene.scale.width
    const maxLeanPx = Math.min(34, w * 0.022)
    this.targetPanX = Phaser.Math.Clamp(ropeShare, -1, 1) * maxLeanPx

    this.panX = Phaser.Math.Linear(this.panX, this.targetPanX, 0.05)
    this.kickOffsetX *= 0.82

    this.camera.setScroll(this.panX + this.kickOffsetX, 0)
  }

  reset() {
    this.hitStopRemainingMs = 0
    this.slowMoRemainingMs = 0
    this.slowMoFactor = 1
    this.panX = 0
    this.targetPanX = 0
    this.kickOffsetX = 0
    this.camera.setScroll(0, 0)
  }
}
