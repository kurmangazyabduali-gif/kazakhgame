import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { XPService, type XPAwardOptions } from '@/lib/services/XPService'
import { type SupabaseClient } from '@supabase/supabase-js'
import { type Database } from '@/types/database'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { progress } = await request.json()
    if (!progress) {
      return NextResponse.json({ error: 'No progress provided' }, { status: 400 })
    }

    // Add XP
    if (progress.xp > 0) {
      await XPService.awardXP(supabase as unknown as SupabaseClient<Database>, {
        userId: user.id,
        amount: progress.xp,
        source: 'guest_migration',
        details: { description: 'Imported from guest session' }
      } as unknown as XPAwardOptions)
    }

    // Convert gameHistory to game_scores
    if (progress.gameHistory && Array.isArray(progress.gameHistory)) {
      for (const history of progress.gameHistory) {
        if (history.gameId && history.score > 0) {
          // get game_id from slug
          const { data: gameData } = (await supabase.from('games').select('id').eq('slug', history.gameId).single()) as unknown as { data: { id: string } }
          if (gameData) {
            await supabase.from('game_scores' as unknown as keyof Database['public']['Tables']).insert({
              user_id: user.id,
              game_id: gameData.id,
              score: history.score,
              xp_earned: history.xpEarned || 0,
              created_at: history.timestamp || new Date().toISOString()
            } as unknown as never)
          }
        }
      }
    }

    // We don't import random achievement IDs directly since they are UUIDs in the DB and strings in client.
    // Real implementation would map slugs to UUIDs if we tracked slugs for achievements.

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Migration error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
