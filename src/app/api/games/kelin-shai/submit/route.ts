import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { validateKelinShaiResult } from '@/games/kelin-shai/validation'
import { createClient } from '@/lib/supabase/server'
import { XPService, type XPAwardOptions } from '@/lib/services/XPService'
import { type SupabaseClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = validateKelinShaiResult(body)
    const sessionId = body.sessionId

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({
        success: true,
        guest: true,
        validatedScore: result.score,
        xpEarned: result.xp,
        achievements: result.achievements,
        unlockedAchievements: result.achievements,
      })
    }

    const { data: gameData } = (await supabase.from('games').select('id').eq('slug', 'kelin-shai').single()) as unknown as { data: { id: string } | null }
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

    await (supabase.from('game_scores') as unknown as { insert: (v: unknown) => Promise<void> }).insert({
      session_id: sessionData?.id,
      user_id: user.id,
      game_id: gameData.id,
      score: result.score,
      xp_earned: result.xp
    })

    await XPService.awardXP(supabase as unknown as SupabaseClient, {
      userId: user.id,
      amount: result.xp,
      source: 'game_score',
      details: { game: 'kelin-shai', score: result.score }
    } as unknown as XPAwardOptions)

    return NextResponse.json({
      success: true,
      guest: false,
      validatedScore: result.score,
      xpEarned: result.xp,
      achievements: result.achievements,
      unlockedAchievements: result.achievements,
    })

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid Kelin Shai result payload' }, { status: 400 })
    }

    console.error('Error submitting kelin-shai score:', error)
    return NextResponse.json({ error: 'Rejected Kelin Shai result' }, { status: 400 })
  }
}
