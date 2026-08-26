-- Add Arqan Tartys to games table
INSERT INTO public.games (id, title, description, type, status, min_level, max_score, created_at, updated_at)
VALUES (
    'arqan-tartys',
    'Арқан тартыс',
    'Командная игра на перетягивание каната. Почувствуй ритм и силу степи!',
    'interactive',
    'published',
    1,
    1000,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description;
