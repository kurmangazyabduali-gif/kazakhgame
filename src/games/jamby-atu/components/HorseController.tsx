'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { useJambyEngine } from '../engine'
import * as THREE from 'three'

export function HorseController({ children }: { children: React.ReactNode }) {
  const gameState = useJambyEngine(s => s.gameState)
  const group = useRef<THREE.Group>(null)
  const headGroup = useRef<THREE.Group>(null)
  const speed = useRef(0)
  
  // Load our ultra-realistic generated horse texture
  const horseTex = useLoader(THREE.TextureLoader, '/assets/jamby-atu/horse.jpg')
  
  // Custom ChromaKey Shader to remove the neon green background
  const horseMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: horseTex },
        keyColor: { value: new THREE.Color('#00ff00') },
        threshold: { value: 0.5 }, // Adjust for exact green
        smoothness: { value: 0.1 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform vec3 keyColor;
        uniform float threshold;
        uniform float smoothness;
        varying vec2 vUv;
        void main() {
          vec4 texColor = texture2D(map, vUv);
          
          // Compute difference to pure neon green
          float diff = distance(texColor.rgb, vec3(0.0, 1.0, 0.0));
          
          if (diff < threshold) {
            discard;
          }
          
          float alpha = smoothstep(threshold, threshold + smoothness, diff);
          gl_FragColor = vec4(texColor.rgb, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    })
  }, [horseTex])

  useFrame((state, delta) => {
    if (!group.current) return

    if (gameState === 'RIDE' && group.current.position.z < -20) {
      group.current.position.z = 0
    }

    const movingStates = ['RIDE', 'AIM', 'DRAW', 'RELEASE', 'ARROW_FLIGHT']
    const targetSpeed = movingStates.includes(gameState) ? 15 : 0
    
    speed.current = THREE.MathUtils.lerp(speed.current, targetSpeed, delta * 2)
    group.current.position.z -= speed.current * delta
    
    // Horse Galloping Bobbing Effect
    if (speed.current > 1) {
      const bob = Math.sin(state.clock.elapsedTime * 12) * 0.15
      group.current.position.y = bob
      
      // The head bobs slightly out of phase
      if (headGroup.current) {
        headGroup.current.position.y = Math.sin(state.clock.elapsedTime * 12 + 1) * 0.1
        headGroup.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.05
      }
    } else {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, delta * 5)
      if (headGroup.current) {
        headGroup.current.position.y = THREE.MathUtils.lerp(headGroup.current.position.y, 0, delta * 5)
        headGroup.current.rotation.z = THREE.MathUtils.lerp(headGroup.current.rotation.z, 0, delta * 5)
      }
    }
  })

  return (
    <group ref={group}>
      {/* 2.5D Ultra-Realistic Horse Head Sprite */}
      {/* Placed slightly ahead of the camera so we look at the back of its head */}
      <group ref={headGroup} position={[0, 1.5, -2.5]}>
        <mesh>
          <planeGeometry args={[3, 3]} />
          <primitive object={horseMaterial} attach="material" />
        </mesh>
      </group>
      {children}
    </group>
  )
}

export function HorseMock() {
  return null // We don't need the mock cubes anymore
}
