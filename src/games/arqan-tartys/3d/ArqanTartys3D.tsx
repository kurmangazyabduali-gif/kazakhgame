import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Environment3D } from './Environment3D';
import { Team3D } from './Team3D';
import { Rope3D } from './Rope3D';
import { BootDustParticles, ZhigerSparkles } from './VfxParticles';
import { useArqanStore } from '../store/useArqanStore';

export default function ArqanTartys3D() {
  const ropePosition = useArqanStore((state) => state.ropePosition);
  const playerFatigue = useArqanStore((state) => state.playerFatigue);
  const aiFatigue = useArqanStore((state) => state.aiFatigue);
  const isAiPulling = useArqanStore((state) => state.isAiPulling ?? true);
  const isCharging = useArqanStore((state) => state.isCharging);
  const isZhigerActive = useArqanStore((state) => state.isZhigerActive);

  const handlePointerDown = () => {
    useArqanStore.getState().startCharge();
  };

  const handlePointerUp = () => {
    useArqanStore.getState().releaseCharge();
  };

  const GameLoop = () => {
    useFrame((state, delta) => {
      useArqanStore.getState().tick(delta);
    });
    return null;
  };

  // Map 3D positions for particle emitters based on rope position
  const playerX = 2 + (ropePosition / 100) * 8;
  const aiX = -2 + (ropePosition / 100) * 8;

  return (
    <div 
      style={{ width: '100%', height: '100vh', touchAction: 'none', position: 'relative' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 45 }}>
        <GameLoop />
        <OrbitControls makeDefault />
        <Environment3D />
        
        <Team3D 
          side="AI" 
          ropePosition={ropePosition} 
          fatigue={aiFatigue} 
          isPulling={isAiPulling} 
        />
        <Team3D 
          side="PLAYER" 
          ropePosition={ropePosition} 
          fatigue={playerFatigue} 
          isPulling={isCharging} 
        />
        
        <Rope3D ropePosition={ropePosition} />

        {/* 3D VFX Particle Emitters */}
        <BootDustParticles isPulling={isCharging} position={[playerX + 2, 0.1, 0]} />
        <BootDustParticles isPulling={isAiPulling} position={[aiX - 2, 0.1, 0]} />

        {/* Zhiger Golden Sparkle Emitter */}
        <ZhigerSparkles isActive={isZhigerActive} position={[playerX + 2, 0.5, 0]} />
      </Canvas>
    </div>
  );
}
