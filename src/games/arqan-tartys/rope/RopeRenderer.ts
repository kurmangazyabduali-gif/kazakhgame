import * as Phaser from 'phaser'
import { RopePhysics } from './RopePhysics'
import { TensionState, getTensionOffset } from './RopeTension'

/** Linear-interpolate two 0xRRGGBB colors by t in [0,1]. */
function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff
  const ag = (a >> 8) & 0xff
  const ab = a & 0xff
  const br = (b >> 16) & 0xff
  const bg = (b >> 8) & 0xff
  const bb = b & 0xff
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return (r << 16) | (g << 8) | bl
}

/**
 * Draws the RopePhysics chain as a thick tapered line with a visible
 * center marker. Pure Phaser.GameObjects.Graphics — redrawn every frame
 * since the rope shape changes continuously (no static texture makes
 * sense here). Strand color and a per-fiber "fray" wobble react to the
 * current tension amplitude so a strong pull is felt in the rope itself,
 * not only in the HUD/juice layers around it.
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

    // Tension "heat" — how hot/dangerous the rope currently reads, driven
    // by the same short-lived shake amplitude that drives the jitter above
    // (0 = resting, 1 = a strong pull just landed). Body and highlight
    // strands shift from their resting bronze/cream toward an ember
    // orange/gold as heat rises, so a big pull is felt in the rope's color
    // a beat before the HUD bars finish animating.
    const heat = Math.max(0, Math.min(1, tension.amplitude))
    const midColor = lerpColor(0x8a6a3c, 0xd4522a, heat)
    const highColor = lerpColor(0xc9a86a, 0xffd76a, heat)

    // Rope body — a soft shadow pass then the main tapered strand, so it
    // reads as a real twisted fiber rope rather than a flat line.
    this.graphics.lineStyle(9, 0x2a1c0e, 0.35)
    this.drawPolyline(points, 2, 2)

    this.graphics.lineStyle(7, midColor, 1)
    this.drawPolyline(points, 0, 0)

    // Above ~mid-heat, individual "fibers" fray out of sync with the main
    // strand — a fast, small, per-point wobble layered on top of the
    // shared jitter — so peak tension reads as the rope straining, not
    // just brighter.
    const frayAmount = Math.max(0, heat - 0.55)
    const highlightPoints = frayAmount > 0
      ? points.map((p, i) => ({
          x: p.x + Math.sin(tension.phase * 2.3 + i * 1.7) * frayAmount * 3.2,
          y: p.y,
        }))
      : points

    this.graphics.lineStyle(3, highColor, 0.8 + heat * 0.2)
    this.drawPolyline(highlightPoints, 0, -1)

    const mid = Math.floor(points.length / 2)
    const centerPoint = points[mid]
    this.centerMarker.setPosition(centerPoint.x, centerPoint.y)
    this.centerGlow.setPosition(centerPoint.x, centerPoint.y)
    this.centerGlow.setFillStyle(lerpColor(0xf4e4c1, 0xff8a3a, heat), 0.35)
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
