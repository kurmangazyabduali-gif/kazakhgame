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
      // RESIZE (not FIT) — the canvas tracks the container's actual pixel size
      // continuously instead of locking an aspect ratio at boot and letterboxing
      // with black bars whenever the viewport's aspect ratio differs (e.g. a
      // portrait phone vs. the desktop size the game happened to start at).
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.NO_CENTER,
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
