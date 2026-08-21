import { ThreeGameConfig, ThreeGameInstance } from '../types/three'
import { sceneManager } from './SceneManager'

export class ThreeGameEngine {
  private activeInstance: ThreeGameInstance | null = null
  private config: ThreeGameConfig | null = null
  private isPaused: boolean = false

  public async loadGame(config: ThreeGameConfig, instance: ThreeGameInstance) {
    if (this.activeInstance) {
      await this.unloadCurrentGame()
    }

    this.config = config
    this.activeInstance = instance
    sceneManager.setScene(config.slug)

    await this.activeInstance.initialize()
    this.activeInstance.start()
  }

  public pause() {
    if (this.activeInstance && !this.isPaused) {
      this.isPaused = true
      this.activeInstance.pause()
    }
  }

  public resume() {
    if (this.activeInstance && this.isPaused) {
      this.isPaused = false
      this.activeInstance.resume()
    }
  }

  public async unloadCurrentGame() {
    if (this.activeInstance) {
      this.activeInstance.dispose()
      this.activeInstance = null
      this.config = null
      this.isPaused = false
      sceneManager.clear()
    }
  }

  public getConfig() {
    return this.config
  }
}

export const threeGameEngine = new ThreeGameEngine()
