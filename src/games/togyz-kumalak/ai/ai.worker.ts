import { TogyzqumalakState, TogyzqumalakMove } from '../engine/types';
import { findBestMove } from './minimax';

self.onmessage = (e: MessageEvent<{ state: TogyzqumalakState; depth: number; messageId: string }>) => {
  const { state, depth, messageId } = e.data;
  
  try {
    const start = performance.now();
    const result = findBestMove(state, depth);
    const duration = performance.now() - start;
    
    self.postMessage({
      messageId,
      move: result.move,
      score: result.score,
      nodesVisited: result.nodesVisited,
      duration
    });
  } catch (error) {
    self.postMessage({
      messageId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
