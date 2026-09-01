export class AudioEffects {
  private ctx: AudioContext | null = null
  private musicIntervalId: number | null = null

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  /**
   * Starts a subtle, pulsing sports heartbeat drumbeat and background hum
   */
  public startBackgroundMusic() {
    this.initCtx()
    if (!this.ctx || this.musicIntervalId) return

    let beatCount = 0
    const playBeat = () => {
      if (!this.ctx) return
      
      const now = this.ctx.currentTime

      // 1. Pulsing sub kick drum on every beat
      const kickOsc = this.ctx.createOscillator()
      const kickGain = this.ctx.createGain()

      kickOsc.type = 'sine'
      // Low sub heartbeat frequency
      kickOsc.frequency.setValueAtTime(65, now)
      kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.15)

      kickGain.gain.setValueAtTime(0.12, now)
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      kickOsc.connect(kickGain)
      kickGain.connect(this.ctx.destination)
      kickOsc.start(now)
      kickOsc.stop(now + 0.2)

      // 2. High-tension atmospheric synth hum on every 4th beat
      if (beatCount % 4 === 0) {
        const padOsc = this.ctx.createOscillator()
        const padGain = this.ctx.createGain()
        const filter = this.ctx.createBiquadFilter()

        padOsc.type = 'triangle'
        padOsc.frequency.setValueAtTime(110, now) // A2 note
        padOsc.frequency.linearRampToValueAtTime(115, now + 1.5)

        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(180, now)

        padGain.gain.setValueAtTime(0.04, now)
        padGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0)

        padOsc.connect(filter)
        filter.connect(padGain)
        padGain.connect(this.ctx.destination)

        padOsc.start(now)
        padOsc.stop(now + 2.0)
      }

      beatCount++
    }

    // Play immediately, then every 600ms (100 BPM rhythmic pulse)
    playBeat()
    this.musicIntervalId = window.setInterval(playBeat, 600)
  }

  public stopBackgroundMusic() {
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId)
      this.musicIntervalId = null
    }
  }

  /**
   * Sound of tensing/gripping hands
   */
  public playGrip() {
    this.initCtx()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(80, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3)

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.3)
  }

  /**
   * Sound of athlete tensing under high fatigue/effort
   */
  public playEffort() {
    this.initCtx()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(65, this.ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(75, this.ctx.currentTime + 0.25)

    // Low-pass filter for a muffled grunt sound
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(220, this.ctx.currentTime)

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.3)
  }

  /**
   * Creak of the table under force
   */
  public playTable() {
    this.initCtx()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(140, this.ctx.currentTime)
    
    // Frequency modulation for creak sound
    osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.08)
    osc.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.16)

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.2)
  }

  /**
   * Dynamic crowd cheering noise
   */
  public playCrowd(intense: boolean = false) {
    this.initCtx()
    if (!this.ctx) return

    const bufferSize = this.ctx.sampleRate * (intense ? 1.5 : 0.8)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)

    // Fill buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    // Bandpass filter to make it sound like crowd roar
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(600, this.ctx.currentTime)
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(intense ? 0.25 : 0.1, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + (intense ? 1.5 : 0.8))

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start()
  }

  /**
   * Slam of hand on the table (Victory PIN / impact)
   */
  public playImpact() {
    this.initCtx()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(110, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.4)

    // Distortion node for satisfying thud crunch
    const waveShaper = this.ctx.createWaveShaper()
    const makeDistortionCurve = (amount = 20) => {
      const k = typeof amount === 'number' ? amount : 50
      const n_samples = 44100
      const curve = new Float32Array(n_samples)
      const deg = Math.PI / 180
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
      }
      return curve
    }
    waveShaper.curve = makeDistortionCurve(10)

    gain.gain.setValueAtTime(0.8, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5)

    osc.connect(waveShaper)
    waveShaper.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start()
    osc.stop(this.ctx.currentTime + 0.5)

    // Add high frequency thud clap
    const snapOsc = this.ctx.createOscillator()
    const snapGain = this.ctx.createGain()
    snapOsc.type = 'triangle'
    snapOsc.frequency.setValueAtTime(800, this.ctx.currentTime)
    snapOsc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05)
    snapGain.gain.setValueAtTime(0.18, this.ctx.currentTime)
    snapGain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.05)
    
    snapOsc.connect(snapGain)
    snapGain.connect(this.ctx.destination)
    snapOsc.start()
    snapOsc.stop(this.ctx.currentTime + 0.05)
  }

  /**
   * Brassy pentatonic victory melody
   */
  public playVictory() {
    this.initCtx()
    if (!this.ctx) return

    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25] // Pentatonic scale C-D-E-G-A-C
    const now = this.ctx.currentTime

    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.12)
      
      gain.gain.setValueAtTime(0.2, now + idx * 0.12 + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.12 + 0.4)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now + idx * 0.12)
      osc.stop(now + idx * 0.12 + 0.4)
    })
  }
}
