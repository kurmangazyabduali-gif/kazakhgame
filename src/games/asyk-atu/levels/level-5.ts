import { AsykLevelConfig } from './types';

export const level5: AsykLevelConfig = {
  level: 5,
  targetCount: 12,
  arenaRadius: 4.0,
  targetRadius: 4.0,
  targetLayout: 'random',
  throwPowerMin: 5,
  throwPowerMax: 40,
  friction: 0.8,
  difficulty: 5,
  positions: [
    [0, 0.5, -2],
    [0.6, 0.5, -2], [-0.6, 0.5, -2],
    [1.2, 0.5, -2], [-1.2, 0.5, -2],
    [0, 0.5, -1.4], [0, 0.5, -2.6],
    [0.6, 0.5, -1.4], [-0.6, 0.5, -1.4],
    [0.6, 0.5, -2.6], [-0.6, 0.5, -2.6],
    [0, 0.5, -0.8]
  ]
};
