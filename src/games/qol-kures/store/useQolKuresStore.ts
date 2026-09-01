import { create } from 'zustand'
import { PhysicsEngine, PhysicsState } from '../engine/PhysicsEngine'
import { QolKuresAI } from '../ai/QolKuresAI'
import { getLevelConfig, LevelConfig } from '../levels/config'
import { calculateMatchScore, saveQolKuresResult, MatchScoreResult } from '../scoring/scoring'
import { AudioEffects } from '../audio/AudioEffects'

interface QolKuresStore {
  gameStatus: 'READY' | 'PLAYING' | 'PIN_SLOWMO' | 'ROUND_END' | 'MATCH_OVER'
  levelId: number
  levelConfig: LevelConfig
  round: number
  playerWins: number
  aiWins: number
  playerPressing: boolean
  aiPressing: boolean
  physicsState: PhysicsState
  lastBurstQuality: 'PERFECT' | 'GOOD' | 'EARLY' | 'LATE' | 'MISS' | null
  showTutorial: boolean
  scoreResult: MatchScoreResult | null
  perfectPushesCount: number
  comebackTriggered: boolean
  peakPlayerStaminaUsed: number // tracks max stamina consumed

  // Engines
  physics: PhysicsEngine
  ai: QolKuresAI
  audio: AudioEffects

  // Actions
  selectLevel: (levelId: number) => void
  startMatch: () => void
  startRound: () => void
  setPlayerPressing: (pressing: boolean) => void
  attemptBurst: () => void
  attemptComeback: () => void
  tick: (dtMs: number) => void
  dismissTutorial: () => void
}

const initialPhysicsState: PhysicsState = {
  position: 0,
  velocity: 0,
  playerStamina: 100,
  aiStamina: 100,
  playerFatigue: 0,
  aiFatigue: 0,
  momentum: 0,
  burstWindowProgress: 0,
  burstWindowActive: false,
  comebackActive: false,
  comebackProgress: 0,
  isFinished: false,
  winner: null,
  pinProgress: 0,
  pinSide: null,
  poseStatePlayer: 'IDLE',
  poseStateAI: 'IDLE'
}

const audio = new AudioEffects()

