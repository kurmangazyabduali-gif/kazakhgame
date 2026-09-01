import { create } from 'zustand';

export type PullQuality = 'PERFECT' | 'GOOD' | 'LATE' | 'MISS' | 'OVERHEAT' | null;
export type GameStatus = 'READY' | 'PULLING' | 'ROUND_END' | 'MATCH_OVER';
export type Tactic = 'NONE' | 'BURST' | 'BRACE' | 'REST';
export type ArmorTier = 'STANDARD' | 'HEAVY_ARMOR';

interface ArqanState {
  status: GameStatus;
  round: number;
  playerWins: number;
  aiWins: number;
  ropePosition: number; // -100 (AI Win) to +100 (Player Win)
  playerFatigue: number; // 0..1
  aiFatigue: number; // 0..1
  isAiPulling: boolean;
  
  // 1v1 Captain Duel
  isCaptainDuel: boolean;
  
  // ЖІГЕР Hype System
  zhigerMeter: number; // 0..100
  isZhigerActive: boolean; // 6s aura
  
  // Armor Customization
  armorTier: ArmorTier;
  
  // Rhythm & Charging
  isCharging: boolean;
  chargePower: number;
  rhythmBeat: number; // 0..1 pulse cycle
  
  // Tactics
  activeTactic: Tactic;
  tacticCooldown: number; // 0..1
  
  lastPullQuality: PullQuality;
  showTutorial: boolean;
  
  startMatch: () => void;
  startRound: () => void;
  tick: (delta: number) => void;
  startCharge: () => void;
  releaseCharge: () => void;
  triggerTactic: (tactic: Tactic) => void;
  setArmorTier: (tier: ArmorTier) => void;
  activateZhiger: () => void;
  checkWin: () => void;
  dismissTutorial: () => void;
}

