import { svgToDataUri } from './svgUtil'

/**
 * Kazakh mounted archer, upper body only (legs are implied by the saddle
 * seat — the horse sprite handles the lower silhouette). Dressed in a
 * chapan-style coat with gold trim and a tymak fur hat, rather than a
 * generic rider silhouette. Three poses share the same torso/head so the
 * transition between them reads as one figure, not a costume swap.
 *
 * IMPORTANT: the canvas is wide enough (0..250) to hold the full extent of
 * every pose's bow/arm geometry, including the idle pose's bow which sits
 * to the LEFT of the torso (its leftmost control point is TX-52) and the
 * draw/release poses' bow+arrow which extend well to the RIGHT (rightmost
 * point TX+160) — anything drawn outside the viewBox gets silently clipped
 * when Phaser rasterizes the SVG. TX must stay >= 52 to keep the idle bow
 * in-bounds and TX + 160 <= W to keep the drawn arrow in-bounds.
 */

const W = 250
const H = 170

// Torso/head sit inside the wide canvas so both the idle bow (far left, needs
// TX >= 52 to stay in-bounds) and the draw/release bow+arrow (far right, needs
// TX + 160 <= W) have room either side, with margin for stroke width.
const TX = 65 // torso horizontal offset baked into every path below

// Face/hat geometry is shared across poses. The fur trim band is kept above
// the eye line (eyes sit at y=34) so it never paints over them — the previous
// version had the trim dipping to y=40, occluding the eyes underneath it.
const HEAD_TORSO = `
  <!-- Torso: chapan coat, terracotta with gold trim -->
  <path d="M ${TX + 30} 70
           C ${TX + 22} 78, ${TX + 18} 100, ${TX + 22} 128
           C ${TX + 24} 140, ${TX + 32} 148, ${TX + 46} 150
           L ${TX + 84} 150
           C ${TX + 96} 148, ${TX + 104} 138, ${TX + 104} 124
           C ${TX + 104} 100, ${TX + 98} 78, ${TX + 88} 68
           C ${TX + 74} 56, ${TX + 44} 56, ${TX + 30} 70 Z"
        fill="url(#coatGrad)" />
  <path d="M ${TX + 30} 70 C ${TX + 22} 78, ${TX + 18} 100, ${TX + 22} 128" stroke="#e0b23a" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.85" />
  <path d="M ${TX + 88} 68 C ${TX + 98} 78, ${TX + 104} 100, ${TX + 104} 124" stroke="#e0b23a" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.85" />
  <!-- Belt (kise) -->
  <rect x="${TX + 24}" y="118" width="78" height="12" rx="3" fill="#3a2a14" />
  <circle cx="${TX + 63}" cy="124" r="6" fill="#e0b23a" />

  <!-- Head -->
  <ellipse cx="${TX + 63}" cy="40" rx="20" ry="21" fill="url(#faceGrad)" />
  <!-- Ears -->
  <ellipse cx="${TX + 42}" cy="42" rx="3.5" ry="5" fill="#c8945a" />
  <ellipse cx="${TX + 84}" cy="42" rx="3.5" ry="5" fill="#c8945a" />
  <!-- Brows -->
  <path d="M ${TX + 49} 33 L ${TX + 59} 31" stroke="#3a2410" stroke-width="2" stroke-linecap="round" />
  <path d="M ${TX + 67} 31 L ${TX + 77} 33" stroke="#3a2410" stroke-width="2" stroke-linecap="round" />
  <!-- Eyes -->
  <ellipse cx="${TX + 55}" cy="37" rx="2.8" ry="3.2" fill="#1c0f06" />
  <ellipse cx="${TX + 71}" cy="37" rx="2.8" ry="3.2" fill="#1c0f06" />
  <circle cx="${TX + 54}" cy="36" r="0.9" fill="#fff" opacity="0.85" />
  <circle cx="${TX + 70}" cy="36" r="0.9" fill="#fff" opacity="0.85" />
  <!-- Mouth / faint smile line -->
  <path d="M ${TX + 55} 49 C ${TX + 58} 52, ${TX + 68} 52, ${TX + 71} 49" stroke="#8a5a3a" stroke-width="1.6" fill="none" opacity="0.6" stroke-linecap="round" />
  <!-- Tymak (fur hat) — crown, then a fur trim band kept ABOVE the eye line (y<=33) -->
  <path d="M ${TX + 40} 26 C ${TX + 42} 6, ${TX + 84} 6, ${TX + 86} 26 C ${TX + 87} 29, ${TX + 82} 32, ${TX + 63} 32 C ${TX + 44} 32, ${TX + 39} 29, ${TX + 40} 26 Z" fill="url(#hatGrad)" />
  <path d="M ${TX + 39} 26 C ${TX + 41} 31, ${TX + 85} 31, ${TX + 87} 26 C ${TX + 88} 33, ${TX + 80} 37, ${TX + 63} 37 C ${TX + 46} 37, ${TX + 38} 33, ${TX + 39} 26 Z" fill="#f2ede2" />
  <path d="M ${TX + 38} 30 L ${TX + 29} 48 C ${TX + 33} 52, ${TX + 42} 50, ${TX + 44} 44 Z" fill="#f2ede2" />
  <path d="M ${TX + 88} 30 L ${TX + 97} 48 C ${TX + 93} 52, ${TX + 84} 50, ${TX + 82} 44 Z" fill="#f2ede2" />
`

