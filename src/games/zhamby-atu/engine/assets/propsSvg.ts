import { svgToDataUri } from './svgUtil'

export function arrowSvg(): string {
  const W = 110
  const H = 16
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="shaftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#b08850" />
      <stop offset="50%" stop-color="#7a5228" />
      <stop offset="100%" stop-color="#b08850" />
    </linearGradient>
    <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8eef4" />
      <stop offset="40%" stop-color="#a0b0be" />
      <stop offset="100%" stop-color="#5a6a7a" />
    </linearGradient>
  </defs>
  <rect x="16" y="6" width="72" height="5" rx="2" fill="url(#shaftGrad)" />
  <path d="M 88 4 L 110 8 L 88 12 L 92 8 Z" fill="url(#headGrad)" stroke="#3a4650" stroke-width="0.5" />
  <path d="M 14 8 L 0 0 L 6 8 L 0 16 Z" fill="#cc2200" />
  <path d="M 14 8 L 0 0 L 6 8 Z" fill="#ffffff" opacity="0.85" />
</svg>`.trim()
}

export function windFlagSvg(): string {
  const W = 60
  const H = 90
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c1502e" />
      <stop offset="100%" stop-color="#8a341c" />
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="4" height="86" rx="1.5" fill="#5a4020" />
  <path d="M 8 6 L 52 16 L 8 32 Z" fill="url(#flagGrad)" />
  <path d="M 8 6 L 52 16" stroke="#e0b23a" stroke-width="1.4" opacity="0.7" />
</svg>`.trim()
}

export function birdSvg(): string {
  const W = 44
  const H = 20
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <path d="M 2 14 Q 11 0 22 12 Q 33 0 42 14" stroke="rgba(20,15,10,0.55)" stroke-width="2.5" stroke-linecap="round" fill="none" />
</svg>`.trim()
}

export function arrowDataUri(): string { return svgToDataUri(arrowSvg()) }
export function windFlagDataUri(): string { return svgToDataUri(windFlagSvg()) }
export function birdDataUri(): string { return svgToDataUri(birdSvg()) }

export const ARROW_SIZE = { width: 110, height: 16 }
export const WIND_FLAG_SIZE = { width: 60, height: 90 }
export const BIRD_SIZE = { width: 44, height: 20 }
