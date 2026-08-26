import { describe, it, expect } from 'vitest'
import { RopePhysics } from '@/games/arqan-tartys/rope/RopePhysics'
import { createTensionState, applyImpulse, stepTension, getTensionOffset } from '@/games/arqan-tartys/rope/RopeTension'

describe('Arqan Tartys — Rope movement (Verlet physics)', () => {
  it('initializes points evenly spaced between anchors', () => {
    const rope = new RopePhysics({ segments: 4, leftAnchor: { x: 0, y: 0 }, rightAnchor: { x: 100, y: 0 } })
    expect(rope.points.length).toBe(5)
    expect(rope.points[0].x).toBe(0)
    expect(rope.points[4].x).toBe(100)
    expect(rope.points[2].x).toBeCloseTo(50, 0)
  })

  it('end points stay pinned to their anchors through simulation', () => {
    const rope = new RopePhysics({ segments: 6 })
    for (let i = 0; i < 30; i++) rope.step(5, 20)
    expect(rope.points[0].x).toBeCloseTo(rope.config.leftAnchor.x, 5)
    expect(rope.points[rope.points.length - 1].x).toBeCloseTo(rope.config.rightAnchor.x, 5)
  })

  it('gravity causes the rope to sag below the anchor baseline', () => {
    const rope = new RopePhysics({ segments: 10, gravity: 0.3 })
    for (let i = 0; i < 20; i++) rope.step(0, 0)
    expect(rope.getMaxSag()).toBeGreaterThan(0)
  })

  it('a sustained pull force moves the rope center of mass', () => {
    const rope = new RopePhysics({ segments: 10 })
    const startCenterX = rope.getCenterPoint().x
    for (let i = 0; i < 40; i++) rope.step(2, 30)
    expect(rope.getCenterPoint().x).toBeGreaterThan(startCenterX)
  })

  it('reset() restores the rope to its flat initial shape', () => {
    const rope = new RopePhysics({ segments: 8 })
    for (let i = 0; i < 20; i++) rope.step(3, 10)
    rope.reset()
    expect(rope.getMaxSag()).toBeCloseTo(0, 5)
  })

  it('distance constraints keep segments bounded under a sustained driving force', () => {
    // A single real pull is a brief impulse, not a force held for many
    // consecutive ticks — this sustains one anyway (25 ticks) as a stress
    // test, and checks the rope stays within the hard safety-clamp bound
    // rather than stretching without limit.
    const rope = new RopePhysics({ segments: 8, segmentLength: 20 })
    for (let i = 0; i < 25; i++) rope.step(1.5, 15)
    for (let i = 0; i < rope.points.length - 1; i++) {
      const a = rope.points[i]
      const b = rope.points[i + 1]
      const dist = Math.hypot(b.x - a.x, b.y - a.y)
      expect(dist).toBeLessThanOrEqual(20 * 3 + 0.01)
    }
  })

  it('never lets a segment exceed the hard safety-clamp distance, even under an extreme sustained force', () => {
    const rope = new RopePhysics({ segments: 8, segmentLength: 20 })
    for (let i = 0; i < 60; i++) rope.step(50, 15) // pathological input
    for (let i = 0; i < rope.points.length - 1; i++) {
      const a = rope.points[i]
      const b = rope.points[i + 1]
      const dist = Math.hypot(b.x - a.x, b.y - a.y)
      expect(dist).toBeLessThanOrEqual(20 * 3 + 0.01)
    }
  })

  it('tension impulses decay to zero over time', () => {
    let state = createTensionState()
    state = applyImpulse(state, 1)
    expect(state.amplitude).toBeGreaterThan(0)
    for (let i = 0; i < 200; i++) state = stepTension(state)
    expect(state.amplitude).toBe(0)
  })

  it('tension offset tapers to zero at the pinned rope ends', () => {
    let state = createTensionState()
    state = applyImpulse(state, 1)
    const endOffset = getTensionOffset(state, 0, 10)
    expect(endOffset.y).toBe(0)
  })
})
