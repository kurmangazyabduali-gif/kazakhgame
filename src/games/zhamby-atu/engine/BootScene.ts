import * as Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    const w = this.scale.width
    const h = this.scale.height
    this.add.text(w / 2, h / 2, 'ЖҮКТЕЛУДЕ...', {
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5)
  }

  create() {
    this._generateSkies()
    this._generateHorseFrames()
    this._generateRider()
    this._generateBow()
    this._generateArrow()
    this._generateTarget()
    this._generateMountains()
    this._generateSteppe()
    this._generateParticle()

    // Particles for impact effects — also update ArrowManager to use 'particle'
    this.anims.create({
      key: 'horse_gallop',
      frames: [
        { key: 'horse_0' },
        { key: 'horse_1' },
        { key: 'horse_2' },
        { key: 'horse_3' },
      ],
      frameRate: 14,
      repeat: -1,
    })

    this.scene.start('MainScene')
  }

  private _generateSkies() {
    const makeGrad = (key: string, stops: [number, string][]) => {
      const tex = this.textures.createCanvas(key, 4, 512)!
      const ctx = tex.getContext()
      const g = ctx.createLinearGradient(0, 0, 0, 512)
      stops.forEach(([t, c]) => g.addColorStop(t, c))
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 4, 512)
      tex.refresh()
    }
    makeGrad('sky_day', [[0, '#1a78c8'], [0.5, '#5bb8f5'], [1, '#e8f4fd']])
    makeGrad('sky_sunset', [[0, '#0d1b3e'], [0.4, '#7b2d8b'], [0.7, '#e8600a'], [1, '#f5c842']])
    makeGrad('sky_night', [[0, '#020818'], [0.5, '#0a1535'], [1, '#0d2040']])
  }

  private _generateHorseFrames() {
    const W = 200, H = 160

    const draw = (key: string, legPhase: number) => {
      const tex = this.textures.createCanvas(key, W, H)!
      const ctx = tex.getContext()

      const drawHorse = (lp: number) => {
        ctx.clearRect(0, 0, W, H)

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)'
        ctx.beginPath()
        ctx.ellipse(100, H - 10, 70, 12, 0, 0, Math.PI * 2)
        ctx.fill()

        // Body gradient
        const bodyGrad = ctx.createRadialGradient(95, 85, 10, 95, 85, 70)
        bodyGrad.addColorStop(0, '#8b6347')
        bodyGrad.addColorStop(0.5, '#5c3d22')
        bodyGrad.addColorStop(1, '#3a2010')
        ctx.fillStyle = bodyGrad

        // Main body
        ctx.beginPath()
        ctx.moveTo(30, 100)
        ctx.bezierCurveTo(25, 70, 40, 55, 80, 50)
        ctx.bezierCurveTo(120, 45, 155, 48, 165, 60)
        ctx.bezierCurveTo(175, 72, 170, 95, 160, 105)
        ctx.bezierCurveTo(130, 115, 70, 115, 30, 100)
        ctx.fill()

        // Neck
        const neckGrad = ctx.createLinearGradient(130, 55, 155, 30)
        neckGrad.addColorStop(0, '#6b4c30')
        neckGrad.addColorStop(1, '#4a2e18')
        ctx.fillStyle = neckGrad
        ctx.beginPath()
        ctx.moveTo(135, 55)
        ctx.bezierCurveTo(140, 35, 150, 20, 158, 15)
        ctx.bezierCurveTo(165, 10, 172, 18, 168, 30)
        ctx.bezierCurveTo(162, 45, 148, 55, 140, 60)
        ctx.fill()

        // Head
        const headGrad = ctx.createLinearGradient(155, 10, 185, 45)
        headGrad.addColorStop(0, '#7a5535')
        headGrad.addColorStop(1, '#4a2e18')
        ctx.fillStyle = headGrad
        ctx.beginPath()
        ctx.moveTo(158, 15)
        ctx.bezierCurveTo(162, 5, 175, 5, 182, 12)
        ctx.bezierCurveTo(188, 20, 186, 38, 178, 45)
        ctx.bezierCurveTo(170, 52, 158, 48, 155, 40)
        ctx.bezierCurveTo(152, 32, 154, 22, 158, 15)
        ctx.fill()

        // Nostril
        ctx.fillStyle = '#2a1408'
        ctx.beginPath()
        ctx.ellipse(178, 40, 4, 3, 0.3, 0, Math.PI * 2)
        ctx.fill()

        // Eye
        ctx.fillStyle = '#1a0f05'
        ctx.beginPath()
        ctx.arc(172, 22, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.beginPath()
        ctx.arc(173, 21, 1.5, 0, Math.PI * 2)
        ctx.fill()

        // Ear
        ctx.fillStyle = '#4a2e18'
        ctx.beginPath()
        ctx.moveTo(166, 8)
        ctx.lineTo(160, -2)
        ctx.lineTo(158, 8)
        ctx.fill()

        // Mane
        ctx.fillStyle = '#1a0a00'
        for (let i = 0; i < 6; i++) {
          const mx = 140 - i * 8
          const my = 35 - i * 2
          ctx.beginPath()
          ctx.moveTo(mx + 5, my - 5)
          ctx.bezierCurveTo(mx, my - 15, mx - 10, my - 10, mx - 5, my + 5)
          ctx.bezierCurveTo(mx + 2, my + 2, mx + 8, my - 2, mx + 5, my - 5)
          ctx.fill()
        }

        // Saddle
        const saddleGrad = ctx.createLinearGradient(90, 50, 120, 80)
        saddleGrad.addColorStop(0, '#8b1a0a')
        saddleGrad.addColorStop(1, '#5a0f05')
        ctx.fillStyle = saddleGrad
        ctx.beginPath()
        ctx.moveTo(90, 53)
        ctx.bezierCurveTo(105, 48, 125, 50, 135, 57)
        ctx.bezierCurveTo(132, 68, 115, 72, 95, 70)
        ctx.bezierCurveTo(88, 67, 88, 60, 90, 53)
        ctx.fill()

        // Saddle detail
        ctx.strokeStyle = '#c0392b'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(95, 52)
        ctx.bezierCurveTo(110, 49, 128, 52, 133, 58)
        ctx.stroke()

        // Legs — using phase offset for gallop animation
        const legPositions = [
          // [frontLeft, frontRight, backLeft, backRight] ankle angles
          { fl: lp * 40, fr: -lp * 35, bl: -lp * 40, br: lp * 35 },
        ][0]

        const drawLeg = (ox: number, oy: number, angle1: number, light: boolean) => {
          ctx.strokeStyle = light ? '#6b4c30' : '#3a2010'
          ctx.lineWidth = 11
          ctx.lineCap = 'round'

          const a1 = (angle1 * Math.PI) / 180
          const kx = ox + Math.sin(a1) * 40
          const ky = oy + Math.cos(a1) * 40
          const hx = kx + Math.sin(a1 * 0.5) * 35
          const hy = ky + Math.cos(a1 * 0.5) * 35

          ctx.beginPath()
          ctx.moveTo(ox, oy)
          ctx.lineTo(kx, ky)
          ctx.stroke()

          ctx.lineWidth = 9
          ctx.beginPath()
          ctx.moveTo(kx, ky)
          ctx.lineTo(hx, hy)
          ctx.stroke()

          // Hoof
          ctx.fillStyle = '#1a0f05'
          ctx.beginPath()
          ctx.ellipse(hx, hy + 4, 9, 6, (a1 * 0.3), 0, Math.PI * 2)
          ctx.fill()
        }

        // Back legs (darker)
        drawLeg(70, 108, legPhase * -35, false)
        drawLeg(90, 112, legPhase * 35, false)
        // Front legs (lighter)
        drawLeg(130, 105, legPhase * 40, true)
        drawLeg(150, 108, legPhase * -40, true)

        // Tail
        ctx.strokeStyle = '#1a0a00'
        ctx.lineWidth = 8
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(32, 88)
        ctx.bezierCurveTo(15, 80 + lp * 10, 5, 100 + lp * 5, 10, 120 + lp * 8)
        ctx.stroke()
        ctx.lineWidth = 4
        ctx.strokeStyle = '#2a1408'
        ctx.beginPath()
        ctx.moveTo(32, 88)
        ctx.bezierCurveTo(20, 85 + lp * 8, 0, 95 + lp * 10, 5, 118 + lp * 6)
        ctx.stroke()
      }

      drawHorse(legPhase)
      tex.refresh()
    }

    draw('horse_0', 0)
    draw('horse_1', 0.7)
    draw('horse_2', 1)
    draw('horse_3', 0.3)
  }

  private _generateRider() {
    const W = 90, H = 130
    const tex = this.textures.createCanvas('rider_body', W, H)!
    const ctx = tex.getContext()

    // Boots
    ctx.fillStyle = '#1a0a00'
    ctx.beginPath()
    ctx.roundRect(15, 100, 22, 28, 5)
    ctx.fill()
    ctx.beginPath()
    ctx.roundRect(45, 100, 22, 28, 5)
    ctx.fill()

    // Trousers
    ctx.fillStyle = '#1a2e5a'
    ctx.beginPath()
    ctx.moveTo(12, 75)
    ctx.lineTo(35, 75)
    ctx.lineTo(35, 105)
    ctx.lineTo(12, 105)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(40, 75)
    ctx.lineTo(68, 75)
    ctx.lineTo(68, 105)
    ctx.lineTo(40, 105)
    ctx.fill()

    // Kamzol (vest) body
    const vestGrad = ctx.createLinearGradient(10, 30, 70, 80)
    vestGrad.addColorStop(0, '#8b1a0a')
    vestGrad.addColorStop(0.5, '#6b1208')
    vestGrad.addColorStop(1, '#4a0d05')
    ctx.fillStyle = vestGrad
    ctx.beginPath()
    ctx.moveTo(15, 45)
    ctx.bezierCurveTo(10, 50, 8, 65, 10, 80)
    ctx.lineTo(70, 80)
    ctx.bezierCurveTo(72, 65, 70, 50, 65, 45)
    ctx.bezierCurveTo(55, 35, 25, 35, 15, 45)
    ctx.fill()

    // Gold trim on vest
    ctx.strokeStyle = '#d4af37'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(15, 45)
    ctx.bezierCurveTo(10, 50, 8, 65, 10, 80)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(65, 45)
    ctx.bezierCurveTo(70, 50, 72, 65, 70, 80)
    ctx.stroke()

    // Arms
    ctx.fillStyle = '#6b3818'
    // Right arm drawing bow
    ctx.beginPath()
    ctx.moveTo(60, 48)
    ctx.bezierCurveTo(72, 44, 80, 38, 82, 28)
    ctx.bezierCurveTo(80, 36, 76, 44, 70, 50)
    ctx.fill()
    // Left arm holding bow
    ctx.beginPath()
    ctx.moveTo(20, 48)
    ctx.bezierCurveTo(8, 44, 2, 38, 0, 28)
    ctx.bezierCurveTo(2, 36, 8, 44, 18, 50)
    ctx.fill()

    // Head - face
    const faceGrad = ctx.createRadialGradient(40, 22, 2, 40, 22, 18)
    faceGrad.addColorStop(0, '#e8b87a')
    faceGrad.addColorStop(1, '#c8945a')
    ctx.fillStyle = faceGrad
    ctx.beginPath()
    ctx.arc(40, 22, 17, 0, Math.PI * 2)
    ctx.fill()

    // Beard stubble
    ctx.fillStyle = '#7a5535'
    ctx.beginPath()
    ctx.arc(40, 30, 10, 0.2, Math.PI - 0.2)
    ctx.fill()

    // Eyes
    ctx.fillStyle = '#1a0a00'
    ctx.beginPath()
    ctx.arc(33, 20, 2.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(47, 20, 2.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(34, 19, 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(48, 19, 1, 0, Math.PI * 2)
    ctx.fill()

    // Tymak (hat)
    const hatGrad = ctx.createLinearGradient(25, -5, 55, 12)
    hatGrad.addColorStop(0, '#4a2e18')
    hatGrad.addColorStop(1, '#2a1a0a')
    ctx.fillStyle = hatGrad
    ctx.beginPath()
    ctx.moveTo(22, 12)
    ctx.bezierCurveTo(25, -5, 55, -5, 58, 12)
    ctx.bezierCurveTo(55, 18, 25, 18, 22, 12)
    ctx.fill()

    // Hat fur trim (white)
    ctx.fillStyle = '#f0ece4'
    ctx.beginPath()
    ctx.moveTo(22, 12)
    ctx.bezierCurveTo(25, 18, 55, 18, 58, 12)
    ctx.bezierCurveTo(55, 22, 25, 22, 22, 12)
    ctx.fill()

    tex.refresh()
  }

  private _generateBow() {
    // Idle bow
    const tex1 = this.textures.createCanvas('bow_idle', 40, 120)!
    const ctx1 = tex1.getContext()
    const bowGrad1 = ctx1.createLinearGradient(0, 0, 40, 120)
    bowGrad1.addColorStop(0, '#8b5a2b')
    bowGrad1.addColorStop(0.5, '#6b3a18')
    bowGrad1.addColorStop(1, '#8b5a2b')
    ctx1.strokeStyle = bowGrad1
    ctx1.lineWidth = 7
    ctx1.lineCap = 'round'
    ctx1.beginPath()
    ctx1.moveTo(35, 5)
    ctx1.bezierCurveTo(10, 35, 10, 85, 35, 115)
    ctx1.stroke()
    // String
    ctx1.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx1.lineWidth = 1.5
    ctx1.beginPath()
    ctx1.moveTo(35, 5)
    ctx1.lineTo(35, 115)
    ctx1.stroke()
    tex1.refresh()

    // Drawn bow
    const tex2 = this.textures.createCanvas('bow_drawn', 65, 120)!
    const ctx2 = tex2.getContext()
    const bowGrad2 = ctx2.createLinearGradient(0, 0, 65, 120)
    bowGrad2.addColorStop(0, '#8b5a2b')
    bowGrad2.addColorStop(0.5, '#6b3a18')
    bowGrad2.addColorStop(1, '#8b5a2b')
    ctx2.strokeStyle = bowGrad2
    ctx2.lineWidth = 7
    ctx2.lineCap = 'round'
    ctx2.beginPath()
    ctx2.moveTo(55, 5)
    ctx2.bezierCurveTo(70, 35, 70, 85, 55, 115)
    ctx2.stroke()
    // Pulled string
    ctx2.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx2.lineWidth = 2
    ctx2.beginPath()
    ctx2.moveTo(55, 5)
    ctx2.lineTo(10, 60)
    ctx2.lineTo(55, 115)
    ctx2.stroke()
    tex2.refresh()
  }

  private _generateArrow() {
    const W = 100, H = 14
    const tex = this.textures.createCanvas('arrow', W, H)!
    const ctx = tex.getContext()

    // Shaft
    const shaftGrad = ctx.createLinearGradient(0, 0, 0, H)
    shaftGrad.addColorStop(0, '#9b7040')
    shaftGrad.addColorStop(0.5, '#7a5228')
    shaftGrad.addColorStop(1, '#9b7040')
    ctx.fillStyle = shaftGrad
    ctx.fillRect(15, 4, 65, 6)

    // Arrowhead (metallic)
    const headGrad = ctx.createLinearGradient(80, 2, 100, 12)
    headGrad.addColorStop(0, '#d0d8e0')
    headGrad.addColorStop(0.4, '#8899aa')
    headGrad.addColorStop(1, '#5a6a7a')
    ctx.fillStyle = headGrad
    ctx.beginPath()
    ctx.moveTo(80, 4)
    ctx.lineTo(100, 7)
    ctx.lineTo(80, 10)
    ctx.lineTo(83, 7)
    ctx.fill()

    // Fletching
    ctx.fillStyle = '#cc2200'
    ctx.beginPath()
    ctx.moveTo(12, 7)
    ctx.lineTo(0, 0)
    ctx.lineTo(5, 7)
    ctx.lineTo(0, 14)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(12, 7)
    ctx.lineTo(0, 0)
    ctx.lineTo(5, 7)
    ctx.fill()

    tex.refresh()
  }

  private _generateTarget() {
    const W = 80, H = 280
    const tex = this.textures.createCanvas('target', W, H)!
    const ctx = tex.getContext()

    // Pole
    const poleGrad = ctx.createLinearGradient(0, 0, W, 0)
    poleGrad.addColorStop(0, '#4a3018')
    poleGrad.addColorStop(0.3, '#7a5530')
    poleGrad.addColorStop(0.7, '#6a4520')
    poleGrad.addColorStop(1, '#3a2010')
    ctx.fillStyle = poleGrad
    ctx.beginPath()
    ctx.roundRect(32, 80, 16, 200, 3)
    ctx.fill()

    // Crossbar
    ctx.fillStyle = '#5a3818'
    ctx.beginPath()
    ctx.roundRect(5, 75, 70, 12, 4)
    ctx.fill()

    // Rope
    ctx.strokeStyle = '#c8a870'
    ctx.lineWidth = 3
    ctx.setLineDash([4, 3])
    ctx.beginPath()
    ctx.moveTo(40, 75)
    ctx.lineTo(40, 55)
    ctx.stroke()
    ctx.setLineDash([])

    // Jamby glow
    const glowGrad = ctx.createRadialGradient(40, 30, 0, 40, 30, 50)
    glowGrad.addColorStop(0, 'rgba(255, 215, 0, 0.35)')
    glowGrad.addColorStop(1, 'rgba(255, 215, 0, 0)')
    ctx.fillStyle = glowGrad
    ctx.beginPath()
    ctx.arc(40, 30, 50, 0, Math.PI * 2)
    ctx.fill()

    // Jamby main disc
    const discGrad = ctx.createRadialGradient(34, 22, 2, 40, 30, 32)
    discGrad.addColorStop(0, '#fff5a0')
    discGrad.addColorStop(0.3, '#ffd700')
    discGrad.addColorStop(0.7, '#d4a017')
    discGrad.addColorStop(1, '#8b6800')
    ctx.fillStyle = discGrad
    ctx.beginPath()
    ctx.arc(40, 30, 30, 0, Math.PI * 2)
    ctx.fill()

    // Disc edge highlight
    ctx.strokeStyle = '#ffeaa0'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(40, 30, 29, -Math.PI * 0.8, 0)
    ctx.stroke()

    // Disc shadow
    ctx.strokeStyle = '#7a5500'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(40, 30, 29, 0, Math.PI * 0.8)
    ctx.stroke()

    // Center ornament ring
    ctx.strokeStyle = '#5a3a00'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(40, 30, 18, 0, Math.PI * 2)
    ctx.stroke()

    // Inner cross
    ctx.strokeStyle = '#8b5a00'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(40, 12)
    ctx.lineTo(40, 48)
    ctx.moveTo(22, 30)
    ctx.lineTo(58, 30)
    ctx.stroke()

    // Center dot
    const dotGrad = ctx.createRadialGradient(40, 30, 0, 40, 30, 8)
    dotGrad.addColorStop(0, '#fff0b0')
    dotGrad.addColorStop(1, '#cc8800')
    ctx.fillStyle = dotGrad
    ctx.beginPath()
    ctx.arc(40, 30, 8, 0, Math.PI * 2)
    ctx.fill()

    // PERFECT zone marker
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(40, 30, 5, 0, Math.PI * 2)
    ctx.stroke()

    tex.refresh()
  }

  private _generateMountains() {
    const W = 1024, H = 400
    const tex = this.textures.createCanvas('mountains', W, H)!
    const ctx = tex.getContext()

    // Far mountains (blue-gray)
    const farGrad = ctx.createLinearGradient(0, 0, 0, H)
    farGrad.addColorStop(0, '#7a8fa0')
    farGrad.addColorStop(1, '#a0b0bb')
    ctx.fillStyle = farGrad
    ctx.beginPath()
    ctx.moveTo(0, H)
    ctx.lineTo(0, 260)
    ctx.bezierCurveTo(80, 180, 130, 200, 200, 160)
    ctx.bezierCurveTo(270, 120, 310, 140, 380, 100)
    ctx.bezierCurveTo(440, 65, 480, 90, 540, 80)
    ctx.bezierCurveTo(600, 70, 640, 95, 700, 85)
    ctx.bezierCurveTo(760, 75, 800, 100, 860, 90)
    ctx.bezierCurveTo(920, 80, 970, 110, 1024, 130)
    ctx.lineTo(1024, H)
    ctx.fill()

    // Snow caps on far mountains
    ctx.fillStyle = 'rgba(255,255,255,0.65)'
    ctx.beginPath()
    ctx.moveTo(370, 115)
    ctx.lineTo(380, 100)
    ctx.lineTo(390, 115)
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(530, 93)
    ctx.lineTo(540, 80)
    ctx.lineTo(550, 93)
    ctx.fill()

    // Near mountains (darker, more saturated)
    const nearGrad = ctx.createLinearGradient(0, 0, 0, H)
    nearGrad.addColorStop(0, '#5a6e50')
    nearGrad.addColorStop(1, '#8a9870')
    ctx.fillStyle = nearGrad
    ctx.beginPath()
    ctx.moveTo(0, H)
    ctx.lineTo(0, 310)
    ctx.bezierCurveTo(60, 270, 100, 280, 160, 240)
    ctx.bezierCurveTo(220, 200, 260, 220, 330, 190)
    ctx.bezierCurveTo(400, 160, 450, 185, 520, 175)
    ctx.bezierCurveTo(590, 165, 640, 200, 720, 185)
    ctx.bezierCurveTo(800, 170, 860, 205, 950, 190)
    ctx.bezierCurveTo(990, 185, 1010, 200, 1024, 210)
    ctx.lineTo(1024, H)
    ctx.fill()

    // Atmospheric haze
    const hazeGrad = ctx.createLinearGradient(0, 0, 0, H)
    hazeGrad.addColorStop(0, 'rgba(180,210,230,0.0)')
    hazeGrad.addColorStop(0.3, 'rgba(180,210,230,0.12)')
    hazeGrad.addColorStop(1, 'rgba(180,210,230,0.35)')
    ctx.fillStyle = hazeGrad
    ctx.fillRect(0, 0, W, H)

    tex.refresh()
  }

  private _generateSteppe() {
    const W = 1024, H = 320
    const tex = this.textures.createCanvas('steppe', W, H)!
    const ctx = tex.getContext()

    // Ground base
    const groundGrad = ctx.createLinearGradient(0, 0, 0, H)
    groundGrad.addColorStop(0, '#c8973a')
    groundGrad.addColorStop(0.3, '#b07828')
    groundGrad.addColorStop(0.7, '#8a5c18')
    groundGrad.addColorStop(1, '#6b4510')
    ctx.fillStyle = groundGrad
    ctx.fillRect(0, 0, W, H)

    // Undulating surface highlight
    ctx.fillStyle = '#d4a845'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(150, -15, 250, 10, 400, -5)
    ctx.bezierCurveTo(550, -20, 700, 5, 850, -10)
    ctx.bezierCurveTo(950, -20, 1000, -5, 1024, 0)
    ctx.lineTo(1024, 40)
    ctx.lineTo(0, 40)
    ctx.fill()

    // Dirt path
    ctx.fillStyle = '#a07228'
    ctx.beginPath()
    ctx.ellipse(512, H - 30, 500, 18, 0, 0, Math.PI * 2)
    ctx.fill()

    // Grass tufts — sparse, organic
    ctx.strokeStyle = '#8a6a20'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    const rng = (seed: number) => {
      let x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }
    for (let i = 0; i < 120; i++) {
      const x = rng(i * 7.3) * W
      const y = rng(i * 3.7) * (H - 40) + 15
      const h = 8 + rng(i * 5.1) * 18
      const lean = (rng(i * 2.9) - 0.5) * 12

      ctx.strokeStyle = i % 3 === 0
        ? '#a0822a'
        : i % 3 === 1
          ? '#c09a35'
          : '#7a5518'
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.quadraticCurveTo(x + lean, y - h * 0.5, x + lean * 1.5, y - h)
      ctx.stroke()
    }

    // Small stones
    ctx.fillStyle = '#7a6040'
    for (let i = 0; i < 20; i++) {
      const x = rng(i * 11.3 + 100) * W
      const y = rng(i * 6.7 + 200) * (H - 20) + 10
      ctx.beginPath()
      ctx.ellipse(x, y, 5 + rng(i) * 8, 3 + rng(i * 2) * 4, rng(i * 3) * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }

    tex.refresh()
  }

  private _generateParticle() {
    const tex = this.textures.createCanvas('particle', 16, 16)!
    const ctx = tex.getContext()
    const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
    g.addColorStop(0, 'rgba(255,220,80,1)')
    g.addColorStop(0.4, 'rgba(255,150,30,0.8)')
    g.addColorStop(1, 'rgba(255,80,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 16, 16)
    tex.refresh()
  }
}
