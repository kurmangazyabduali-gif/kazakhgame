import { NextResponse } from 'next/server'
import { validateMatchSubmission, MatchSubmission } from '@/games/arqan-tartys/scoring/validateMatch'
import { calculateMatchXP } from '@/games/arqan-tartys/scoring/scoring'
import { evaluateAchievements, AchievementId } from '@/games/arqan-tartys/scoring/achievements'

interface SubmitBody {
  level: number
  events: MatchSubmission['events']
  aiSeed: number
  isFirstPullEver?: boolean
  isFirstWinEver?: boolean
  alreadyUnlockedAchievements?: AchievementId[]
  totalLevels?: number
}

// API for Arqan Tartys (tug-of-war). Progression is localStorage-only for
// this game (no Supabase game_sessions/game_scores rows), so this route's
// job is narrower than asyk-atu's: recompute the ENTIRE match server-side
// from the raw pull-event log and hand back a validated result the client
// can then persist locally. The client-declared winner/score are never
// read or trusted — only `level`, `events`, and `aiSeed` are used.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SubmitBody>
    const { level, events, aiSeed } = body

    if (typeof level !== 'number' || !Number.isInteger(level) || level < 1 || level > 8) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
    }
    if (!Array.isArray(events)) {
      return NextResponse.json({ error: 'Invalid events payload' }, { status: 400 })
    }
    if (typeof aiSeed !== 'number' || !Number.isFinite(aiSeed)) {
      return NextResponse.json({ error: 'Invalid aiSeed' }, { status: 400 })
    }

    const validation = validateMatchSubmission({ level, events, aiSeed })
    if (!validation.valid) {
      return NextResponse.json({ error: 'Result rejected by server validation', reason: validation.reason }, { status: 400 })
    }

    const { result, score } = validation
    const xp = calculateMatchXP(result, level)

    const alreadyUnlocked = new Set(
      Array.isArray(body.alreadyUnlockedAchievements) ? body.alreadyUnlockedAchievements : []
    )
    const newAchievements = evaluateAchievements(
      result,
      {
        isFirstPullEver: Boolean(body.isFirstPullEver),
        isFirstWinEver: Boolean(body.isFirstWinEver),
        completedLevel: level,
        totalLevels: typeof body.totalLevels === 'number' ? body.totalLevels : 8,
      },
      alreadyUnlocked
    )

    return NextResponse.json({
      success: true,
      guest: true,
      validatedWinner: result.winner,
      validatedScore: score,
      xpEarned: xp,
      playerRoundsWon: result.playerRoundsWon,
      aiRoundsWon: result.aiRoundsWon,
      hadComeback: result.hadComeback,
      isCleanSweep: result.isCleanSweep,
      unlockedAchievements: newAchievements,
    })
  } catch (error) {
    console.error('Arqan Tartys submit error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
