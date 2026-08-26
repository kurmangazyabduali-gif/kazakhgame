/**
 * Verlet-integrated rope chain for Arqan Tartys.
 *
 * The rope is modelled as N point masses connected by distance constraints
 * (classic Verlet rope). A single scalar `pull` force (positive = toward
 * Team A / left, negative = toward Team B / right) is applied to the whole
 * chain each tick, plus gravity for natural sag and light damping so the
 * rope settles instead of oscillating forever.
 *
 * This module is deliberately Phaser-free — pure math — so it can be unit
 * tested in isolation and driven by any renderer.
 */

export interface RopePoint {
  x: number
  y: number
  prevX: number
  prevY: number
  /** Pinned points do not move under simulation (used for the two rope ends,
   *  which stay attached to the last character in each team's line). */
  pinned: boolean
}

export interface RopeConfig {
  /** Number of point masses along the rope. */
  segments: number
  /** Rest distance between adjacent points, in world units. */
  segmentLength: number
  /** World-space anchor for the rope's left end. */
  leftAnchor: { x: number; y: number }
  /** World-space anchor for the rope's right end. */
  rightAnchor: { x: number; y: number }
  /** Downward accel per tick^2 driving natural sag (small — this is a taut
   *  sports rope, not slack chain). */
  gravity: number
  /** Velocity retained per tick, (0..1). Lower = more damping/settling. */
  damping: number
  /** Verlet constraint relaxation iterations per tick — higher = stiffer rope. */
  constraintIterations: number
}

export const DEFAULT_ROPE_CONFIG: RopeConfig = {
  segments: 12,
  segmentLength: 28,
  leftAnchor: { x: 0, y: 0 },
  rightAnchor: { x: 336, y: 0 },
  gravity: 0.28,
  damping: 0.985,
  constraintIterations: 10,
}

export class RopePhysics {
  points: RopePoint[]
  config: RopeConfig
  /** Horizontal world-space offset applied to the whole rope this tick,
   *  representing the tug-of-war center of mass shifting toward a side.
   *  Positive = shifted toward Team A (left), negative = toward Team B. */
  private centerOffsetX = 0

  constructor(config: Partial<RopeConfig> = {}) {
    this.config = { ...DEFAULT_ROPE_CONFIG, ...config }
    this.points = this.buildInitialChain()
  }

