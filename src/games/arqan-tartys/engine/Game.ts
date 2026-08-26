import * as Phaser from 'phaser'
import { BootScene } from './BootScene'
import { MainScene } from './MainScene'

export function getPhaserConfig(parent: HTMLElement, startLevel = 1): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: parent.clientWidth || window.innerWidth,
    height: parent.clientHeight || window.innerHeight,
    scale: {
      // RESIZE, not FIT — tracks the container's actual pixel size so the
      // side-view composition (both teams + rope) never letterboxes on a
      // narrow mobile viewport, matching the fix already proven in
      // Zhamby Atu's Phaser scale config.
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.NO_CENTER,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    backgroundColor: '#e8b978',
    // BootScene auto-starts as the first scene in this list. It has no
    // init data at that point, so it reads the starting level from the
    // game registry instead (set below via the config's own callback,
    // which runs before the scene manager boots the first scene).
    scene: [BootScene, MainScene],
    pixelArt: false,
    antialias: true,
    roundPixels: false,
    callbacks: {
      preBoot: (game) => {
        game.registry.set('startLevel', startLevel)
      },
    },
  }
}
