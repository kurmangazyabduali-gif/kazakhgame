/**
 * Tug-of-war athlete SVGs — stylized-realistic 2D, modern sportswear with
 * Kazakh ornamental trim. Each character is generated from a body-type +
 * pose combination so the 4-per-team roster reads as genuinely different
 * people (varied height/build/stance), not "identical heads on different
 * bodies."
 *
 * Facing: characters are authored facing LEFT (pulling toward negative x),
 * matching Team A's pull direction. Team B (right side, pulling toward
 * positive x) reuses the same textures mirrored via Phaser's setFlipX.
 */
import { svgToDataUri } from './svgUtil'

const W = 160
const H = 220

export type BodyType = 'LEAN' | 'STOCKY' | 'TALL' | 'COMPACT'
export type PoseState = 'IDLE' | 'PULL' | 'STRAIN' | 'RECOVER' | 'VICTORY' | 'DEFEAT'

export interface CharacterSpec {
  body: BodyType
  /** Team-accent color for the kit trim (deep blue for Team A / gold for
   *  Team B, per the spec palette). */
  accent: string
  /** Skin tone variation so the 4 teammates read as distinct individuals. */
  skinTone: string
  /** Hair/headwear variation. */
  headwear: 'CAP' | 'HEADBAND' | 'BARE' | 'SCARF'
}

const BODY_METRICS: Record<BodyType, { torsoW: number; torsoH: number; limbW: number; headR: number; heightScale: number }> = {
  LEAN: { torsoW: 34, torsoH: 62, limbW: 11, headR: 16, heightScale: 1.04 },
  STOCKY: { torsoW: 46, torsoH: 58, limbW: 15, headR: 17, heightScale: 0.94 },
  TALL: { torsoW: 36, torsoH: 68, limbW: 12, headR: 15.5, heightScale: 1.12 },
  COMPACT: { torsoW: 40, torsoH: 54, limbW: 13, headR: 16.5, heightScale: 0.9 },
}

/** Pose parameters: torso lean angle (deg, positive leans back/away from
 *  rope = pulling hard), front/back leg dig-in angle, arm pull position. */
const POSE_PARAMS: Record<PoseState, { lean: number; frontLegDig: number; backLegDig: number; armPull: number; kneeBend: number }> = {
  IDLE: { lean: 2, frontLegDig: 4, backLegDig: -4, armPull: 0.15, kneeBend: 6 },
  PULL: { lean: 22, frontLegDig: 22, backLegDig: -18, armPull: 0.85, kneeBend: 18 },
  STRAIN: { lean: 30, frontLegDig: 28, backLegDig: -24, armPull: 1, kneeBend: 24 },
  RECOVER: { lean: 8, frontLegDig: 8, backLegDig: -6, armPull: 0.3, kneeBend: 10 },
  VICTORY: { lean: -18, frontLegDig: -6, backLegDig: 10, armPull: -0.4, kneeBend: 4 },
  DEFEAT: { lean: 34, frontLegDig: 4, backLegDig: 2, armPull: 0.1, kneeBend: 30 },
}

function limb(x1: number, y1: number, x2: number, y2: number, width: number, color: string) {
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" fill="none" />`
}

