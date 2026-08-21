export type TargetLayout = 'circle' | 'line' | 'triangle' | 'random' | 'custom'

export interface AsykLevelConfig {
  level: number;
  targetCount: number;
  arenaRadius: number;
  targetRadius: number; // For rendering the inner circle if needed
  targetLayout: TargetLayout;
  throwPowerMin: number;
  throwPowerMax: number;
  friction: number;
  difficulty: number;
  positions: [number, number, number][]; // [x, y, z]
}
