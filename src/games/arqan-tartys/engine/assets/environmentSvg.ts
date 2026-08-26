/**
 * Steppe sports-ground environment for Arqan Tartys — warm-light Kazakh
 * steppe with distant mountains and ornament banners framing the pull line,
 * deliberately not a generic gym backdrop.
 */
import { svgToDataUri } from '../../characters/svgUtil'

const W = 1440
const H = 500

export function mountainsSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 260" width="${W}" height="260">
  <defs>
    <linearGradient id="mtnFar" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8fa4c4" />
      <stop offset="100%" stop-color="#c9b98f" />
    </linearGradient>
    <linearGradient id="mtnNear" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6f83a8" />
      <stop offset="100%" stop-color="#a99566" />
    </linearGradient>
  </defs>
  <path d="M0 260 L0 160 L120 90 L240 170 L380 60 L520 150 L680 100 L820 180 L980 70 L1140 160 L1280 110 L1440 190 L1440 260 Z" fill="url(#mtnFar)" opacity="0.55" />
  <path d="M0 260 L0 210 L160 130 L320 200 L500 120 L660 205 L840 140 L1020 215 L1200 150 L1440 220 L1440 260 Z" fill="url(#mtnNear)" opacity="0.75" />
</svg>`.trim()
}

export function steppeSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f4d9a0" />
      <stop offset="45%" stop-color="#e8b978" />
      <stop offset="100%" stop-color="#d99a5c" />
    </linearGradient>
    <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c9a366" />
      <stop offset="50%" stop-color="#a97f4a" />
      <stop offset="100%" stop-color="#7a5a34" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff4d6" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#fff4d6" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#skyGrad)" />
  <circle cx="${W * 0.5}" cy="${H * 0.22}" r="220" fill="url(#sunGlow)" />
  <rect y="${H * 0.62}" width="${W}" height="${H * 0.38}" fill="url(#groundGrad)" />
  <!-- center pull-line marking on the ground -->
  <rect x="${W / 2 - 3}" y="${H * 0.62}" width="6" height="${H * 0.38}" fill="#f4e4c1" opacity="0.35" />
  <!-- distant grass tufts -->
  ${Array.from({ length: 26 })
    .map((_, i) => {
      const x = (i / 26) * W + (i % 3) * 14
      const y = H * 0.66 + (i % 5) * 6
      return `<path d="M ${x} ${y} q 4 -14 8 0" stroke="#6b5330" stroke-width="2" fill="none" opacity="0.4" />`
    })
    .join('')}
</svg>`.trim()
}

export function ornamentBannerSvg(accent: string): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 180" width="120" height="180">
  <rect x="0" y="0" width="120" height="180" fill="${accent}" opacity="0.85" />
  ${Array.from({ length: 5 })
    .map((_, i) => {
      const y = 20 + i * 32
      return `<path d="M 20 ${y} L 60 ${y - 14} L 100 ${y} L 60 ${y + 14} Z" fill="none" stroke="#f4e4c1" stroke-width="2.5" opacity="0.8" />`
    })
    .join('')}
  <rect x="0" y="0" width="120" height="180" fill="none" stroke="#f4e4c1" stroke-width="3" opacity="0.6" />
</svg>`.trim()
}

export function dustParticleSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="12" r="10" fill="#d9b877" opacity="0.5" />
</svg>`.trim()
}

export function mountainsDataUri(): string {
  return svgToDataUri(mountainsSvg())
}
export function steppeDataUri(): string {
  return svgToDataUri(steppeSvg())
}
export function ornamentBannerDataUri(accent: string): string {
  return svgToDataUri(ornamentBannerSvg(accent))
}
export function dustParticleDataUri(): string {
  return svgToDataUri(dustParticleSvg())
}

export const ENV_SIZE = { width: W, height: H }
export const MOUNTAINS_SIZE = { width: W, height: 260 }
export const BANNER_SIZE = { width: 120, height: 180 }
