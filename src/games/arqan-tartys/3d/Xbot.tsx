import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from 'react'
import { useGraph, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { GLTF, SkeletonUtils } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Beta_Joints: THREE.SkinnedMesh
    Beta_Surface: THREE.SkinnedMesh
    mixamorigHips: THREE.Bone
  }
  materials: {
    Beta_Joints_MAT: THREE.MeshStandardMaterial
    ['asdf1:Beta_HighLimbsGeoSG2']: THREE.MeshStandardMaterial
  }
}

interface XbotProps {
  teamColor?: string
  isPulling?: boolean
  fatigue?: number
  faceLeft?: boolean
}

export function Xbot({ teamColor = '#ffffff', isPulling = false, fatigue = 0, faceLeft = false }: XbotProps) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/Xbot.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult

  const material = useMemo(() => {
    const mat = materials['asdf1:Beta_HighLimbsGeoSG2'].clone()
    mat.color = new THREE.Color(teamColor)
    return mat
  }, [materials, teamColor])

  const spine = useMemo(() => clone.getObjectByName('mixamorigSpine') as THREE.Bone | undefined, [clone])
  const rightArm = useMemo(() => clone.getObjectByName('mixamorigRightArm') as THREE.Bone | undefined, [clone])
  const rightForeArm = useMemo(() => clone.getObjectByName('mixamorigRightForeArm') as THREE.Bone | undefined, [clone])
  const leftArm = useMemo(() => clone.getObjectByName('mixamorigLeftArm') as THREE.Bone | undefined, [clone])
  const leftForeArm = useMemo(() => clone.getObjectByName('mixamorigLeftForeArm') as THREE.Bone | undefined, [clone])
  const head = useMemo(() => clone.getObjectByName('mixamorigHead') as THREE.Bone | undefined, [clone])

  // Arms forward to HOLD THE ROPE
  useEffect(() => {
    if (rightArm && leftArm && rightForeArm && leftForeArm) {
      // Arms stretched straight forward (X rotation ~90° from T-pose)
      rightArm.rotation.set(1.3, 0.15, -0.25)
      leftArm.rotation.set(1.3, -0.15, 0.25)
      rightForeArm.rotation.set(0.4, 0, -0.1)
      leftForeArm.rotation.set(0.4, 0, 0.1)
    }
  }, [rightArm, leftArm, rightForeArm, leftForeArm])

  useFrame((state) => {
    if (!spine || !head) return

    const targetLean = isPulling ? -0.45 : -0.12
    spine.rotation.x = THREE.MathUtils.lerp(spine.rotation.x, targetLean, 0.08)

    const breath = Math.sin(state.clock.elapsedTime * (4 + fatigue * 4)) * 0.03 * fatigue
    spine.rotation.x += breath
    head.rotation.x = fatigue * 0.35

    material.emissive = new THREE.Color('#ff0000')
    material.emissiveIntensity = fatigue * 0.4
  })

  // The Xbot model faces -Z by default. 
  // To face RIGHT (+X): rotate Y by -Math.PI/2
  // To face LEFT (-X): rotate Y by +Math.PI/2
  const yRotation = faceLeft ? Math.PI / 2 : -Math.PI / 2

  return (
    <group ref={group} dispose={null}>
      <group rotation={[0, yRotation, 0]}>
        <group name="Armature" scale={0.011}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh name="Beta_Joints" geometry={nodes.Beta_Joints.geometry} material={materials.Beta_Joints_MAT} skeleton={nodes.Beta_Joints.skeleton} />
          <skinnedMesh name="Beta_Surface" geometry={nodes.Beta_Surface.geometry} material={material} skeleton={nodes.Beta_Surface.skeleton} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/Xbot.glb')
