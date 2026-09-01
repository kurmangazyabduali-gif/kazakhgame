import React, { useRef } from 'react';
import { Plane, Line, Sky } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useArqanStore } from '../store/useArqanStore';

function Mountain({ position, scale, color }: { position: [number, number, number], scale: [number, number, number], color: string }) {
  return (
    <mesh position={position} castShadow>
      <coneGeometry args={[scale[0], scale[1], 8]} />
      <meshStandardMaterial color={color} roughness={0.85} flatShading />
    </mesh>
  );
}

function Tree({ position, treeScale = 1 }: { position: [number, number, number], treeScale?: number }) {
  return (
    <group position={position} scale={treeScale}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.1, 1, 6]} />
        <meshStandardMaterial color="#5c3a1e" />
      </mesh>
      <mesh position={[0, 1.3, 0]} castShadow>
        <coneGeometry args={[0.45, 1, 6]} />
        <meshStandardMaterial color="#1e6b2a" flatShading />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[0.3, 0.7, 6]} />
        <meshStandardMaterial color="#2a8035" flatShading />
      </mesh>
    </group>
  );
}

function Yurt({ position, rotY = 0 }: { position: [number, number, number], rotY?: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[1.3, 1.3, 1.2, 16]} />
        <meshStandardMaterial color="#f0e0c0" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[1.5, 1.2, 16]} />
        <meshStandardMaterial color="#c09050" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[1.32, 1.32, 0.12, 16]} />
        <meshStandardMaterial color="#b22222" />
      </mesh>
      <mesh position={[0, 0.5, 1.31]}>
        <boxGeometry args={[0.45, 0.8, 0.05]} />
        <meshStandardMaterial color="#6b3a1e" />
      </mesh>
      <mesh position={[0, 2.05, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 8]} />
        <meshStandardMaterial color="#6b3a1e" />
      </mesh>
    </group>
  );
}

function SpectatorFigure({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.25, 0.4, 0.18]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
    </group>
  );
}

function KazakhOrnamentPost({ position, accentColor }: { position: [number, number, number], accentColor: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 1.6, 8]} />
        <meshStandardMaterial color="#4a2e18" />
      </mesh>
      <mesh position={[0, 1.7, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.25, 0.25, 0.06]} />
        <meshStandardMaterial color="#ffd700" metalness={0.88} roughness={0.18} />
      </mesh>
      <mesh position={[0.22, 1.4, 0]}>
        <boxGeometry args={[0.4, 0.25, 0.02]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
    </group>
  );
}

/** 3D Waving Kazakh Tribal Banner (Ту) at arena corners */
function KazakhTribalBanner({ position, bannerColor }: { position: [number, number, number], bannerColor: string }) {
  const flagRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!flagRef.current) return;
    const t = state.clock.elapsedTime;
    flagRef.current.rotation.y = Math.sin(t * 4) * 0.15;
    flagRef.current.rotation.z = Math.cos(t * 3) * 0.05;
  });

  return (
    <group position={position}>
      {/* Spear Pole */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 4.4, 8]} />
        <meshStandardMaterial color="#3a2210" roughness={0.7} />
      </mesh>
      {/* Spear Tip */}
      <mesh position={[0, 4.5, 0]}>
        <coneGeometry args={[0.08, 0.3, 6]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Waving Fabric Flag */}
      <mesh ref={flagRef} position={[0.4, 3.8, 0]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.02]} />
        <meshStandardMaterial color={bannerColor} roughness={0.5} />
      </mesh>
    </group>
  );
}

