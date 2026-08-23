export interface ZhambyLevelConfig {
  level: number
  horseSpeed: number
  targetDistance: number
  targetSize: number // Scale multiplier
  windSpeed: number // Negative for left, positive for right
  targetMotion: 'NONE' | 'SWAY' | 'MOVE_Y' | 'MOVE_X'
  attempts: number
  timeOfDay: 'DAY' | 'SUNSET' | 'NIGHT'
  weather: 'NONE' | 'RAIN' | 'SNOW'
}

export const ZHAMBY_LEVELS: Record<number, ZhambyLevelConfig> = {
  1: { level: 1, horseSpeed: 100, targetDistance: 800, targetSize: 1.5, windSpeed: 0, targetMotion: 'NONE', attempts: 5, timeOfDay: 'DAY', weather: 'NONE' },
  2: { level: 2, horseSpeed: 150, targetDistance: 1200, targetSize: 1.2, windSpeed: 0, targetMotion: 'NONE', attempts: 5, timeOfDay: 'DAY', weather: 'NONE' },
  3: { level: 3, horseSpeed: 150, targetDistance: 1200, targetSize: 1.0, windSpeed: 0, targetMotion: 'NONE', attempts: 5, timeOfDay: 'DAY', weather: 'NONE' },
  4: { level: 4, horseSpeed: 250, targetDistance: 1500, targetSize: 1.0, windSpeed: 0, targetMotion: 'NONE', attempts: 5, timeOfDay: 'DAY', weather: 'RAIN' },
  5: { level: 5, horseSpeed: 250, targetDistance: 1500, targetSize: 1.0, windSpeed: -200, targetMotion: 'NONE', attempts: 5, timeOfDay: 'DAY', weather: 'NONE' },
  
  6: { level: 6, horseSpeed: 200, targetDistance: 1500, targetSize: 1.0, windSpeed: 0, targetMotion: 'SWAY', attempts: 5, timeOfDay: 'SUNSET', weather: 'NONE' },
  7: { level: 7, horseSpeed: 200, targetDistance: 1800, targetSize: 1.0, windSpeed: -100, targetMotion: 'NONE', attempts: 5, timeOfDay: 'SUNSET', weather: 'NONE' },
  8: { level: 8, horseSpeed: 250, targetDistance: 2000, targetSize: 0.8, windSpeed: 100, targetMotion: 'NONE', attempts: 5, timeOfDay: 'SUNSET', weather: 'RAIN' },
  9: { level: 9, horseSpeed: 300, targetDistance: 2200, targetSize: 0.8, windSpeed: -300, targetMotion: 'NONE', attempts: 5, timeOfDay: 'SUNSET', weather: 'NONE' },
  10: { level: 10, horseSpeed: 350, targetDistance: 2500, targetSize: 0.6, windSpeed: -400, targetMotion: 'MOVE_Y', attempts: 5, timeOfDay: 'SUNSET', weather: 'SNOW' },
  
  11: { level: 11, horseSpeed: 300, targetDistance: 2000, targetSize: 0.7, windSpeed: 200, targetMotion: 'SWAY', attempts: 5, timeOfDay: 'NIGHT', weather: 'NONE' },
  12: { level: 12, horseSpeed: 400, targetDistance: 2200, targetSize: 0.8, windSpeed: 0, targetMotion: 'NONE', attempts: 5, timeOfDay: 'NIGHT', weather: 'NONE' },
  13: { level: 13, horseSpeed: 250, targetDistance: 1800, targetSize: 0.5, windSpeed: -250, targetMotion: 'NONE', attempts: 5, timeOfDay: 'NIGHT', weather: 'SNOW' },
  14: { level: 14, horseSpeed: 350, targetDistance: 2800, targetSize: 0.6, windSpeed: -350, targetMotion: 'SWAY', attempts: 5, timeOfDay: 'NIGHT', weather: 'RAIN' },
  15: { level: 15, horseSpeed: 450, targetDistance: 3000, targetSize: 0.4, windSpeed: -500, targetMotion: 'MOVE_Y', attempts: 5, timeOfDay: 'NIGHT', weather: 'SNOW' },
}
