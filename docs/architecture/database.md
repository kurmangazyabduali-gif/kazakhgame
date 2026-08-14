# Database Architecture

Built on PostgreSQL (Supabase) with extensive Row Level Security (RLS).

## Key Entities
- `profiles`: Extends Supabase auth users.
- `games`: Registry of available games.
- `game_sessions`: Tracks active gameplay sessions.
- `game_scores`: Final results and XP earned.
- `achievements`: Unlocked milestones.

## Security
- RLS ensures users can only mutate their own sessions and scores.
- Service Role keys are required for administrative inserts (like adding new games).
