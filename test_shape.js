const THREE = require('three');

function createBoardShape() {
  const shape = new THREE.Shape();
  
  // Outer boundary
  shape.moveTo(-4.75, -4.25);
  shape.lineTo(4.75, -4.25);
  shape.lineTo(4.75, 4.25);
  shape.lineTo(-4.75, 4.25);
  shape.lineTo(-4.75, -4.25);

  // Add Kazan holes
  function addCapsuleHole(cx, cy, w, h) {
    const hole = new THREE.Path();
    const r = w / 2;
    hole.moveTo(cx - w/2 + r, cy - h/2);
    hole.lineTo(cx + w/2 - r, cy - h/2);
    hole.absarc(cx + w/2 - r, cy - h/2 + r, r, -Math.PI/2, 0, false);
    hole.lineTo(cx + w/2, cy + h/2 - r);
    hole.absarc(cx + w/2 - r, cy + h/2 - r, r, 0, Math.PI/2, false);
    hole.lineTo(cx - w/2 + r, cy + h/2);
    hole.absarc(cx - w/2 + r, cy + h/2 - r, r, Math.PI/2, Math.PI, false);
    hole.lineTo(cx - w/2, cy - h/2 + r);
    hole.absarc(cx - w/2 + r, cy - h/2 + r, r, Math.PI, -Math.PI/2, false);
    shape.holes.push(hole);
  }

  addCapsuleHole(0, 0.45, 8.5, 0.6); // P1 Kazan
  addCapsuleHole(0, -0.45, 8.5, 0.6); // P2 Kazan

  // Add Otau holes
  for (let i = 0; i < 9; i++) {
    const x = (i - 4) * 0.95;
    addCapsuleHole(x, 2.5, 0.45, 3.2); // P1
    addCapsuleHole(x, -2.5, 0.45, 3.2); // P2
  }
  
  return shape;
}
console.log('Shape has ' + createBoardShape().holes.length + ' holes');
