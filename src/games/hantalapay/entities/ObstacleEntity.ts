import { ObstacleItem } from '../engine/types'

export class ObstacleEntityRenderer {
  public drawObstacle(ctx: CanvasRenderingContext2D, item: ObstacleItem) {
    ctx.save()
    ctx.translate(item.x, item.y)
    ctx.rotate(item.rotation)

    const r = item.radius

    if (item.type === 'COIN') {
      // Ancient Kazakh Silver Coin (Күміс теңге)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
      ctx.shadowBlur = 8
      ctx.shadowOffsetX = 3
      ctx.shadowOffsetY = 4

      const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.2, 0, 0, r)
      grad.addColorStop(0, '#FFFFFF')
      grad.addColorStop(0.6, '#B0B5BC')
      grad.addColorStop(1, '#626770')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fill()

      // Inner coin rim & square hole
      ctx.strokeStyle = '#4A4E54'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = '#303337'
      ctx.fillRect(-r * 0.25, -r * 0.25, r * 0.5, r * 0.5)

    } else if (item.type === 'COASTER') {
      // Traditional Felt Coaster (Кігіз ою)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 3

      ctx.fillStyle = '#8B261D'
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = '#D4AF37'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2)
      ctx.stroke()

    } else {
      // Steppe Pebble (Тас)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 6
      ctx.shadowOffsetX = 3
      ctx.shadowOffsetY = 4

      const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.2, 0, 0, r)
      grad.addColorStop(0, '#8E857B')
      grad.addColorStop(1, '#4A433B')

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(0, 0, r, r * 0.75, 0.4, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}

export const obstacleRenderer = new ObstacleEntityRenderer()