export const useArqanStore = create<ArqanState>((set, get) => ({
  status: 'READY',
  round: 1,
  playerWins: 0,
  aiWins: 0,
  ropePosition: 0,
  playerFatigue: 0,
  aiFatigue: 0,
  isAiPulling: false,
  
  isCaptainDuel: false,
  zhigerMeter: 0,
  isZhigerActive: false,
  armorTier: 'STANDARD',
  
  isCharging: false,
  chargePower: 0,
  rhythmBeat: 0,
  
  activeTactic: 'NONE',
  tacticCooldown: 0,
  
  lastPullQuality: null,
  showTutorial: true,

  setArmorTier: (tier: ArmorTier) => {
    set({ armorTier: tier });
  },

  activateZhiger: () => {
    const state = get();
    if (state.zhigerMeter < 100 || state.isZhigerActive) return;

    set({ isZhigerActive: true, zhigerMeter: 0, lastPullQuality: 'PERFECT' });

    setTimeout(() => {
      set({ isZhigerActive: false });
    }, 6000);
  },

  startMatch: () => {
    set({
      status: 'READY',
      round: 1,
      playerWins: 0,
      aiWins: 0,
      ropePosition: 0,
      playerFatigue: 0,
      aiFatigue: 0,
      isAiPulling: false,
      isCaptainDuel: false,
      zhigerMeter: 0,
      isZhigerActive: false,
      isCharging: false,
      chargePower: 0,
      rhythmBeat: 0,
      activeTactic: 'NONE',
      tacticCooldown: 0,
      lastPullQuality: null,
    });
  },

  startRound: () => {
    const state = get();
    // Check if Round 3 is a 1v1 Captain Duel (tied 1-1)
    const isDuel = state.round === 3 && state.playerWins === 1 && state.aiWins === 1;

    set({
      status: 'PULLING',
      ropePosition: 0,
      playerFatigue: 0,
      aiFatigue: 0,
      isAiPulling: false,
      isCaptainDuel: isDuel,
      isCharging: false,
      chargePower: 0,
      rhythmBeat: 0,
      activeTactic: 'NONE',
      tacticCooldown: 0,
      lastPullQuality: null,
    });
  },

  dismissTutorial: () => {
    set({ showTutorial: false });
  },

  tick: (delta: number) => {
    const state = get();
    if (state.status !== 'PULLING') return;

    let {
      ropePosition,
      playerFatigue,
      aiFatigue,
      isCharging,
      chargePower,
      rhythmBeat,
      activeTactic,
      tacticCooldown,
      zhigerMeter,
      isZhigerActive,
      armorTier,
    } = state;

    // Rhythm Clock (~120 BPM)
    rhythmBeat = (rhythmBeat + delta * 2.0) % 1.0;

    // Cooldown Decay
    if (tacticCooldown > 0) {
      tacticCooldown = Math.max(0, tacticCooldown - delta * 0.3);
    }

    // Heavy Armor Bonus: +15% Force, slightly faster fatigue
    const armorMultiplier = armorTier === 'HEAVY_ARMOR' ? 1.15 : 1.0;

    // Fatigue rates
    let playerFatigueRate = 0.07;
    let playerRecovery = 0.16;

    if (isZhigerActive) {
      // Zhiger Mode: 0 Fatigue drain, 1.35x force
      playerFatigueRate = 0;
      playerRecovery = 0.50;
    } else if (activeTactic === 'REST') {
      playerRecovery = 0.40;
    } else if (activeTactic === 'BURST') {
      playerFatigueRate = 0.20;
    }

    // AI Fatigue rates
    const aiFatigueRate = 0.22;
    const aiRecovery = 0.08;

    // Player Charging & Mechanics
    if (isCharging) {
      if (playerFatigue < 1 || isZhigerActive) {
        chargePower += 50 * delta;
        if (!isZhigerActive) {
          playerFatigue = Math.min(1, playerFatigue + playerFatigueRate * delta);
        }
        
        // Continuous pulling force
        let basePull = (activeTactic === 'BURST' ? 8 : 4) * armorMultiplier;
        if (isZhigerActive) basePull *= 1.35;

        ropePosition += basePull * delta;

        // Overheat safety
        if (chargePower > 100) {
          isCharging = false;
          chargePower = 0;
          set({ lastPullQuality: 'OVERHEAT', playerFatigue: Math.min(1, playerFatigue + 0.15) });
          setTimeout(() => {
            if (get().lastPullQuality === 'OVERHEAT') set({ lastPullQuality: null });
          }, 1200);
        }
      } else {
        isCharging = false;
        chargePower = 0;
      }
    } else {
      playerFatigue = Math.max(0, playerFatigue - playerRecovery * delta);
      chargePower = 0;
    }

    // AI Mechanics & Behavior
    let aiPulling = false;
    if (aiFatigue < 0.8 && Math.random() > 0.15) {
      let aiForce = 12 + Math.random() * 6;
      
      // If player is BRACING, reduce incoming AI pull by 75%
      if (activeTactic === 'BRACE') {
        aiForce *= 0.25;
      }
      
      ropePosition -= aiForce * delta;
      aiFatigue = Math.min(1, aiFatigue + aiFatigueRate * delta);
      aiPulling = true;
    } else {
      aiFatigue = Math.max(0, aiFatigue - aiRecovery * delta);
    }

    // Natural drift
    ropePosition -= 0.4 * delta;

    set({
      ropePosition,
      playerFatigue,
      aiFatigue,
      isCharging,
      chargePower,
      rhythmBeat,
      activeTactic,
      tacticCooldown,
      zhigerMeter,
      isAiPulling: aiPulling,
    });

    get().checkWin();
  },

  triggerTactic: (tactic: Tactic) => {
    const state = get();
    if (state.status !== 'PULLING' || state.tacticCooldown > 0) return;

    const armorMultiplier = state.armorTier === 'HEAVY_ARMOR' ? 1.15 : 1.0;

    if (tactic === 'BURST') {
      const rhythmDist = Math.abs(state.rhythmBeat - 0.5);
      const isPerfectSync = rhythmDist < 0.15;
      let force = (isPerfectSync ? 35 : 20) * armorMultiplier;
      if (state.isZhigerActive) force *= 1.35;

      const quality: PullQuality = isPerfectSync ? 'PERFECT' : 'GOOD';

      // Build Zhiger Meter on Perfect/Good pulls
      const zhigerGain = isPerfectSync ? 25 : 12;

      set((s) => ({
        activeTactic: 'BURST',
        tacticCooldown: 1.0,
        ropePosition: s.ropePosition + force,
        lastPullQuality: quality,
        zhigerMeter: Math.min(100, s.zhigerMeter + zhigerGain),
        playerFatigue: Math.min(1, s.playerFatigue + (s.isZhigerActive ? 0 : 0.15)),
      }));
    } else if (tactic === 'BRACE') {
      set((s) => ({
        activeTactic: 'BRACE',
        tacticCooldown: 1.0,
        lastPullQuality: 'GOOD',
        zhigerMeter: Math.min(100, s.zhigerMeter + 10),
      }));
    } else if (tactic === 'REST') {
      set({
        activeTactic: 'REST',
        tacticCooldown: 0.8,
        playerFatigue: Math.max(0, state.playerFatigue - 0.3),
        lastPullQuality: 'GOOD',
      });
    }

    setTimeout(() => {
      if (get().lastPullQuality !== null) {
        set({ lastPullQuality: null });
      }
    }, 1000);

    get().checkWin();
  },

  startCharge: () => {
    const state = get();
    if (state.status !== 'PULLING' || (state.playerFatigue >= 0.95 && !state.isZhigerActive)) return;
    set({ isCharging: true, chargePower: 0 });
  },

  releaseCharge: () => {
    const state = get();
    if (state.status !== 'PULLING' || !state.isCharging) return;

    const { chargePower, rhythmBeat, armorTier, isZhigerActive } = state;
    
    const rhythmDist = Math.abs(rhythmBeat - 0.5);
    const isRhythmPeak = rhythmDist < 0.15;

    const armorMultiplier = armorTier === 'HEAVY_ARMOR' ? 1.15 : 1.0;

    let quality: PullQuality = 'MISS';
    let impulse = 0;

    if (chargePower >= 55 && chargePower <= 100) {
      quality = isRhythmPeak ? 'PERFECT' : 'GOOD';
      impulse = (isRhythmPeak ? 35 : 22) * armorMultiplier;
      if (isZhigerActive) impulse *= 1.35;
    } else if (chargePower >= 25 && chargePower < 55) {
      quality = 'GOOD';
      impulse = 14 * armorMultiplier;
    } else {
      quality = 'MISS';
      impulse = 4;
    }

    const zhigerGain = quality === 'PERFECT' ? 25 : quality === 'GOOD' ? 12 : 0;

    set((s) => ({
      ropePosition: s.ropePosition + impulse,
      isCharging: false,
      chargePower: 0,
      lastPullQuality: quality,
      zhigerMeter: Math.min(100, s.zhigerMeter + zhigerGain),
      playerFatigue: Math.min(1, s.playerFatigue + (s.isZhigerActive ? 0 : quality === 'MISS' ? 0.05 : 0.1)),
    }));

    setTimeout(() => {
      if (get().lastPullQuality === quality) {
        set({ lastPullQuality: null });
      }
    }, 1000);

    get().checkWin();
  },

  checkWin: () => {
    const state = get();
    if (state.status !== 'PULLING') return;

    if (state.ropePosition >= 100) {
      const pWins = state.playerWins + 1;
      if (pWins >= 2) {
        set({ status: 'MATCH_OVER', playerWins: pWins, ropePosition: 100 });
      } else {
        set({ status: 'ROUND_END', playerWins: pWins, round: state.round + 1, ropePosition: 100 });
      }
    } else if (state.ropePosition <= -100) {
      const aWins = state.aiWins + 1;
      if (aWins >= 2) {
        set({ status: 'MATCH_OVER', aiWins: aWins, ropePosition: -100 });
      } else {
        set({ status: 'ROUND_END', aiWins: aWins, round: state.round + 1, ropePosition: -100 });
      }
    }
  },
}));
