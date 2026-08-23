import * as Phaser from 'phaser'

export class RiderEntity extends Phaser.GameObjects.Container {
  public horse: Phaser.GameObjects.Sprite
  public torso: Phaser.GameObjects.Image
  public bowIdle: Phaser.GameObjects.Image
  public bowDrawn: Phaser.GameObjects.Image
  public loadedArrow: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    // Horse (animated sprite)
    this.horse = scene.add.sprite(0, 0, 'horse_0')
    this.horse.setOrigin(0.5, 1)
    this.horse.setScale(1.2)
    this.horse.play('horse_gallop')

    // Torso
    this.torso = scene.add.image(-8, -75, 'rider_body')
    this.torso.setOrigin(0.5, 1)
    this.torso.setScale(0.8)

    // Bow (idle)
    this.bowIdle = scene.add.image(18, -105, 'bow_idle')
    this.bowIdle.setOrigin(0.5, 0.5)
    this.bowIdle.setScale(0.7)

    // Bow (drawn)
    this.bowDrawn = scene.add.image(18, -105, 'bow_drawn')
    this.bowDrawn.setOrigin(0.5, 0.5)
    this.bowDrawn.setScale(0.7)
    this.bowDrawn.setVisible(false)

    // Loaded arrow
    this.loadedArrow = scene.add.image(18, -105, 'arrow')
    this.loadedArrow.setOrigin(0.5, 0.5)
    this.loadedArrow.setScale(0.9)
    this.loadedArrow.setVisible(false)

    this.add([this.horse, this.torso, this.bowIdle, this.bowDrawn, this.loadedArrow])
    this.setDepth(8)           // Must be above steppe (3) and mountains (2)
    scene.add.existing(this)
  }

  setDrawPower(powerVector: Phaser.Math.Vector2) {
    const power = powerVector.length()
    
    // Switch bow state
    if (power > 20) {
      this.bowIdle.setVisible(false)
      this.bowDrawn.setVisible(true)
      this.loadedArrow.setVisible(true)
      
      // Calculate angle
      const angle = Math.atan2(powerVector.y, powerVector.x)
      
      this.bowDrawn.setRotation(angle)
      this.loadedArrow.setRotation(angle)
      this.torso.setRotation(angle * 0.3) // Rider leans slightly
      
      // Pull arrow back visually based on power
      const pullDist = Phaser.Math.Clamp(power * 0.1, 0, 30)
      this.loadedArrow.x = 20 - Math.cos(angle) * pullDist
      this.loadedArrow.y = -110 - Math.sin(angle) * pullDist

    } else {
      this.resetPose()
    }
  }

  resetPose() {
    this.bowIdle.setVisible(true)
    this.bowDrawn.setVisible(false)
    this.loadedArrow.setVisible(false)
    this.torso.setRotation(0)
    
    // Slight idle bob for bow
    this.bowIdle.setRotation(0)
  }
}
