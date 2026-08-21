import { useState, useCallback, useRef } from 'react';
import { TogyzqumalakState, TogyzqumalakMove, MoveRecord, Player, BoardState } from '@/games/togyz-kumalak/engine/types';
import { sounds } from './SoundManager';

function fromLinear(linear: number): { player: Player; otauIndex: number } {
  const idx = ((linear % 18) + 18) % 18;
  if (idx < 9) return { player: 1, otauIndex: idx };
  return { player: 2, otauIndex: idx - 9 };
}

function toLinear(player: Player, otauIndex: number): number {
  return player === 1 ? otauIndex : 9 + otauIndex;
}

export function useSowingAnimation(
  initialState: TogyzqumalakState, 
  onComplete: () => void
) {
  const [visualState, setVisualState] = useState<TogyzqumalakState>(initialState);
  const [animatingPit, setAnimatingPit] = useState<number | null>(null);
  
  const isAnimating = useRef(false);

  const startAnimation = useCallback(async (
    startState: TogyzqumalakState, 
    move: TogyzqumalakMove, 
    record: MoveRecord,
    finalState: TogyzqumalakState
  ) => {
    isAnimating.current = true;
    let currentState = JSON.parse(JSON.stringify(startState)) as TogyzqumalakState;
    setVisualState(currentState);
    
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    
    const sourceLinear = toLinear(move.player, move.otauIndex);
    const sourceStones = move.player === 1 
      ? currentState.board.player1Otaus[move.otauIndex]
      : currentState.board.player2Otaus[move.otauIndex];
    
    let stonesToSow = 0;
    if (sourceStones === 1) {
      if (move.player === 1) currentState.board.player1Otaus[move.otauIndex] = 0;
      else currentState.board.player2Otaus[move.otauIndex] = 0;
      stonesToSow = 1;
    } else {
      if (move.player === 1) currentState.board.player1Otaus[move.otauIndex] = 1;
      else currentState.board.player2Otaus[move.otauIndex] = 1;
      stonesToSow = sourceStones - 1;
    }

    setVisualState({...currentState});
    await delay(300);

    let currentLinear = sourceLinear + 1;
    
    for (let i = 0; i < stonesToSow; i++) {
      const pos = fromLinear(currentLinear + i);
      setAnimatingPit(toLinear(pos.player, pos.otauIndex));
      
      const isP1Tuzdyk = pos.player === 2 && currentState.tuzdyk.player1 === pos.otauIndex;
      const isP2Tuzdyk = pos.player === 1 && currentState.tuzdyk.player2 === pos.otauIndex;
      
      if (isP1Tuzdyk) {
        currentState.kazan.player1 += 1;
      } else if (isP2Tuzdyk) {
        currentState.kazan.player2 += 1;
      } else {
        if (pos.player === 1) currentState.board.player1Otaus[pos.otauIndex] += 1;
        else currentState.board.player2Otaus[pos.otauIndex] += 1;
      }
      
      setVisualState({...currentState});
      try { sounds.playStoneDrop(); } catch (e) {}
      await delay(120); 
    }

    if (record.captured > 0 || record.tuzdykCreated || record.atsyrau) {
      await delay(200);
      try {
        if (record.captured > 0) sounds.playCapture();
        if (record.tuzdykCreated) sounds.playTuzdyk();
      } catch (e) {}
      
      setVisualState(finalState);
      await delay(400); 
    } else {
      setVisualState(finalState);
    }
    
    if (finalState.currentPlayer !== startState.currentPlayer) {
      try { sounds.playTurnStart(); } catch (e) {}
    }
    
    setAnimatingPit(null);
    isAnimating.current = false;
    onComplete();
  }, [onComplete]);

  return {
    visualState,
    animatingPit,
    isAnimating: isAnimating.current,
    startAnimation
  };
}