  private buildInitialChain(): RopePoint[] {
    const { segments, leftAnchor, rightAnchor } = this.config
    const pts: RopePoint[] = []
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = leftAnchor.x + (rightAnchor.x - leftAnchor.x) * t
      const y = leftAnchor.y + (rightAnchor.y - leftAnchor.y) * t
      pts.push({ x, y, prevX: x, prevY: y, pinned: i === 0 || i === segments })
    }
    return pts
  }

  /** Reset the rope to a flat, untensioned line at the current anchors. */
  reset() {
    this.centerOffsetX = 0
    this.points = this.buildInitialChain()
  }

  /**
   * Recompute anchor positions (e.g. on resize) while keeping the rope's
   * current shape relative to its span — call reset() after this if a full
   * snap-back is desired instead.
   */
  setAnchors(left: { x: number; y: number }, right: { x: number; y: number }) {
    this.config.leftAnchor = left
    this.config.rightAnchor = right
    const endIdx = this.points.length - 1
    this.points[0].x = left.x
    this.points[0].y = left.y
    this.points[0].prevX = left.x
    this.points[0].prevY = left.y
    this.points[endIdx].x = right.x
    this.points[endIdx].y = right.y
    this.points[endIdx].prevX = right.x
    this.points[endIdx].prevY = right.y
  }

  /**
   * Advance the simulation by one tick.
   * @param pullForceX horizontal force this tick — positive pulls the rope
   *   toward the left team, negative toward the right team. This is the
   *   net (teamForce - opponentForce) delta from the force engine, already
   *   scaled to world units by the caller. Applied only to interior points,
   *   damped by distance-from-anchor, so it reads as tension propagating
   *   through the rope rather than the whole chain translating as one
   *   rigid body (which would starve the constraint solver — the segment
   *   next to a pinned anchor has nowhere to relax a uniform drift into).
   * @param centerOffsetX the rope's overall horizontal center-of-mass
   *   position this frame (i.e. ropePosition mapped to world space) — the
   *   whole chain is nudged toward this so match state and physics agree.
   */
  step(pullForceX: number, centerOffsetX: number) {
    const { gravity, damping, constraintIterations } = this.config
    this.centerOffsetX = centerOffsetX
    const last = this.points.length - 1

    // Integrate (Verlet). The point directly adjacent to each pinned anchor
    // is excluded from the direct force injection (taper 0 there, ramping
    // up to 1 within a couple of segments) — that single segment has
    // nowhere to relax a large uniform drift into since one of its ends
    // cannot move, so feeding it the full force every tick previously
    // outran the constraint solver and produced runaway stretch there.
    // Everywhere else gets the full pull, so the rope still visibly bows
    // and travels as a whole.
    const rampSegments = Math.min(2, Math.floor(last / 2))
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i]
      if (p.pinned) continue
      const distFromLeftEnd = i
      const distFromRightEnd = last - i
      const edgeDist = Math.min(distFromLeftEnd, distFromRightEnd)
      const taper = rampSegments > 0 ? Math.min(1, edgeDist / rampSegments) : 1
      const vx = (p.x - p.prevX) * damping
      const vy = (p.y - p.prevY) * damping
      const nx = p.x + vx + pullForceX * taper
      const ny = p.y + vy + gravity
      p.prevX = p.x
      p.prevY = p.y
      p.x = nx
      p.y = ny
    }

    // Satisfy distance constraints between neighbors. Alternate sweep
    // direction each iteration (a standard Verlet-rope stabilization trick)
    // so correction pressure doesn't always pile up against the same end.
    const { segmentLength } = this.config
    for (let iter = 0; iter < constraintIterations; iter++) {
      const forward = iter % 2 === 0
      for (let k = 0; k < this.points.length - 1; k++) {
        const i = forward ? k : this.points.length - 2 - k
        const a = this.points[i]
        const b = this.points[i + 1]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001
        const diff = (dist - segmentLength) / dist
        const offX = dx * 0.5 * diff
        const offY = dy * 0.5 * diff
        if (!a.pinned) {
          a.x += offX
          a.y += offY
        }
        if (!b.pinned) {
          b.x -= offX
          b.y -= offY
        }
      }
    }

    // Safety clamp: whatever the constraint solver couldn't fully resolve
    // this tick (e.g. an unusually large or sustained driving force), hard-
    // cap any segment from exceeding a generous multiple of its rest length
    // so the rope can never visually tear apart, regardless of input. Runs
    // several passes (like the main solver above) since a single pass can't
    // fully collapse an extreme one-tick stretch on its own.
    const maxAllowed = segmentLength * 3
    for (let pass = 0; pass < 4; pass++) {
      for (let i = 0; i < this.points.length - 1; i++) {
        const a = this.points[i]
        const b = this.points[i + 1]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001
        if (dist > maxAllowed) {
          const diff = (dist - maxAllowed) / dist
          const offX = dx * 0.5 * diff
          const offY = dy * 0.5 * diff
          if (!a.pinned) {
            a.x += offX
            a.y += offY
          }
          if (!b.pinned) {
            b.x -= offX
            b.y -= offY
          }
        }
      }
    }
  }

  /** World position of the center marker (the point Team A/B fight over). */
  getCenterPoint(): RopePoint {
    const mid = Math.floor(this.points.length / 2)
    return this.points[mid]
  }

  /** Max sag (lowest point's y offset below the anchor line) — used for a
   *  "how taut is the rope" visual/tension read. */
  getMaxSag(): number {
    const { leftAnchor, rightAnchor } = this.config
    let maxSag = 0
    for (const p of this.points) {
      const t = (p.x - leftAnchor.x) / (rightAnchor.x - leftAnchor.x || 1)
      const baselineY = leftAnchor.y + (rightAnchor.y - leftAnchor.y) * t
      maxSag = Math.max(maxSag, p.y - baselineY)
    }
    return maxSag
  }

  /** Current horizontal offset of the rope's center of mass. */
  getCenterOffsetX(): number {
    return this.centerOffsetX
  }
}
