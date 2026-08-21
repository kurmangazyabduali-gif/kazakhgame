export class GameAudioService {
  private static instance: GameAudioService;
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  private constructor() {
    // Try to load user preference
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('uly_dala_audio_muted');
      if (savedMute) this.isMuted = savedMute === 'true';
      
      const savedVol = localStorage.getItem('uly_dala_audio_volume');
      if (savedVol) this.volume = parseFloat(savedVol);
    }
  }

  public static getInstance(): GameAudioService {
    if (!GameAudioService.instance) {
      GameAudioService.instance = new GameAudioService();
    }
    return GameAudioService.instance;
  }

  public init() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new Ctx();
    }
  }

  // Synthesize basic premium sounds instead of requiring external assets for now
  // In a real production environment, this would load MP3s/OGGs
  public playSfx(type: 'hit' | 'success' | 'transition' | 'click' | 'pour' | 'stone') {
    if (this.isMuted || !this.audioContext) return;
    if (this.audioContext.state === 'suspended') this.audioContext.resume();

    const t = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    // Apply master volume
    const v = this.volume;

    switch (type) {
      case 'hit':
        // Wooden knock
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.8, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      case 'stone':
        // Stone click (Togyzkumalak)
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.5, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
      case 'pour':
        // Tea pour (noise) - simple approximation using high freq sine modulations
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, t);
        for(let i=0; i<10; i++) {
            osc.frequency.linearRampToValueAtTime(400 + Math.random()*200, t + 0.1 * i);
        }
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.3, t + 0.1);
        gain.gain.linearRampToValueAtTime(0, t + 1.0);
        osc.start(t);
        osc.stop(t + 1.0);
        break;
      case 'success':
        // Pleasant chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(554.37, t + 0.1); // C#
        osc.frequency.setValueAtTime(659.25, t + 0.2); // E
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.5, t + 0.1);
        gain.gain.linearRampToValueAtTime(0, t + 0.6);
        osc.start(t);
        osc.stop(t + 0.6);
        break;
      case 'transition':
        // Deep woosh
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(20, t + 0.8);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.6, t + 0.4);
        gain.gain.linearRampToValueAtTime(0, t + 0.8);
        osc.start(t);
        osc.stop(t + 0.8);
        break;
      case 'click':
        // UI click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.3, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
        break;
    }
  }

  public setMute(mute: boolean) {
    this.isMuted = mute;
    if (typeof window !== 'undefined') {
      localStorage.setItem('uly_dala_audio_muted', mute.toString());
    }
  }

  public toggleMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }
}

export const gameAudio = GameAudioService.getInstance();
