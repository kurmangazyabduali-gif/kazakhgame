import { NextRequest, NextResponse } from 'next/server'
// API for Kusbegilik

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { score?: unknown }
    const score = typeof body.score === 'number' ? body.score : 0

    // 1. Basic validation (Anti-cheat)
    if (score > 1000) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
    }
    const xpEarned = score
    const newTrust = 50
    const newExp = xpEarned
    const newLevel = Math.floor(newExp / 500) + 1
    
    return NextResponse.json({
      success: true,
      guest: true,
      eagleStats: {
        trust: newTrust,
        experience: newExp,
        level: newLevel
      },
      xpEarned
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
