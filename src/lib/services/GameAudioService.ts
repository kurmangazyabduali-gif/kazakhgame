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
  public playSfx(type: 'hit' | 'success' | 'transition' | 'click' | 'pour' | 'stone' | 'bowDraw' | 'bowRelease' | 'arrowImpact' | 'ropeCut' | 'miss' | 'ropePullPerfect' | 'ropePullGood' | 'ropePullWeak' | 'ropeTension' | 'footstepDig' | 'crowdEffort' | 'matchVictory' | 'matchDefeat' | 'matchPoint') {
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
      case 'bowDraw': {
        // Rising creak/tension as the bow is pulled back — short, subtle, filtered tone
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.linearRampToValueAtTime(160, t + 0.15);
        const drawFilter = this.audioContext.createBiquadFilter();
        drawFilter.type = 'lowpass';
        drawFilter.frequency.setValueAtTime(500, t);
        osc.disconnect();
        osc.connect(drawFilter);
        drawFilter.connect(gain);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.18, t + 0.05);
        gain.gain.linearRampToValueAtTime(v * 0.1, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.16);
        break;
      }
      case 'bowRelease':
        // Twang — a quick plucked-string snap with fast pitch drop
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.12);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.6, t + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.18);
        break;
      case 'arrowImpact':
        // Thud + crack — short noisy knock, punchier than the generic 'hit'
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.09);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.9, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
        break;
      case 'ropeCut': {
        // The best possible result — a bright ascending flourish (snap + chime)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(70, t + 0.06);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.85, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.08);

        const chime = this.audioContext.createOscillator();
        const chimeGain = this.audioContext.createGain();
        chime.connect(chimeGain);
        chimeGain.connect(this.audioContext.destination);
        chime.type = 'sine';
        chime.frequency.setValueAtTime(523.25, t + 0.05); // C5
        chime.frequency.setValueAtTime(659.25, t + 0.14); // E5
        chime.frequency.setValueAtTime(783.99, t + 0.23); // G5
        chimeGain.gain.setValueAtTime(0, t + 0.05);
        chimeGain.gain.linearRampToValueAtTime(v * 0.45, t + 0.1);
        chimeGain.gain.linearRampToValueAtTime(0, t + 0.7);
        chime.start(t + 0.05);
        chime.stop(t + 0.7);
        break;
      }
      case 'miss':
        // Dull, deflated descending tone — a shot that found nothing
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.25);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.3, t + 0.03);
        gain.gain.linearRampToValueAtTime(0, t + 0.28);
        osc.start(t);
        osc.stop(t + 0.28);
        break;

      // --- Arqan Tartys (tug-of-war) — physical rope/effort sounds only.
      // Deliberately NOT reusing 'click'/'hit': every core pull action must
      // read as a real rope under tension, not a generic UI beep.
      case 'ropePullPerfect': {
        // Taut rope thrum + low body-thud — a pull that lands exactly on
        // the beat, felt as much as heard.
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(70, t);
        osc.frequency.exponentialRampToValueAtTime(42, t + 0.14);
        const perfFilter = this.audioContext.createBiquadFilter();
        perfFilter.type = 'lowpass';
        perfFilter.frequency.setValueAtTime(320, t);
        osc.disconnect();
        osc.connect(perfFilter);
        perfFilter.connect(gain);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.95, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        osc.start(t);
        osc.stop(t + 0.22);

        const thrum = this.audioContext.createOscillator();
        const thrumGain = this.audioContext.createGain();
        thrum.connect(thrumGain);
        thrumGain.connect(this.audioContext.destination);
        thrum.type = 'triangle';
        thrum.frequency.setValueAtTime(130, t + 0.02);
        thrum.frequency.linearRampToValueAtTime(95, t + 0.18);
        thrumGain.gain.setValueAtTime(0, t + 0.02);
        thrumGain.gain.linearRampToValueAtTime(v * 0.4, t + 0.05);
        thrumGain.gain.linearRampToValueAtTime(0, t + 0.3);
        thrum.start(t + 0.02);
        thrum.stop(t + 0.3);
        break;
      }
      case 'ropePullGood':
        // Solid but softer rope-strain thud — a good-not-perfect pull.
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(85, t);
        osc.frequency.exponentialRampToValueAtTime(55, t + 0.11);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.55, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.16);
        osc.start(t);
        osc.stop(t + 0.16);
        break;
      case 'ropePullWeak':
        // Loose, glancing rope slip — early/late timing that barely bites.
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.22, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      case 'ropeTension': {
        // Fibrous creak — ambient rope-under-load texture for sustained strain.
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.linearRampToValueAtTime(260, t + 0.3);
        const tensionFilter = this.audioContext.createBiquadFilter();
        tensionFilter.type = 'bandpass';
        tensionFilter.frequency.setValueAtTime(400, t);
        tensionFilter.Q.setValueAtTime(6, t);
        osc.disconnect();
        osc.connect(tensionFilter);
        tensionFilter.connect(gain);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.12, t + 0.08);
        gain.gain.linearRampToValueAtTime(0, t + 0.35);
        osc.start(t);
        osc.stop(t + 0.35);
        break;
      }
      case 'footstepDig': {
        // Heel-dig-in thump — dull, low, textured like packed earth.
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.09);
        const stepFilter = this.audioContext.createBiquadFilter();
        stepFilter.type = 'lowpass';
        stepFilter.frequency.setValueAtTime(220, t);
        osc.disconnect();
        osc.connect(stepFilter);
        stepFilter.connect(gain);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.5, t + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      }
      case 'crowdEffort': {
        // Layered short grunts approximating a team's collective exertion —
        // several detuned low oscillators firing in a tight cluster.
        const voices = [140, 165, 118, 152];
        voices.forEach((freq, i) => {
          const vOsc = this.audioContext!.createOscillator();
          const vGain = this.audioContext!.createGain();
          vOsc.connect(vGain);
          vGain.connect(this.audioContext!.destination);
          vOsc.type = 'triangle';
          const start = t + i * 0.02;
          vOsc.frequency.setValueAtTime(freq, start);
          vOsc.frequency.exponentialRampToValueAtTime(freq * 0.6, start + 0.18);
          vGain.gain.setValueAtTime(0, start);
          vGain.gain.linearRampToValueAtTime(v * 0.18, start + 0.03);
          vGain.gain.linearRampToValueAtTime(0, start + 0.22);
          vOsc.start(start);
          vOsc.stop(start + 0.22);
        });
        // The shared osc/gain pair created above the switch is unused by this
        // multi-voice case — start and immediately stop it silently so we
        // never call stop() on a node that was never started.
        gain.gain.setValueAtTime(0, t);
        osc.start(t);
        osc.stop(t);
        break;
      }
      case 'matchVictory': {
        // Triumphant rising fanfare — three ascending open-fifth chords.
        // The shared osc/gain pair above is unused here — start/stop it
        // silently rather than calling stop() on an unstarted node.
        gain.gain.setValueAtTime(0, t);
        osc.start(t);
        osc.stop(t);
        const notes = [
          [392, 587.33],
          [440, 659.25],
          [523.25, 783.99],
        ];
        notes.forEach(([f1, f2], i) => {
          const start = t + i * 0.16;
          [f1, f2].forEach((freq) => {
            const vOsc = this.audioContext!.createOscillator();
            const vGain = this.audioContext!.createGain();
            vOsc.connect(vGain);
            vGain.connect(this.audioContext!.destination);
            vOsc.type = 'triangle';
            vOsc.frequency.setValueAtTime(freq, start);
            vGain.gain.setValueAtTime(0, start);
            vGain.gain.linearRampToValueAtTime(v * 0.35, start + 0.04);
            vGain.gain.linearRampToValueAtTime(0, start + 0.5);
            vOsc.start(start);
            vOsc.stop(start + 0.5);
          });
        });
        break;
      }
      case 'matchDefeat':
        // Heavy descending drop — the rope center crossed the wrong way.
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(48, t + 0.6);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(v * 0.45, t + 0.05);
        gain.gain.linearRampToValueAtTime(0, t + 0.7);
        osc.start(t);
        osc.stop(t + 0.7);
        break;
      case 'matchPoint': {
        // Two-note rising alert — a brief "heads up, this is it" sting,
        // brighter and shorter than the ambient rope-tension creak so it
        // reads as a distinct event rather than a texture.
        const blips = [520, 720];
        blips.forEach((freq, i) => {
          const vOsc = this.audioContext!.createOscillator();
          const vGain = this.audioContext!.createGain();
          vOsc.connect(vGain);
          vGain.connect(this.audioContext!.destination);
          vOsc.type = 'square';
          const start = t + i * 0.09;
          vOsc.frequency.setValueAtTime(freq, start);
          vGain.gain.setValueAtTime(0, start);
          vGain.gain.linearRampToValueAtTime(v * 0.22, start + 0.015);
          vGain.gain.linearRampToValueAtTime(0, start + 0.14);
          vOsc.start(start);
          vOsc.stop(start + 0.14);
        });
        // The shared osc/gain pair created above the switch is unused by
        // this multi-voice case — start and immediately stop it silently
        // so we never call stop() on a node that was never started.
        gain.gain.setValueAtTime(0, t);
        osc.start(t);
        osc.stop(t);
        break;
      }
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
