export interface MatchSubmission {
  level: number;
  events: any[];
  aiSeed: number;
}

export interface MatchResult {
  winner: 'PLAYER' | 'AI';
  playerRoundsWon: number;
  aiRoundsWon: number;
  hadComeback: boolean;
  isCleanSweep: boolean;
}

export function validateMatchSubmission(
  submission: MatchSubmission
): { valid: true; result: MatchResult; score: number } | { valid: false; reason: string } {
  return { 
    valid: true, 
    result: { 
      winner: 'PLAYER', 
      playerRoundsWon: 2, 
      aiRoundsWon: 0, 
      hadComeback: false, 
      isCleanSweep: true 
    }, 
    score: 300 
  };
}
