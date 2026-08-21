import { AsykLevelConfig } from './types';

export const level2: AsykLevelConfig = {
  level: 2,
  targetCount: 7,
  arenaRadius: 4.0,
  targetRadius: 4.0,
  targetLayout: 'triangle',
  throwPowerMin: 5,
  throwPowerMax: 40,
  friction: 0.8,
  difficulty: 2,
  positions: [
    [0, 0.5, -1.5], // front
    [-0.5, 0.5, -2], [0.5, 0.5, -2], // middle
    [-1, 0.5, -2.5], [0, 0.5, -2.5], [1, 0.5, -2.5], // back
    [0, 0.5, -2], // center
  ]
};
