import * as Phaser from 'phaser'
import { MatchManager, ROUNDS_TO_WIN } from './MatchManager'
import { ArqanAI } from '../ai/ArqanAI'
import { RopePhysics } from '../rope/RopePhysics'
import { RopeRenderer } from '../rope/RopeRenderer'
import { createTensionState, applyImpulse, stepTension, TensionState } from '../rope/RopeTension'
import { TeamEntity } from '../teams/TeamEntity'
import { UIManager } from '../ui/UIManager'
import { RhythmMarker } from '../ui/RhythmMarker'
import { TutorialManager, achievementToast } from '../tutorial/TutorialManager'
import { HintManager } from '../tutorial/HintManager'
import { InputManager } from './InputManager'
import { ARQAN_LEVELS, ARQAN_LEVEL_COUNT } from '../levels/config'
import { calculateMatchXP } from '../scoring/scoring'
import { evaluateAchievements, ACHIEVEMENTS } from '../scoring/achievements'
import { loadProgression, saveProgression, mergeNewAchievements } from '../scoring/progression'
import { PullEvent } from '../scoring/validateMatch'
import { gameAudio } from '@/lib/services/GameAudioService'
import { PullQuality, Side } from './types'
import { ParticleFX } from '../fx/ParticleFX'
import { PopupText } from '../fx/PopupText'
import { CameraDirector } from '../fx/CameraDirector'
import { DangerVignette } from '../fx/DangerVignette'
import { MatchPointBanner } from '../fx/MatchPointBanner'
import { OpponentIntro } from '../fx/OpponentIntro'
import {
  hitStopMsForQuality,
  shakeSpecForQuality,
  dangerVignetteIntensity,
  matchPointSide,
  MATCH_WIN_SLOWMO_FACTOR,
  MATCH_WIN_SLOWMO_REAL_MS,
} from '../fx/JuiceRules'

interface MainSceneInitData {
  level?: number
}

export class MainScene extends Phaser.Scene {
  private manager!: MatchManager
  private ai!: ArqanAI
  private aiSeed = 0

  private rope!: RopePhysics
  private ropeRenderer!: RopeRenderer
  private tension: TensionState = createTensionState()

  private teamA!: TeamEntity
  private teamB!: TeamEntity
  private ui!: UIManager
  private rhythmMarker!: RhythmMarker
  private tutorial!: TutorialManager
  private hints!: HintManager
  private pullInput!: InputManager

  private particleFX!: ParticleFX
  private popupText!: PopupText
  private cameraDirector!: CameraDirector
  private dangerVignette!: DangerVignette
  private matchPointBanner!: MatchPointBanner
  private opponentIntro!: OpponentIntro
  private cloudsLayer?: Phaser.GameObjects.TileSprite

  private currentLevel = 1
  private eventLog: PullEvent[] = []
  private roundStartClockMs = 0
  private matchOverHandled = false
  private isTutorialActive = false
  /** Guards the match-winning pull's slow-mo hold: input/AI freeze the
   *  instant that pull lands, and resolveRound() only fires once, after
   *  the hold's real-time duration elapses. */
  private matchWinHoldActive = false

  private groundY = 0

  constructor() {
    super('MainScene')
  }

