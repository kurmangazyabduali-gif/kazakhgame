const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/assets/zhamby-atu/sprites');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const colors = {
  body: '#4a2e1b',
  legsBack: '#2c1a0e',
  mane: '#1a0f08',
  saddle: '#8b2500'
};

const headAndBody = `
  <!-- Body -->
  <path d="M 50 80 C 70 70, 110 70, 130 80 C 145 90, 150 110, 140 120 C 120 120, 70 120, 40 110 C 30 100, 35 85, 50 80 Z" fill="${colors.body}"/>
  <!-- Neck and Head -->
  <path d="M 120 85 C 130 60, 150 40, 160 40 C 170 40, 175 55, 165 70 C 150 90, 140 100, 130 105 Z" fill="${colors.body}"/>
  <!-- Snout -->
  <path d="M 160 40 C 175 45, 185 60, 175 75 C 165 80, 155 75, 165 70 Z" fill="${colors.body}"/>
  <!-- Ears -->
  <path d="M 150 40 L 145 25 L 155 35 Z" fill="${colors.body}"/>
  <!-- Mane -->
  <path d="M 120 85 C 125 70, 140 45, 150 40 C 140 45, 125 65, 115 80 Z" fill="${colors.mane}"/>
  <!-- Tail root -->
  <path d="M 40 90 C 30 90, 20 110, 25 120 C 35 110, 40 100, 40 90 Z" fill="${colors.mane}"/>
  <!-- Saddle -->
  <path d="M 75 75 C 90 75, 105 75, 110 85 C 105 90, 80 90, 70 85 Z" fill="${colors.saddle}"/>
`;

const frames = [
  // Frame 1: Extended
  `
    <!-- Back legs -->
    <path d="M 50 110 L 20 160 L 30 165 L 55 120 Z" fill="${colors.legsBack}"/>
    <path d="M 130 110 L 170 140 L 165 150 L 125 120 Z" fill="${colors.legsBack}"/>
    <!-- Front legs -->
    <path d="M 60 110 L 30 170 L 40 175 L 65 120 Z" fill="${colors.body}"/>
    <path d="M 140 110 L 180 150 L 175 160 L 135 120 Z" fill="${colors.body}"/>
    <!-- Tail flow -->
    <path d="M 30 95 C 10 110, 0 130, 5 150 C 15 130, 25 110, 35 105 Z" fill="${colors.mane}"/>
  `,
  // Frame 2: Gathering
  `
    <!-- Back legs -->
    <path d="M 50 110 L 40 160 L 50 165 L 60 120 Z" fill="${colors.legsBack}"/>
    <path d="M 130 110 L 150 160 L 140 165 L 125 120 Z" fill="${colors.legsBack}"/>
    <!-- Front legs -->
    <path d="M 60 110 L 50 170 L 60 175 L 70 120 Z" fill="${colors.body}"/>
    <path d="M 140 110 L 160 170 L 150 175 L 135 120 Z" fill="${colors.body}"/>
    <!-- Tail flow -->
    <path d="M 30 95 C 15 115, 10 140, 20 160 C 25 140, 30 115, 35 105 Z" fill="${colors.mane}"/>
  `,
  // Frame 3: Crossed (Airborne)
  `
    <!-- Back legs -->
    <path d="M 50 110 L 80 150 L 85 140 L 60 110 Z" fill="${colors.legsBack}"/>
    <path d="M 130 110 L 110 150 L 100 140 L 125 110 Z" fill="${colors.legsBack}"/>
    <!-- Front legs -->
    <path d="M 60 110 L 90 160 L 95 150 L 70 110 Z" fill="${colors.body}"/>
    <path d="M 140 110 L 120 160 L 110 150 L 135 110 Z" fill="${colors.body}"/>
    <!-- Tail flow -->
    <path d="M 30 95 C 20 100, 15 120, 30 140 C 30 120, 30 105, 35 105 Z" fill="${colors.mane}"/>
  `,
  // Frame 4: Landing
  `
    <!-- Back legs -->
    <path d="M 50 110 L 60 160 L 70 160 L 60 115 Z" fill="${colors.legsBack}"/>
    <path d="M 130 110 L 130 160 L 120 160 L 125 115 Z" fill="${colors.legsBack}"/>
    <!-- Front legs -->
    <path d="M 60 110 L 70 170 L 80 170 L 70 115 Z" fill="${colors.body}"/>
    <path d="M 140 110 L 140 170 L 130 170 L 135 115 Z" fill="${colors.body}"/>
    <!-- Tail flow -->
    <path d="M 30 95 C 20 110, 15 130, 25 150 C 30 130, 30 110, 35 105 Z" fill="${colors.mane}"/>
  `
];

frames.forEach((frame, index) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    ${headAndBody}
    ${frame}
  </svg>`;
  fs.writeFileSync(path.join(dir, `horse_run_${index}.svg`), svg);
});
console.log('Horse frames generated!');
