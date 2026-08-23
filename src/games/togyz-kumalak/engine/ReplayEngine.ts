import { TogyzqumalakState, MoveRecord, GameMode, Player } from './types';
import { TogyzqumalakEngine } from './TogyzqumalakEngine';

export class ReplayEngine {
  private initialState: TogyzqumalakState;
  private moves: MoveRecord[];
  private states: TogyzqumalakState[];
  private currentIndex: number = 0;

  constructor(mode: GameMode, practiceScenario: number, moves: MoveRecord[]) {
    this.initialState = mode === 'practice'
      ? TogyzqumalakEngine.getPracticeState(practiceScenario)
      : TogyzqumalakEngine.getInitialState();
    
    this.moves = moves;
    this.states = [this.initialState];
    
    // Generate all states
    let currentState = this.initialState;
    for (const move of moves) {
      const result = TogyzqumalakEngine.applyMove(currentState, {
        player: move.player,
        otauIndex: move.otauIndex
      });
      this.states.push(result.nextState);
      currentState = result.nextState;
    }
  }

  public get totalMoves(): number {
    return this.moves.length;
  }

  public get currentMoveIndex(): number {
    return this.currentIndex;
  }

  public getCurrentState(): TogyzqumalakState {
    return this.states[this.currentIndex];
  }

  public stepForward(): TogyzqumalakState | null {
    if (this.currentIndex < this.states.length - 1) {
      this.currentIndex++;
      return this.states[this.currentIndex];
    }
    return null;
  }

  public stepBackward(): TogyzqumalakState | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.states[this.currentIndex];
    }
    return null;
  }

  public goToStart(): TogyzqumalakState {
    this.currentIndex = 0;
    return this.states[0];
  }

  public goToEnd(): TogyzqumalakState {
    this.currentIndex = this.states.length - 1;
    return this.states[this.currentIndex];
  }

  public jumpToMove(index: number): TogyzqumalakState {
    if (index >= 0 && index < this.states.length) {
      this.currentIndex = index;
    }
    return this.states[this.currentIndex];
  }
}
