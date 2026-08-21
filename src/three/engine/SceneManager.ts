export class SceneManager {
  private activeSceneId: string | null = null

  public setScene(id: string) {
    this.activeSceneId = id
  }

  public getActiveScene() {
    return this.activeSceneId
  }

  public clear() {
    this.activeSceneId = null
  }
}

export const sceneManager = new SceneManager()
