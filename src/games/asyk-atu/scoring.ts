import { ThrowEvent } from './types'

export function calculateTotalScore(events: ThrowEvent[]): number {
  return events.reduce((total, event) => {
    let roundScore = 0
    
    // Base points for hits
    if (event.hitQuality === 'direct') roundScore += 100
    else if (event.hitQuality === 'strong') roundScore += 50
    else if (event.hitQuality === 'miss') roundScore += 0

    // Targets hit
    roundScore += event.targetsHit * 50

    // Combo multiplier
    if (event.combo > 1) {
      roundScore *= event.combo
    }

    // Golden hits bonus
    if (event.goldenHits) {
      roundScore += event.goldenHits * 200
    }

    // Alshy face bonus (rare)
    if (event.alshyBonus) {
      roundScore += 500
    }

    return total + roundScore
  }, 0)
}

export function calculateXP(score: number, completed: boolean): number {
  let xp = Math.floor(score / 10)
  if (completed) xp += 100
  return xp
}

export function calculateAccuracy(events: ThrowEvent[]): number {
  if (events.length === 0) return 0
  const throwsWithHits = events.filter(e => e.targetsHit > 0).length
  return Math.round((throwsWithHits / events.length) * 100)
}
