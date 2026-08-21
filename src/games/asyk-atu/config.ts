export const ASYK_CONFIG = {
  GAME_SLUG: 'asyk-atu',
  MAX_ROUNDS: 5,
  
  PHYSICS: {
    MIN_VELOCITY: 300,
    MAX_VELOCITY: 1200,
    BOUNCE: 0.6,
    DRAG: 150,
    ANGULAR_DRAG: 100,
    DIRECT_HIT_THRESHOLD: 800,
    STRONG_HIT_THRESHOLD: 400,
  },

  // Вероятности выпадения граней (Алшы, Тәйке, Бүк, Шік)
  FACE_PROBABILITIES: {
    alshy: 0.10, // 10%
    tayke: 0.20, // 20%
    buk: 0.35,   // 35%
    chik: 0.35   // 35%
  },
  
  SCORING: {
    DIRECT_HIT: 100,
    STRONG_HIT: 50,
    PRECISION_BONUS: 25,
    ALSHY_BONUS: 50, // Бонус за выпадение "Алшы"
    COMBO_MULTIPLIER: 1.5,
    MISS: 0,
    XP_PER_SCORE_POINT: 0.2,
    XP_COMPLETION_BONUS: 50,
  }
}