  init(data: MainSceneInitData) {
    this.currentLevel = data.level ?? 1
    this.matchOverHandled = false
    this.eventLog = []
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    this.groundY = h * 0.78

    const levelConfig = ARQAN_LEVELS[this.currentLevel] ?? ARQAN_LEVELS[1]
    this.manager = new MatchManager(levelConfig.matchConfig)
    this.aiSeed = Math.floor(Math.random() * 1_000_000)
    this.ai = new ArqanAI(levelConfig.aiDifficulty, this.aiSeed, levelConfig.matchConfig)

    this.buildEnvironment(w, h)

    const spacing = Math.min(52, w * 0.038)
    this.teamA = new TeamEntity(this, 'A', w * 0.5 - 170, this.groundY, spacing)
    this.teamB = new TeamEntity(this, 'B', w * 0.5 + 170, this.groundY, spacing)

    this.rope = new RopePhysics({
      segments: 14,
      segmentLength: 18,
      leftAnchor: { x: w * 0.5 - 160, y: this.groundY - 92 },
      rightAnchor: { x: w * 0.5 + 160, y: this.groundY - 92 },
    })
    this.ropeRenderer = new RopeRenderer(this, 15)

    this.ui = new UIManager(this)
    this.rhythmMarker = new RhythmMarker(this)
    this.tutorial = new TutorialManager(this)
    this.hints = new HintManager(this, this.rhythmMarker)
    this.pullInput = new InputManager(this)
    this.pullInput.onPull = (atMs) => this.handlePlayerPull(atMs)

    this.particleFX = new ParticleFX(this)
    this.popupText = new PopupText(this)
    this.cameraDirector = new CameraDirector(this)
    this.dangerVignette = new DangerVignette(this)
    this.matchPointBanner = new MatchPointBanner(this, () => gameAudio.playSfx('matchPoint'))
    this.opponentIntro = new OpponentIntro(this)

    this.ui.setRound(1, 0, 0)

    gameAudio.init()

    this.scale.on('resize', this.handleResize, this)
    this.events.once('shutdown', this.handleShutdown, this)

    const progression = loadProgression()
    if (levelConfig.isTutorial && !progression.hasEverPulled) {
      this.isTutorialActive = true
      this.pullInput.enabled = false
      this.tutorial.playIntro(h - 64, () => {
        this.isTutorialActive = false
        this.pullInput.enabled = true
        this.beginRound()
      })
    } else {
      this.opponentIntro.show(levelConfig.opponentName, levelConfig.opponentStyle, () => this.beginRound())
    }
  }

  private buildEnvironment(w: number, h: number) {
    this.add.image(w / 2, h * 0.35, 'steppe').setDisplaySize(w, h * 0.75).setDepth(0)
    // Slow-drifting cloud layer between the sky and the mountains — a
    // living backdrop instead of a static painted sky.
    this.cloudsLayer = this.add
      .tileSprite(w / 2, h * 0.15, w, h * 0.26, 'clouds')
      .setDepth(0.5)
      .setAlpha(0.75)
    this.add.image(w / 2, h * 0.28, 'mountains').setDisplaySize(w, h * 0.32).setDepth(1).setAlpha(0.85)
    this.add.image(28, h * 0.5, 'bannerA').setOrigin(0, 0.5).setDisplaySize(56, h * 0.4).setDepth(2).setAlpha(0.9)
    this.add.image(w - 28, h * 0.5, 'bannerB').setOrigin(1, 0.5).setDisplaySize(56, h * 0.4).setDepth(2).setAlpha(0.9)
  }

  private beginRound() {
    this.manager.startNewRound()
    this.manager.beginPull()
    this.roundStartClockMs = 0
    this.pullInput.reset()
    this.pullInput.enabled = true
    this.hints.reset()
    this.rope.reset()
    this.teamA.setPose('IDLE')
    this.teamB.setPose('IDLE')
    this.teamA.setFatigue(0)
    this.teamB.setFatigue(0)
    this.matchPointBanner.reset()
    this.dangerVignette.hide()
    this.cameraDirector.reset()
    this.matchWinHoldActive = false
    this.ui.setRound(this.manager.currentRoundNumber, this.manager.playerRoundsWon, this.manager.aiRoundsWon)
  }

