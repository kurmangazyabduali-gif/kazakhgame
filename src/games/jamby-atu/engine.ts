import { create } from 'zustand'

export type GameState = 'INTRO' | 'MOUNT' | 'RIDE' | 'AIM' | 'DRAW' | 'RELEASE' | 'ARROW_FLIGHT' | 'IMPACT' | 'RESULT' | 'NEXT_TARGET' | 'FINAL_RESULT'
export type HitZone = 'BULLSEYE' | 'CENTER' | 'OUTER' | 'MISS'

export interface JambyLevel {
  id: number
  targetSize: number
  targetMovement: 'NONE' | 'HORIZONTAL' | 'FAST'
  windStrength: number // 0 to 1
  windDirection: [number, number, number]
}

export const LEVELS: JambyLevel[] = [
  { id: 1, targetSize: 2.0, targetMovement: 'NONE', windStrength: 0, windDirection: [0, 0, 0] },
  { id: 2, targetSize: 1.5, targetMovement: 'NONE', windStrength: 0, windDirection: [0, 0, 0] },
  { id: 3, targetSize: 1.5, targetMovement: 'HORIZONTAL', windStrength: 0.3, windDirection: [1, 0, 0] },
  { id: 4, targetSize: 1.2, targetMovement: 'HORIZONTAL', windStrength: 0.6, windDirection: [1, 0, 0.5] },
  { id: 5, targetSize: 1.0, targetMovement: 'FAST', windStrength: 1.0, windDirection: [-1, 0, 0.5] },
]

export interface ShotResult {
  levelId: number
  zone: HitZone
  score: number
  accuracy: number
  windDifficulty: number
  combo: number
}

interface JambyStore {
  gameState: GameState
  currentLevelIndex: number
  score: number
  combo: number
  hits: number
  results: ShotResult[]
  drawStrength: number // 0 to 100
  
  setGameState: (state: GameState) => void
  setDrawStrength: (val: number) => void
  registerShot: (zone: HitZone, accuracy: number) => void
  nextLevel: () => void
  reset: () => void
}

export const useJambyEngine = create<JambyStore>((set, get) => ({
  gameState: 'INTRO',
  currentLevelIndex: 0,
  score: 0,
  combo: 0,
  hits: 0,
  results: [],
  drawStrength: 0,

  setGameState: (state) => set({ gameState: state }),
  setDrawStrength: (val) => set({ drawStrength: Math.max(0, Math.min(100, val)) }),
  
  registerShot: (zone, accuracy) => {
    const state = get()
    const level = LEVELS[state.currentLevelIndex]
    
    let baseScore = 0
    let isHit = false
    if (zone === 'BULLSEYE') { baseScore = 100; isHit = true }
    else if (zone === 'CENTER') { baseScore = 50; isHit = true }
    else if (zone === 'OUTER') { baseScore = 20; isHit = true }

    const newCombo = isHit ? state.combo + 1 : 0
    let comboMultiplier = 1
    if (newCombo >= 5) comboMultiplier = 2.5
    else if (newCombo >= 4) comboMultiplier = 2.0
    else if (newCombo >= 3) comboMultiplier = 1.5
    else if (newCombo >= 2) comboMultiplier = 1.2

    const difficultyMultiplier = 1 + level.windStrength + (level.targetMovement === 'FAST' ? 0.5 : level.targetMovement === 'HORIZONTAL' ? 0.2 : 0)
    
    const finalScore = Math.round(baseScore * comboMultiplier * difficultyMultiplier)
    
    const result: ShotResult = {
      levelId: level.id,
      zone,
      score: finalScore,
      accuracy,
      windDifficulty: level.windStrength,
      combo: newCombo
    }

    set({
      gameState: 'RESULT',
      score: state.score + finalScore,
      combo: newCombo,
      hits: state.hits + (isHit ? 1 : 0),
      results: [...state.results, result]
    })
  },

  nextLevel: () => {
    const state = get()
    if (state.currentLevelIndex >= LEVELS.length - 1) {
      set({ gameState: 'FINAL_RESULT' })
    } else {
      set({ 
        currentLevelIndex: state.currentLevelIndex + 1,
        gameState: 'RIDE',
        drawStrength: 0
      })
    }
  },

  reset: () => set({
    gameState: 'INTRO',
    currentLevelIndex: 0,
    score: 0,
    combo: 0,
    hits: 0,
    results: [],
    drawStrength: 0
  })
}))
