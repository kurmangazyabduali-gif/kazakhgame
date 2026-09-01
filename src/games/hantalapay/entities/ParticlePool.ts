import { FloatingParticle } from '../engine/types'

export class ParticlePoolEngine {
  private particles: FloatingParticle[] = []
  private maxParticles: number = 80

  public spawnDustParticles(width: number, height: number, count: number = 20) {
    if (this.particles.length >= this.maxParticles) return

    for (let i = 0; i < count; i++) {
      this.particles.push({
        id: `dust-${Math.random()}`,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        size: 1.5 + Math.random() * 2.5,
        color: '#D4AF37',
        alpha: 0.15 + Math.random() * 0.25,
        life: 0,
        maxLife: 3.0 + Math.random() * 3.0,
      })
    }
  }

  public spawnScorePopup(x: number, y: number, text: string, color: string = '#FFF3C4', scale: number = 1.0) {
    this.particles.push({
      id: `popup-${Math.random()}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 20,
      vy: -60 - Math.random() * 30,
      size: 16 * scale,
      color,
      alpha: 1.0,
      life: 0,
      maxLife: 1.2,
      text,
      scale,
    })
  }

  public spawnSparkles(x: number, y: number, color: string = '#D4AF37', count: number = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 40 + Math.random() * 120
      this.particles.push({
        id: `sparkle-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3,
        color,
        alpha: 1.0,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
      })
    }
  }

  public updateAndDraw(ctx: CanvasRenderingContext2D, dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life += dt
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1)
        continue
      }

      p.x += p.vx * dt
      p.y += p.vy * dt
      const lifePct = p.life / p.maxLife

      ctx.save()
      if (p.text) {
        // Render Floating Score Text
        const fadeAlpha = 1.0 - Math.pow(lifePct, 2)
        ctx.globalAlpha = Math.max(0, fadeAlpha)
        ctx.fillStyle = p.color
        ctx.strokeStyle = '#2A2621'
        ctx.lineWidth = 3
        ctx.font = `black ${Math.round(p.size)}px sans-serif`
        ctx.textAlign = 'center'
        ctx.strokeText(p.text, p.x, p.y)
        ctx.fillText(p.text, p.x, p.y)
      } else {
        // Render Sparkle / Dust Particle
        ctx.globalAlpha = Math.max(0, p.alpha * (1.0 - lifePct))
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }
  }

  public clear() {
    this.particles = []
  }
}

export const particlePool = new ParticlePoolEngine()
