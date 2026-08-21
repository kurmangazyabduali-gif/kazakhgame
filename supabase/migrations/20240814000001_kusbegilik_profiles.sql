-- Kusbegilik Eagle Profiles
CREATE TABLE public.kusbegilik_eagles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT DEFAULT 'Мұзбалақ',
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    trust INTEGER DEFAULT 50, -- 0 to 100
    
    -- Stats (0 to 100)
    speed INTEGER DEFAULT 20,
    stamina INTEGER DEFAULT 20,
    turning INTEGER DEFAULT 20,
    reaction INTEGER DEFAULT 20,
    focus INTEGER DEFAULT 20,
    divePower INTEGER DEFAULT 20,
    accuracy INTEGER DEFAULT 20,
    
    missions_completed INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    success_rate INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.kusbegilik_eagles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read their own eagle profile" ON public.kusbegilik_eagles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own eagle profile" ON public.kusbegilik_eagles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own eagle profile" ON public.kusbegilik_eagles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add Kusbegilik Achievements
INSERT INTO public.achievements (title, description, xp_reward) VALUES 
('First Flight', 'Совершите свой первый полёт с бүркітом', 100),
('First Successful Dive', 'Успешно спикируйте на цель', 150),
('Sharp Eye', 'Обнаружьте цель быстро', 150),
('Perfect Dive', 'Идеальное пикирование и захват', 300),
('Master of the Steppe', 'Выполните все миссии құсбегі', 500),
('Құсбегі', 'Достигните высшего уровня доверия с бүркітом', 1000);
