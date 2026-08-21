import { AsykLevelConfig } from './types';

export const level4: AsykLevelConfig = {
  level: 4,
  targetCount: 10,
  arenaRadius: 4.0,
  targetRadius: 4.0,
  targetLayout: 'custom',
  throwPowerMin: 5,
  throwPowerMax: 40,
  friction: 0.8,
  difficulty: 4,
  positions: [
    [0, 0.5, -1],
    [0.8, 0.5, -1.5], [-0.8, 0.5, -1.5],
    [1.6, 0.5, -2], [-1.6, 0.5, -2],
    [0.8, 0.5, -2.5], [-0.8, 0.5, -2.5],
    [0, 0.5, -3],
    [0, 0.5, -2], // inner center
    [0, 0.5, -1.5]
  ]
};
