import * as Phaser from 'phaser'
import {
  characterDataUri,
  CHARACTER_SIZE,
  TEAM_A_ROSTER,
  TEAM_B_ROSTER,
  PoseState,
} from '../characters/characterSvg'
import {
  mountainsDataUri,
  steppeDataUri,
  ornamentBannerDataUri,
  dustParticleDataUri,
  cloudsDataUri,
  ENV_SIZE,
  MOUNTAINS_SIZE,
  BANNER_SIZE,
  CLOUDS_SIZE,
} from './assets/environmentSvg'

const POSES: PoseState[] = ['IDLE', 'PULL', 'STRAIN', 'RECOVER', 'VICTORY', 'DEFEAT']

export function teamATextureKey(index: number, pose: PoseState): string {
  return `teamA_${index}_${pose}`
}
export function teamBTextureKey(index: number, pose: PoseState): string {
  return `teamB_${index}_${pose}`
}

export class BootScene extends Phaser.Scene {
  private startLevel = 1

  constructor() {
    super('BootScene')
  }

  init(data: { level?: number }) {
    // On the very first boot, Phaser auto-starts this scene with no init
    // data — the level is read from the registry instead (set by
    // getPhaserConfig's preBoot callback). A later explicit
    // scene.start('BootScene', { level }) call, if any, still takes
    // priority via the data argument.
    this.startLevel = data?.level ?? this.registry.get('startLevel') ?? 1
  }

  preload() {
    const loadingText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'ЖҮКТЕЛУДЕ...', {
      fontSize: '20px',
      color: '#3a2a10',
      fontFamily: 'Georgia, serif',
    }).setOrigin(0.5)

    this.load.on('progress', (value: number) => {
      loadingText.setText(`ЖҮКТЕЛУДЕ... ${Math.round(value * 100)}%`)
    })

    // Environment
    this.load.svg('mountains', mountainsDataUri(), MOUNTAINS_SIZE)
    this.load.svg('steppe', steppeDataUri(), ENV_SIZE)
    this.load.svg('bannerA', ornamentBannerDataUri('#d4af37'), BANNER_SIZE)
    this.load.svg('bannerB', ornamentBannerDataUri('#1a5c8c'), BANNER_SIZE)
    this.load.svg('dustParticle', dustParticleDataUri(), { width: 24, height: 24 })
    this.load.svg('clouds', cloudsDataUri(), CLOUDS_SIZE)

    // Team A characters (4 athletes x 6 pose states)
    TEAM_A_ROSTER.forEach((spec, i) => {
      POSES.forEach((pose) => {
        this.load.svg(teamATextureKey(i, pose), characterDataUri(spec, pose), CHARACTER_SIZE)
      })
    })

    // Team B characters
    TEAM_B_ROSTER.forEach((spec, i) => {
      POSES.forEach((pose) => {
        this.load.svg(teamBTextureKey(i, pose), characterDataUri(spec, pose), CHARACTER_SIZE)
      })
    })
  }

  create() {
    this.scene.start('MainScene', { level: this.startLevel })
  }
}
