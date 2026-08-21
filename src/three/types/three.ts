export type CameraMode = 'first-person' | 'third-person' | 'isometric' | 'free-camera' | 'target-camera'

export interface ThreeGameConfig {
  id: string
  slug: string
  cameraMode: CameraMode
  physicsEnabled: boolean
  shadowsEnabled: boolean
}

export interface ThreeGameInstance {
  initialize(): Promise<void>
  start(): void
  pause(): void
  resume(): void
  reset(): void
  dispose(): void
}

export interface ThreeNationalGame {
  config: ThreeGameConfig
  instance: ThreeGameInstance
}
