import { create } from 'zustand'

export type MissionState = 'SEARCH' | 'LOCATE' | 'FOCUS' | 'POSITION' | 'DIVE' | 'ATTACK' | 'RESULT' | 'RETURN' | 'IDLE'

export type EagleCommand = 'FOLLOW' | 'TURN' | 'CLIMB' | 'DIVE' | 'FOCUS' | 'ATTACK' | 'RETURN' | 'IDLE'

export interface EagleProfile {
  name: string
  level: number
  experience: number
  trust: number
  speed: number
  stamina: number
  turning: number
  reaction: number
  focus: number
  divePower: number
  accuracy: number
  missions_completed: number
}

interface KusbegilikStore {
  gameState: 'HUB' | 'PLAYING' | 'PAUSED' | 'FINISHED'
  missionState: MissionState
  currentMissionId: string | null
  
  // Eagle Stats & State
  profile: EagleProfile | null
  currentStamina: number // 0 to 100
  
  // Flight Telemetry
  flightState: 'GLIDE' | 'CLIMB' | 'DIVE' | 'TURN' | 'BRAKE'
  speed: number
  altitude: number
  pitch: number
  roll: number
  yaw: number
  
  // Control Mode
  controlMode: 'DIRECT' | 'COMMAND'
  activeCommand: EagleCommand
  
  // Target
  targetLocated: boolean
  targetDistance: number
  
  // Checkpoints
  checkpoints: { id: string, position: [number, number, number], radius: number, passed: boolean }[]
  passCheckpoint: (id: string) => void
  
  // Actions
  setGameState: (state: 'HUB' | 'PLAYING' | 'PAUSED' | 'FINISHED') => void
  setMissionState: (state: MissionState) => void
  startMission: (missionId: string) => void
  setProfile: (profile: EagleProfile) => void
  updateTelemetry: (speed: number, altitude: number, pitch: number, roll: number, yaw: number) => void
  setFlightState: (state: 'GLIDE' | 'CLIMB' | 'DIVE' | 'TURN' | 'BRAKE') => void
  setControlMode: (mode: 'DIRECT' | 'COMMAND') => void
  setCommand: (cmd: EagleCommand) => void
  updateStamina: (amount: number) => void
  setTargetInfo: (located: boolean, distance: number) => void
  reset: () => void
}

export const useKusbegilikEngine = create<KusbegilikStore>((set) => ({
  gameState: 'HUB',
  missionState: 'IDLE',
  currentMissionId: null,
  
  profile: null,
  currentStamina: 100,
  
  flightState: 'GLIDE',
  speed: 0,
  altitude: 0,
  pitch: 0,
  roll: 0,
  yaw: 0,
  
  controlMode: 'DIRECT',
  activeCommand: 'IDLE',
  
  targetLocated: false,
  targetDistance: 9999,
  
  checkpoints: [
    { id: 'cp1', position: [0, 50, -100], radius: 10, passed: false },
    { id: 'cp2', position: [50, 40, -200], radius: 10, passed: false },
  ],
  passCheckpoint: (id) => set((state) => {
    const cps = [...state.checkpoints]
    const idx = cps.findIndex(c => c.id === id)
    if (idx !== -1 && !cps[idx].passed) cps[idx].passed = true
    return { checkpoints: cps }
  }),

  setGameState: (state) => set({ gameState: state }),
  setMissionState: (state) => set({ missionState: state }),
  
  startMission: (missionId) => {
    set({
      gameState: 'PLAYING',
      missionState: 'SEARCH',
      currentMissionId: missionId,
      currentStamina: 100,
      controlMode: 'DIRECT',
      activeCommand: 'IDLE',
      targetLocated: false,
      targetDistance: 9999
    })
  },
  
  setProfile: (profile) => set({ profile }),
  
  updateTelemetry: (speed, altitude, pitch, roll, yaw) => set({ speed, altitude, pitch, roll, yaw }),
  setFlightState: (state) => set({ flightState: state }),
  
  setControlMode: (mode) => set({ controlMode: mode }),
  setCommand: (cmd) => set({ activeCommand: cmd, controlMode: 'COMMAND' }),
  
  updateStamina: (amount) => set((state) => ({ 
    currentStamina: Math.max(0, Math.min(100, state.currentStamina + amount)) 
  })),
  
  setTargetInfo: (located, distance) => set({ targetLocated: located, targetDistance: distance }),

  reset: () => set({
    gameState: 'HUB',
    missionState: 'IDLE',
    currentMissionId: null,
    currentStamina: 100,
    controlMode: 'DIRECT',
    activeCommand: 'IDLE',
    targetLocated: false,
    targetDistance: 9999
  })
}))
