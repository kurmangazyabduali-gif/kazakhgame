import { useAnimations } from '@react-three/drei'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

export function useAnimationSystem(animations: THREE.AnimationClip[], ref: React.RefObject<THREE.Object3D | null>) {
  const { actions } = useAnimations(animations, ref)
  const [currentAction, setCurrentAction] = useState<string | null>(null)

  const play = (name: string, loop: boolean = true) => {
    if (!actions[name]) return

    const action = actions[name]
    action?.reset().fadeIn(0.2).play()
    if (!loop) {
      action?.setLoop(THREE.LoopOnce, 1)
      Reflect.set(action, 'clampWhenFinished', true)
    }
    setCurrentAction(name)
  }

  const crossFade = (from: string, to: string, duration: number = 0.5) => {
    if (!actions[from] || !actions[to]) return

    const fromAction = actions[from]
    const toAction = actions[to]

    toAction?.reset().play()
    fromAction?.crossFadeTo(toAction!, duration, true)
    setCurrentAction(to)
  }

  const stop = (name: string) => {
    actions[name]?.fadeOut(0.2).stop()
  }

  // Effect to clean up animations on unmount
  useEffect(() => {
    return () => {
      Object.values(actions).forEach(action => action?.stop())
    }
  }, [actions])

  return { play, crossFade, stop, actions, currentAction }
}
