import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody, RapierRigidBody, useRapier } from '@react-three/rapier';
import { AsykBone } from './AsykBone';
import { ThrowParams, AsykAtuPhase, AsykFace } from '../types';
import { getLevelConfig } from '../levels';
import * as THREE from 'three';
import { Sparkles, ContactShadows, Trail, Line, Text, Environment } from '@react-three/drei';

function SlowMoStepper({ isThrowing }: { isThrowing: boolean }) {
  const { step } = useRapier();
  useFrame((_, delta) => {
    // During throw, slow down physics time by 5x
    // Cap delta to prevent huge jumps if tab was inactive
    const safeDelta = Math.min(delta, 0.1); 
    step(isThrowing ? safeDelta * 0.15 : safeDelta);
  });
  return null;
}

interface Asyk3DSceneProps {
  currentPhase: AsykAtuPhase;
  onAimUpdate: (params: ThrowParams) => void;
  onThrowStart: () => void;
  onThrowComplete: (result: { targetsHit: number, landedFace?: AsykFace, remaining: number }) => void;
  level: number;
}

const PLAYER_START = new THREE.Vector3(0, 0.25, 4);
const CIRCLE_CENTER = new THREE.Vector3(0, 0, -2);
const TARGET_HIT_MOVE_THRESHOLD = 0.5;



