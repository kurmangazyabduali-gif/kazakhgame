import { AsykLevelConfig } from './types';

export const level1: AsykLevelConfig = {
  level: 1,
  targetCount: 5,
  arenaRadius: 4.0,
  targetRadius: 4.0,
  targetLayout: 'line',
  throwPowerMin: 5,
  throwPowerMax: 40,
  friction: 0.8,
  difficulty: 1,
  positions: [
    [0, 0.5, -2],
    [-0.8, 0.5, -2],
    [0.8, 0.5, -2],
    [-1.6, 0.5, -2],
    [1.6, 0.5, -2],
  ]
};
