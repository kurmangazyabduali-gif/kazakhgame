import { svgToDataUri } from './svgUtil'

/**
 * 2D Cartoon Horse matching the exact reference style provided by the user.
 * 
 * Key Features from Reference:
 * - Chestnut brown body (#A65D2D) with soft rounded curves.
 * - Flowing white/cream mane (#F2EFE9) and forelock.
 * - Unified head shape (NO protruding lips / NO botox).
 * - Friendly cartoon eye with white iris/pupil and highlight dot.
 * - Brown bridle with gold rosette buttons (#DA9B26).
 * - Curved bushy dark brown tail (#5C361A).
 * - Charcoal saddle (#403C3A) on a golden/cream saddle pad.
 * - Dark hooves (#2A2725).
 */

const W = 420
const H = 250

const C = {
  body: '#A65D2D',         // Chestnut brown
  bodyDark: '#85461E',     // Shadow
  bodyLight: '#BA6D39',    // Highlight
  mane: '#F2EFE9',         // White / cream mane
  maneShadow: '#D8D4CC',   // Shadow for white mane
  tail: '#5C361A',         // Dark brown tail
  tailDark: '#3D220F',
  bridle: '#5C361A',       // Leather bridle
  gold: '#DA9B26',         // Gold rosette / trim
  saddle: '#403C3A',       // Charcoal saddle
  saddlePad: '#E6D08E',    // Cream saddle pad
  hoof: '#2A2725',         // Dark hooves
  eyeWhite: '#FFFFFF',
  eyeIris: '#5C361A',
  eyePupil: '#1A1009',
  snout: '#8F4E24',        // Soft snout tone
  nostril: '#592E12',
}

const { sin, cos, PI, abs, max } = Math

interface LegAngles { upper: number; lower: number }

function buildLeg(
  rx: number, ry: number,
  uLen: number, lLen: number,
  a: LegAngles,
  w: number,
  isShadow: boolean
): string {
  const kneeX = rx + sin(a.upper) * uLen
  const kneeY = ry + cos(a.upper) * uLen
  const la = a.upper + a.lower
  const hoofX = kneeX + sin(la) * lLen
  const hoofY = kneeY + cos(la) * lLen

  const legColor = isShadow ? C.bodyDark : C.body
  const strokeColor = isShadow ? '#6D3816' : '#88491F'

  return `
    <!-- Upper Leg (Thigh / Shoulder) -->
    <line x1="${rx}" y1="${ry}" x2="${kneeX}" y2="${kneeY}"
          stroke="${legColor}" stroke-width="${w}" stroke-linecap="round" />
    
    <!-- Lower Leg -->
    <line x1="${kneeX}" y1="${kneeY}" x2="${hoofX}" y2="${hoofY}"
          stroke="${legColor}" stroke-width="${w * 0.75}" stroke-linecap="round" />

    <!-- Joint Bump -->
    <circle cx="${kneeX}" cy="${kneeY}" r="${w * 0.45}" fill="${legColor}" />

    <!-- Hoof -->
    <path d="M ${hoofX - 7} ${hoofY} L ${hoofX + 7} ${hoofY} L ${hoofX + 5} ${hoofY + 8} L ${hoofX - 5} ${hoofY + 8} Z"
          fill="${C.hoof}" />
  `
}

