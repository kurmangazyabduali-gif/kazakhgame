-- 1. Quests table
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g., [{"type": "game_played", "game_id": "asyk-atu", "count": 1}]
    xp_reward INTEGER DEFAULT 0,
    achievement_reward_id UUID REFERENCES public.achievements(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Quest Progress table
CREATE TABLE IF NOT EXISTS public.quest_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed'
    progress JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g., {"asyk-atu_played": 1}
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, quest_id)
);

-- 3. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'achievement', 'level_up', 'quest'
    title TEXT NOT NULL,
    message TEXT,
    read BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Quests: everyone can read
CREATE POLICY "Quests are viewable by everyone" ON public.quests
    FOR SELECT USING (true);

-- Quest Progress: users can read their own
CREATE POLICY "Users can view own quest progress" ON public.quest_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Notifications: users can read their own
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. Seed Data: Games
INSERT INTO public.games (slug, name, category, description, image_url)
VALUES 
    ('asyk-atu', 'Асық ату', 'Ұлттық спорт', 'Дәстүрлі асық ату ойыны.', '/images/games/asyk-atu.jpg'),
    ('kelin-shai', 'Келін шай', 'Ұлттық дәстүр', 'Келін шай құю өнерінің симуляторы.', '/images/games/kelin-shai.jpg'),
    ('togyzqumalak', 'Тоғызқұмалақ', 'Стратегия', 'Ұлттық логикалық ойын (Rule Engine + AI).', '/images/games/togyzqumalak.jpg')
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- 5. Seed Data: Global Achievements
INSERT INTO public.achievements (id, title, description, xp_reward, icon)
VALUES 
    (gen_random_uuid(), 'Первый бросок', 'Сыграйте свою первую партию в Асық ату', 50, '🎯'),
    (gen_random_uuid(), 'Қонақжай келін', 'Завершите все сценарии Келін шай', 100, '🫖'),
    (gen_random_uuid(), 'Тоғызқұмалақ шебері', 'Одержите победу над сложным AI в Тоғызқұмалақ', 150, '🧠'),
    (gen_random_uuid(), 'Ұлы дала шәкірті', 'Завершите цепочку квестов «Бастау жолы»', 300, '🏆'),
    (gen_random_uuid(), 'Первый ход', 'Сделайте свой первый ход в любой игре', 20, '🎲'),
    (gen_random_uuid(), 'Мастер асық ату', 'Заработайте 500 очков в Асық ату', 200, '🏅')
ON CONFLICT (title) DO NOTHING;

-- 6. Seed Data: Quest "Бастау жолы"
DO $$
DECLARE
    ach_id UUID;
BEGIN
    SELECT id INTO ach_id FROM public.achievements WHERE title = 'Ұлы дала шәкірті' LIMIT 1;
    
    INSERT INTO public.quests (slug, title, description, requirements, xp_reward, achievement_reward_id)
    VALUES (
        'bastau-zholy', 
        'Бастау жолы', 
        'Пройдите первые шаги на платформе ULY DALA, познакомившись с каждой из игр.',
        '[{"type":"game_played","game_id":"asyk-atu","count":1}, {"type":"game_played","game_id":"kelin-shai","count":1}, {"type":"game_played","game_id":"togyzqumalak","count":1}]'::jsonb,
        300,
        ach_id
    ) ON CONFLICT (slug) DO NOTHING;
END $$;
