import * as Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // Show a small loading text
    const w = this.scale.width
    const h = this.scale.height
    this.add.text(w/2, h/2, 'ЖҮКТЕЛУДЕ...', { fontSize: '24px', color: '#ffcc00' }).setOrigin(0.5)

    // Load actual SVG assets created as beautiful vector silhouettes
    this.load.image('rider', '/assets/zhamby-atu/rider.svg')
    this.load.image('arrow', '/assets/zhamby-atu/arrow.svg')
    this.load.image('target', '/assets/zhamby-atu/target.svg')
    this.load.image('mountains', '/assets/zhamby-atu/bg_mountains.svg')
    this.load.image('steppe', '/assets/zhamby-atu/bg_steppe.svg')

    // Generate Sky dynamically since it's just a gradient
    const skyTexture = this.textures.createCanvas('sky', 2, 256)
    if (skyTexture) {
      const ctx = skyTexture.getContext()
      const grd = ctx.createLinearGradient(0, 0, 0, 256)
      grd.addColorStop(0, '#2b5876') // Deep blue sunset sky
      grd.addColorStop(1, '#ffc371') // Golden hour horizon
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, 2, 256)
      skyTexture.refresh()
    }
  }

  create() {
    this.scene.start('MainScene')
  }
}
