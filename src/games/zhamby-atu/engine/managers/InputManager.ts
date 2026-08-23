import * as Phaser from 'phaser'

export class InputManager {
  private scene: Phaser.Scene
  
  public isDragging = false
  public dragStart = new Phaser.Math.Vector2()
  public dragVector = new Phaser.Math.Vector2()
  
  // Callbacks
  public onDragStart?: (pointer: Phaser.Input.Pointer) => void
  public onDragMove?: (dragVector: Phaser.Math.Vector2) => void
  public onDragEnd?: (dragVector: Phaser.Math.Vector2) => void

  constructor(scene: Phaser.Scene) {
    this.scene = scene

    this.scene.input.on('pointerdown', this.handlePointerDown, this)
    this.scene.input.on('pointermove', this.handlePointerMove, this)
    this.scene.input.on('pointerup', this.handlePointerUp, this)
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    this.isDragging = true
    this.dragStart.set(pointer.x, pointer.y)
    if (this.onDragStart) this.onDragStart(pointer)
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.isDragging) return
    
    // We want the vector from the pointer to the start position (like pulling a slingshot back)
    this.dragVector.set(this.dragStart.x - pointer.x, this.dragStart.y - pointer.y)
    
    // Soft Cap Power (Max Drag)
    const MAX_DRAG = 250
    if (this.dragVector.length() > MAX_DRAG) {
      // Scale down to max
      this.dragVector.normalize().scale(MAX_DRAG)
    }

    if (this.onDragMove) this.onDragMove(this.dragVector)
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer) {
    if (!this.isDragging) return
    this.isDragging = false

    this.dragVector.set(this.dragStart.x - pointer.x, this.dragStart.y - pointer.y)
    
    const MAX_DRAG = 250
    if (this.dragVector.length() > MAX_DRAG) {
      this.dragVector.normalize().scale(MAX_DRAG)
    }

    // Minimum drag threshold to prevent accidental taps firing
    if (this.dragVector.length() < 20) {
      if (this.onDragMove) this.onDragMove(new Phaser.Math.Vector2(0,0)) // reset
      return
    }

    if (this.onDragEnd) this.onDragEnd(this.dragVector)
  }
}
