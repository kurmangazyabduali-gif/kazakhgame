import * as Phaser from 'phaser'
import { BootScene } from './BootScene'
import { MainScene } from './MainScene'

export function getPhaserConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: parent.clientWidth || window.innerWidth,
    height: parent.clientHeight || window.innerHeight,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 900 },
        debug: false,   // Always off — was causing pink hitbox rectangles
      }
    },
    backgroundColor: '#1a78c8',
    scene: [BootScene, MainScene],
    pixelArt: false,
    antialias: true,
    roundPixels: false,
  }
}
