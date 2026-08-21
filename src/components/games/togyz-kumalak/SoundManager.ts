'use client'

export class SoundManager {
  private static instance: SoundManager
  private context: AudioContext | null = null

  // We can synthesize sounds using Web Audio API to avoid needing external assets
  // since the prompt says "Не generic UI sounds", a synthesized stone clack or wood sound is great.

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  private initContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (this.context.state === 'suspended') {
      this.context.resume()
    }
  }

  playStoneDrop() {
    this.initContext()
    if (!this.context) return

    const osc = this.context.createOscillator()
    const gain = this.context.createGain()
    
    // Wood/Stone clack sound
    osc.type = 'sine'
    // Randomize pitch slightly for organic feel
    const baseFreq = 800 + Math.random() * 200
    osc.frequency.setValueAtTime(baseFreq, this.context.currentTime)
    osc.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.05)
    
    gain.gain.setValueAtTime(0.5, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.context.destination)
    
    osc.start()
    osc.stop(this.context.currentTime + 0.05)
  }

  playCapture() {
    this.initContext()
    if (!this.context) return

    const osc = this.context.createOscillator()
    const gain = this.context.createGain()
    
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(300, this.context.currentTime)
    osc.frequency.linearRampToValueAtTime(600, this.context.currentTime + 0.1)
    
    gain.gain.setValueAtTime(0, this.context.currentTime)
    gain.gain.linearRampToValueAtTime(0.4, this.context.currentTime + 0.05)
    gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.2)

    osc.connect(gain)
    gain.connect(this.context.destination)
    
    osc.start()
    osc.stop(this.context.currentTime + 0.2)
  }

  playTuzdyk() {
    this.initContext()
    if (!this.context) return

    // Golden chime
    const osc = this.context.createOscillator()
    const gain = this.context.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, this.context.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.5)
    
    gain.gain.setValueAtTime(0.6, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5)

    osc.connect(gain)
    gain.connect(this.context.destination)
    
    osc.start()
    osc.stop(this.context.currentTime + 0.5)
  }

  playTurnStart() {
    this.initContext()
    if (!this.context) return

    const osc = this.context.createOscillator()
    const gain = this.context.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, this.context.currentTime)
    osc.frequency.linearRampToValueAtTime(450, this.context.currentTime + 0.1)
    
    gain.gain.setValueAtTime(0, this.context.currentTime)
    gain.gain.linearRampToValueAtTime(0.2, this.context.currentTime + 0.05)
    gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.3)

    osc.connect(gain)
    gain.connect(this.context.destination)
    
    osc.start()
    osc.stop(this.context.currentTime + 0.3)
  }
}

export const sounds = SoundManager.getInstance()