export function Asyk3DScene({ 
  currentPhase, 
  onAimUpdate, 
  onThrowStart,
  onThrowComplete,
  level
}: Asyk3DSceneProps) {
  const playerRef = useRef<RapierRigidBody>(null);
  const targetRefs = useRef<Record<number, RapierRigidBody>>({});
  
  const { camera } = useThree();
  const levelConfig = useMemo(() => getLevelConfig(level), [level]);
  
  const [activeTargets, setActiveTargets] = useState<number[]>(
    Array.from({ length: levelConfig.targetCount }, (_, i) => i)
  );
  
  const [aimParams, setAimParams] = useState<ThrowParams>({ angleDeg: 0, powerPercent: 0, directionDeg: 0 });
  const aimState = useRef({ isDragging: false, startY: 0, currentY: 0, startX: 0, currentX: 0 });
  
  const [floatingTexts, setFloatingTexts] = useState<{id: string, text: string, pos: [number, number, number], time: number}[]>([]);
  
  const resetTimerRef = useRef(0);
  const hasTriggeredReset = useRef(false);

  const executeThrow = useCallback((angleDeg: number, powerPercent: number) => {
    onThrowStart();
    const body = playerRef.current;
    if (body) {
      // Scale power using level config
      const minP = levelConfig.throwPowerMin;
      const maxP = levelConfig.throwPowerMax;
      const velocityMag = minP + (powerPercent / 100) * (maxP - minP);
      
      const rad = THREE.MathUtils.degToRad(angleDeg - 180);
      const vx = Math.sin(rad) * velocityMag;
      const vz = Math.cos(rad) * velocityMag;
      
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      
      body.applyImpulse({ x: vx, y: 0, z: vz }, true);
      body.applyTorqueImpulse({ 
        x: (Math.random() - 0.5) * 1.5, 
        y: (Math.random() - 0.5) * 1.5, 
        z: (Math.random() - 0.5) * 1.5 
      }, true);
    }
  }, [onThrowStart, levelConfig]);

  // Handle Drag/Pull-back input
  useEffect(() => {
    if (currentPhase !== 'AIM') return;
    hasTriggeredReset.current = false;

    const handlePointerDown = (e: PointerEvent | TouchEvent) => {
      // prevent default to stop scrolling on mobile
      if (e.type === 'touchstart') e.preventDefault();
      
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as PointerEvent).clientY;
      
      aimState.current = {
        isDragging: true,
        startX: clientX,
        startY: clientY,
        currentX: clientX,
        currentY: clientY
      };
    };

    const handlePointerMove = (e: PointerEvent | TouchEvent) => {
      if (!aimState.current.isDragging) return;
      if (e.type === 'touchmove') e.preventDefault();
      
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as PointerEvent).clientY;
      
      aimState.current.currentX = clientX;
      aimState.current.currentY = clientY;
      
      // Calculate drag distance (downwards = power)
      const deltaY = Math.max(0, clientY - aimState.current.startY); 
      // Calculate angle (horizontal drag = angle)
      const deltaX = clientX - aimState.current.startX;
      
      const maxDragDist = window.innerHeight * 0.4;
      const powerPercent = Math.min(100, Math.max(0, (deltaY / maxDragDist) * 100));
      
      // Angle mapped: full width of screen = ~90 degrees
      const angleDeg = (deltaX / window.innerWidth) * 90;
      
      const newParams = { angleDeg, powerPercent, directionDeg: angleDeg };
      setAimParams(newParams);
      onAimUpdate(newParams);
    };

    const handlePointerUp = () => {
      if (!aimState.current.isDragging) return;
      aimState.current.isDragging = false;
      
      if (aimParams.powerPercent > 5) { // Minimum threshold to throw
        executeThrow(aimParams.angleDeg, aimParams.powerPercent);
      } else {
        // Reset aim if pulled back too little
        const resetParams = { angleDeg: 0, powerPercent: 0, directionDeg: 0 };
        setAimParams(resetParams);
        onAimUpdate(resetParams);
      }
    };

    const touchOptions: AddEventListenerOptions = { passive: false };
    
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchstart', handlePointerDown, touchOptions);
    window.addEventListener('touchmove', handlePointerMove, touchOptions);
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown, touchOptions);
      window.removeEventListener('touchmove', handlePointerMove, touchOptions);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [currentPhase, aimParams, executeThrow, onAimUpdate]);

  const processSettling = useCallback(() => {
    if (hasTriggeredReset.current) return;
    hasTriggeredReset.current = true;

    let knockedOutCount = 0;
    const remainingTargets: number[] = [];
    const newFloatingTexts: typeof floatingTexts = [];
    
    activeTargets.forEach((id) => {
      const body = targetRefs.current[id];
      if (body) {
        const t = body.translation();
        const initial = levelConfig.positions[id];
        
        const distFromCenter = Math.sqrt(Math.pow(t.x - CIRCLE_CENTER.x, 2) + Math.pow(t.z - CIRCLE_CENTER.z, 2));
        const movedFromStart = Math.sqrt(Math.pow(t.x - initial[0], 2) + Math.pow(t.z - initial[2], 2));
        
        // If outside arena, it's knocked out
        if (distFromCenter > levelConfig.arenaRadius || movedFromStart > TARGET_HIT_MOVE_THRESHOLD * 3) { // increased threshold slightly
          knockedOutCount++;
          newFloatingTexts.push({ 
            id: `hit-${id}-${Date.now()}`, 
            text: `+${50 * (knockedOutCount)}`, 
            pos: [t.x, t.y + 1, t.z], 
            time: Date.now() 
          });
        } else {
          remainingTargets.push(id);
        }
      } else {
        remainingTargets.push(id);
      }
    });

    if (newFloatingTexts.length > 0) {
      setFloatingTexts(prev => [...prev, ...newFloatingTexts]);
      setTimeout(() => setFloatingTexts(prev => prev.filter(t => Date.now() - t.time < 2000)), 2000);
    }

    // Reset player position immediately
    if (playerRef.current) {
      playerRef.current.setTranslation({ x: PLAYER_START.x, y: PLAYER_START.y, z: PLAYER_START.z }, true);
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      playerRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
    
    setAimParams({ angleDeg: 0, powerPercent: 0, directionDeg: 0 });

    setActiveTargets(remainingTargets);
    
    // Notify wrapper
    onThrowComplete({
      targetsHit: knockedOutCount,
      remaining: remainingTargets.length,
      landedFace: 'chik'
    });
  }, [activeTargets, levelConfig, onThrowComplete]);

  // Frame Loop (Camera + Settle Detection)
  useFrame((state, delta) => {
    // 1. Camera Logic
    if (currentPhase === 'AIM') {
      const targetCamPos = new THREE.Vector3(PLAYER_START.x, PLAYER_START.y + 3, PLAYER_START.z + 4.5);
      state.camera.position.lerp(targetCamPos, 0.05); // Smoother return to aim
      
      // Smooth look-at reset
      const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position);
      const targetLookAt = new THREE.Vector3(CIRCLE_CENTER.x, 0.5, CIRCLE_CENTER.z);
      currentLookAt.lerp(targetLookAt, 0.05);
      state.camera.lookAt(currentLookAt);
      
    } else if (currentPhase === 'THROWING' && playerRef.current) {
      const p = playerRef.current.translation();
      
      // OOB Check
      if (p.y < -3 || Math.abs(p.x) > 20 || Math.abs(p.z) > 20) {
         processSettling();
         return;
      }

      // Cinematic Slow-Motion Camera Follow
      // Since the physics is literally slowed down 6x via SlowMoStepper, we can use a moderate lerp
      const targetPos = new THREE.Vector3(
        THREE.MathUtils.clamp(p.x * 0.3, -3, 3),
        Math.max(1.5, p.y + 1.5),
        THREE.MathUtils.clamp(p.z + 4, -2, 10)
      );
      
      camera.position.lerp(targetPos, 0.05);
      
      // Smooth lookAt to track the bone without snapping
      const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
      const targetLook = new THREE.Vector3(p.x, Math.max(0, p.y), p.z - 2);
      currentLookAt.lerp(targetLook, 0.08);
      camera.lookAt(currentLookAt);
      
      // Motion Detection for SETTLING
      let isMoving = false;
      const v = playerRef.current.linvel();
      if (Math.abs(v.x) > 0.05 || Math.abs(v.z) > 0.05) isMoving = true;
      
      activeTargets.forEach(id => {
        const body = targetRefs.current[id];
        if (body) {
          const bv = body.linvel();
          if (Math.abs(bv.x) > 0.05 || Math.abs(bv.z) > 0.05) isMoving = true;
        }
      });

      if (isMoving) {
        resetTimerRef.current = 0;
      } else {
        resetTimerRef.current += delta;
        if (resetTimerRef.current > 0.8 && !hasTriggeredReset.current) { // settle time
          processSettling();
        }
      }
    }
  });

  return (
    <group>
      {/* Bright daylight fog */}
      <fog attach="fog" args={['#F4F8FA', 10, 50]} />
      <color attach="background" args={['#87CEEB']} />
      
      {/* Bright Daylight Lighting */}
      <ambientLight intensity={0.8} color="#FFFFFF" />
      <directionalLight 
        position={[-15, 25, 10]} 
        castShadow 
        intensity={2.5} 
        color="#FFF5E6"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
      />
      {/* Fill light from opposite side */}
      <directionalLight position={[15, 10, -10]} intensity={1.0} color="#E0F2FE" />

      {/* Realistic daytime environment reflection */}
      <Environment preset="park" environmentIntensity={0.6} />
      <ContactShadows resolution={1024} scale={25} blur={2} opacity={0.6} far={10} color="#2A1A10" />
      
      {/* Subtle floating dust particles */}
      <Sparkles count={50} scale={20} size={1.5} speed={0.1} opacity={0.2} color="#FFFFFF" position={[0, 2, 0]} />
      
      <Physics gravity={[0, -20, 0]} paused={true} timeStep="vary">
        <SlowMoStepper isThrowing={currentPhase === 'THROWING'} />
        
        <RigidBody type="fixed" friction={levelConfig.friction} restitution={0.1} name="ground">
          {/* Ground environment (Steppe/Sand) */}
          <mesh receiveShadow position={[0, -0.26, 0]} rotation={[-Math.PI/2, 0, 0]}>
            <planeGeometry args={[150, 150]} />
            <meshStandardMaterial color="#E6C898" roughness={1.0} />
          </mesh>
          
          {/* Main Playing Arena (Tekemet/Syrmak style base) */}
          <mesh receiveShadow position={[0, -0.15, 0]}>
            <cylinderGeometry args={[20, 20, 0.2, 64]} />
            <meshStandardMaterial color="#C59C6D" roughness={0.9} />
          </mesh>
          <mesh receiveShadow position={[0, -0.04, 0]}>
            <cylinderGeometry args={[levelConfig.arenaRadius + 1, levelConfig.arenaRadius + 1, 0.05, 64]} />
            <meshStandardMaterial color="#A87C51" roughness={0.85} bumpScale={0.1} />
          </mesh>
        </RigidBody>
        
        {/* Visual Target Reticle and Trajectory */}
        {currentPhase === 'AIM' && aimParams.powerPercent > 0 && (
          <Line 
            points={[ 
              [PLAYER_START.x, 0.1, PLAYER_START.z], 
              [
                PLAYER_START.x + Math.sin(THREE.MathUtils.degToRad(aimParams.angleDeg - 180)) * (aimParams.powerPercent / 10), 
                0.1, 
                PLAYER_START.z + Math.cos(THREE.MathUtils.degToRad(aimParams.angleDeg - 180)) * (aimParams.powerPercent / 10)
              ] 
            ]}
            color={aimParams.powerPercent > 80 ? "#C0392B" : "#FFF"}
            lineWidth={4}
            dashed
            dashScale={0.5}
            opacity={0.8}
            transparent
          />
        )}
        
        {/* Target Circle Boundary Visualization - Traditional white chalk/rope line */}
        <mesh position={[CIRCLE_CENTER.x, 0.02, CIRCLE_CENTER.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[levelConfig.arenaRadius - 0.1, levelConfig.arenaRadius, 128]} />
          <meshStandardMaterial color="#FFFFFF" roughness={1} opacity={0.9} transparent />
        </mesh>
        
        {/* Inner circle decoration (Ornamental touch) */}
        <mesh position={[CIRCLE_CENTER.x, 0.015, CIRCLE_CENTER.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[levelConfig.arenaRadius - 0.8, levelConfig.arenaRadius - 0.75, 64]} />
          <meshStandardMaterial color="#8B4513" roughness={0.9} opacity={0.5} transparent />
        </mesh>

        {/* Target Asyks */}
        <group key={"targets"}>
          {activeTargets.map((id) => (
            <AsykBone 
              key={"target-" + id}
              bodyRef={(r) => { if (r) targetRefs.current[id] = r; }}
              position={levelConfig.positions[id] as [number, number, number]} 
              isGolden={id === 0}
            />
          ))}
        </group>
        
        {/* Player Throwing Asyk */}
        <Trail width={0.4} length={10} color="#FFFFFF" attenuation={(t) => t * t}>
          <AsykBone 
            bodyRef={(r) => { playerRef.current = r; }} 
            position={[PLAYER_START.x, PLAYER_START.y, PLAYER_START.z]} 
            isPlayer={true} 
          />
        </Trail>
        
      </Physics>
      
      {/* Floating Score Texts */}
      {floatingTexts.map(ft => (
        <Text
          key={ft.id}
          position={ft.pos}
          fontSize={1.5}
          color="#FFF"
          font="/fonts/CormorantGaramond-Bold.ttf"
          outlineWidth={0.06}
          outlineColor="#8B4513"
          anchorX="center"
          anchorY="middle"
        >
          {ft.text}
        </Text>
      ))}

    </group>
  );
}


