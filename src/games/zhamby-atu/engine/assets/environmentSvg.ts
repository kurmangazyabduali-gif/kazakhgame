import { svgToDataUri } from './svgUtil'

const rng = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

interface MountainOptions {
  tint: 'day' | 'sunset' | 'night'
}

/** Two-layer mountain range with atmospheric haze, tileable horizontally. */
export function mountainsSvg({ tint }: MountainOptions): string {
  const W = 1024
  const H = 460

  const palette = {
    day: { far: ['#8fa4b5', '#b8c8d4'], near: ['#5f7a55', '#8fa478'], snow: 'rgba(255,255,255,0.7)' },
    sunset: { far: ['#7a5f78', '#c99a7a'], near: ['#4a3a48', '#6a4838'], snow: 'rgba(255,230,200,0.55)' },
    night: { far: ['#252d45', '#374060'], near: ['#161a2c', '#232840'], snow: 'rgba(200,210,255,0.3)' },
  }[tint]

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="farGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.far[0]}" />
      <stop offset="100%" stop-color="${palette.far[1]}" />
    </linearGradient>
    <linearGradient id="nearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.near[0]}" />
      <stop offset="100%" stop-color="${palette.near[1]}" />
    </linearGradient>
    <linearGradient id="haze" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d0e4f0" stop-opacity="0" />
      <stop offset="60%" stop-color="#d0e4f0" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#d0e4f0" stop-opacity="0.32" />
    </linearGradient>
  </defs>

  <!-- Far ridge -->
  <path d="M 0 ${H} L 0 300
           C 90 210, 150 230, 230 180
           C 310 138, 360 158, 440 112
           C 510 74, 560 100, 630 88
           C 700 78, 750 108, 820 96
           C 890 86, 950 118, 1024 148
           L 1024 ${H} Z" fill="url(#farGrad)" />
  <path d="M 420 128 L 440 112 L 460 128 Z" fill="${palette.snow}" />
  <path d="M 610 100 L 630 88 L 650 102 Z" fill="${palette.snow}" />

  <!-- Near ridge, more saturated -->
  <path d="M 0 ${H} L 0 350
           C 70 310, 115 320, 180 276
           C 250 230, 300 250, 380 218
           C 460 184, 520 212, 600 200
           C 680 188, 740 226, 830 212
           C 910 198, 970 224, 1024 240
           L 1024 ${H} Z" fill="url(#nearGrad)" />

  <!-- Atmospheric haze wash over everything -->
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#haze)" />
</svg>`.trim()
}

/** Steppe ground: dirt path, grass tufts, scattered stones — tileable. */
export function steppeSvg(): string {
  const W = 1024
  const H = 340

  const tufts = Array.from({ length: 130 }, (_, i) => {
    const x = rng(i * 7.3) * W
    const y = rng(i * 3.7) * (H - 50) + 20
    const h = 10 + rng(i * 5.1) * 20
    const lean = (rng(i * 2.9) - 0.5) * 14
    const color = i % 3 === 0 ? '#a0822a' : i % 3 === 1 ? '#c09a35' : '#7a5518'
    return `<path d="M ${x} ${y} Q ${x + lean} ${y - h * 0.5} ${x + lean * 1.5} ${y - h}" stroke="${color}" stroke-width="2" stroke-linecap="round" fill="none" />`
  }).join('')

  const stones = Array.from({ length: 22 }, (_, i) => {
    const x = rng(i * 11.3 + 100) * W
    const y = rng(i * 6.7 + 200) * (H - 30) + 12
    const rx = 5 + rng(i) * 8
    const ry = 3 + rng(i * 2) * 4
    const rot = rng(i * 3) * 180
    return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#7a6040" transform="rotate(${rot} ${x} ${y})" />`
  }).join('')

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c8973a" />
      <stop offset="30%" stop-color="#b07828" />
      <stop offset="70%" stop-color="#8a5c18" />
      <stop offset="100%" stop-color="#6b4510" />
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#groundGrad)" />
  <path d="M 0 0 C 150 -15, 250 10, 400 -5 C 550 -20, 700 5, 850 -10 C 950 -20, 1000 -5, 1024 0 L 1024 40 L 0 40 Z" fill="#d4a845" />
  <ellipse cx="512" cy="${H - 30}" rx="500" ry="18" fill="#a07228" />
  ${stones}
  ${tufts}
</svg>`.trim()
}

/** Fast-parallax foreground grass silhouette strip — sells speed. */
export function foregroundGrassSvg(): string {
  const W = 1024
  const H = 170

  const blades = Array.from({ length: 80 }, (_, i) => {
    const x = rng(i * 9.1) * W
    const h = 70 + rng(i * 4.4) * 100
    const lean = (rng(i * 2.2) - 0.5) * 46
    const w = 11 + rng(i * 6.6) * 15
    const color = i % 3 === 0 ? 'rgba(30,22,10,0.94)' : i % 3 === 1 ? 'rgba(42,32,14,0.9)' : 'rgba(18,13,6,0.96)'
    return `<path d="M ${x - w / 2} ${H} Q ${x + lean * 0.6} ${H - h * 0.6} ${x + lean} ${H - h} Q ${x + lean * 0.7} ${H - h * 0.5} ${x + w / 2} ${H} Z" fill="${color}" />`
  }).join('')

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${blades}
</svg>`.trim()
}

export function mountainsDataUri(tint: MountainOptions['tint']): string { return svgToDataUri(mountainsSvg({ tint })) }
export function steppeDataUri(): string { return svgToDataUri(steppeSvg()) }
export function foregroundGrassDataUri(): string { return svgToDataUri(foregroundGrassSvg()) }

export const MOUNTAINS_SIZE = { width: 1024, height: 460 }
export const STEPPE_SIZE = { width: 1024, height: 340 }
export const GRASS_SIZE = { width: 1024, height: 170 }
