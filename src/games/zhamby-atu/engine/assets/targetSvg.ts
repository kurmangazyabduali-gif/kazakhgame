import { svgToDataUri } from './svgUtil'

/**
 * The jamby target: a wooden crossbar pole with a braided rope suspending
 * an ornamented gold disc (the jamby itself). Split into two separately
 * loaded textures — the static pole/crossbar, and the disc that physics
 * moves independently as it swings — matching how JambyTarget.ts already
 * treats them as two separate game objects.
 */

const POLE_W = 90
const POLE_H = 260

export function poleSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${POLE_W} ${POLE_H}" width="${POLE_W}" height="${POLE_H}">
  <defs>
    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4a3018" />
      <stop offset="30%" stop-color="#8a5c30" />
      <stop offset="70%" stop-color="#6a4520" />
      <stop offset="100%" stop-color="#3a2410" />
    </linearGradient>
  </defs>
  <!-- Vertical pole, subtle grain lines -->
  <rect x="36" y="84" width="18" height="${POLE_H - 84}" rx="3" fill="url(#woodGrad)" />
  <path d="M 40 90 L 40 ${POLE_H - 4} M 46 88 L 46 ${POLE_H - 6}" stroke="#2a1a0a" stroke-width="1" opacity="0.35" />
  <!-- Crossbar -->
  <rect x="4" y="78" width="82" height="14" rx="4" fill="#5a3818" />
  <rect x="4" y="78" width="82" height="4" rx="2" fill="#7a5228" opacity="0.6" />
  <!-- Rope from crossbar down to where the disc hangs -->
  <path d="M 45 92 L 45 40" stroke="#c8a870" stroke-width="3.5" stroke-dasharray="5 3" stroke-linecap="round" />
</svg>`.trim()
}

interface DiscOptions {
  variant: 'jamby' | 'decoy'
}

export function discSvg({ variant }: DiscOptions): string {
  const W = 100
  const isDecoy = variant === 'decoy'

  const rimStops = isDecoy
    ? [['0%', '#8a8078'], ['30%', '#5e564c'], ['70%', '#3a342c'], ['100%', '#211d18']]
    : [['0%', '#fff5a0'], ['30%', '#ffd700'], ['70%', '#c99000'], ['100%', '#7a5500']]

  const gradStops = rimStops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}" />`).join('')

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}">
  <defs>
    <radialGradient id="discGrad" cx="35%" cy="30%" r="75%">
      ${gradStops}
    </radialGradient>
    <radialGradient id="discGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${isDecoy ? '#b02818' : '#ffd700'}" stop-opacity="${isDecoy ? 0.28 : 0.4}" />
      <stop offset="100%" stop-color="${isDecoy ? '#b02818' : '#ffd700'}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <circle cx="50" cy="50" r="48" fill="url(#discGlow)" />
  <circle cx="50" cy="50" r="38" fill="url(#discGrad)" stroke="${isDecoy ? 'rgba(180,40,30,0.6)' : '#8b5a00'}" stroke-width="2" />

  <!-- Ornamental ring, qoshqar-muiz inspired scrollwork -->
  <circle cx="50" cy="50" r="24" fill="none" stroke="${isDecoy ? '#3a352e' : '#8b5a00'}" stroke-width="2" opacity="0.75" />
  <path d="M 50 26 C 58 26, 62 32, 58 38 C 55 42, 48 40, 48 35" fill="none" stroke="${isDecoy ? '#3a352e' : '#8b5a00'}" stroke-width="1.6" opacity="0.6" />
  <path d="M 50 74 C 42 74, 38 68, 42 62 C 45 58, 52 60, 52 65" fill="none" stroke="${isDecoy ? '#3a352e' : '#8b5a00'}" stroke-width="1.6" opacity="0.6" />

  <!-- Center boss -->
  <circle cx="50" cy="50" r="10" fill="${isDecoy ? '#2a251f' : '#fff0b0'}" />
  <circle cx="50" cy="50" r="10" fill="none" stroke="${isDecoy ? '#5a5040' : '#cc8800'}" stroke-width="1.5" />

  ${isDecoy
    ? `<path d="M 36 36 L 64 64 M 64 36 L 36 64" stroke="rgba(180,40,30,0.8)" stroke-width="4" stroke-linecap="round" />`
    : `<path d="M 50 30 L 50 70 M 30 50 L 70 50" stroke="#8b5a00" stroke-width="1.2" opacity="0.5" />`
  }

  <!-- Rim highlight -->
  <path d="M 20 34 A 38 38 0 0 1 60 13" fill="none" stroke="#fff" stroke-width="2" opacity="${isDecoy ? 0.08 : 0.35}" stroke-linecap="round" />
</svg>`.trim()
}

export function poleDataUri(): string { return svgToDataUri(poleSvg()) }
export function jambyDiscDataUri(): string { return svgToDataUri(discSvg({ variant: 'jamby' })) }
export function decoyDiscDataUri(): string { return svgToDataUri(discSvg({ variant: 'decoy' })) }

export const POLE_SIZE = { width: POLE_W, height: POLE_H }
export const DISC_SIZE = { width: 100, height: 100 }