  update(_time: number, realDeltaMs: number) {
    // The clouds drift regardless of match state — a living backdrop even
    // behind menus/overlays.
    if (this.cloudsLayer) this.cloudsLayer.tilePositionX += realDeltaMs * 0.01

    // beginFrame() both advances the hit-stop/slow-mo clocks (real time)
    // and returns the ms of SIMULATION time to advance this frame — 0
    // during a freeze, scaled during slow-mo, unchanged otherwise. Every
    // sim-clock accumulator below must use this value (not realDeltaMs) so
    // recorded pull timestamps stay internally consistent for the server's
    // match replay, which only cares about simulation time.
    const simDeltaMs = this.cameraDirector.beginFrame(realDeltaMs)

    if (this.isTutorialActive) return
    if (this.manager.state !== 'PULL') return
    if (simDeltaMs <= 0) return // hit-stop freeze this frame

    this.manager.tick(simDeltaMs)
    this.pullInput.tick(simDeltaMs)
    this.roundStartClockMs += simDeltaMs

    // Drive the AI on its own beat schedule, independent of player input.
    // Frozen during the match-winning hold so the AI can't sneak in a beat
    // while the camera is settling on the result.
    if (!this.matchWinHoldActive && this.roundStartClockMs >= this.manager.engine.getNextBeatMs()) {
      const decision = this.ai.decideBeat(this.manager.engine)
      if (decision.willPull) {
        const atMs = this.manager.engine.getNextBeatMs() + decision.timingOffsetMs
        const result = this.manager.registerPull('AI', atMs)
        this.onPullResolved('AI', result.quality)
      }
      this.manager.engine.advanceBeat()
    }

    this.tension = stepTension(this.tension)
    this.rope.step(0, this.mapRopePositionToWorld())
    this.ropeRenderer.render(this.rope, this.tension)

    const nextBeat = this.manager.engine.getNextBeatMs()
    const beatStart = nextBeat - this.manager.config.beatIntervalMs
    const progress = (this.roundStartClockMs - beatStart) / (nextBeat - beatStart)
    this.rhythmMarker.update(progress)

    this.ui.update(
      this.manager.engine.ropePosition,
      this.manager.config.winThreshold,
      this.manager.engine.player.fatigue,
      this.manager.engine.ai.fatigue
    )

    this.teamA.setFatigue(this.manager.engine.player.fatigue)
    this.teamB.setFatigue(this.manager.engine.ai.fatigue)

    const ropeShare = this.manager.engine.ropePosition / this.manager.config.winThreshold
    this.cameraDirector.update(ropeShare)
    this.dangerVignette.update(dangerVignetteIntensity(this.manager.engine.getDangerLevel('PLAYER')), realDeltaMs)
    this.matchPointBanner.notify(matchPointSide(this.manager.engine.ropePosition, this.manager.config.winThreshold))

    if (!this.matchWinHoldActive) {
      const winner = this.manager.engine.checkWinner()
      if (winner) {
        this.resolveRound()
      }
    }
  }

  private mapRopePositionToWorld(): number {
    // Scale the abstract [-winThreshold, winThreshold] rope position down
    // to a modest world-space offset for the rope's visual center of mass.
    const scale = 40 / this.manager.config.winThreshold
    return this.manager.engine.ropePosition * scale
  }

  private handlePlayerPull(atMs: number) {
    if (this.manager.state !== 'PULL') return
    const result = this.manager.registerPull('PLAYER', atMs)
    this.eventLog.push({ side: 'PLAYER', atMs, roundNumber: this.manager.currentRoundNumber })
    this.onPullResolved('PLAYER', result.quality)
  }

  private onPullResolved(side: Side, quality: PullQuality) {
    this.hints.notifyPullResult(quality)
    this.rhythmMarker.flash(quality)
    this.tension = applyImpulse(this.tension, quality === 'PERFECT' ? 1 : quality === 'GOOD' ? 0.55 : 0.2)

    const team = side === 'PLAYER' ? this.teamA : this.teamB
    const pose = quality === 'PERFECT' || quality === 'GOOD' ? 'STRAIN' : quality === 'MISS' ? 'RECOVER' : 'PULL'
    team.setPose(pose)
    team.playPullImpulse(quality === 'PERFECT' ? 1.4 : quality === 'GOOD' ? 0.9 : 0.4)
    this.time.delayedCall(260, () => team.setPose('IDLE'))

    const foot = team.getFrontFootPosition()
    const hand = team.getFrontHandPosition()
    this.particleFX.pullDust(foot.x, foot.y, quality)
    this.popupText.spawn(hand.x, hand.y - 16, quality)

    this.cameraDirector.impulse(shakeSpecForQuality(quality, side))
    this.cameraDirector.triggerHitStop(hitStopMsForQuality(quality))

    if (quality === 'PERFECT') {
      gameAudio.playSfx('ropePullPerfect')
    } else if (quality === 'GOOD') {
      gameAudio.playSfx('ropePullGood')
    } else if (quality !== 'MISS') {
      gameAudio.playSfx('ropePullWeak')
    } else {
      gameAudio.playSfx('footstepDig')
    }

    // The pull that finishes the WHOLE match (not just a round) earns a
    // held slow-motion beat before the result screen — everything else
    // freezes (input, AI beats) while the rope/camera keep easing in slow
    // motion, then resolveRound() fires once the hold ends.
    if (!this.matchWinHoldActive) {
      const winnerNow = this.manager.engine.checkWinner()
      if (winnerNow === side) {
        const projectedWins = (side === 'PLAYER' ? this.manager.playerRoundsWon : this.manager.aiRoundsWon) + 1
        if (projectedWins >= ROUNDS_TO_WIN) {
          this.matchWinHoldActive = true
          this.pullInput.enabled = false
          this.cameraDirector.triggerSlowMo(MATCH_WIN_SLOWMO_FACTOR, MATCH_WIN_SLOWMO_REAL_MS)
          this.particleFX.salute(this.scale.width / 2, this.scale.height * 0.4, true)
          this.time.delayedCall(MATCH_WIN_SLOWMO_REAL_MS, () => this.resolveRound())
        }
      }
    }
  }

