-- 1. Add metadata JSONB column to game_scores
ALTER TABLE public.game_scores ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE public.game_scores ADD COLUMN IF NOT EXISTS duration INTEGER;

-- 2. Seed the Kelin Shai game
INSERT INTO public.games (id, slug, name, category, description, image_url)
VALUES (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'kelin-shai',
    'Келін шай',
    'Ұлттық дәстүр',
    'Искусство правильной подачи чая. Пройдите через различные жизненные ситуации, чтобы показать свое уважение и знание традиций.',
    '/images/games/kelin-shai.jpg'
) ON CONFLICT (slug) DO NOTHING;

-- 3. Seed Achievements for Kelin Shai
INSERT INTO public.achievements (title, description, xp_reward)
VALUES 
    ('kelin_first_tea', 'Проведите свое первое чаепитие', 20),
    ('kelin_hospitality', 'Получите более 90 баллов за гостеприимство', 50),
    ('kelin_neat', 'Не пролейте чай и сохраняйте чистоту дастархана', 30),
    ('kelin_tradition', 'Подайте чай старшему гостю первым', 50),
    ('kelin_master', 'Завершите сложный сценарий с максимальным баллом', 100)
ON CONFLICT DO NOTHING;
