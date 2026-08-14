-- Seed Data for ULY DALA Platform

-- Regions
INSERT INTO public.regions (id, name) VALUES
('b3c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1a', 'Астана'),
('b3c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1b', 'Алматы'),
('b3c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1c', 'Шымкент'),
('b3c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1d', 'Туркестанская область'),
('b3c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1e', 'Карагандинская область');

-- Games
INSERT INTO public.games (id, slug, name, category, description) VALUES
('a1c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1a', 'asyk-atu', 'Асық ату', 'Ұлттық спорт', 'Традиционная казахская игра в асыки.'),
('a1c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1b', 'kelin-shai', 'Келін шай', 'Ұлттық дәстүр', 'Искусство правильной подачи чая по казахским традициям.'),
('a1c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1c', 'togyz-kumalak', 'Тоғызқұмалақ', 'Стратегия', 'Казахская национальная логическая настольная игра.'),
('a1c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1d', 'zhamba-atu', 'Жамбы ату', 'Ұлттық спорт', 'Стрельба из лука по мишени.'),
('a1c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1e', 'kusbegilik', 'Құсбегілік', 'Ұлттық дәстүр', 'Искусство охоты с ловчими птицами.');

-- Achievements
INSERT INTO public.achievements (id, title, description, xp_reward) VALUES
('c2c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1a', 'Первый бросок', 'Сыграть в Асық ату впервые', 50),
('c2c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1b', 'Первое чаепитие', 'Пройти симуляцию Келін шай', 50),
('c2c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1c', 'Первый матч', 'Сыграть в любую игру', 20),
('c2c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1d', 'Мерген', 'Попасть в цель 10 раз в Жамбы ату', 100),
('c2c8f8b2-1b1a-4b1a-8b1a-1b1a4b1a8b1e', 'Ұлы дала шәкірті', 'Зарегистрироваться на платформе ULY DALA', 10);
