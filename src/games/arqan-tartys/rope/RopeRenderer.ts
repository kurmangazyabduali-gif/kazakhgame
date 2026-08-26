import * as Phaser from 'phaser'
import { RopePhysics } from './RopePhysics'
import { TensionState, getTensionOffset } from './RopeTension'

/**
 * Draws the RopePhysics chain as a thick tapered line with a visible
 * center marker. Pure Phaser.GameObjects.Graphics — redrawn every frame
 * since the rope shape changes continuously (no static texture makes
 * sense here).
 */
export class RopeRenderer {
  private scene: Phaser.Scene
  private graphics: Phaser.GameObjects.Graphics
  private centerMarker: Phaser.GameObjects.Arc
  private centerGlow: Phaser.GameObjects.Arc

  constructor(scene: Phaser.Scene, depth = 20) {
    this.scene = scene
    this.graphics = scene.add.graphics().setDepth(depth)
    this.centerGlow = scene.add.circle(0, 0, 14, 0xf4e4c1, 0.35).setDepth(depth + 1)
    this.centerMarker = scene.add.circle(0, 0, 7, 0xd4af37).setStrokeStyle(2, 0x3a2a10, 0.8).setDepth(depth + 2)
  }

  render(rope: RopePhysics, tension: TensionState) {
    this.graphics.clear()

    const points = rope.points.map((p, i) => {
      const jitter = getTensionOffset(tension, i, rope.points.length)
      return { x: p.x + jitter.x, y: p.y + jitter.y }
    })

    // Rope body — a soft shadow pass then the main tapered strand, so it
    // reads as a real twisted fiber rope rather than a flat line.
    this.graphics.lineStyle(9, 0x2a1c0e, 0.35)
    this.drawPolyline(points, 2, 2)

    this.graphics.lineStyle(7, 0x8a6a3c, 1)
    this.drawPolyline(points, 0, 0)

    this.graphics.lineStyle(3, 0xc9a86a, 0.8)
    this.drawPolyline(points, 0, -1)

    const mid = Math.floor(points.length / 2)
    const centerPoint = points[mid]
    this.centerMarker.setPosition(centerPoint.x, centerPoint.y)
    this.centerGlow.setPosition(centerPoint.x, centerPoint.y)
    const pulse = 1 + Math.sin(tension.phase * 0.5) * tension.amplitude * 0.15
    this.centerMarker.setScale(pulse)
  }

  private drawPolyline(points: { x: number; y: number }[], offX: number, offY: number) {
    if (points.length < 2) return
    this.graphics.beginPath()
    this.graphics.moveTo(points[0].x + offX, points[0].y + offY)
    for (let i = 1; i < points.length; i++) {
      this.graphics.lineTo(points[i].x + offX, points[i].y + offY)
    }
    this.graphics.strokePath()
  }

  destroy() {
    this.graphics.destroy()
    this.centerMarker.destroy()
    this.centerGlow.destroy()
  }
}
