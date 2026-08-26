import * as Phaser from 'phaser'

/**
 * Tap-rhythm input: desktop (mouse click / Space / A key for a left-side
 * pull gesture, D key kept as an alternate pull key for players used to
 * A-D controls) and mobile (tap anywhere on the pull zone). Every input
 * source funnels into a single onPull(atMs) callback — the ForceEngine
 * doesn't care how the tap arrived, only when.
 */
export class InputManager {
  private scene: Phaser.Scene
  private clockMs = 0
  private spaceKey?: Phaser.Input.Keyboard.Key
  private aKey?: Phaser.Input.Keyboard.Key
  private dKey?: Phaser.Input.Keyboard.Key

  public onPull?: (atMs: number) => void
  public enabled = true

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    scene.input.on('pointerdown', this.handlePointer, this)

    if (scene.input.keyboard) {
      this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      this.aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
      this.dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
      this.spaceKey.on('down', this.handleKey, this)
      this.aKey.on('down', this.handleKey, this)
      this.dKey.on('down', this.handleKey, this)
    }
  }

  /** Call every frame with elapsed ms so timestamps line up with the
   *  ForceEngine's own round clock. */
  tick(deltaMs: number) {
    this.clockMs += deltaMs
  }

  private handlePointer() {
    if (!this.enabled) return
    this.onPull?.(this.clockMs)
  }

  private handleKey() {
    if (!this.enabled) return
    this.onPull?.(this.clockMs)
  }

  reset() {
    this.clockMs = 0
  }

  destroy() {
    this.scene.input.off('pointerdown', this.handlePointer, this)
    this.spaceKey?.off('down', this.handleKey, this)
    this.aKey?.off('down', this.handleKey, this)
    this.dKey?.off('down', this.handleKey, this)
  }
}
