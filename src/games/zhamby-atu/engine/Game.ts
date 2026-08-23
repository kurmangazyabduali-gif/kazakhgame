import * as Phaser from 'phaser'
import { BootScene } from './BootScene'
import { MainScene } from './MainScene'

export function getPhaserConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 900 },
        debug: process.env.NODE_ENV === 'development',
      }
    },
    backgroundColor: '#000000',
    scene: [BootScene, MainScene],
    pixelArt: false,
    antialias: true,
  }
}
