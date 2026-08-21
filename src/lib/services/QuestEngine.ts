import { SupabaseClient } from '@supabase/supabase-js'
import { PlatformEventPayload } from './AchievementService'
import { XPService } from './XPService'

type QuestRequirement = {
  type: 'game_played'
  game_id: string
  count: number
}

function readProgress(rawProgress: unknown): Record<string, number> {
  if (!rawProgress || typeof rawProgress !== 'object' || Array.isArray(rawProgress)) return {}

  return Object.fromEntries(
    Object.entries(rawProgress).filter((entry): entry is [string, number] => typeof entry[1] === 'number')
  )
}

function readRequirements(rawRequirements: unknown): QuestRequirement[] {
  if (!Array.isArray(rawRequirements)) return []

  return rawRequirements.filter((item): item is QuestRequirement => (
    typeof item === 'object' &&
    item !== null &&
    'type' in item &&
    'game_id' in item &&
    'count' in item &&
    item.type === 'game_played' &&
    typeof item.game_id === 'string' &&
    typeof item.count === 'number'
  ))
}

export class QuestEngine {
  /**
   * Processes a platform event and updates quest progress.
   */
  public static async processEvent(supabase: SupabaseClient, payload: PlatformEventPayload): Promise<void> {
    if (!payload.gameId) return

    // Find all active quests for this user
    // We actually need to fetch all quests and check if user has a completed progress row.
    // If not, we update the progress.
    const { data: quests } = await supabase
      .from('quests')
      .select('*')
      
    if (!quests) return

    for (const quest of quests) {
      // Check current progress
      let { data: progressRow } = await supabase
        .from('quest_progress')
        .select('*')
        .eq('user_id', payload.userId)
        .eq('quest_id', quest.id)
        .maybeSingle()

      if (progressRow?.status === 'completed') {
        continue // Already done
      }

      const currentProgress = readProgress(progressRow?.progress)
      
      // Update progress based on the event (simplistic rule engine)
      let progressed = false
      const requirements = readRequirements(quest.requirements)

      // e.g. [{"type": "game_played", "game_id": "asyk-atu", "count": 1}]
      for (const req of requirements) {
        if (req.type === 'game_played' && req.game_id === payload.gameId) {
          const key = `${payload.gameId}_played`
          const currentCount = currentProgress[key] || 0
          if (currentCount < req.count) {
            currentProgress[key] = currentCount + 1
            progressed = true
          }
        }
      }

      if (!progressed) continue

      // Check if all requirements are met
      let isCompleted = true
      for (const req of requirements) {
        if (req.type === 'game_played') {
          const key = `${req.game_id}_played`
          if ((currentProgress[key] || 0) < req.count) {
            isCompleted = false
            break
          }
        }
      }

      // Upsert progress
      if (!progressRow) {
        const { data: inserted } = await supabase
          .from('quest_progress')
          .insert({
            user_id: payload.userId,
            quest_id: quest.id,
            status: isCompleted ? 'completed' : 'in_progress',
            progress: currentProgress,
            completed_at: isCompleted ? new Date().toISOString() : null
          })
          .select()
          .single()
        progressRow = inserted
      } else {
        await supabase
          .from('quest_progress')
          .update({
            status: isCompleted ? 'completed' : 'in_progress',
            progress: currentProgress,
            completed_at: isCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', progressRow.id)
      }

      // Hand out rewards if just completed
      if (isCompleted) {
        if (quest.xp_reward) {
          await XPService.awardXP(supabase, {
            userId: payload.userId,
            baseXp: quest.xp_reward,
            reason: 'quest_completed',
            metadata: { questId: quest.id }
          })
        }
        
        if (quest.achievement_reward_id) {
          // Grant achievement directly
          try {
            await supabase.from('user_achievements').insert({
              user_id: payload.userId,
              achievement_id: quest.achievement_reward_id
            })
          } catch {
            // Ignore if already has it
          }
        }

        // Notification
        await supabase.from('notifications').insert({
          user_id: payload.userId,
          type: 'quest',
          title: 'Квест аяқталды!',
          message: `Сіз "${quest.title}" квестін сәтті аяқтадыңыз.`,
          metadata: { questId: quest.id }
        })
      }
    }
  }
}
