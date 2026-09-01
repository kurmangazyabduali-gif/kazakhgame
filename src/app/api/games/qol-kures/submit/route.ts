import { NextResponse } from 'next/server'
import { calculateMatchScore } from '@/games/qol-kures/scoring/scoring'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      win, 
      roundsWon, 
      roundsLost, 
      perfectPushes, 
      staminaEfficiency, 
      comebackTriggered, 
      difficulty 
    } = body

    if (
      win === undefined ||
      roundsWon === undefined ||
      roundsLost === undefined ||
      perfectPushes === undefined ||
      staminaEfficiency === undefined ||
      comebackTriggered === undefined ||
      !difficulty
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Securely calculate score and XP on the server (no trust of client-side totals)
    const result = calculateMatchScore(
      win,
      roundsWon,
      roundsLost,
      perfectPushes,
      staminaEfficiency,
      comebackTriggered,
      difficulty
    )

    // Return guest payload directly
    return NextResponse.json({
      success: true,
      guest: true,
      validatedScore: result.score,
      xpEarned: result.xpEarned,
      unlockedAchievements: result.unlockedAchievements
    })

  } catch (error) {
    console.error('Submit score error in qol-kures:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
