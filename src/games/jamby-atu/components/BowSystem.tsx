'use client'

import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { HitZone, useJambyEngine } from '../engine'
import * as THREE from 'three'
import { ArrowProjectile } from './ArrowProjectile'

export function BowSystem() {
  const gameState = useJambyEngine(s => s.gameState)
  const setGameState = useJambyEngine(s => s.setGameState)
  const drawStrength = useJambyEngine(s => s.drawStrength)
  const setDrawStrength = useJambyEngine(s => s.setDrawStrength)
  
  const bowGroup = useRef<THREE.Group>(null)
  const { camera } = useThree()
  
  const [activeArrow, setActiveArrow] = useState<{
    id: number
    position: [number, number, number]
    direction: THREE.Vector3
    power: number
  } | null>(null)
  const arrowIdRef = useRef(0)

  // Load the ultra-realistic bow texture
  const bowTex = useLoader(THREE.TextureLoader, '/assets/jamby-atu/bow.jpg')
  
  // Custom ChromaKey Shader to remove the neon green background
  const bowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: bowTex },
        keyColor: { value: new THREE.Color('#00ff00') },
        threshold: { value: 0.45 },
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
          float diff = distance(texColor.rgb, vec3(0.0, 1.0, 0.0));
          if (diff < threshold) {
            discard;
          }
          float alpha = smoothstep(threshold, threshold + smoothness, diff);
          gl_FragColor = vec4(texColor.rgb, alpha);
        }
      `,
      transparent: true,
      depthTest: false // Ensures it renders cleanly over the scene
    })
  }, [bowTex])


  useFrame((state) => {
    if (!bowGroup.current) return
    if (gameState !== 'AIM' && gameState !== 'DRAW') return

    // Calculate aim direction based on pointer
    const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5)
    vector.unproject(camera)
    const dir = vector.sub(camera.position).normalize()
    
    // Position bow relative to camera
    const bowPos = camera.position.clone().add(dir.clone().multiplyScalar(1.5))
    // Offset to the right and slightly down
    bowPos.add(new THREE.Vector3(0.6, -0.4, 0))
    
    bowGroup.current.position.copy(bowPos)
    
    // Look at target
    const targetLook = bowPos.clone().add(dir)
    bowGroup.current.lookAt(targetLook)

    if (gameState === 'DRAW') {
      setDrawStrength(drawStrength + (100 * state.clock.getDelta())) 
      
      // Add shaking effect when drawing hard
      if (drawStrength > 70) {
        bowGroup.current.position.x += (Math.random() - 0.5) * 0.02
        bowGroup.current.position.y += (Math.random() - 0.5) * 0.02
      }
    }
  })

  const handleShoot = useCallback((power: number) => {
    if (!bowGroup.current) return
    
    const dir = new THREE.Vector3()
    bowGroup.current.getWorldDirection(dir)
    const pos = bowGroup.current.position.clone()

    setActiveArrow({
      id: arrowIdRef.current + 1,
      position: [pos.x, pos.y, pos.z],
      direction: dir,
      power
    })
    arrowIdRef.current += 1
    
    setGameState('ARROW_FLIGHT')
  }, [setGameState])

  useEffect(() => {
    const onRelease = (event: Event) => {
      const shootEvent = event as CustomEvent<{ power: number }>
      if (gameState === 'DRAW') {
        handleShoot(shootEvent.detail.power)
      }
    }

    window.addEventListener('jamby-shoot', onRelease)
    return () => window.removeEventListener('jamby-shoot', onRelease)
  }, [gameState, handleShoot])

  const handleArrowHit = (zone: HitZone) => {
    const accuracy = zone === 'BULLSEYE' ? 100 : zone === 'CENTER' ? 70 : 30
    useJambyEngine.getState().registerShot(zone, accuracy)
  }

  const handleArrowMiss = () => {
    useJambyEngine.getState().registerShot('MISS', 0)
  }

  return (
    <>
      {/* Ultra-Realistic 2.5D Bow Sprite */}
      {(gameState === 'AIM' || gameState === 'DRAW') && (
        <group ref={bowGroup}>
          <mesh rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[2, 2]} />
            <primitive object={bowMaterial} attach="material" />
          </mesh>
        </group>
      )}

      {/* The Fired Arrow */}
      {activeArrow && (
        <ArrowProjectile 
          key={activeArrow.id}
          position={activeArrow.position} 
          direction={activeArrow.direction} 
          power={activeArrow.power}
          onHit={handleArrowHit}
          onMiss={handleArrowMiss}
        />
      )}
    </>
  )
}
