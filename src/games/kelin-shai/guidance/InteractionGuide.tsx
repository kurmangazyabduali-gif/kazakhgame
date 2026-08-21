'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { HintLevel } from './useHintSystem'

interface InteractionGuideProps {
  level: HintLevel
  sourcePos: [number, number, number]
  targetPos: [number, number, number]
  actionType: 'drag' | 'pour' | 'handoff' | 'tap'
}

export default function InteractionGuide({ level, sourcePos, targetPos, actionType }: InteractionGuideProps) {
  const handRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Calculate curve for the line (arc)
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...sourcePos)
    const end = new THREE.Vector3(...targetPos)
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    mid.y += 0.5 // arc height
    
    return new THREE.QuadraticBezierCurve3(start, mid, end)
  }, [sourcePos, targetPos])

  const linePoints = useMemo(() => curve.getPoints(20), [curve])

  useFrame((state) => {
    if (level < 3 || !handRef.current) return
    // Animate hand along the curve
    const t = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2 // 0 to 1 oscillating
    const pos = curve.getPoint(t)
    // Update the Html position container (we can't easily move the Html component itself smoothly without re-rendering, so we move a Group wrapper)
    if (groupRef.current) {
      groupRef.current.position.copy(pos)
    }
    
    // Scale hand down slightly when "grabbing" (t < 0.1) or "releasing" (t > 0.9)
    if (actionType === 'drag' || actionType === 'handoff') {
      const isGrabbing = t > 0.05 && t < 0.95
      handRef.current.style.transform = `scale(${isGrabbing ? 0.9 : 1}) rotate(-15deg)`
      handRef.current.style.opacity = (t < 0.02 || t > 0.98) ? '0' : '1'
    } else if (actionType === 'pour') {
      // Pouring motion (tilt)
      const isPouring = t > 0.8
      handRef.current.style.transform = `scale(0.9) rotate(${isPouring ? -45 : -15}deg)`
    }
  })

  if (level < 2) return null

  return (
    <>
      {/* Level 2+: Show trajectory line */}
      <Line 
        points={linePoints}
        color="#D4AF37"
        lineWidth={3}
        dashed
        dashScale={5}
        dashSize={1}
        dashOffset={0}
        transparent
        opacity={0.6}
      />
      
      {/* Level 3: Show animated hand */}
      {level >= 3 && (
        <group ref={groupRef}>
          <Html center style={{ pointerEvents: 'none' }}>
            <div 
              ref={handRef}
              className="text-4xl filter drop-shadow-lg transition-transform duration-100"
              style={{ transformOrigin: 'top left' }}
            >
              👆
            </div>
          </Html>
        </group>
      )}
    </>
  )
}