const DEFS = `
  <linearGradient id="coatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#c1502e" />
    <stop offset="60%" stop-color="#8a341c" />
    <stop offset="100%" stop-color="#5c1f0f" />
  </linearGradient>
  <radialGradient id="faceGrad" cx="40%" cy="35%" r="70%">
    <stop offset="0%" stop-color="#e8b888" />
    <stop offset="100%" stop-color="#c08a5c" />
  </radialGradient>
  <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#5a3c22" />
    <stop offset="100%" stop-color="#2e1a0c" />
  </linearGradient>
  <linearGradient id="bowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#c89a5c" />
    <stop offset="50%" stop-color="#8a5a2c" />
    <stop offset="100%" stop-color="#c89a5c" />
  </linearGradient>
`

/** Bow + arm idle at the rider's side, string relaxed. The hand grips the
 *  bow's midpoint directly (no gap) so the silhouette reads as one held
 *  object instead of a floating prop. */
export function riderIdleSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${DEFS}</defs>
  <!-- Bow, unstrung tension, resting — drawn first so the gripping hand overlaps it -->
  <path d="M ${TX - 38} 62 C ${TX - 56} 84, ${TX - 56} 120, ${TX - 38} 142" stroke="url(#bowGrad)" stroke-width="7" stroke-linecap="round" fill="none" />
  <path d="M ${TX - 38} 62 L ${TX - 38} 142" stroke="#f0ead8" stroke-width="1.4" opacity="0.85" />
  <!-- Rear arm holding the bow, relaxed — reaches all the way to the grip -->
  <path d="M ${TX - 2} 80 C ${TX - 16} 86, ${TX - 30} 92, ${TX - 38} 102" stroke="#a05838" stroke-width="11" stroke-linecap="round" fill="none" />
  <!-- Grip wrap where hand meets bow -->
  <circle cx="${TX - 38}" cy="102" r="5.5" fill="#3a2a14" />
  ${HEAD_TORSO}
  <!-- Front arm resting on thigh -->
  <path d="M ${TX + 92} 92 C ${TX + 100} 100, ${TX + 100} 112, ${TX + 92} 118" stroke="#8a341c" stroke-width="11" stroke-linecap="round" fill="none" />
</svg>`.trim()
}

/** Bow fully drawn, arrow nocked, string pulled to the cheek. */
export function riderDrawSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${DEFS}</defs>
  <!-- Bow arm extended forward -->
  <path d="M ${TX + 90} 86 C ${TX + 108} 82, ${TX + 122} 74, ${TX + 130} 60" stroke="#8a341c" stroke-width="11" stroke-linecap="round" fill="none" />
  <!-- Bow, drawn curve -->
  <path d="M ${TX + 132} 26 C ${TX + 150} 50, ${TX + 150} 92, ${TX + 132} 116" stroke="url(#bowGrad)" stroke-width="7.5" stroke-linecap="round" fill="none" />
  <!-- Grip -->
  <circle cx="${TX + 137}" cy="71" r="6" fill="#3a2a14" />
  <!-- Drawn string, pulled back to cheek -->
  <path d="M ${TX + 132} 26 L ${TX + 46} 66 L ${TX + 132} 116" stroke="#f0ead8" stroke-width="1.8" fill="none" />
  <!-- Nocked arrow -->
  <path d="M ${TX + 46} 66 L ${TX + 150} 66" stroke="#9b7040" stroke-width="3.5" stroke-linecap="round" />
  <path d="M ${TX + 150} 66 L ${TX + 160} 62 L ${TX + 150} 70 Z" fill="#c8d0d8" />
  <path d="M ${TX + 44} 63 L ${TX + 30} 58 L ${TX + 38} 66 L ${TX + 30} 74 L ${TX + 44} 69 Z" fill="#cc2200" />
  ${HEAD_TORSO}
  <!-- Draw arm pulled back to cheek -->
  <path d="M ${TX + 24} 78 C ${TX + 12} 74, ${TX} 68, ${TX - 6} 60" stroke="#a05838" stroke-width="10" stroke-linecap="round" fill="none" />
</svg>`.trim()
}

/** Instant just after release — string still vibrating, arm following through. */
export function riderReleaseSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>${DEFS}</defs>
  <path d="M ${TX + 90} 86 C ${TX + 108} 82, ${TX + 122} 74, ${TX + 130} 60" stroke="#8a341c" stroke-width="11" stroke-linecap="round" fill="none" />
  <path d="M ${TX + 132} 26 C ${TX + 150} 50, ${TX + 150} 92, ${TX + 132} 116" stroke="url(#bowGrad)" stroke-width="7.5" stroke-linecap="round" fill="none" />
  <circle cx="${TX + 137}" cy="71" r="6" fill="#3a2a14" />
  <!-- String snapped back to rest, mid-vibration -->
  <path d="M ${TX + 132} 26 C ${TX + 118} 60, ${TX + 146} 66, ${TX + 132} 116" stroke="#f0ead8" stroke-width="1.8" fill="none" />
  ${HEAD_TORSO}
  <!-- Draw arm recoiling outward past its start point (follow-through) -->
  <path d="M ${TX + 22} 76 C ${TX + 6} 68, ${TX - 8} 58, ${TX - 16} 46" stroke="#a05838" stroke-width="10" stroke-linecap="round" fill="none" />
</svg>`.trim()
}

export function riderIdleDataUri(): string { return svgToDataUri(riderIdleSvg()) }
export function riderDrawDataUri(): string { return svgToDataUri(riderDrawSvg()) }
export function riderReleaseDataUri(): string { return svgToDataUri(riderReleaseSvg()) }

export const RIDER_SIZE = { width: W, height: H }

/** X position (in texture pixels) where the bow's arrow-nock point sits — used by
 *  RiderEntity to compute the world-space bow-tip anchor without duplicating the
 *  TX/geometry constants above. */
export const RIDER_BOW_TIP = { x: TX + 132, y: 66 }
export const RIDER_TORSO_CENTER_X = TX + 63
