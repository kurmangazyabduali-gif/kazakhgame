ALTER TABLE public.game_scores
  ADD COLUMN IF NOT EXISTS duration_ms INTEGER,
  ADD COLUMN IF NOT EXISTS difficulty TEXT,
  ADD COLUMN IF NOT EXISTS accuracy NUMERIC,
  ADD COLUMN IF NOT EXISTS hits INTEGER,
  ADD COLUMN IF NOT EXISTS round_events JSONB;

CREATE INDEX IF NOT EXISTS game_scores_game_score_idx
  ON public.game_scores (game_id, score DESC);

CREATE INDEX IF NOT EXISTS game_scores_user_created_idx
  ON public.game_scores (user_id, created_at DESC);
