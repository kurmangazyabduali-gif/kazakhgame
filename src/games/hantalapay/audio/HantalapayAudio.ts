class HantalapayAudioSynthesizer {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
  }

  public playScatter() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    // Generate rapid succession of bone clack pulses
    for (let i = 0; i < 8; i++) {
      const delay = i * 0.04 + Math.random() * 0.02
      this.playBoneClack(now + delay, 0.7 + Math.random() * 0.6, 0.4 - i * 0.03)
    }
  }

  public playAsykPickup(combo: number = 1) {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    // Pitch rises with combo streak
    const pitchMultiplier = Math.min(1.8, 1.0 + (combo - 1) * 0.08)
    this.playBoneClack(now, pitchMultiplier, 0.5)

    // Add bright harmonic tone on high combo
    if (combo > 3) {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440 * pitchMultiplier, now)
      osc.frequency.exponentialRampToValueAtTime(880 * pitchMultiplier, now + 0.1)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.1)
    }
  }

  public playKhanPickup() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    // Royal pentatonic arpeggio chime (D-F#-A-D)
    const notes = [587.33, 739.99, 880.0, 1174.66]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.06)

      gain.gain.setValueAtTime(0.3, now + idx * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now + idx * 0.06)
      osc.stop(now + idx * 0.06 + 0.4)
    })

    // Deep resonance impact
    const sub = this.ctx.createOscillator()
    const subGain = this.ctx.createGain()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(150, now)
    sub.frequency.exponentialRampToValueAtTime(50, now + 0.5)

    subGain.gain.setValueAtTime(0.4, now)
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)

    sub.connect(subGain)
    subGain.connect(this.ctx.destination)
    sub.start(now)
    sub.stop(now + 0.5)
  }

  public playObstacleClick() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(120, now)
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.15)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.15)
  }

  public playCountdownTick(isFinal: boolean = false) {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = isFinal ? 'triangle' : 'sine'
    osc.frequency.setValueAtTime(isFinal ? 880 : 523.25, now)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.3 : 0.1))

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + (isFinal ? 0.3 : 0.1))
  }

  public playRoundWin() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const freqs = [523.25, 659.25, 783.99, 1046.5] // C-E-G-C
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)

      gain.gain.setValueAtTime(0.2, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.3)
    })
  }

  private playBoneClack(time: number, pitchMultiplier: number, volume: number) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(600 * pitchMultiplier, time)
    osc.frequency.exponentialRampToValueAtTime(150 * pitchMultiplier, time + 0.04)

    gain.gain.setValueAtTime(volume, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(time)
    osc.stop(time + 0.04)
  }
}

export const hantalapayAudio = new HantalapayAudioSynthesizer()
