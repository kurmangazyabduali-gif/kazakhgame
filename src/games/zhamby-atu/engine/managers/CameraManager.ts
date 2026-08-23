import * as Phaser from 'phaser'

export class CameraManager {
  private scene: Phaser.Scene
  private mainCamera: Phaser.Cameras.Scene2D.Camera
  
  private followTarget: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | null = null
  private defaultScrollX: number = 0
  
  private isFollowingArrow = false

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.mainCamera = scene.cameras.main
  }

  // Called when riding normally
  updateRiding(scrollX: number) {
    if (!this.isFollowingArrow) {
      this.defaultScrollX = scrollX
      this.mainCamera.scrollX = scrollX
    }
  }

  followArrow(arrow: Phaser.GameObjects.Image) {
    this.isFollowingArrow = true
    this.followTarget = arrow
    
    // Smoothly pan camera to start tracking the arrow
    this.mainCamera.startFollow(arrow, false, 0.1, 0.1, -this.scene.scale.width * 0.2, 0)
  }

  returnToRider() {
    this.isFollowingArrow = false
    this.followTarget = null
    this.mainCamera.stopFollow()

    // Smooth return to default scroll X
    this.scene.tweens.add({
      targets: this.mainCamera,
      scrollX: this.defaultScrollX,
      duration: 600,
      ease: 'Sine.easeOut'
    })
  }
}