export function horseFrameSvg(phase: number): string {
  const t = phase * PI * 2

  const phA = t
  const phB = t + PI

  const bob = -abs(sin(t * 2)) * 3.5
  const headNod = cos(t) * 2

  // Gallop leg movement
  const lfU = 0.12 + sin(phA) * 0.5
  const lfL = -0.1 - max(0, sin(phA)) * 0.4
  const rfU = 0.12 + sin(phB) * 0.5
  const rfL = -0.1 - max(0, sin(phB)) * 0.4
  const lhU = -0.1 + sin(phB) * 0.48
  const lhL =  0.28 - max(0, -sin(phB)) * 0.4
  const rhU = -0.1 + sin(phA) * 0.48
  const rhL =  0.28 - max(0, -sin(phA)) * 0.4

  const hRX = 100, hRY = 120 + bob
  const fRX = 225, fRY = 120 + bob

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">

<!-- Ground Shadow -->
<ellipse cx="165" cy="${H - 10}" rx="125" ry="6" fill="#000" opacity="0.18" />

<!-- ═══ FAR-SIDE LEGS (Behind Body) ═══ -->
${buildLeg(hRX + 10, hRY + 2, 42, 40, { upper: lhU, lower: lhL }, 15, true)}
${buildLeg(fRX + 10, fRY + 2, 40, 38, { upper: rfU, lower: rfL }, 14, true)}

<!-- ═══ BUSHY CURVED TAIL (Matches Reference) ═══ -->
<g transform="translate(0 ${bob})">
  <path d="M 72 90 Q 40 95 38 135 Q 36 170 52 178 Q 62 165 52 135 Q 56 105 72 90 Z"
        fill="${C.tail}" />
  <path d="M 68 95 Q 44 102 42 135 Q 40 162 50 170"
        fill="none" stroke="${C.tailDark}" stroke-width="2" opacity="0.5" />
</g>

<!-- ═══ MAIN BODY (Matches Reference) ═══ -->
<g transform="translate(0 ${bob})">
  <!-- Torso Mass -->
  <path d="
    M 78 95
    C 70 70, 85 52, 115 52
    C 145 52, 185 50, 215 55
    C 235 60, 245 75, 242 92
    C 238 115, 205 125, 165 125
    C 125 125, 90 120, 78 95 Z"
    fill="${C.body}" />

  <!-- Body Shadow Underside -->
  <path d="M 90 110 C 130 125, 180 125, 230 110 C 205 122, 145 124, 90 110 Z"
        fill="${C.bodyDark}" opacity="0.4" />

  <!-- Body Top Highlight -->
  <path d="M 95 55 C 135 53, 175 52, 215 57 C 175 53, 135 54, 95 55 Z"
        fill="${C.bodyLight}" opacity="0.6" />

  <!-- Tucked Rear Flank Line -->
  <path d="M 105 122 C 95 105, 90 90, 88 75" fill="none" stroke="${C.bodyDark}" stroke-width="2" opacity="0.3" />
</g>

<!-- ═══ ELEGANT UPRIGHT NECK ═══ -->
<g transform="translate(0 ${bob})">
  <path d="
    M 215 70
    C 225 48, 235 25, ${245 + headNod} 10
    C ${265 + headNod} 10, ${272 + headNod} 25, ${262 + headNod} 45
    C ${252 + headNod} 65, 240 85, 228 95 Z"
    fill="${C.body}" />

  <!-- Neck Highlight -->
  <path d="M 220 65 C 230 45, 240 25, ${248 + headNod} 12"
        fill="none" stroke="${C.bodyLight}" stroke-width="3" opacity="0.5" />
</g>

<!-- ═══ WHITE / CREAM FLOWING MANE (Matches Reference) ═══ -->
<g transform="translate(0 ${bob})">
  <!-- Main Mane Sweep down the neck -->
  <path d="
    M ${245 + headNod} 2
    C ${220 + headNod} 15, ${210 + headNod} 45, ${208 + headNod} 80
    C ${215 + headNod} 80, ${225 + headNod} 60, ${232 + headNod} 40
    C ${238 + headNod} 30, ${248 + headNod} 15, ${245 + headNod} 2 Z"
    fill="${C.mane}" stroke="${C.maneShadow}" stroke-width="1" />

  <!-- Mane Locks Detail -->
  <path d="M ${240 + headNod} 10 Q ${225 + headNod} 30 ${215 + headNod} 60"
        fill="none" stroke="${C.maneShadow}" stroke-width="1.5" opacity="0.6" />
</g>

<!-- ═══ CLEAN UNIFIED CARTOON HEAD (Complete, Proportionate Head) ═══ -->
<g transform="translate(${headNod} 0)">
  <!-- Main Head Shape (Scaled larger so eyes and features fit comfortably inside) -->
  <path d="
    M 240 10
    C 255 -2, 282 0, 300 14
    C 318 26, 332 42, 326 60
    C 320 74, 300 82, 280 78
    C 260 74, 242 64, 235 46
    C 230 30, 232 16, 240 10 Z"
    fill="${C.body}" />

  <!-- Soft Snout Area -->
  <path d="M 288 32 C 308 42, 326 52, 320 66 C 312 76, 295 78, 282 74 Z" fill="${C.snout}" />

  <!-- Nostril Circle -->
  <circle cx="308" cy="58" r="4" fill="${C.nostril}" />

  <!-- Mouth Line (Clean smile line) -->
  <path d="M 314 66 Q 302 72 290 68" fill="none" stroke="${C.bodyDark}" stroke-width="1.8" stroke-linecap="round" />

  <!-- Cartoon Eye (White circle + iris + pupil + highlight dot - centered nicely) -->
  <g transform="translate(272, 28)">
    <!-- Eye White -->
    <circle cx="0" cy="0" r="7.5" fill="${C.eyeWhite}" stroke="${C.bodyDark}" stroke-width="0.8" />
    <!-- Iris -->
    <circle cx="1" cy="0" r="5" fill="${C.eyeIris}" />
    <!-- Pupil -->
    <circle cx="1.5" cy="0" r="3" fill="${C.eyePupil}" />
    <!-- Highlight Dot -->
    <circle cx="-1" cy="-2" r="1.8" fill="#FFFFFF" />
  </g>

  <!-- Eyelid / Brow Curve -->
  <path d="M 264 18 Q 272 13 280 18" fill="none" stroke="${C.bodyDark}" stroke-width="1.8" stroke-linecap="round" />

  <!-- Ears (Pointing Up, exactly like reference) -->
  <!-- Back Ear -->
  <path d="M 244 8 L 238 -15 L 250 5 Z" fill="${C.bodyDark}" />
  <!-- Front Ear -->
  <path d="M 252 5 L 254 -18 L 262 5 Z" fill="${C.body}" stroke="${C.bodyDark}" stroke-width="0.8" />
  <path d="M 254 7 L 255 -12 L 259 6 Z" fill="#D98B8B" opacity="0.5" />

  <!-- White Forelock Tuft (On top of head between ears) -->
  <path d="M 248 3 Q 262 -12 276 3 Q 262 6 248 3 Z" fill="${C.mane}" stroke="${C.maneShadow}" stroke-width="0.8" />

  <!-- ═══ BRIDLE HARNESS (Matches Reference) ═══ -->
  <!-- Head Strap -->
  <path d="M 254 5 L 260 56" fill="none" stroke="${C.bridle}" stroke-width="2.5" />
  <!-- Muzzle Strap -->
  <path d="M 276 38 L 308 55" fill="none" stroke="${C.bridle}" stroke-width="2.5" />
  <!-- Cheek Strap -->
  <path d="M 258 30 L 292 46" fill="none" stroke="${C.bridle}" stroke-width="2" />
  
  <!-- Gold Rosette Buttons (At bridle junctions, exact reference detail!) -->
  <circle cx="256" cy="28" r="3.5" fill="${C.gold}" stroke="#9E6E17" stroke-width="0.8" />
  <circle cx="292" cy="46" r="3.5" fill="${C.gold}" stroke="#9E6E17" stroke-width="0.8" />
  <circle cx="260" cy="56" r="3.5" fill="${C.gold}" stroke="#9E6E17" stroke-width="0.8" />

  <!-- Reins extending to rider -->
  <path d="M 292 46 C 248 62, 212 55, 195 25" fill="none" stroke="${C.bridle}" stroke-width="2" opacity="0.8" />
</g>

<!-- ═══ SADDLE & SADDLE PAD (Matches Reference) ═══ -->
<g transform="translate(0 ${bob})">
  <!-- Saddle Pad (Golden / Cream with border) -->
  <path d="M 130 52 L 180 50 L 185 85 L 125 88 Z"
        fill="${C.saddlePad}" stroke="${C.gold}" stroke-width="2" rx="3" />

  <!-- Dark Charcoal Saddle (Matches Reference) -->
  <path d="M 132 48 C 150 42, 172 44, 182 52 C 185 64, 178 78, 160 80 C 142 82, 132 75, 130 62 Z"
        fill="${C.saddle}" />
  <path d="M 138 48 C 155 44, 175 46, 178 54" fill="none" stroke="#605B58" stroke-width="1.5" />

  <!-- Girth Strap -->
  <path d="M 158 80 L 158 120" stroke="${C.bridle}" stroke-width="4" stroke-linecap="round" />
</g>

<!-- ═══ NEAR-SIDE LEGS (In Front of Body) ═══ -->
${buildLeg(hRX, hRY, 42, 40, { upper: rhU, lower: rhL }, 15, false)}
${buildLeg(fRX, fRY, 40, 38, { upper: lfU, lower: lfL }, 14, false)}

</svg>`.trim()
}

export function horseFrameDataUri(phase: number): string {
  return svgToDataUri(horseFrameSvg(phase))
}

export const HORSE_SIZE = { width: W, height: H }
