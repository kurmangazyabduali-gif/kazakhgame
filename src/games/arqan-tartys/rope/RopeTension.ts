/**
 * Visual tension/vibration layer for the rope.
 *
 * Separate from RopePhysics (the structural simulation) — this tracks a
 * short-lived "shake" impulse that decays over time, so a strong pull makes
 * the rope visibly judder for a few frames without permanently perturbing
 * the Verlet chain. Pure math, framework-free, unit-testable.
 */

export interface TensionState {
  /** Current shake amplitude in world units. Decays toward 0 each tick. */
  amplitude: number
  /** Oscillation phase, radians. Advances every tick while amplitude > 0. */
  phase: number
}

export const TENSION_DECAY = 0.88
export const TENSION_FREQUENCY = 1.6

export function createTensionState(): TensionState {
  return { amplitude: 0, phase: 0 }
}

/** Feed a new pull impulse into the tension state — magnitude should be the
 *  normalized force of the pull that just landed (0..1, perfect timing = 1). */
export function applyImpulse(state: TensionState, magnitude: number): TensionState {
  return {
    amplitude: Math.min(1, state.amplitude + magnitude * 0.6),
    phase: state.phase,
  }
}

/** Advance the tension/vibration simulation by one tick. */
export function stepTension(state: TensionState): TensionState {
  if (state.amplitude <= 0.001) {
    return { amplitude: 0, phase: 0 }
  }
  return {
    amplitude: state.amplitude * TENSION_DECAY,
    phase: state.phase + TENSION_FREQUENCY,
  }
}

/** Per-point-index vertical/horizontal jitter offset to add on top of the
 *  base rope shape — highest at the rope center, tapering to zero at the
 *  pinned ends, so the vibration reads as travelling along the rope. */
export function getTensionOffset(state: TensionState, pointIndex: number, totalPoints: number): { x: number; y: number } {
  if (state.amplitude <= 0) return { x: 0, y: 0 }
  const mid = (totalPoints - 1) / 2
  const distFromMid = Math.abs(pointIndex - mid) / mid
  const taper = 1 - distFromMid // 1 at center, 0 at ends
  const endTaper = pointIndex === 0 || pointIndex === totalPoints - 1 ? 0 : 1
  const wave = Math.sin(state.phase + pointIndex * 0.9)
  return {
    x: 0,
    y: wave * state.amplitude * taper * endTaper * 10,
  }
}
