import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BootDustParticlesProps {
  isPulling: boolean;
  position: [number, number, number];
}

/**
 * 3D Dust Particle System emitting dirt particles under pulling athletes' boots.
 */
export function BootDustParticles({ isPulling, position }: BootDustParticlesProps) {
  const count = 25;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Particle state data
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 2.5,
      y: Math.random() * 0.4,
      z: (Math.random() - 0.5) * 1.2,
      scale: 0.04 + Math.random() * 0.08,
      speedY: 0.3 + Math.random() * 0.6,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random(),
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      if (isPulling) {
        p.y += p.speedY * delta;
        p.x += p.speedX * delta;

        if (p.y > 0.8) {
          p.y = 0;
          p.x = (Math.random() - 0.5) * 2.5;
        }

        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.setScalar(p.scale * (1 - p.y / 0.8));
      } else {
        dummy.scale.set(0, 0, 0);
      }
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.5, 6, 6]} />
        <meshStandardMaterial color="#8a6e45" transparent opacity={0.65} roughness={0.9} />
      </instancedMesh>
    </group>
  );
}

interface ZhigerSparklesProps {
  isActive: boolean;
  position: [number, number, number];
}

/**
 * 3D Golden Sparkle Particle System for Zhiger Mode.
 */
export function ZhigerSparkles({ isActive, position }: ZhigerSparklesProps) {
  const count = 35;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 3.0,
      y: Math.random() * 1.8,
      z: (Math.random() - 0.5) * 1.5,
      scale: 0.03 + Math.random() * 0.06,
      speedY: 0.6 + Math.random() * 0.8,
      rotSpeed: Math.random() * 5,
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    particles.forEach((p, i) => {
      if (isActive) {
        p.y += p.speedY * delta;
        if (p.y > 2.2) {
          p.y = 0;
          p.x = (Math.random() - 0.5) * 3.0;
        }

        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.y += p.rotSpeed * delta;
        dummy.scale.setScalar(p.scale * (1 + Math.sin(state.clock.elapsedTime * 10 + i) * 0.3));
      } else {
        dummy.scale.set(0, 0, 0);
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color="#ffe57f" />
      </instancedMesh>
    </group>
  );
}
