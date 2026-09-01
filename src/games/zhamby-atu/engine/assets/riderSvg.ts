import { svgToDataUri } from './svgUtil'

const W = 180
const H = 220

function getRiderDefs() {
  return `
    <defs>
      <!-- Skin -->
      <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d49a7a" />
        <stop offset="100%" stop-color="#9a6245" />
      </linearGradient>
      
      <!-- Armor / Chapan -->
      <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2a3c5a" />
        <stop offset="50%" stop-color="#1a2538" />
        <stop offset="100%" stop-color="#0a101a" />
      </linearGradient>
      
      <!-- Leather elements -->
      <linearGradient id="leatherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#6a3e20" />
        <stop offset="100%" stop-color="#3a1e0b" />
      </linearGradient>
      
      <!-- Gold trim -->
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffdf73" />
        <stop offset="50%" stop-color="#d4a02e" />
        <stop offset="100%" stop-color="#8a6012" />
      </linearGradient>

      <!-- Bow wood -->
      <linearGradient id="bowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#5a3a22" />
        <stop offset="50%" stop-color="#3a2212" />
        <stop offset="100%" stop-color="#1e1006" />
      </linearGradient>
    </defs>
  `
}

function getRiderBody() {
  return `
    <!-- Torso / Armor (Highly detailed shape with broad shoulders) -->
    <path d="M 60 120 C 50 80, 70 50, 100 50 C 130 50, 150 80, 140 120 C 135 150, 110 160, 100 160 C 90 160, 65 150, 60 120 Z" fill="url(#armorGrad)" />
    
    <!-- Belt -->
    <path d="M 62 135 Q 100 145 138 135 L 136 145 Q 100 155 64 145 Z" fill="url(#leatherGrad)" />
    <!-- Belt Buckle -->
    <rect x="90" y="136" width="20" height="14" rx="3" fill="url(#goldGrad)" />
    
    <!-- Gold Trim on armor -->
    <path d="M 60 120 C 50 80, 70 50, 100 50 C 130 50, 150 80, 140 120" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
    <path d="M 100 50 L 100 140" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.6" />

    <!-- Head and Helmet -->
    <!-- Helmet Base -->
    <path d="M 75 45 C 75 20, 125 20, 125 45 C 125 55, 75 55, 75 45 Z" fill="url(#goldGrad)" />
    <!-- Helmet Spike -->
    <path d="M 98 22 L 100 5 L 102 22 Z" fill="url(#goldGrad)" />
    <!-- Face -->
    <path d="M 82 45 C 82 70, 118 70, 118 45 Z" fill="url(#skinGrad)" />
    <!-- Shadow under helmet -->
    <path d="M 82 45 C 82 50, 118 50, 118 45 Z" fill="#000" opacity="0.3" />
    
    <!-- Facial Features -->
    <!-- Eyes -->
    <path d="M 92 53 Q 95 51 98 53" fill="none" stroke="#2a1205" stroke-width="1.5" />
    <path d="M 104 53 Q 107 51 110 53" fill="none" stroke="#2a1205" stroke-width="1.5" />
    <!-- Mustache -->
    <path d="M 95 62 Q 100 60 105 62 Q 108 65 110 68 Q 105 64 100 64 Q 95 64 90 68 Q 92 65 95 62 Z" fill="#1a110a" />

    <!-- Quiver on back -->
    <path d="M 50 60 L 65 130 L 75 125 L 60 55 Z" fill="url(#leatherGrad)" />
    <!-- Arrows in quiver -->
    <line x1="55" y1="58" x2="45" y2="35" stroke="#fff" stroke-width="2" />
    <line x1="60" y1="56" x2="52" y2="30" stroke="#fff" stroke-width="2" />
    <line x1="65" y1="58" x2="62" y2="33" stroke="#fff" stroke-width="2" />
  `
}

