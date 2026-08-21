-- Seed the Asyk Atu game
INSERT INTO public.games (id, slug, name, category, description, image_url)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'asyk-atu',
    'Асық ату',
    'Ұлттық спорт',
    'Традиционная казахская игра в асыки. Тренируйте меткость, бросая асык (сақа) и выбивая цели.',
    '/images/games/asyk-atu.jpg'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Achievements for Asyk Atu
INSERT INTO public.achievements (title, description, xp_reward)
VALUES 
    ('asyk_first_throw', 'Сделайте свой первый бросок в Асық ату', 10),
    ('asyk_sharp_eye', 'Выбейте все мишени без промахов в одной игре', 50),
    ('asyk_triple_combo', 'Сделайте 3 успешных броска подряд', 30),
    ('asyk_master', 'Наберите больше 400 очков в одной игре', 100)
ON CONFLICT DO NOTHING;
