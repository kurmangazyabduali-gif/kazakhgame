import { svgToDataUri } from './svgUtil'

const rng = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

interface MountainOptions {
  tint: 'day' | 'sunset' | 'night'
}

export function mountainsSvg({ tint }: MountainOptions): string {
  const W = 1024
  const H = 460

  const palette = {
    day: { 
      far: ['#6c89a0', '#95aebd'], 
      mid: ['#4b6858', '#6b8a78'],
      near: ['#324a3a', '#4a6b54'], 
      snow: 'rgba(255, 255, 255, 0.9)' 
    },
    sunset: { 
      far: ['#6a4a68', '#b57b6a'], 
      mid: ['#5a3a48', '#8a5a48'],
      near: ['#3a2028', '#5a3030'], 
      snow: 'rgba(255, 210, 180, 0.85)' 
    },
    night: { 
      far: ['#151a2d', '#252d45'], 
      mid: ['#101525', '#1a2235'],
      near: ['#0a0c15', '#121622'], 
      snow: 'rgba(180, 190, 240, 0.4)' 
    },
  }[tint]

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="farGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.far[0]}" />
      <stop offset="100%" stop-color="${palette.far[1]}" />
    </linearGradient>
    <linearGradient id="midGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.mid[0]}" />
      <stop offset="100%" stop-color="${palette.mid[1]}" />
    </linearGradient>
    <linearGradient id="nearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.near[0]}" />
      <stop offset="100%" stop-color="${palette.near[1]}" />
    </linearGradient>
    <linearGradient id="haze" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.far[1]}" stop-opacity="0" />
      <stop offset="80%" stop-color="${palette.far[1]}" stop-opacity="0.3" />
      <stop offset="100%" stop-color="${palette.far[1]}" stop-opacity="0.6" />
    </linearGradient>
  </defs>

  <!-- Far Mountains (Sharp Peaks) -->
  <path d="M 0 ${H} L 0 280
           L 40 220 L 90 260 L 150 180 L 210 240 L 280 150 L 350 210
           L 420 120 L 490 190 L 560 140 L 630 200 L 710 110 L 780 170
           L 860 130 L 940 190 L 1024 100
           L 1024 ${H} Z" fill="url(#farGrad)" />
           
  <!-- Snow Caps for Far Mountains -->
  <path d="M 150 180 L 135 200 L 150 215 L 165 195 Z
           M 280 150 L 260 180 L 280 195 L 300 175 Z
           M 420 120 L 395 155 L 420 170 L 445 145 Z
           M 560 140 L 540 170 L 560 185 L 580 160 Z
           M 710 110 L 685 145 L 710 160 L 735 135 Z
           M 860 130 L 840 160 L 860 175 L 880 150 Z" fill="${palette.snow}" />

  <!-- Mid Mountains -->
  <path d="M 0 ${H} L 0 320
           C 60 280, 100 290, 160 240
           C 220 200, 270 210, 330 180
           C 390 150, 450 170, 520 140
           C 590 120, 660 160, 730 130
           C 800 110, 880 140, 950 120
           C 980 110, 1000 130, 1024 110
           L 1024 ${H} Z" fill="url(#midGrad)" />

  <!-- Near Ridge (Rolling Hills) -->
  <path d="M 0 ${H} L 0 380
           C 80 340, 140 360, 220 310
           C 300 260, 360 290, 450 250
           C 540 210, 600 240, 700 220
           C 800 200, 880 240, 980 210
           C 1000 200, 1010 220, 1024 210
           L 1024 ${H} Z" fill="url(#nearGrad)" />

  <!-- Atmospheric haze wash over everything -->
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#haze)" />
</svg>`.trim()
}

export function steppeSvg(): string {
  const W = 1024
  const H = 340

  // More realistic grass tufts with multiple blades and varied colors
  const tufts = Array.from({ length: 250 }, (_, i) => {
    const x = rng(i * 7.3) * W
    const y = rng(i * 3.7) * (H - 50) + 20
    const h = 15 + rng(i * 5.1) * 25
    const lean = (rng(i * 2.9) - 0.5) * 20
    const color = i % 3 === 0 ? '#8c9c4a' : i % 3 === 1 ? '#7a8c3a' : '#5c6b2a'
    return `
      <path d="M ${x} ${y} Q ${x + lean} ${y - h * 0.5} ${x + lean * 1.5} ${y - h}" stroke="${color}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M ${x} ${y} Q ${x + lean*0.5} ${y - h * 0.4} ${x + lean * 0.8} ${y - h*0.8}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6"/>
    `
  }).join('')

  // Realistic shaded rocks
  const stones = Array.from({ length: 40 }, (_, i) => {
    const x = rng(i * 11.3 + 100) * W
    const y = rng(i * 6.7 + 200) * (H - 30) + 12
    const rx = 6 + rng(i) * 12
    const ry = 4 + rng(i * 2) * 6
    const rot = rng(i * 3) * 180
    return `
      <g transform="translate(${x} ${y}) rotate(${rot})">
        <ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="#504d48" />
        <ellipse cx="-1" cy="-1" rx="${rx*0.8}" ry="${ry*0.7}" fill="#6b6761" />
        <ellipse cx="-2" cy="-2" rx="${rx*0.4}" ry="${ry*0.3}" fill="#85817a" />
      </g>
    `
  }).join('')

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#919c4d" />
      <stop offset="30%" stop-color="#7a873b" />
      <stop offset="70%" stop-color="#5a6328" />
      <stop offset="100%" stop-color="#3d4518" />
    </linearGradient>
    <linearGradient id="pathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#a88b5e" />
      <stop offset="100%" stop-color="#8a6e45" />
    </linearGradient>
  </defs>
  
  <rect width="${W}" height="${H}" fill="url(#groundGrad)" />
  
  <!-- Realistic Dirt Path with organic edges -->
  <path d="M 0 0 C 150 -10, 250 20, 400 5 C 550 -15, 700 25, 850 0 C 950 -15, 1000 5, 1024 0 L 1024 60 C 1000 70, 950 50, 850 65 C 700 80, 550 40, 400 60 C 250 75, 150 45, 0 60 Z" fill="url(#pathGrad)" opacity="0.9" />
  
  <!-- Path details / ruts -->
  <path d="M 0 20 C 200 10, 400 40, 600 20 C 800 5, 1000 30, 1024 25" stroke="#755a35" stroke-width="3" fill="none" opacity="0.5" />
  <path d="M 0 40 C 300 35, 500 55, 700 40 C 900 25, 1000 45, 1024 40" stroke="#634a29" stroke-width="4" fill="none" opacity="0.5" />

  ${stones}
  ${tufts}
</svg>`.trim()
}

export function foregroundGrassSvg(): string {
  const W = 1024
  const H = 170

  const blades = Array.from({ length: 150 }, (_, i) => {
    const x = rng(i * 9.1) * W
    const h = 80 + rng(i * 4.4) * 120
    const lean = (rng(i * 2.2) - 0.5) * 60
    const w = 8 + rng(i * 6.6) * 12
    const color = i % 3 === 0 ? '#11180d' : i % 3 === 1 ? '#182112' : '#0d120a'
    return `<path d="M ${x - w / 2} ${H} Q ${x + lean * 0.6} ${H - h * 0.6} ${x + lean} ${H - h} Q ${x + lean * 0.7} ${H - h * 0.5} ${x + w / 2} ${H} Z" fill="${color}" opacity="0.95" />`
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
