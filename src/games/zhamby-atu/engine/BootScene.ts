import * as Phaser from 'phaser'
import { horseFrameDataUri, HORSE_SIZE } from './assets/horseSvg'
import { riderIdleDataUri, riderDrawDataUri, riderReleaseDataUri, RIDER_SIZE } from './assets/riderSvg'
import { poleDataUri, jambyDiscDataUri, decoyDiscDataUri, POLE_SIZE, DISC_SIZE } from './assets/targetSvg'
import { mountainsDataUri, steppeDataUri, foregroundGrassDataUri, MOUNTAINS_SIZE, STEPPE_SIZE, GRASS_SIZE } from './assets/environmentSvg'
import { arrowDataUri, windFlagDataUri, birdDataUri, ARROW_SIZE, WIND_FLAG_SIZE, BIRD_SIZE } from './assets/propsSvg'

export class BootScene extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text

  constructor() {
    super('BootScene')
  }

  preload() {
    const w = this.scale.width
    const h = this.scale.height
    this.loadingText = this.add.text(w / 2, h / 2, 'ЖҮКТЕЛУДЕ...', {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Horse gallop cycle — 4 frames, hand-authored SVG anatomy rasterized at load time.
    this.load.svg('horse_0', horseFrameDataUri(0), HORSE_SIZE)
    this.load.svg('horse_1', horseFrameDataUri(0.25), HORSE_SIZE)
    this.load.svg('horse_2', horseFrameDataUri(0.5), HORSE_SIZE)
    this.load.svg('horse_3', horseFrameDataUri(0.75), HORSE_SIZE)

    // Rider — three whole-pose textures instead of layered torso+bow+arrow sprites.
    this.load.svg('rider_idle', riderIdleDataUri(), RIDER_SIZE)
    this.load.svg('rider_draw', riderDrawDataUri(), RIDER_SIZE)
    this.load.svg('rider_release', riderReleaseDataUri(), RIDER_SIZE)

    // Arrow
    this.load.svg('arrow', arrowDataUri(), ARROW_SIZE)

    // Jamby target — pole/crossbar/rope and disc are now separate textures so
    // the disc can swing independently under physics.
    this.load.svg('target_pole', poleDataUri(), POLE_SIZE)
    this.load.svg('target_disc', jambyDiscDataUri(), DISC_SIZE)
    this.load.svg('target_disc_decoy', decoyDiscDataUri(), DISC_SIZE)

    // Environment — mountains loaded per time-of-day tint (baked palette, not runtime setTint)
    this.load.svg('mountains_day', mountainsDataUri('day'), MOUNTAINS_SIZE)
    this.load.svg('mountains_sunset', mountainsDataUri('sunset'), MOUNTAINS_SIZE)
    this.load.svg('mountains_night', mountainsDataUri('night'), MOUNTAINS_SIZE)
    this.load.svg('steppe', steppeDataUri(), STEPPE_SIZE)
    this.load.svg('fg_grass', foregroundGrassDataUri(), GRASS_SIZE)

    // Props
    this.load.svg('bird', birdDataUri(), BIRD_SIZE)
    this.load.svg('wind_flag', windFlagDataUri(), WIND_FLAG_SIZE)

    this.load.on('progress', (value: number) => {
      this.loadingText.setText(`ЖҮКТЕЛУДЕ... ${Math.round(value * 100)}%`)
    })
  }

  create() {
    this._generateSkies()
    this._generateParticle()
    this._generateDustParticle()
    this._generateShadowBlob()

    this.anims.create({
      key: 'horse_gallop',
      frames: [
        { key: 'horse_0' },
        { key: 'horse_1' },
        { key: 'horse_2' },
        { key: 'horse_3' },
      ],
      frameRate: 14,
      repeat: -1,
    })

    this.scene.start('MainScene')
  }

  private _generateSkies() {
    const makeGrad = (key: string, stops: [number, string][]) => {
      const tex = this.textures.createCanvas(key, 4, 512)!
      const ctx = tex.getContext()
      const g = ctx.createLinearGradient(0, 0, 0, 512)
      stops.forEach(([t, c]) => g.addColorStop(t, c))
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 4, 512)
      tex.refresh()
    }
    makeGrad('sky_day', [[0, '#1a78c8'], [0.5, '#5bb8f5'], [1, '#e8f4fd']])
    makeGrad('sky_sunset', [[0, '#0d1b3e'], [0.4, '#7b2d8b'], [0.7, '#e8600a'], [1, '#f5c842']])
    makeGrad('sky_night', [[0, '#020818'], [0.5, '#0a1535'], [1, '#0d2040']])
  }

  private _generateParticle() {
    const tex = this.textures.createCanvas('particle', 16, 16)!
    const ctx = tex.getContext()
    const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
    g.addColorStop(0, 'rgba(255,220,80,1)')
    g.addColorStop(0.4, 'rgba(255,150,30,0.8)')
    g.addColorStop(1, 'rgba(255,80,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 16, 16)
    tex.refresh()
  }

  private _generateDustParticle() {
    const tex = this.textures.createCanvas('dust_particle', 16, 16)!
    const ctx = tex.getContext()
    const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
    g.addColorStop(0, 'rgba(220,190,140,0.9)')
    g.addColorStop(0.5, 'rgba(190,160,110,0.5)')
    g.addColorStop(1, 'rgba(190,160,110,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 16, 16)
    tex.refresh()
  }

  private _generateShadowBlob() {
    const tex = this.textures.createCanvas('shadow_blob', 40, 14)!
    const ctx = tex.getContext()
    const g = ctx.createRadialGradient(20, 7, 0, 20, 7, 20)
    g.addColorStop(0, 'rgba(0,0,0,0.35)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(20, 7, 20, 7, 0, 0, Math.PI * 2)
    ctx.fill()
    tex.refresh()
  }
}
