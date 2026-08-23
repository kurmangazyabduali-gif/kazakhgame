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
    this.load.image('rider_torso', '/assets/zhamby-atu/sprites/rider_torso.svg')
    this.load.image('bow_idle', '/assets/zhamby-atu/sprites/bow_idle.svg')
    this.load.image('bow_drawn', '/assets/zhamby-atu/sprites/bow_drawn.svg')
    
    // Load horse animation frames
    this.load.image('horse_run_0', '/assets/zhamby-atu/sprites/horse_run_0.svg')
    this.load.image('horse_run_1', '/assets/zhamby-atu/sprites/horse_run_1.svg')
    this.load.image('horse_run_2', '/assets/zhamby-atu/sprites/horse_run_2.svg')
    this.load.image('horse_run_3', '/assets/zhamby-atu/sprites/horse_run_3.svg')

    this.load.image('arrow', '/assets/zhamby-atu/arrow.svg')
    this.load.image('target', '/assets/zhamby-atu/target.svg')
    this.load.image('mountains', '/assets/zhamby-atu/bg_mountains.svg')
    this.load.image('steppe', '/assets/zhamby-atu/bg_steppe.svg')

    // Generate Sky dynamically
    const generateSky = (key: string, top: string, bottom: string) => {
      const skyTexture = this.textures.createCanvas(key, 2, 256)
      if (skyTexture) {
        const ctx = skyTexture.getContext()
        const grd = ctx.createLinearGradient(0, 0, 0, 256)
        grd.addColorStop(0, top)
        grd.addColorStop(1, bottom)
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, 2, 256)
        skyTexture.refresh()
      }
    }

    generateSky('sky_day', '#4facfe', '#fdfbfb')
    generateSky('sky_sunset', '#2b5876', '#ffc371')
    generateSky('sky_night', '#0f2027', '#203a43')
  }

  create() {
    this.anims.create({
      key: 'horse_gallop',
      frames: [
        { key: 'horse_run_0' },
        { key: 'horse_run_1' },
        { key: 'horse_run_2' },
        { key: 'horse_run_3' }
      ],
      frameRate: 12,
      repeat: -1
    })

    this.scene.start('MainScene')
  }
}
