import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PullCharacter } from './PullCharacter';
import { useArqanStore } from '../store/useArqanStore';

interface Team3DProps {
  side: 'PLAYER' | 'AI';
  ropePosition: number;
  fatigue: number;
  isPulling: boolean;
}

export const Team3D: React.FC<Team3DProps> = ({ side, ropePosition, fatigue, isPulling }) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentX = useRef(0);
  
  const isPlayer = side === 'PLAYER';
  const startX = isPlayer ? 2 : -2; 
  const direction = isPlayer ? 1 : -1;
  const color = isPlayer ? '#d4af37' : '#1a5c8c'; 

  const isCaptainDuel = useArqanStore((state) => state.isCaptainDuel);
  const armorTier = useArqanStore((state) => state.armorTier);
  const isZhigerActive = useArqanStore((state) => state.isZhigerActive);

  useFrame(() => {
    if (!groupRef.current) return;
    
    const mappedPosition = (ropePosition / 100) * 8;
    const targetX = startX + mappedPosition;
    
    // Smooth movement
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX, 0.08);
    groupRef.current.position.x = currentX.current;
  });

  // If Captain Duel (1v1), render only the Captain (index 5)
  const rosterIndexes = isCaptainDuel ? [5] : Array.from({ length: 6 }, (_, i) => i);

  return (
    <group ref={groupRef}>
      {rosterIndexes.map((i) => {
        const rotationY = isPlayer ? Math.PI : 0;
        const positionX = isCaptainDuel ? 0 : i * direction * 1.0;
        
        return (
          <group 
            key={i} 
            position={[positionX, 0, 0]} 
            rotation={[0, rotationY, 0]}
          >
            <PullCharacter 
              color={color} 
              isPulling={isPulling} 
              fatigue={fatigue}
              index={i}
              armorTier={isPlayer ? armorTier : 'STANDARD'}
              isZhigerActive={isPlayer && isZhigerActive}
            />
          </group>
        );
      })}
    </group>
  );
};
