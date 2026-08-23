const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/assets/zhamby-atu/sprites');

// Rider Body (Sitting)
const riderTorso = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150">
  <!-- Torso & Legs -->
  <path d="M 40 100 C 30 70, 40 40, 50 30 C 60 40, 70 70, 60 100 L 50 120 Z" fill="#4a2e1b"/>
  <!-- Head & Hat -->
  <path d="M 50 30 C 45 20, 55 10, 65 15 C 60 25, 55 30, 50 30 Z" fill="#8b2500"/>
  <circle cx="52" cy="22" r="8" fill="#ffcc99"/>
</svg>`;

// Bow Idle (Unbent)
const bowIdle = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M 50 10 C 70 30, 70 70, 50 90" fill="none" stroke="#5c3a18" stroke-width="6" stroke-linecap="round"/>
  <path d="M 50 10 L 50 90" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.8"/>
</svg>`;

// Bow Drawn (Bent)
const bowDrawn = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M 50 10 C 80 40, 80 60, 50 90" fill="none" stroke="#5c3a18" stroke-width="6" stroke-linecap="round"/>
  <path d="M 50 10 L 10 50 L 50 90" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.8"/>
</svg>`;

fs.writeFileSync(path.join(dir, 'rider_torso.svg'), riderTorso);
fs.writeFileSync(path.join(dir, 'bow_idle.svg'), bowIdle);
fs.writeFileSync(path.join(dir, 'bow_drawn.svg'), bowDrawn);
console.log('Rider parts generated!');