function getDetailedBow(state: 'idle' | 'draw' | 'release') {
  if (state === 'idle') {
    return `
      <!-- Idle Bow (held loosely) -->
      <path d="M 100 50 Q 140 100 100 150" fill="none" stroke="url(#bowGrad)" stroke-width="8" stroke-linecap="round" />
      <path d="M 100 50 L 100 150" fill="none" stroke="#e0e0e0" stroke-width="1.5" />
    `
  } else if (state === 'draw') {
    return `
      <!-- Drawn Bow (Tense curve) -->
      <path d="M 160 30 C 200 80, 200 130, 160 180" fill="none" stroke="url(#bowGrad)" stroke-width="8" stroke-linecap="round" />
      <!-- Bow string pulled back to face -->
      <path d="M 160 30 L 100 100 L 160 180" fill="none" stroke="#fff" stroke-width="1.5" />
    `
  } else {
    return `
      <!-- Released Bow (Snaps forward) -->
      <path d="M 140 40 Q 170 105 140 170" fill="none" stroke="url(#bowGrad)" stroke-width="8" stroke-linecap="round" />
      <path d="M 140 40 L 140 170" fill="none" stroke="#fff" stroke-width="1.5" />
    `
  }
}

export function riderIdleSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${getRiderDefs()}
  ${getRiderBody()}
  
  <!-- Right Arm (holding bow loosely) -->
  <path d="M 120 70 C 135 100, 120 120, 100 100" fill="none" stroke="url(#leatherGrad)" stroke-width="16" stroke-linecap="round" />
  <circle cx="100" cy="100" r="10" fill="url(#skinGrad)" />
  ${getDetailedBow('idle')}
</svg>`.trim()
}

export function riderDrawSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${getRiderDefs()}
  ${getRiderBody()}
  
  <!-- Left Arm (extended, holding bow) -->
  <path d="M 120 70 L 170 100" fill="none" stroke="url(#leatherGrad)" stroke-width="15" stroke-linecap="round" />
  <circle cx="170" cy="100" r="9" fill="url(#skinGrad)" />
  
  ${getDetailedBow('draw')}

  <!-- Drawn Arrow -->
  <line x1="90" y1="100" x2="180" y2="100" stroke="#d6c6b4" stroke-width="4" stroke-linecap="round" />
  <polygon points="180,100 170,95 170,105" fill="#505050" />
  <!-- Fletching -->
  <polygon points="90,100 100,95 110,100 100,105" fill="#ffffff" />
  
  <!-- Right Arm (pulled back to cheek) -->
  <path d="M 100 75 L 80 100 L 100 100" fill="none" stroke="url(#armorGrad)" stroke-width="16" stroke-linecap="round" />
  <circle cx="100" cy="100" r="9" fill="url(#skinGrad)" />
</svg>`.trim()
}

export function riderReleaseSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  ${getRiderDefs()}
  ${getRiderBody()}
  
  <!-- Left Arm (extended, snapped back slightly) -->
  <path d="M 120 70 L 150 105" fill="none" stroke="url(#leatherGrad)" stroke-width="15" stroke-linecap="round" />
  <circle cx="150" cy="105" r="9" fill="url(#skinGrad)" />
  
  ${getDetailedBow('release')}

  <!-- Right Arm (thrown back from release) -->
  <path d="M 100 75 L 60 90 L 50 120" fill="none" stroke="url(#armorGrad)" stroke-width="16" stroke-linecap="round" />
  <circle cx="50" cy="120" r="9" fill="url(#skinGrad)" />
</svg>`.trim()
}

export function riderIdleDataUri(): string { return svgToDataUri(riderIdleSvg()) }
export function riderDrawDataUri(): string { return svgToDataUri(riderDrawSvg()) }
export function riderReleaseDataUri(): string { return svgToDataUri(riderReleaseSvg()) }

export const RIDER_SIZE = { width: W, height: H }
export const RIDER_BOW_TIP = { x: 180, y: 100 } // Adjusted to match new drawn arrow tip
export const RIDER_TORSO_CENTER_X = 100
