import { svgToDataUri } from './svgUtil'

const POLE_W = 90
const POLE_H = 260

export function poleSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${POLE_W} ${POLE_H}" width="${POLE_W}" height="${POLE_H}">
  <defs>
    <!-- Photorealistic wood gradient -->
    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2c1e10" />
      <stop offset="15%" stop-color="#4a3018" />
      <stop offset="45%" stop-color="#5a3c20" />
      <stop offset="85%" stop-color="#3a2410" />
      <stop offset="100%" stop-color="#1e1005" />
    </linearGradient>
  </defs>
  <!-- Vertical pole with 3D cylindrical shading -->
  <rect x="36" y="84" width="18" height="${POLE_H - 84}" rx="3" fill="url(#woodGrad)" />
  <path d="M 40 90 L 40 ${POLE_H - 4} M 44 88 L 44 ${POLE_H - 6} M 48 88 L 48 ${POLE_H - 6}" stroke="#1f130a" stroke-width="1.5" opacity="0.5" />
  
  <!-- Crossbar with shadow drop -->
  <rect x="6" y="80" width="78" height="18" rx="4" fill="#1e1005" opacity="0.6" />
  <rect x="4" y="76" width="82" height="16" rx="4" fill="url(#woodGrad)" />
  <rect x="4" y="76" width="82" height="4" rx="2" fill="#7a5228" opacity="0.8" />
  
  <!-- Realistic braided rope -->
  <path d="M 45 92 L 45 40" stroke="#8c7853" stroke-width="4" stroke-dasharray="6 2" stroke-linecap="round" />
  <path d="M 45 92 L 45 40" stroke="#4a3c26" stroke-width="4" stroke-dasharray="0 8" stroke-dashoffset="4" stroke-linecap="round" />
</svg>`.trim()
}

interface DiscOptions {
  variant: 'jamby' | 'decoy'
}

export function discSvg({ variant }: DiscOptions): string {
  const W = 100
  const isDecoy = variant === 'decoy'

  const rimStops = isDecoy
    ? [['0%', '#a8a098'], ['30%', '#6e665c'], ['70%', '#2a241c'], ['100%', '#110d08']]
    : [['0%', '#ffffff'], ['20%', '#ffe45e'], ['60%', '#d49600'], ['100%', '#5a3a00']]

  const gradStops = rimStops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}" />`).join('')

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="${W}" height="${W}">
  <defs>
    <!-- Ultra-realistic metallic radial gradient -->
    <radialGradient id="discGrad" cx="30%" cy="25%" r="80%">
      ${gradStops}
    </radialGradient>
    <radialGradient id="discGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${isDecoy ? '#ff3828' : '#ffe45e'}" stop-opacity="${isDecoy ? 0.35 : 0.6}" />
      <stop offset="100%" stop-color="${isDecoy ? '#b02818' : '#ffd700'}" stop-opacity="0" />
    </radialGradient>
    
    <linearGradient id="metalBevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#fff" stop-opacity="0" />
      <stop offset="100%" stop-color="#000" stop-opacity="0.6" />
    </linearGradient>
  </defs>

  <!-- Ambient Glow -->
  <circle cx="50" cy="50" r="50" fill="url(#discGlow)" />
  
  <!-- Base Metallic Disc -->
  <circle cx="50" cy="50" r="38" fill="url(#discGrad)" />
  
  <!-- 3D Bevel Edge -->
  <circle cx="50" cy="50" r="38" fill="none" stroke="url(#metalBevel)" stroke-width="3" />
  <circle cx="50" cy="50" r="35" fill="none" stroke="${isDecoy ? '#2a241c' : '#7a4a00'}" stroke-width="1.5" opacity="0.8" />

  <!-- Intricate Kazakh Ornament (Qoshqar-Muiz) -->
  <g stroke="${isDecoy ? '#110d08' : '#5a3a00'}" stroke-width="2" fill="none" opacity="0.8">
    <path d="M 50 20 C 65 20, 75 30, 75 45 C 75 40, 70 32, 60 32 C 55 32, 50 38, 50 45" />
    <path d="M 50 80 C 35 80, 25 70, 25 55 C 25 60, 30 68, 40 68 C 45 68, 50 62, 50 55" />
    <path d="M 20 50 C 20 35, 30 25, 45 25 C 40 25, 32 30, 32 40 C 32 45, 38 50, 45 50" />
    <path d="M 80 50 C 80 65, 70 75, 55 75 C 60 75, 68 70, 68 60 C 68 55, 62 50, 55 50" />
  </g>

  <!-- Center Boss (Jewel / Metal Dome) -->
  <circle cx="50" cy="50" r="12" fill="${isDecoy ? '#1a1510' : '#ffefb3'}" />
  <circle cx="50" cy="50" r="12" fill="url(#discGrad)" />
  <circle cx="48" cy="48" r="4" fill="#ffffff" opacity="0.6" />
  <circle cx="50" cy="50" r="12" fill="none" stroke="url(#metalBevel)" stroke-width="1.5" />

  ${isDecoy
    ? `<path d="M 32 32 L 68 68 M 68 32 L 32 68" stroke="rgba(255,40,30,0.9)" stroke-width="5" stroke-linecap="round" />`
    : ``
  }
</svg>`.trim()
}

export function poleDataUri(): string { return svgToDataUri(poleSvg()) }
export function jambyDiscDataUri(): string { return svgToDataUri(discSvg({ variant: 'jamby' })) }
export function decoyDiscDataUri(): string { return svgToDataUri(discSvg({ variant: 'decoy' })) }

export const POLE_SIZE = { width: POLE_W, height: POLE_H }
export const DISC_SIZE = { width: 100, height: 100 }
