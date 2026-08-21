import { useState, useEffect, useCallback } from 'react'

export type HintLevel = 0 | 1 | 2 | 3

export function useHintSystem(stepId: string | undefined, isActive: boolean) {
  const [hintLevel, setHintLevel] = useState<HintLevel>(0)
  const [lastActionTime, setLastActionTime] = useState(Date.now())

  const resetHintTimer = useCallback(() => {
    setLastActionTime(Date.now())
    setHintLevel(0)
  }, [])

  useEffect(() => {
    if (!isActive || !stepId) {
      setHintLevel(0)
      return
    }

    const interval = setInterval(() => {
      const idleTime = Date.now() - lastActionTime
      if (idleTime > 8000) setHintLevel(3) // Ghost Hand
      else if (idleTime > 5000) setHintLevel(2) // Arrow/Line
      else if (idleTime > 2500) setHintLevel(1) // Glow
      else setHintLevel(0)
    }, 500)

    return () => clearInterval(interval)
  }, [stepId, lastActionTime, isActive])

  // Reset hints when step changes
  useEffect(() => {
    resetHintTimer()
  }, [stepId, resetHintTimer])

  // Global pointer listener to reset hints on ANY user interaction
  useEffect(() => {
    const handleInteraction = () => resetHintTimer()
    window.addEventListener('pointerdown', handleInteraction)
    window.addEventListener('pointermove', handleInteraction, { once: true }) // only first move resets, to not spam
    
    // To keep resetting on continuous move, we can do throttling, 
    // but usually pointerdown is enough for "drag" start.
    
    return () => {
      window.removeEventListener('pointerdown', handleInteraction)
      window.removeEventListener('pointermove', handleInteraction)
    }
  }, [resetHintTimer])

  return { hintLevel, resetHintTimer }
}
