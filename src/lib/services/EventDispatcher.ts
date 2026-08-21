import { SupabaseClient } from '@supabase/supabase-js'
import { PlatformEventPayload, AchievementService } from './AchievementService'
import { QuestEngine } from './QuestEngine'
import { XPService } from './XPService'

export class EventDispatcher {
  /**
   * The central event bus for the platform. Whenever a game completes,
   * this dispatcher triggers all the downstream services (Achievements, Quests).
   * Note: XP for the game itself is usually awarded before calling this,
   * but achievements and quests might grant BONUS XP.
   */
  public static async dispatchGameCompleted(supabase: SupabaseClient, payload: PlatformEventPayload): Promise<void> {
    try {
      // 0. Base XP calculation for playing a game
      // In a real app this would be more complex (e.g. ScoreService), 
      // but we do a simple base XP + score bonus here.
      const baseXP = 20 + Math.floor((payload.score || 0) / 10)
      
      await XPService.awardXP(supabase, {
        userId: payload.userId,
        baseXp: baseXP,
        reason: 'game_completed',
        metadata: { gameId: payload.gameId, score: payload.score }
      })

      // 1. Check and award achievements
      await AchievementService.evaluateAchievements(supabase, payload)
      
      // 2. Check and advance quests
      await QuestEngine.processEvent(supabase, payload)

      // 3. Analytics (could write to an analytics table in the future)
      console.log(`[Platform Event] GAME_COMPLETED: User ${payload.userId} finished ${payload.gameId}`)
      
    } catch (e) {
      console.error('[EventDispatcher] Error dispatching GAME_COMPLETED:', e)
      // Do not throw, side effects should not break the main transaction
    }
  }
}