export const useQolKuresStore = create<QolKuresStore>((set, get) => {
  const defaultLevel = getLevelConfig(1)
  const physics = new PhysicsEngine(defaultLevel.difficulty)
  const ai = new QolKuresAI(defaultLevel.difficulty)

  return {
    gameStatus: 'READY',
    levelId: 1,
    levelConfig: defaultLevel,
    round: 1,
    playerWins: 0,
    aiWins: 0,
    playerPressing: false,
    aiPressing: false,
    physicsState: initialPhysicsState,
    lastBurstQuality: null,
    showTutorial: true,
    scoreResult: null,
    perfectPushesCount: 0,
    comebackTriggered: false,
    peakPlayerStaminaUsed: 0,

    physics,
    ai,
    audio,

    selectLevel: (levelId) => {
      const config = getLevelConfig(levelId)
      physics.reset(config.difficulty)
      ai.reset(config.difficulty)
      
      set({
        levelId,
        levelConfig: config,
        gameStatus: 'READY',
        round: 1,
        playerWins: 0,
        aiWins: 0,
        playerPressing: false,
        aiPressing: false,
        physicsState: physics.getState(),
        lastBurstQuality: null,
        scoreResult: null,
        perfectPushesCount: 0,
        comebackTriggered: false,
        peakPlayerStaminaUsed: 0,
        showTutorial: levelId === 1
      })
    },

    startMatch: () => {
      const { levelConfig } = get()
      physics.reset(levelConfig.difficulty)
      ai.reset(levelConfig.difficulty)

      set({
        gameStatus: 'PLAYING',
        round: 1,
        playerWins: 0,
        aiWins: 0,
        playerPressing: false,
        aiPressing: false,
        physicsState: physics.getState(),
        lastBurstQuality: null,
        scoreResult: null,
        perfectPushesCount: 0,
        comebackTriggered: false,
        peakPlayerStaminaUsed: 0
      })
      get().audio.playGrip()
    },

    startRound: () => {
      const { levelConfig } = get()
      physics.reset(levelConfig.difficulty)
      ai.reset(levelConfig.difficulty)
      physics.setState({ position: levelConfig.startPosition })

      set({
        gameStatus: 'PLAYING',
        playerPressing: false,
        aiPressing: false,
        physicsState: physics.getState(),
        lastBurstQuality: null
      })
      get().audio.playGrip()
    },

    setPlayerPressing: (pressing) => {
      if (get().gameStatus !== 'PLAYING') return
      
      if (pressing && !get().playerPressing) {
        get().audio.playGrip()
      }
      set({ playerPressing: pressing })
    },

    attemptBurst: () => {
      const { gameStatus, physics, perfectPushesCount } = get()
      if (gameStatus !== 'PLAYING') return

      const quality = physics.triggerBurst()
      if (quality !== 'MISS') {
        get().audio.playGrip()
        set({ 
          lastBurstQuality: quality,
          perfectPushesCount: quality === 'PERFECT' ? perfectPushesCount + 1 : perfectPushesCount
        })

        // Reset last burst popup text after 1s
        setTimeout(() => {
          set({ lastBurstQuality: null })
        }, 1000)
      }
    },

    attemptComeback: () => {
      const { gameStatus, physics } = get()
      if (gameStatus !== 'PLAYING') return

      const success = physics.triggerComeback()
      if (success) {
        get().audio.playImpact()
        set({ comebackTriggered: true })
      }
    },

    tick: (dtMs) => {
      const { gameStatus, physics, ai, playerPressing, playerWins, aiWins, round, levelConfig } = get()
      if (gameStatus !== 'PLAYING') return

      // 1. Update AI Action
      const aiAction = ai.update(dtMs, physics.getState())
      if (aiAction.triggerBurst) {
        physics.triggerBurst() // trigger AI burst impact internally
      }

      // Apply stamina multipliers for custom level challenges
      const nextPhysicsState = physics.tick(dtMs, playerPressing, aiAction.isPressing)
      
      // Randomly synthesize creak wood sounds under pressure
      if ((playerPressing || aiAction.isPressing) && Math.random() < 0.05) {
        get().audio.playTable()
      }
      if (playerPressing && nextPhysicsState.playerStamina < 40 && Math.random() < 0.04) {
        get().audio.playEffort()
      }

      // Check for round win/loss transition
      if (nextPhysicsState.isFinished) {
        const winner = nextPhysicsState.winner
        get().audio.playImpact()
        get().audio.playCrowd(true)

        // Set status to PIN_SLOWMO first to show the slam thud
        set({ 
          gameStatus: 'PIN_SLOWMO',
          physicsState: { ...nextPhysicsState },
          aiPressing: false
        })

        // After 1.2s of slowmo impact display, process round outcome
        setTimeout(() => {
          const nextPlayerWins = winner === 'player' ? playerWins + 1 : playerWins
          const nextAiWins = winner === 'ai' ? aiWins + 1 : aiWins
          const isMatchOver = nextPlayerWins === 2 || nextAiWins === 2

          if (isMatchOver) {
            // Calculate final scores
            const scoreRes = calculateMatchScore(
              nextPlayerWins === 2,
              nextPlayerWins,
              nextAiWins,
              get().perfectPushesCount,
              100 - get().physicsState.playerFatigue, // efficiency
              get().comebackTriggered,
              levelConfig.difficulty
            )

            // Save results to Guest Storage
            saveQolKuresResult(scoreRes.score, scoreRes.xpEarned, scoreRes.unlockedAchievements)

            set({
              gameStatus: 'MATCH_OVER',
              playerWins: nextPlayerWins,
              aiWins: nextAiWins,
              scoreResult: scoreRes
            })
            if (nextPlayerWins === 2) {
              get().audio.playVictory()
            }
          } else {
            set({
              gameStatus: 'ROUND_END',
              playerWins: nextPlayerWins,
              aiWins: nextAiWins,
              round: round + 1
            })
          }
        }, 1200)
      } else {
        set({ 
          physicsState: { ...nextPhysicsState },
          aiPressing: aiAction.isPressing
        })
      }
    },

    dismissTutorial: () => {
      set({ showTutorial: false })
    }
  }
})
