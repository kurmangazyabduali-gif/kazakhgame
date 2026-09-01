import { AsykItem } from '../engine/types'

export class AsykEntityRenderer {
  public drawAsyk(ctx: CanvasRenderingContext2D, item: AsykItem, isHighlighted: boolean = false) {
    if (item.isCollected && !item.isCollectingAnimation) return

    ctx.save()
    ctx.translate(item.x, item.y)

    // Handle pickup float-up animation
    if (item.isCollectingAnimation) {
      const p = item.collectProgress
      const scale = 1.0 + Math.sin(p * Math.PI) * 0.4 - p * 0.5
      ctx.scale(Math.max(0.1, scale), Math.max(0.1, scale))
      ctx.globalAlpha = Math.max(0, 1 - p * 0.9)
    } else {
      ctx.scale(item.scale, item.scale)
      ctx.globalAlpha = item.opacity
    }

    ctx.rotate(item.rotation)

    // 1. Drop shadow on felt carpet
    ctx.save()
    ctx.shadowColor = 'rgba(20, 10, 5, 0.45)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 4
    ctx.shadowOffsetY = 6

    // Base bone outline (stylized knuckle bone shape)
    const r = item.radius
    ctx.beginPath()
    ctx.moveTo(-r * 0.7, -r * 0.8)
    ctx.bezierCurveTo(-r * 1.1, -r * 0.3, -r * 1.0, r * 0.4, -r * 0.6, r * 0.85)
    ctx.bezierCurveTo(-r * 0.2, r * 1.0, r * 0.2, r * 1.0, r * 0.6, r * 0.85)
    ctx.bezierCurveTo(r * 1.0, r * 0.4, r * 1.1, -r * 0.3, r * 0.7, -r * 0.8)
    ctx.bezierCurveTo(r * 0.3, -r * 1.05, -r * 0.3, -r * 1.05, -r * 0.7, -r * 0.8)
    ctx.closePath()

    // Bone gradient fill
    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.2, 0, 0, r * 1.2)
    grad.addColorStop(0, '#FAF5ED')
    grad.addColorStop(0.5, item.colorHex)
    grad.addColorStop(1, '#9C8872')

    ctx.fillStyle = grad
    ctx.fill()
    ctx.restore()

    // 2. Bone ridges & grooves (Inner bone details for realistic look)
    ctx.strokeStyle = 'rgba(90, 70, 50, 0.35)'
    ctx.lineWidth = 1.8

    // Center groove (Алшы / Тәйке groove)
    ctx.beginPath()
    ctx.moveTo(-r * 0.25, -r * 0.5)
    ctx.bezierCurveTo(-r * 0.3, 0, -r * 0.2, r * 0.4, -r * 0.15, r * 0.5)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(r * 0.25, -r * 0.5)
    ctx.bezierCurveTo(r * 0.3, 0, r * 0.2, r * 0.4, r * 0.15, r * 0.5)
    ctx.stroke()

    // Top & bottom knuckle caps
    ctx.fillStyle = 'rgba(180, 160, 140, 0.4)'
    ctx.beginPath()
    ctx.ellipse(-r * 0.4, -r * 0.55, r * 0.2, r * 0.15, 0.3, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.ellipse(r * 0.4, -r * 0.55, r * 0.2, r * 0.15, -0.3, 0, Math.PI * 2)
    ctx.fill()

    // 3. Highlight pulse if idle hint active
    if (isHighlighted) {
      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.restore()
  }
}

export const asykRenderer = new AsykEntityRenderer()
