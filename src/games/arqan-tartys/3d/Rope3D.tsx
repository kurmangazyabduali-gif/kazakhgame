import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

interface Rope3DProps {
  ropePosition: number; // -100 to 100
}

export const Rope3D: React.FC<Rope3DProps> = ({ ropePosition }) => {
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mappedX = (ropePosition / 100) * 8;
    if (markerRef.current) {
      markerRef.current.position.x = mappedX;
      markerRef.current.rotation.y += 0.02; // Spin the marker so it's visible
    }
  });

  return (
    <group>
      {/* The rope at hand height of the Xbot models */}
      <Cylinder
        args={[0.045, 0.045, 40, 8]}
        rotation={[0, 0, Math.PI / 2]}
        position={[0, 0.85, 0]}
        castShadow
      >
        <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      </Cylinder>
      
      {/* Red diamond marker showing the center of the rope */}
      <Octahedron
        ref={markerRef}
        args={[0.3]}
        position={[0, 1.15, 0]}
        castShadow
      >
        <meshStandardMaterial color="#ff0000" emissive="#ff3300" emissiveIntensity={0.3} />
      </Octahedron>
    </group>
  );
};
