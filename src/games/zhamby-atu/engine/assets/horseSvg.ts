/**
 * Kazakh steppe horse — a single detailed SVG body/head/mane/tail, with legs
 * parameterized by gallop phase (0..1) so BootScene can render four frames
 * of a real gallop cycle instead of a static silhouette. Anatomy follows a
 * proper horse skeleton: shoulder → knee → fetlock → hoof, hip → hock → fetlock → hoof,
 * so the joints bend the right direction at every phase.
 */
import { svgToDataUri } from './svgUtil'

const W = 340
const H = 240

interface LegPose {
  hipX: number
  hipY: number
  upperLen: number
  lowerLen: number
  upperAngle: number // radians, 0 = straight down
  lowerAngle: number // relative to upper
}

function legPath(pose: LegPose, thickness: number, color: string, hoofColor: string) {
  const { hipX, hipY, upperLen, lowerLen, upperAngle, lowerAngle } = pose
  const kneeX = hipX + Math.sin(upperAngle) * upperLen
  const kneeY = hipY + Math.cos(upperAngle) * upperLen
  const totalAngle = upperAngle + lowerAngle
  const hoofX = kneeX + Math.sin(totalAngle) * lowerLen
  const hoofY = kneeY + Math.cos(totalAngle) * lowerLen

  return `
    <path d="M ${hipX} ${hipY} L ${kneeX} ${kneeY}" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" fill="none" />
    <path d="M ${kneeX} ${kneeY} L ${hoofX} ${hoofY}" stroke="${color}" stroke-width="${thickness * 0.72}" stroke-linecap="round" fill="none" />
    <ellipse cx="${hoofX}" cy="${hoofY + 3}" rx="7" ry="4.5" fill="${hoofColor}" transform="rotate(${(totalAngle * 180) / Math.PI * 0.3} ${hoofX} ${hoofY + 3})" />
  `
}

