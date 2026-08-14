-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Regions
CREATE TABLE public.regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Schools
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    region_id UUID REFERENCES public.regions(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    region_id UUID REFERENCES public.regions(id),
    school_id UUID REFERENCES public.schools(id),
    class_name TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Games
CREATE TABLE public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Game Sessions
CREATE TABLE public.game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES public.games(id) NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    status TEXT DEFAULT 'active'
);

-- Game Scores
CREATE TABLE public.game_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.game_sessions(id),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    game_id UUID REFERENCES public.games(id) NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Achievements
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    xp_reward INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Achievements
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    achievement_id UUID REFERENCES public.achievements(id) NOT NULL,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Leaderboards
CREATE TABLE public.leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- global, regional, school
    region_id UUID REFERENCES public.regions(id),
    school_id UUID REFERENCES public.schools(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Traditions
CREATE TABLE public.traditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Museum Items
CREATE TABLE public.museum_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    model_url TEXT,
    historical_period TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quests
CREATE TABLE public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    xp_reward INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Conversations
CREATE TABLE public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.museum_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public read access
CREATE POLICY "Public read access for regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Public read access for schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Public read access for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read access for games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public read access for achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public read access for leaderboards" ON public.leaderboards FOR SELECT USING (true);
CREATE POLICY "Public read access for traditions" ON public.traditions FOR SELECT USING (true);
CREATE POLICY "Public read access for museum items" ON public.museum_items FOR SELECT USING (true);

-- Authenticated User Policies
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read their own sessions" ON public.game_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sessions" ON public.game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own active sessions" ON public.game_sessions FOR UPDATE USING (auth.uid() = user_id AND status = 'active');

CREATE POLICY "Users can read their own scores" ON public.game_scores FOR SELECT USING (auth.uid() = user_id);
-- Scores should ideally be inserted by a secure server function, but for MVP:
CREATE POLICY "Users can insert their own scores" ON public.game_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read their own ai conversations" ON public.ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own ai conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);

-- Setup automatic profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
