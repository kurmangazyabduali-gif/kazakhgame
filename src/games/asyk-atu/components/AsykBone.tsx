'use client';

import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, type CollisionEnterPayload, type RapierRigidBody } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { AsykFace } from '../types';

interface AsykBoneProps {
  position?: [number, number, number];
  isPlayer?: boolean;
  isGolden?: boolean;
  onStop?: (face: AsykFace) => void;
  bodyRef?: (body: RapierRigidBody | null) => void;
  onCollisionEnter?: (e: CollisionEnterPayload) => void;
  emissive?: string;
  emissiveIntensity?: number;
}

// Pre-create materials to avoid memory leaks
const playerMaterial = new THREE.MeshStandardMaterial({
  color: '#3b82f6',
  roughness: 0.8,
  metalness: 0.05
});

const targetMaterial = new THREE.MeshStandardMaterial({
  color: '#e8d5a5',
  roughness: 0.8,
  metalness: 0.05
});

const goldMaterial = new THREE.MeshStandardMaterial({
  color: '#FFD700',
  roughness: 0.2,
  metalness: 0.8
});

export function AsykBone({ position = [0, 0, 0], isPlayer = false, isGolden = false, onStop, bodyRef, onCollisionEnter, emissive, emissiveIntensity }: AsykBoneProps) {
  const innerRef = useRef<RapierRigidBody>(null);
  const [stopped, setStopped] = useState(false);
  const stopTimer = useRef(0);

  // Load the GLB model
  const { scene } = useGLTF('/assets/games/asyk-atu/asyks/asyk.glb');
  
  // Clone scene and apply material modifications safely
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    
    // Calculate bounding box to normalize scale
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Target length is ~0.9 based on physics collider
    const targetLength = 0.9;
    const scaleFactor = maxDim > 0 ? targetLength / maxDim : 1;
    clone.scale.set(scaleFactor, scaleFactor, scaleFactor);
    
    // Center the geometry so it aligns with physics body origin
    const center = box.getCenter(new THREE.Vector3());
    clone.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor);

    // Apply materials
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        let mat = isGolden ? goldMaterial : (isPlayer ? playerMaterial : targetMaterial);
        
        // If there's an emissive color, we need a unique material instance
        if (emissive) {
          mat = mat.clone();
          mat.emissive = new THREE.Color(emissive);
          mat.emissiveIntensity = emissiveIntensity || 1;
        } else if (!isGolden && child.material && (child.material as THREE.MeshStandardMaterial).map) {
           // If the original model has a texture, preserve it by cloning the base material
           const oldMat = child.material as THREE.MeshStandardMaterial;
           mat = mat.clone();
           mat.map = oldMat.map;
           mat.normalMap = oldMat.normalMap;
           mat.color = new THREE.Color('#ffffff'); // Reset base color if using texture
        }
        
        child.material = mat;
      }
    });
    
    return clone;
  }, [scene, isPlayer, isGolden, emissive, emissiveIntensity]);

  // Cleanup cloned materials on unmount if they were specifically cloned for this instance
  useEffect(() => {
    return () => {
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Only dispose if it's not one of our global shared materials
          if (child.material !== playerMaterial && child.material !== targetMaterial && child.material !== goldMaterial) {
            child.material.dispose();
          }
        }
      });
    };
  }, [clonedScene]);

  const setRigidBodyRef = useCallback((body: RapierRigidBody | null) => {
    innerRef.current = body;
    bodyRef?.(body);
  }, [bodyRef]);

  useFrame((state, delta) => {
    const body = innerRef.current;
    if (!body) return;

    const linVel = body.linvel();
    const angVel = body.angvel();
    const speed = Math.sqrt(linVel.x ** 2 + linVel.y ** 2 + linVel.z ** 2) + Math.sqrt(angVel.x ** 2 + angVel.y ** 2 + angVel.z ** 2);
    
    if (speed < 0.1 && !stopped && stopTimer.current > 1.0) {
      setStopped(true);
      if (onStop) {
        const rot = body.rotation();
        const euler = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w));
        
        let face: AsykFace = 'chik';
        const absX = Math.abs(euler.x);
        const absZ = Math.abs(euler.z);
        
        // This heuristic might need tuning for the new model's orientation
        if (absX < 0.5 && absZ < 0.5) face = 'alshy';
        else if (absX > 2.5 && absZ < 0.5) face = 'tayke';
        else if (absZ > 1.0 && absZ < 2.0) face = 'buk';
        
        onStop(face);
      }
    } else if (speed >= 0.1) {
      setStopped(false);
      stopTimer.current += delta;
    }
  });

  return (
    <RigidBody 
      ref={setRigidBodyRef}
      position={position} 
      colliders={false}
      mass={isPlayer ? 5.0 : 2.0} 
      restitution={0} 
      friction={0.9}
      linearDamping={0.5}
      angularDamping={2.0} 
      ccd={true}
      onCollisionEnter={onCollisionEnter}
    >
      <group rotation={[Math.PI / 2, 0, 0]}>
        <CapsuleCollider args={[0.25, 0.2]} />
      </group>
      
      {/* We wrap clonedScene in a group to allow for manual rotation corrections.
          Most GLB models are Y-up (tall). The physics collider is rotated Math.PI/2 on X 
          to lie flat on the ground. We apply the same rotation to the visual model. */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={clonedScene} />
      </group>
    </RigidBody>
  );
}

useGLTF.preload('/assets/games/asyk-atu/asyks/asyk.glb');
