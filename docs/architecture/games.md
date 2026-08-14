# Games Architecture

Games are built as isolated modules that conform to the `NationalGame` contract.

## Contract
```typescript
interface NationalGame {
  id: string;
  slug: string;
  name: string;
  category: GameCategory;

  initialize(): void;
  start(): void;
  pause(): void;
  resume(): void;
  finish(): GameResult;
}
```

## Integration
Games are loaded dynamically via the `GameRegistry`. The `GameSession` wrapper manages the lifecycle and automatically records the duration and outcomes before writing to the database.