export function characterSvg(spec: CharacterSpec, pose: PoseState): string {
  const m = BODY_METRICS[spec.body]
  const p = POSE_PARAMS[pose]
  const scale = m.heightScale

  // Anchor point: feet baseline, roughly centered horizontally.
  const cx = W * 0.52
  const hipY = H - 58 * scale
  const shoulderY = hipY - m.torsoH * scale

  const leanRad = (p.lean * Math.PI) / 180
  const shoulderX = cx + Math.sin(leanRad) * m.torsoH * scale * 0.5
  const shoulderYLean = shoulderY - Math.cos(leanRad) * 4

  // Legs: back leg (right, trailing) digs in behind; front leg (left,
  // leading) plants ahead — classic tug-of-war stance.
  const frontFootX = cx - 34 - p.frontLegDig * 0.6
  const backFootX = cx + 30 + Math.abs(p.backLegDig) * 0.5
  const kneeDrop = 34 * scale
  const shinDrop = 32 * scale

  const frontKneeX = cx - 14 + p.kneeBend * 0.2
  const backKneeX = cx + 16 - p.kneeBend * 0.15

  const skinTone = spec.skinTone
  const kitBody = '#2b3a52'
  const kitTrim = spec.accent

  // Rope-gripping arms: both hands reach toward the rope (behind the
  // character, at roughly shoulder height), pulled back harder in
  // PULL/STRAIN via armPull.
  const gripX = shoulderX + 46 + p.armPull * 26
  const gripY = shoulderYLean - 6 + p.armPull * 10

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="kitGrad-${spec.accent.slice(1)}-${spec.body}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${kitBody}" />
      <stop offset="100%" stop-color="#161f2e" />
    </linearGradient>
    <radialGradient id="headGrad-${spec.body}" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="${lighten(skinTone, 18)}" />
      <stop offset="100%" stop-color="${skinTone}" />
    </radialGradient>
  </defs>

  <!-- Ground contact shadow -->
  <ellipse cx="${cx}" cy="${H - 6}" rx="46" ry="8" fill="#000" opacity="0.18" />

  <!-- Back leg (trailing, digs in) -->
  ${limb(cx + 6, hipY, backKneeX, hipY + kneeDrop, m.limbW, '#1c2433')}
  ${limb(backKneeX, hipY + kneeDrop, backFootX, hipY + kneeDrop + shinDrop, m.limbW * 0.85, '#1c2433')}
  <ellipse cx="${backFootX}" cy="${hipY + kneeDrop + shinDrop + 3}" rx="13" ry="6" fill="#0d1219" />

  <!-- Back arm (far arm, partially occluded) -->
  ${limb(shoulderX - 4, shoulderYLean + 6, gripX - 8, gripY + 4, m.limbW * 0.75, lighten(skinTone, -6))}

  <!-- Torso (leaning per pose) -->
  <g>
    <path d="M ${cx - m.torsoW * 0.5} ${hipY}
             C ${cx - m.torsoW * 0.55} ${hipY - m.torsoH * scale * 0.4}, ${shoulderX - m.torsoW * 0.5} ${shoulderYLean + m.torsoH * scale * 0.1}, ${shoulderX - m.torsoW * 0.42} ${shoulderYLean}
             L ${shoulderX + m.torsoW * 0.42} ${shoulderYLean}
             C ${shoulderX + m.torsoW * 0.5} ${shoulderYLean + m.torsoH * scale * 0.1}, ${cx + m.torsoW * 0.55} ${hipY - m.torsoH * scale * 0.4}, ${cx + m.torsoW * 0.5} ${hipY}
             Z"
          fill="url(#kitGrad-${spec.accent.slice(1)}-${spec.body})" />
    <!-- Kit trim — Kazakh ornament-inspired diagonal band -->
    <path d="M ${cx - m.torsoW * 0.5} ${hipY - m.torsoH * scale * 0.35}
             L ${shoulderX - m.torsoW * 0.3} ${shoulderYLean + m.torsoH * scale * 0.15}"
          stroke="${kitTrim}" stroke-width="6" opacity="0.9" />
    <path d="M ${cx - m.torsoW * 0.35} ${hipY - m.torsoH * scale * 0.2} L ${cx - m.torsoW * 0.2} ${hipY - m.torsoH * scale * 0.32} L ${cx - m.torsoW * 0.05} ${hipY - m.torsoH * scale * 0.2} L ${cx - m.torsoW * 0.2} ${hipY - m.torsoH * scale * 0.08} Z"
          fill="${kitTrim}" opacity="0.85" />
    <!-- Waist belt -->
    <rect x="${cx - m.torsoW * 0.52}" y="${hipY - 6}" width="${m.torsoW * 1.04}" height="7" fill="${kitTrim}" opacity="0.7" />
  </g>

  <!-- Front leg (leading, planted) -->
  ${limb(cx - 6, hipY, frontKneeX, hipY + kneeDrop, m.limbW, '#232d40')}
  ${limb(frontKneeX, hipY + kneeDrop, frontFootX, hipY + kneeDrop + shinDrop, m.limbW * 0.85, '#232d40')}
  <ellipse cx="${frontFootX}" cy="${hipY + kneeDrop + shinDrop + 3}" rx="14" ry="6.5" fill="#0d1219" />

  <!-- Front arm (near arm, gripping the rope) -->
  ${limb(shoulderX + 4, shoulderYLean + 4, gripX, gripY, m.limbW * 0.8, skinTone)}
  <circle cx="${gripX}" cy="${gripY}" r="${m.limbW * 0.55}" fill="${lighten(skinTone, -8)}" />

  <!-- Head -->
  <g transform="translate(${shoulderX - m.torsoW * 0.05} ${shoulderYLean - m.headR * 1.5})">
    <circle cx="0" cy="0" r="${m.headR}" fill="url(#headGrad-${spec.body})" />
    <!-- Eyes -->
    <circle cx="${-m.headR * 0.32}" cy="${-m.headR * 0.05}" r="1.7" fill="#1c1108" />
    <circle cx="${m.headR * 0.15}" cy="${-m.headR * 0.05}" r="1.7" fill="#1c1108" />
    <!-- Determined brow line (more pronounced under strain) -->
    <path d="M ${-m.headR * 0.5} ${-m.headR * 0.28} L ${-m.headR * 0.12} ${-m.headR * (0.18 + p.lean / 400)}"
          stroke="#1c1108" stroke-width="1.4" fill="none" stroke-linecap="round" />
    ${headwearSvg(spec.headwear, m.headR, kitTrim)}
  </g>
</svg>`.trim()
}

function headwearSvg(kind: CharacterSpec['headwear'], headR: number, accent: string): string {
  switch (kind) {
    case 'CAP':
      return `<path d="M ${-headR} ${-headR * 0.55} A ${headR} ${headR} 0 0 1 ${headR} ${-headR * 0.55} L ${headR * 0.9} ${-headR * 0.75} L ${-headR * 0.9} ${-headR * 0.75} Z" fill="${accent}" />
              <ellipse cx="${headR * 0.6}" cy="${-headR * 0.6}" rx="${headR * 0.55}" ry="${headR * 0.18}" fill="${accent}" opacity="0.9" />`
    case 'HEADBAND':
      return `<rect x="${-headR}" y="${-headR * 0.25}" width="${headR * 2}" height="${headR * 0.32}" fill="${accent}" />
              <path d="M ${-headR * 0.15} ${-headR * 0.1} L 0 ${-headR * 0.32} L ${headR * 0.15} ${-headR * 0.1} Z" fill="#fff" opacity="0.8" />`
    case 'SCARF':
      return `<path d="M ${-headR * 0.9} ${headR * 0.5} Q 0 ${headR * 1.1} ${headR * 0.9} ${headR * 0.5}" stroke="${accent}" stroke-width="6" fill="none" stroke-linecap="round" />`
    case 'BARE':
    default:
      return `<path d="M ${-headR * 0.85} ${-headR * 0.5} Q 0 ${-headR * 1.15} ${headR * 0.85} ${-headR * 0.5}" fill="#241a10" opacity="0.92" />`
  }
}

function lighten(hex: string, amount: number): string {
  const c = hex.replace('#', '')
  const num = parseInt(c, 16)
  let r = (num >> 16) + amount
  let g = ((num >> 8) & 0xff) + amount
  let b = (num & 0xff) + amount
  r = Math.max(0, Math.min(255, r))
  g = Math.max(0, Math.min(255, g))
  b = Math.max(0, Math.min(255, b))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function characterDataUri(spec: CharacterSpec, pose: PoseState): string {
  return svgToDataUri(characterSvg(spec, pose))
}

export const CHARACTER_SIZE = { width: W, height: H }

/** Team A roster — 4 visually distinct athletes (varied body type, skin
 *  tone, headwear) in deep-blue kit. */
export const TEAM_A_ROSTER: CharacterSpec[] = [
  { body: 'LEAN', accent: '#d4af37', skinTone: '#c68a5c', headwear: 'CAP' },
  { body: 'STOCKY', accent: '#d4af37', skinTone: '#8a5a3a', headwear: 'HEADBAND' },
  { body: 'TALL', accent: '#d4af37', skinTone: '#e0ab7c', headwear: 'BARE' },
  { body: 'COMPACT', accent: '#d4af37', skinTone: '#9c6a42', headwear: 'SCARF' },
]

/** Team B roster — same variety, warm-brown/gold kit to read as the rival
 *  team at a glance. */
export const TEAM_B_ROSTER: CharacterSpec[] = [
  { body: 'STOCKY', accent: '#1a5c8c', skinTone: '#b87d52', headwear: 'BARE' },
  { body: 'LEAN', accent: '#1a5c8c', skinTone: '#7a4a2e', headwear: 'SCARF' },
  { body: 'COMPACT', accent: '#1a5c8c', skinTone: '#d89e6e', headwear: 'HEADBAND' },
  { body: 'TALL', accent: '#1a5c8c', skinTone: '#94623e', headwear: 'CAP' },
]
