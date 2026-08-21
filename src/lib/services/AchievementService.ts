import { SupabaseClient } from '@supabase/supabase-js'
import { XPService } from './XPService'

export interface PlatformEventPayload {
  userId: string
  gameId?: string
  score?: number
  didWin?: boolean
  difficulty?: string
  tuzdykCreated?: boolean
  capturedTotal?: number
  actionType?: string // e.g. "first_move", "completed_scenarios"
}

export class AchievementService {
  /**
   * Evaluates achievements based on the incoming event and unlocks them if criteria are met.
   */
  public static async evaluateAchievements(supabase: SupabaseClient, payload: PlatformEventPayload): Promise<void> {
    // Determine which titles might be earned from this payload
    const titlesToUnlock: string[] = []

    if (payload.gameId === 'asyk-atu' && payload.didWin !== undefined) {
      titlesToUnlock.push('Первый бросок')
    }
    
    if (payload.gameId === 'asyk-atu' && (payload.score ?? 0) >= 500) {
      titlesToUnlock.push('Мастер асық ату')
    }

    if (payload.gameId === 'kelin-shai' && payload.didWin !== undefined) {
      titlesToUnlock.push('Қонақжай келін') // Assuming didWin means completed all scenarios for now
    }

    if (payload.gameId === 'togyzqumalak' && payload.didWin && payload.difficulty === 'hard') {
      titlesToUnlock.push('Тоғызқұмалақ шебері')
    }

    if (payload.actionType === 'first_move') {
      titlesToUnlock.push('Первый ход')
    }

    if (titlesToUnlock.length === 0) return

    // Fetch achievement definitions
    const { data: achievements } = await supabase
      .from('achievements')
      .select('id, title, xp_reward')
      .in('title', titlesToUnlock)

    if (!achievements) return

    for (const ach of achievements) {
      // Try to insert. We use ON CONFLICT DO NOTHING natively if we had unique constraints,
      // but without it, we can just insert and catch the error, or check if it exists first.
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', payload.userId)
        .eq('achievement_id', ach.id)
        .maybeSingle()

      if (!existing) {
        // Unlock
        await supabase.from('user_achievements').insert({
          user_id: payload.userId,
          achievement_id: ach.id
        })

        // Award XP
        if (ach.xp_reward) {
          await XPService.awardXP(supabase, {
            userId: payload.userId,
            baseXp: ach.xp_reward,
            reason: 'achievement_unlocked',
            metadata: { achievementId: ach.id }
          })
        }

        // Notification
        await supabase.from('notifications').insert({
          user_id: payload.userId,
          type: 'achievement',
          title: 'Жаңа жетістік!',
          message: `Сіз "${ach.title}" жетістігін аштыңыз.`,
          metadata: { achievementId: ach.id }
        })
      }
    }
  }
}