  private resolveRound() {
    const record = this.manager.checkRoundEnd()
    if (!record) return

    this.pullInput.enabled = false
    this.dangerVignette.hide()
    const winningTeam = record.winner === 'PLAYER' ? this.teamA : this.teamB
    const losingTeam = record.winner === 'PLAYER' ? this.teamB : this.teamA
    winningTeam.setPose('VICTORY')
    losingTeam.setPose('DEFEAT')
    gameAudio.playSfx(record.winner === 'PLAYER' ? 'matchVictory' : 'matchDefeat')

    // A round win already got its "big" salute above if it also finished
    // the match — only add the smaller one here for a plain round win.
    if (!this.matchWinHoldActive) {
      const hand = winningTeam.getFrontHandPosition()
      this.particleFX.salute(hand.x, hand.y, false)
    }

    this.ui.showRoundResult(record.roundNumber, record.winner, () => {
      this.pullInput.enabled = true
      if (this.manager.isMatchOver()) {
        this.finishMatch()
      } else {
        this.manager.engine.enterRecovery()
        this.time.delayedCall(600, () => this.beginRound())
      }
    })
  }

  private finishMatch() {
    if (this.matchOverHandled) return
    this.matchOverHandled = true

    const result = this.manager.finishMatch()
    const xp = calculateMatchXP(result, this.currentLevel)

    const progression = loadProgression()
    const isFirstPullEver = !progression.hasEverPulled
    const isFirstWinEver = progression.totalWins === 0 && result.winner === 'PLAYER'

    const newAchievements = evaluateAchievements(
      result,
      { isFirstPullEver, isFirstWinEver, completedLevel: this.currentLevel, totalLevels: ARQAN_LEVEL_COUNT },
      new Set(progression.achievements)
    )

    const updated = mergeNewAchievements(
      {
        ...progression,
        hasEverPulled: true,
        totalXP: progression.totalXP + xp,
        totalMatchesPlayed: progression.totalMatchesPlayed + 1,
        totalWins: progression.totalWins + (result.winner === 'PLAYER' ? 1 : 0),
        bestStreak: Math.max(progression.bestStreak, ...result.rounds.map((r) => r.playerBestStreak)),
        unlockedLevel:
          result.winner === 'PLAYER'
            ? Math.max(progression.unlockedLevel, Math.min(ARQAN_LEVEL_COUNT, this.currentLevel + 1))
            : progression.unlockedLevel,
      },
      newAchievements
    )
    saveProgression(updated)

    newAchievements.forEach((id, i) => {
      this.time.delayedCall(i * 600, () => achievementToast(this, ACHIEVEMENTS[id].nameKz))
    })

    this.ui.showMatchResult(result, xp, () => {
      this.scene.restart({ level: this.currentLevel })
    })
  }

  private handleResize() {
    const w = this.scale.width
    const h = this.scale.height
    this.groundY = h * 0.78
    this.rhythmMarker.reposition(this.manager.config)
    const spacing = Math.min(52, w * 0.038)
    this.teamA.setPositions(w * 0.5 - 170, this.groundY, spacing)
    this.teamB.setPositions(w * 0.5 + 170, this.groundY, spacing)
    this.rope.setAnchors({ x: w * 0.5 - 160, y: this.groundY - 92 }, { x: w * 0.5 + 160, y: this.groundY - 92 })
    if (this.cloudsLayer) {
      this.cloudsLayer.setPosition(w / 2, h * 0.15)
      this.cloudsLayer.setSize(w, h * 0.26)
    }
  }

  private handleShutdown() {
    this.scale.off('resize', this.handleResize, this)
    this.pullInput.destroy()
    this.ropeRenderer.destroy()
    this.teamA.destroy()
    this.teamB.destroy()
    this.ui.destroy()
    this.rhythmMarker.destroy()
    this.dangerVignette.destroy()
  }
}
