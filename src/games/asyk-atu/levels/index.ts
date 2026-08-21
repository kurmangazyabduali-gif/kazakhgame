import { level1 } from './level-1';
import { level2 } from './level-2';
import { level3 } from './level-3';
import { level4 } from './level-4';
import { level5 } from './level-5';
import { AsykLevelConfig } from './types';

const levels: Record<number, AsykLevelConfig> = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5
};

export const getLevelConfig = (level: number): AsykLevelConfig => {
  return levels[level] || levels[5];
};

export * from './types';
