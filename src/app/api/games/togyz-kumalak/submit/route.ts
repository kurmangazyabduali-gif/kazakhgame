import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { XPService, type XPAwardOptions } from '@/lib/services/XPService';
import { type SupabaseClient } from '@supabase/supabase-js';
import { validateAndReplayGame } from '@/games/togyz-kumalak/server/validator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, mode, difficulty, moveHistory, humanPlayer, practiceScenario } = body;

    if (!sessionId || !moveHistory || !Array.isArray(moveHistory)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Replay the game server-side to validate the final state
    const validation = validateAndReplayGame(
      mode,
      practiceScenario || 1,
      moveHistory,
      humanPlayer || 1
    );

    if (!validation.valid || !validation.finalState) {
      return NextResponse.json({ error: validation.reason || 'Invalid game state' }, { status: 400 });
    }

    const state = validation.finalState;
    if (state.status === 'playing') {
      return NextResponse.json({ error: 'Game not finished' }, { status: 400 });
    }

    // Determine basic score and XP for Guest or Auth
    let serverScore = state.kazan.player1; 
    if (humanPlayer === 2) serverScore = state.kazan.player2;
    
    // Quick XP scaling
    const isWin = validation.winner === humanPlayer;
    let xp = isWin ? 100 : (validation.isDraw ? 50 : 20);
    if (difficulty === 'medium') xp = Math.floor(xp * 1.5);
    if (difficulty === 'hard') xp = Math.floor(xp * 2.0);

    const achievements: string[] = [];
    if (isWin) achievements.push('first_win_togyz');
    if (validation.tuzdykCreated) achievements.push('tuzdyk_master');

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Guest mode
      return NextResponse.json({
        success: true,
        guest: true,
        validatedScore: serverScore,
        xpEarned: xp,
        unlockedAchievements: achievements,
        p1Score: state.kazan.player1,
        p2Score: state.kazan.player2,
        winner: validation.winner
      });
    }

    // Authenticated Mode
    const { data: gameData } = (await supabase.from('games').select('id').eq('slug', 'togyz-kumalak').single()) as unknown as { data: { id: string } | null };
    if (!gameData) throw new Error('Game not found in DB');

    const { data: sessionData, error: sessionError } = (await (supabase.from('game_sessions') as unknown as { insert: (v: unknown) => { select: () => { single: () => Promise<unknown> } } }).insert({
      id: sessionId,
      user_id: user.id,
      game_id: gameData.id,
      status: 'completed',
      end_time: new Date().toISOString()
    }).select().single()) as unknown as { data: { id: string } | null, error: { code?: string } | null };

    if (sessionError) {
      if (sessionError.code === '23505') { 
        return NextResponse.json({ error: 'Session already submitted' }, { status: 409 });
      }
      throw sessionError;
    }

    // Insert Score
    await (supabase.from('game_scores') as unknown as { insert: (v: unknown) => Promise<void> }).insert({
      session_id: sessionData?.id,
      user_id: user.id,
      game_id: gameData.id,
      score: serverScore,
      xp_earned: xp,
      metadata: { mode, difficulty, winner: validation.winner, p1Score: state.kazan.player1, p2Score: state.kazan.player2 }
    });

    // Update XP
    await XPService.awardXP(supabase as unknown as SupabaseClient, {
      userId: user.id,
      amount: xp,
      source: 'game_score',
      details: { game: 'togyz-kumalak', score: serverScore }
    } as unknown as XPAwardOptions);

    return NextResponse.json({
      success: true,
      guest: false,
      validatedScore: serverScore,
      xpEarned: xp,
      unlockedAchievements: achievements,
      p1Score: state.kazan.player1,
      p2Score: state.kazan.player2,
      winner: validation.winner
    });

  } catch (error) {
    console.error('Submit score error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
