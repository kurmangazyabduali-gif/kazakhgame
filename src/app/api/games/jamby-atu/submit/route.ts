import { NextResponse } from 'next/server'
// API for Jamby Atu

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { score, results } = body

    // 1. Server-side validation (Anti-cheat)
    if (!results || !Array.isArray(results) || results.length > 5) {
      return NextResponse.json({ error: 'Invalid results format' }, { status: 400 })
    }
    
    if (score > 4000 || score < 0) {
      return NextResponse.json({ error: 'Suspicious score detected' }, { status: 400 })
    }

    return NextResponse.json({ success: true, guest: true, validatedScore: score, xpEarned: score })
    
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
