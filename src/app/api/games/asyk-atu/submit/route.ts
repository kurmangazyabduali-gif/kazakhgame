import { NextResponse } from 'next/server'
import { calculateTotalScore, calculateXP } from '@/games/asyk-atu/scoring'
import { ThrowEvent } from '@/games/asyk-atu/types'
import { ASYK_CONFIG } from '@/games/asyk-atu/config'
import { createClient } from '@/lib/supabase/server'
import { XPService, type XPAwardOptions } from '@/lib/services/XPService'
import { type SupabaseClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, events } = body

    if (!sessionId || !events || !Array.isArray(events)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Server-side score validation
    const serverScore = calculateTotalScore(events as ThrowEvent[])
    const isCompleted = events.length >= 5 // Approximated for completed check
    const xp = calculateXP(serverScore, isCompleted)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Guest mode
      return NextResponse.json({
        success: true,
        guest: true,
        validatedScore: serverScore,
        xpEarned: xp,
        unlockedAchievements: []
      })
    }

    // Authenticated Mode
    // 1. Get Game ID
    const { data: gameData } = (await supabase.from('games').select('id').eq('slug', 'asyk-atu').single()) as unknown as { data: { id: string } | null }
    if (!gameData) throw new Error('Game not found in DB')

    const { data: sessionData, error: sessionError } = (await (supabase.from('game_sessions') as unknown as { insert: (v: unknown) => { select: () => { single: () => Promise<unknown> } } }).insert({
      id: sessionId,
      user_id: user.id,
      game_id: gameData.id,
      status: 'completed',
      end_time: new Date().toISOString()
    }).select().single()) as unknown as { data: { id: string } | null, error: { code?: string } | null }

    if (sessionError) {
      if (sessionError.code === '23505') { // unique violation
        return NextResponse.json({ error: 'Session already submitted' }, { status: 409 })
      }
      throw sessionError
    }

    // 3. Insert Score
    await (supabase.from('game_scores') as unknown as { insert: (v: unknown) => Promise<void> }).insert({
      session_id: sessionData?.id,
      user_id: user.id,
      game_id: gameData.id,
      score: serverScore,
      xp_earned: xp
    })

    // 4. Update XP & Profile
    await XPService.awardXP(supabase as unknown as SupabaseClient, {
      userId: user.id,
      amount: xp,
      source: 'game_score',
      details: { game: 'asyk-atu', score: serverScore }
    } as unknown as XPAwardOptions)

    return NextResponse.json({
      success: true,
      guest: false,
      validatedScore: serverScore,
      xpEarned: xp,
      unlockedAchievements: []
    })

  } catch (error) {
    console.error('Submit score error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