export const Environment3D: React.FC = () => {
  const spectatorColors = ['#c23b22', '#1d65a6', '#2a8035', '#f39c12', '#7d3c98', '#16a085'];
  const isCharging = useArqanStore((state) => state.isCharging);

  return (
    <group>
      {/* Sky */}
      <Sky sunPosition={[40, 15, -30]} turbidity={4} rayleigh={0.4} mieCoefficient={0.01} mieDirectionalG={0.8} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#ffe8cc" />
      <directionalLight
        position={[15, 20, 8]}
        intensity={1.9}
        color="#ffd090"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight args={['#87ceeb', '#c4a060', 0.4]} />
      <directionalLight position={[-10, 8, -15]} intensity={0.4} color="#ffaa66" />
      
      {/* Fog */}
      <fog attach="fog" args={['#d4c0a0', 30, 90]} />
      
      {/* Ground - steppe */}
      <Plane args={[200, 200]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <meshStandardMaterial color="#b8964a" roughness={0.95} />
      </Plane>

      {/* Playing field - grass area */}
      <Plane args={[24, 6]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <meshStandardMaterial color="#7a9a45" roughness={0.9} />
      </Plane>

      {/* 3D Soil Rut Grooves beneath athletes' feet */}
      <Plane args={[12, 1.2]} rotation={[-Math.PI / 2, 0, 0]} position={[4, -0.008, 0]} receiveShadow>
        <meshStandardMaterial color="#4a361c" roughness={0.98} opacity={isCharging ? 0.85 : 0.4} transparent />
      </Plane>
      <Plane args={[12, 1.2]} rotation={[-Math.PI / 2, 0, 0]} position={[-4, -0.008, 0]} receiveShadow>
        <meshStandardMaterial color="#4a361c" roughness={0.98} opacity={0.5} transparent />
      </Plane>

      {/* Center gold line */}
      <Line points={[[0, 0.01, -3], [0, 0.01, 3]]} color="#d4af37" lineWidth={5} />
      {/* Win threshold lines */}
      <Line points={[[-8, 0.01, -3], [-8, 0.01, 3]]} color="#ff4444" lineWidth={4} />
      <Line points={[[8, 0.01, -3], [8, 0.01, 3]]} color="#4488ff" lineWidth={4} />

      {/* Victory Posts */}
      <KazakhOrnamentPost position={[-8, 0, 3.2]} accentColor="#d4af37" />
      <KazakhOrnamentPost position={[8, 0, 3.2]} accentColor="#1a5c8c" />
      <KazakhOrnamentPost position={[-8, 0, -3.2]} accentColor="#d4af37" />
      <KazakhOrnamentPost position={[8, 0, -3.2]} accentColor="#1a5c8c" />

      {/* Kazakh Tribal Banners (Ту) at arena corners */}
      <KazakhTribalBanner position={[-13, 0, 4]} bannerColor="#d4af37" />
      <KazakhTribalBanner position={[13, 0, 4]} bannerColor="#1a5c8c" />
      <KazakhTribalBanner position={[-13, 0, -4]} bannerColor="#d4af37" />
      <KazakhTribalBanner position={[13, 0, -4]} bannerColor="#1a5c8c" />

      {/* Spectators */}
      {Array.from({ length: 12 }).map((_, i) => (
        <SpectatorFigure
          key={`spec-front-${i}`}
          position={[-6 + i * 1.1, 0.25, 5.8]}
          color={spectatorColors[i % spectatorColors.length]}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <SpectatorFigure
          key={`spec-back-${i}`}
          position={[-6 + i * 1.1, 0.25, -5.8]}
          color={spectatorColors[(i + 2) % spectatorColors.length]}
        />
      ))}

      {/* Fences */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = -14 + i * 2;
        return (
          <React.Fragment key={`fence-${i}`}>
            <mesh position={[x, 0.35, 4.5]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.7, 4]} />
              <meshStandardMaterial color="#5c3a1e" />
            </mesh>
            <mesh position={[x, 0.35, -4.5]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.7, 4]} />
              <meshStandardMaterial color="#5c3a1e" />
            </mesh>
          </React.Fragment>
        );
      })}

      {/* Mountains */}
      <Mountain position={[-35, 5, -50]} scale={[15, 12, 15]} color="#7B6B52" />
      <Mountain position={[-18, 8, -55]} scale={[20, 18, 20]} color="#6B5B42" />
      <Mountain position={[5, 6, -48]} scale={[16, 14, 16]} color="#8B7B5B" />
      <Mountain position={[25, 10, -60]} scale={[22, 22, 22]} color="#5B4B35" />

      {/* Yurts */}
      <Yurt position={[-20, 0, -14]} rotY={0.5} />
      <Yurt position={[22, 0, -16]} rotY={-0.3} />

      {/* Trees */}
      <Tree position={[-13, 0, -5]} treeScale={1.2} />
      <Tree position={[13, 0, -6]} treeScale={1.1} />
    </group>
  );
};
