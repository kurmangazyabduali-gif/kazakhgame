import { describe, it, expect, vi } from 'vitest'
import { GameSession } from '@/games/engine/GameSession'
import { NationalGame } from '@/types/game'

describe('GameSession', () => {
  it('should initialize and start the game', () => {
    const mockGame: NationalGame = {
      id: '1',
      slug: 'test-game',
      name: 'Test Game',
      category: 'Ұлттық спорт',
      initialize: vi.fn(),
      start: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      finish: vi.fn().mockReturnValue({ score: 100, xp: 50, completed: true, achievements: [] }),
    }

    const session = new GameSession(mockGame)
    expect(session.getStatus()).toBe('idle')

    session.start()
    expect(mockGame.initialize).toHaveBeenCalled()
    expect(mockGame.start).toHaveBeenCalled()
    expect(session.getStatus()).toBe('running')

    const result = session.finish()
    expect(mockGame.finish).toHaveBeenCalled()
    expect(result?.score).toBe(100)
    expect(result?.duration).toBeGreaterThanOrEqual(0)
    expect(session.getStatus()).toBe('finished')
  })
})