/** phase in [0, 1) — one full gallop stride */
export function horseFrameSvg(phase: number): string {
  const t = phase * Math.PI * 2
  const sin = Math.sin(t)
  const cos = Math.cos(t)
  const sin2 = Math.sin(t + Math.PI * 0.5)

  // Back legs (hindquarters, drive the gallop)
  const backLeft: LegPose = { hipX: 88, hipY: 118, upperLen: 46, lowerLen: 42, upperAngle: -0.15 + sin * 0.55, lowerAngle: 0.35 - sin * 0.5 }
  const backRight: LegPose = { hipX: 104, hipY: 120, upperLen: 46, lowerLen: 42, upperAngle: -0.15 - sin * 0.55, lowerAngle: 0.35 + sin * 0.5 }
  // Front legs (reach forward on the extended phase)
  const frontLeft: LegPose = { hipX: 222, hipY: 122, upperLen: 44, lowerLen: 40, upperAngle: 0.25 + cos * 0.5, lowerAngle: -0.2 - cos * 0.4 }
  const frontRight: LegPose = { hipX: 238, hipY: 120, upperLen: 44, lowerLen: 40, upperAngle: 0.25 - cos * 0.5, lowerAngle: -0.2 + cos * 0.4 }

  // Body bob — the whole torso rises/falls slightly with the stride
  const bodyBob = sin2 * 3.5
  const maneWave = sin * 10

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9a7050" />
      <stop offset="45%" stop-color="#7a5535" />
      <stop offset="100%" stop-color="#4a3018" />
    </linearGradient>
    <linearGradient id="bodyHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="neckGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8a6040" />
      <stop offset="100%" stop-color="#5a3c22" />
    </linearGradient>
    <linearGradient id="saddleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b8331c" />
      <stop offset="60%" stop-color="#8a2313" />
      <stop offset="100%" stop-color="#5c1509" />
    </linearGradient>
    <radialGradient id="eyeGrad" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#3a2a1c" />
      <stop offset="55%" stop-color="#1c1108" />
      <stop offset="100%" stop-color="#0a0602" />
    </radialGradient>
  </defs>

  <!-- Ground contact shadow -->
  <ellipse cx="165" cy="${H - 6}" rx="120" ry="10" fill="#000" opacity="0.16" />

  <!-- Back legs (drawn first, partially behind body) -->
  <g opacity="0.96">
    ${legPath(backLeft, 15, '#3d2a18', '#1c0f06')}
    ${legPath(backRight, 15, '#4a3220', '#1c0f06')}
  </g>

  <!-- Tail — flowing, reacts to gait -->
  <path d="M 62 ${112 + bodyBob} C ${30 + sin * 14} ${118 + bodyBob}, ${8 + sin * 22} ${150 + sin * 12}, ${14 + sin * 18} ${188 + sin * 10}"
        stroke="#1c0f06" stroke-width="13" stroke-linecap="round" fill="none" />
  <path d="M 60 ${110 + bodyBob} C ${26 + sin * 16} ${112 + bodyBob}, ${2 + sin * 24} ${140 + sin * 14}, ${8 + sin * 20} ${178 + sin * 12}"
        stroke="#2e1a0c" stroke-width="7" stroke-linecap="round" fill="none" />

  <!-- BODY — barrel torso -->
  <g transform="translate(0 ${bodyBob})">
    <path d="M 55 130
             C 48 78, 82 46, 138 42
             C 188 38, 226 48, 250 66
             C 268 78, 270 102, 260 122
             C 244 138, 180 146, 128 146
             C 96 146, 66 148, 55 130 Z"
          fill="url(#bodyGrad)" />
    <path d="M 92 48 C 140 36, 198 40, 234 60 C 206 50, 150 44, 92 48 Z" fill="url(#bodyHighlight)" />

    <!-- Neck -->
    <path d="M 240 68
             C 254 46, 268 18, 274 4
             C 284 0, 296 8, 292 20
             C 286 38, 268 58, 252 76 Z"
          fill="url(#neckGrad)" />

    <!-- Mane — flowing tapered strands (stroked curves, not filled spikes) -->
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => {
      const mx = 274 - i * 14.5
      const my = 4 + i * 7.4
      const wave = maneWave * (i / 6)
      const len = 34 + (i % 3) * 6
      return `<path d="M ${mx} ${my} C ${mx - 10 + wave * 0.6} ${my + len * 0.35}, ${mx - 16 + wave} ${my + len * 0.7}, ${mx - 10 + wave} ${my + len}"
                     stroke="${i < 3 ? '#1c0f06' : '#2e1a0c'}" stroke-width="${5.5 - i * 0.3}" stroke-linecap="round" fill="none" opacity="0.94" />`
    }).join('')}

    <!-- Head -->
    <path d="M 270 8
             C 278 0, 300 2, 308 14
             C 314 24, 314 42, 308 56
             C 304 64, 296 68, 288 66
             C 292 74, 290 82, 282 84
             C 272 86, 262 80, 260 70
             C 252 56, 250 32, 258 16
             C 262 10, 266 8, 270 8 Z"
          fill="url(#neckGrad)" />
    <!-- Muzzle -->
    <ellipse cx="298" cy="72" rx="13" ry="10" fill="#a67c5c" transform="rotate(12 298 72)" />
    <ellipse cx="302" cy="70" rx="3.5" ry="2.5" fill="#1c0f06" />
    <!-- Eye — dark gradient iris with a small offset sparkle, not a flat disc -->
    <ellipse cx="284" cy="26" rx="6.5" ry="5.8" fill="url(#eyeGrad)" />
    <ellipse cx="284" cy="26" rx="6.5" ry="5.8" fill="none" stroke="#0a0602" stroke-width="0.8" opacity="0.6" />
    <circle cx="281.5" cy="23.5" r="1.6" fill="#fff" opacity="0.85" />
    <!-- Ear -->
    <path d="M 274 4 L 266 -12 L 262 6 Z" fill="#5a3c22" />
    <path d="M 273 2 L 268 -8 L 264 5 Z" fill="#c09070" />

    <!-- Saddle (Kazakh ornate style, gold trim) -->
    <path d="M 152 44 C 172 36, 204 38, 224 50 C 230 62, 220 78, 200 82 C 176 86, 152 80, 146 66 C 144 58, 146 50, 152 44 Z"
          fill="url(#saddleGrad)" />
    <path d="M 156 46 C 176 40, 202 42, 218 52" stroke="#e0b23a" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path d="M 150 64 C 160 76, 186 82, 212 74" stroke="#e0b23a" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <!-- Saddle ornament diamond -->
    <path d="M 186 54 L 194 62 L 186 70 L 178 62 Z" fill="none" stroke="#e0b23a" stroke-width="1.5" />
  </g>

  <!-- Front legs (drawn last, in front of body) -->
  <g>
    ${legPath(frontLeft, 14, '#5a3c22', '#1c0f06')}
    ${legPath(frontRight, 14, '#6a4830', '#1c0f06')}
  </g>
</svg>`.trim()
}

export function horseFrameDataUri(phase: number): string {
  return svgToDataUri(horseFrameSvg(phase))
}

export const HORSE_SIZE = { width: W, height: H }
