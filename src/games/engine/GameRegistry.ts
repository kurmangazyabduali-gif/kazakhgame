import { NationalGame } from '@/types/game'

class GameRegistry {
  private games: Map<string, NationalGame> = new Map()

  register(game: NationalGame) {
    if (this.games.has(game.slug)) {
      console.warn(`Game with slug ${game.slug} is already registered.`)
      return
    }
    this.games.set(game.slug, game)
  }

  getGame(slug: string): NationalGame | undefined {
    return this.games.get(slug)
  }

  getAllGames(): NationalGame[] {
    return Array.from(this.games.values())
  }
}

export const registry = new GameRegistry()
