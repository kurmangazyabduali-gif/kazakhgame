import { AsykLevelConfig } from './types';

export const level3: AsykLevelConfig = {
  level: 3,
  targetCount: 9,
  arenaRadius: 4.0,
  targetRadius: 4.0,
  targetLayout: 'circle',
  throwPowerMin: 5,
  throwPowerMax: 40,
  friction: 0.8,
  difficulty: 3,
  positions: [
    [0, 0.5, -2], // center
    ...Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return [
        Math.cos(angle) * 1.5,
        0.5,
        -2 + Math.sin(angle) * 1.5
      ] as [number, number, number]
    })
  ]
};
