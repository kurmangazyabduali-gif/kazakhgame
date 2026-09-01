import { AsykItem } from '../engine/types'

export class KhanEntityRenderer {
  public drawKhan(ctx: CanvasRenderingContext2D, item: AsykItem, timeSec: number) {
    if (item.isCollected && !item.isCollectingAnimation) return

    ctx.save()
    ctx.translate(item.x, item.y)

    // Handle pickup float-up animation
    if (item.isCollectingAnimation) {
      const p = item.collectProgress
      const scale = 1.2 + Math.sin(p * Math.PI) * 0.6 - p * 0.6
      ctx.scale(Math.max(0.1, scale), Math.max(0.1, scale))
      ctx.globalAlpha = Math.max(0, 1 - p * 0.9)
    } else {
      ctx.scale(item.scale, item.scale)
      ctx.globalAlpha = item.opacity
    }

    // 1. Royal Glowing Aura Pulsing Rings
    const pulse = Math.sin(timeSec * 6) * 4
    const r = item.radius

    ctx.save()
    ctx.shadowColor = 'rgba(212, 175, 55, 0.9)'
    ctx.shadowBlur = 20 + pulse
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(0, 0, r + 8 + pulse * 0.5, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // 2. Rotating Kazakh Gold Ornament Ring
    ctx.save()
    ctx.rotate(timeSec * 0.8)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)'
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    ctx.arc(0, 0, r + 14, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // 3. Drop Shadow & Base Bone Shape
    ctx.save()
    ctx.rotate(item.rotation)
    ctx.shadowColor = 'rgba(180, 50, 20, 0.6)'
    ctx.shadowBlur = 14
    ctx.shadowOffsetX = 4
    ctx.shadowOffsetY = 6

    ctx.beginPath()
    ctx.moveTo(-r * 0.7, -r * 0.8)
    ctx.bezierCurveTo(-r * 1.15, -r * 0.3, -r * 1.05, r * 0.4, -r * 0.65, r * 0.85)
    ctx.bezierCurveTo(-r * 0.2, r * 1.05, r * 0.2, r * 1.05, r * 0.65, r * 0.85)
    ctx.bezierCurveTo(r * 1.05, r * 0.4, r * 1.15, -r * 0.3, r * 0.7, -r * 0.8)
    ctx.bezierCurveTo(r * 0.3, -r * 1.05, -r * 0.3, -r * 1.05, -r * 0.7, -r * 0.8)
    ctx.closePath()

    // Royal Gold-Crimson Metallic Radial Gradient
    const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.3, r * 0.2, 0, 0, r * 1.3)
    grad.addColorStop(0, '#FFF3C4')
    grad.addColorStop(0.3, '#D4AF37')
    grad.addColorStop(0.7, '#B85D36')
    grad.addColorStop(1, '#662208')

    ctx.fillStyle = grad
    ctx.fill()
    ctx.restore()

    // 4. Gold Kazakh Ornament Emblem on Khan
    ctx.save()
    ctx.rotate(item.rotation)
    ctx.fillStyle = '#FFF3C4'
    ctx.strokeStyle = '#662208'
    ctx.lineWidth = 1

    // Central diamond ornament emblem
    ctx.beginPath()
    ctx.moveTo(0, -r * 0.45)
    ctx.lineTo(r * 0.35, 0)
    ctx.lineTo(0, r * 0.45)
    ctx.lineTo(-r * 0.35, 0)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // "ХАН" Gold Crown Badge
    ctx.fillStyle = '#662208'
    ctx.font = 'bold 9px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('ХАН', 0, 1)

    ctx.restore()

    ctx.restore()
  }
}

export const khanRenderer = new KhanEntityRenderer()
