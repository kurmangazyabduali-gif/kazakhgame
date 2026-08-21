import { NationalGame, GameCategory, GameResult } from '@/types/game'
import { ScenarioEngine } from '../engine/scenario/ScenarioEngine'
import { firstTeaScenario } from './scenarios/first-tea'
import { registry } from '../engine/GameRegistry'

export class KelinShaiGame implements NationalGame {
  id = 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e'
  slug = 'kelin-shai'
  name = 'Келін шай'
  category: GameCategory = 'Ұлттық дәстүр'
  
  public engine: ScenarioEngine

  constructor() {
    this.engine = new ScenarioEngine(firstTeaScenario)
  }

  initialize(): void {
    this.engine.initialize()
  }

  start(): void {
    this.engine.start()
  }

  pause(): void {
    // Engine has no internal tick, pause just means ignoring UI inputs, handled by Wrapper.
  }

  resume(): void {
  }

  restart(): void {
    this.engine.initialize()
    this.engine.start()
  }

  finish(): GameResult {
    return this.engine.finish()
  }
}

// Auto-register
registry.register(new KelinShaiGame())
