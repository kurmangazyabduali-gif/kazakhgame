import * as Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // Generate procedural assets
    const graphics = this.add.graphics()
    
    // 1. Sky Gradient
    const skyTexture = this.textures.createCanvas('sky', 2, 256)
    if (skyTexture) {
      const ctx = skyTexture.getContext()
      const grd = ctx.createLinearGradient(0, 0, 0, 256)
      grd.addColorStop(0, '#4facfe') // Blue sky top
      grd.addColorStop(1, '#f5e4bd') // Warm horizon
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, 2, 256)
      skyTexture.refresh()
    }

    // 2. Mountains (procedural polygon)
    graphics.clear()
    graphics.fillStyle(0x8b7355, 1)
    graphics.beginPath()
    graphics.moveTo(0, 200)
    graphics.lineTo(100, 50)
    graphics.lineTo(200, 150)
    graphics.lineTo(300, 20)
    graphics.lineTo(400, 200)
    graphics.closePath()
    graphics.fillPath()
    graphics.generateTexture('mountains', 400, 200)

    // 3. Steppe Grass
    graphics.clear()
    graphics.fillStyle(0xd4af37, 1) // Golden grass
    graphics.fillRect(0, 0, 1024, 200)
    graphics.fillStyle(0xb38b22, 1) // Darker grass details
    for (let i = 0; i < 50; i++) {
      graphics.fillRect(Math.random() * 1024, Math.random() * 200, 4, 10)
    }
    graphics.generateTexture('steppe', 1024, 200)

    // 4. Rider/Horse Box (Placeholder)
    graphics.clear()
    graphics.fillStyle(0x4a3b32, 1) // Dark brown horse
    graphics.fillRoundedRect(0, 20, 100, 60, 10) // Horse body
    graphics.fillRoundedRect(80, 0, 30, 40, 5) // Horse head
    graphics.fillStyle(0x8b2500, 1) // Rider
    graphics.fillRect(30, -30, 20, 50) 
    graphics.generateTexture('rider', 120, 100)

    // 5. Arrow
    graphics.clear()
    graphics.lineStyle(4, 0x5c4033) // Shaft
    graphics.beginPath()
    graphics.moveTo(0, 5)
    graphics.lineTo(40, 5)
    graphics.strokePath()
    graphics.fillStyle(0xcccccc, 1) // Head
    graphics.fillTriangle(40, 0, 50, 5, 40, 10)
    graphics.fillStyle(0xffffff, 1) // Feather
    graphics.fillRect(0, 2, 10, 6)
    graphics.generateTexture('arrow', 50, 10)

    // 6. Jamby Target
    graphics.clear()
    graphics.lineStyle(6, 0x3e2723) // Pole
    graphics.beginPath()
    graphics.moveTo(50, 0)
    graphics.lineTo(50, 200)
    graphics.strokePath()
    graphics.fillStyle(0xffd700, 1) // Gold Jamby plate
    graphics.fillCircle(50, 40, 30)
    graphics.fillStyle(0xffffff, 1) // Inner silver/white
    graphics.fillCircle(50, 40, 15)
    graphics.generateTexture('target', 100, 200)
    
    // Clean up graphics
    graphics.destroy()
  }

  create() {
    this.scene.start('MainScene')
  }
}
