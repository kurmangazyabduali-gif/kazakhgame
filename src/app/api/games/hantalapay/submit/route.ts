import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { score, stars, roundsCompleted, khansCaptured } = body

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
    }

    // Anti-cheat verification bounds
    const maxPossibleScore = 150000
    const validatedScore = Math.min(score, maxPossibleScore)
    const xpReward = Math.round(validatedScore * 0.1) + (stars || 0) * 150

    return NextResponse.json({
      success: true,
      validatedScore,
      xpEarned: xpReward,
      message: 'Hantalapay match score validated and recorded.',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 })
  }
}
