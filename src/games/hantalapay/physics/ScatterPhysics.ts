import { AsykItem, AsykOrientation } from '../engine/types'

export class ScatterPhysicsEngine {
  private friction: number = 0.93 // carpet felt friction
  private wallRestitution: number = 0.65 // bouncing off carpet boundary
  private ballRestitution: number = 0.70 // asyk-to-asyk collision bouncing

  public createScatterAsyks(
    count: number,
    hasKhan: boolean,
    originX: number,
    originY: number,
    arenaWidth: number,
    arenaHeight: number,
    scatterForceMin: number,
    scatterForceMax: number
  ): AsykItem[] {
    const items: AsykItem[] = []
    const orientations: AsykOrientation[] = ['ALSHY', 'TAYKE', 'BUK', 'SHIK']
    const colors = ['#E2D5C3', '#D6C5B0', '#CDB89F', '#EBE1D3', '#C2B198']

    // Determine Khan index (if round has Khan)
    const khanIndex = hasKhan ? Math.floor(Math.random() * count) : -1

    for (let i = 0; i < count; i++) {
      const isKhan = i === khanIndex
      const angle = Math.random() * Math.PI * 2
      const speed = scatterForceMin + Math.random() * (scatterForceMax - scatterForceMin)
      const radius = isKhan ? 24 : 18 + Math.random() * 4

      // Spread initial positions slightly around scatter hand
      const initialOffsetX = (Math.random() - 0.5) * 30
      const initialOffsetY = (Math.random() - 0.5) * 30

      items.push({
        id: `asyk-${i}-${Date.now()}`,
        x: Math.max(radius + 20, Math.min(arenaWidth - radius - 20, originX + initialOffsetX)),
        y: Math.max(radius + 20, Math.min(arenaHeight - radius - 20, originY + initialOffsetY)),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 12,
        orientation: orientations[Math.floor(Math.random() * orientations.length)],
        isKhan,
        isCollected: false,
        isCollectingAnimation: false,
        collectProgress: 0,
        collectStartX: 0,
        collectStartY: 0,
        scale: 1.0,
        colorHex: isKhan ? '#D4AF37' : colors[i % colors.length],
        opacity: 1.0,
      })
    }

    return items
  }

  public stepPhysics(
    items: AsykItem[],
    dt: number,
    bounds: { width: number; height: number; margin: number }
  ): boolean {
    let anyActiveMovement = false

    // 1. Move and apply friction
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.isCollected) continue

      const speedSq = item.vx * item.vx + item.vy * item.vy
      if (speedSq > 0.01) {
        anyActiveMovement = true
        item.x += item.vx * dt
        item.y += item.vy * dt
        item.vx *= Math.pow(this.friction, dt * 60)
        item.vy *= Math.pow(this.friction, dt * 60)

        item.rotation += item.rotationSpeed * dt
        item.rotationSpeed *= Math.pow(this.friction, dt * 60)
      } else {
        item.vx = 0
        item.vy = 0
        item.rotationSpeed = 0
      }

      // Boundary bouncing
      const minX = bounds.margin + item.radius
      const maxX = bounds.width - bounds.margin - item.radius
      const minY = bounds.margin + item.radius
      const maxY = bounds.height - bounds.margin - item.radius

      if (item.x < minX) {
        item.x = minX
        item.vx = -item.vx * this.wallRestitution
      } else if (item.x > maxX) {
        item.x = maxX
        item.vx = -item.vx * this.wallRestitution
      }

      if (item.y < minY) {
        item.y = minY
        item.vy = -item.vy * this.wallRestitution
      } else if (item.y > maxY) {
        item.y = maxY
        item.vy = -item.vy * this.wallRestitution
      }
    }

    // 2. Inter-asyk elastic collisions
    for (let i = 0; i < items.length; i++) {
      const a = items[i]
      if (a.isCollected) continue

      for (let j = i + 1; j < items.length; j++) {
        const b = items[j]
        if (b.isCollected) continue

        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.hypot(dx, dy)
        const minDist = a.radius + b.radius

        if (dist < minDist && dist > 0.001) {
          anyActiveMovement = true
          // Overlap resolution
          const nx = dx / dist
          const ny = dy / dist
          const overlap = minDist - dist
          a.x -= nx * overlap * 0.5
          a.y -= ny * overlap * 0.5
          b.x += nx * overlap * 0.5
          b.y += ny * overlap * 0.5

          // Relative velocity calculation
          const rvx = b.vx - a.vx
          const rvy = b.vy - a.vy
          const velAlongNormal = rvx * nx + rvy * ny

          if (velAlongNormal < 0) {
            const impulse = -(1 + this.ballRestitution) * velAlongNormal * 0.5
            a.vx -= impulse * nx
            a.vy -= impulse * ny
            b.vx += impulse * nx
            b.vy += impulse * ny
          }
        }
      }
    }

    return anyActiveMovement
  }
}

export const scatterPhysics = new ScatterPhysicsEngine()
