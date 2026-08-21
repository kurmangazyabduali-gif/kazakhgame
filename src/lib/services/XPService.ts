import { SupabaseClient } from '@supabase/supabase-js'
import { LevelService } from './LevelService'

export interface XPAwardOptions {
  userId: string
  baseXp: number
  reason: string // e.g. "game_completed", "achievement_unlocked"
  metadata?: Record<string, unknown>
}

export class XPService {
  /**
   * Awards XP to a user and handles level ups.
   * Note: This does NOT commit the XP to the profile table if you pass a transaction.
   * Actually, we will just update the profile here for simplicity since we don't have true transactions.
   */
  public static async awardXP(supabase: SupabaseClient, options: XPAwardOptions): Promise<{ xpEarned: number, leveledUp: boolean, oldLevel: number, newLevel: number }> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, level')
      .eq('id', options.userId)
      .single()

    if (!profile) {
      throw new Error('Profile not found')
    }

    const currentXp = profile.xp || 0
    const currentLevel = profile.level || 1

    const newXp = currentXp + options.baseXp
    const newLevel = LevelService.calculateLevel(newXp)
    const leveledUp = newLevel > currentLevel

    // Update profile
    await supabase
      .from('profiles')
      .update({
        xp: newXp,
        level: newLevel
      })
      .eq('id', options.userId)

    if (leveledUp) {
      // Create a level up notification
      await supabase.from('notifications').insert({
        user_id: options.userId,
        type: 'level_up',
        title: 'Жаңа деңгей!',
        message: `Құттықтаймыз! Сіз ${LevelService.getLevelTitle(newLevel)} деңгейіне жеттіңіз.`,
        metadata: { oldLevel: currentLevel, newLevel }
      })
    }

    return {
      xpEarned: options.baseXp,
      leveledUp,
      oldLevel: currentLevel,
      newLevel
    }
  }
}
