-- ============================================================
-- CodeConquer Database Schema & Supabase Setup
-- Paste this script directly into the Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    next_level_xp INTEGER DEFAULT 500,
    energy_crystals INTEGER DEFAULT 100 CHECK (energy_crystals >= 0),
    max_energy_crystals INTEGER DEFAULT 100,
    streak_count INTEGER DEFAULT 1 CHECK (streak_count >= 0),
    last_active_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ISLANDS TABLE
CREATE TABLE IF NOT EXISTS public.islands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    biome TEXT NOT NULL,
    description TEXT,
    required_level INTEGER DEFAULT 1,
    total_territories INTEGER DEFAULT 5,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Master')),
    color TEXT DEFAULT 'text-emerald-400',
    bg_gradient TEXT DEFAULT 'from-emerald-900/40 to-cyan-900/30',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TERRITORIES TABLE
CREATE TABLE IF NOT EXISTS public.territories (
    id TEXT PRIMARY KEY,
    island_id TEXT NOT NULL REFERENCES public.islands(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    description TEXT,
    problem_id TEXT,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Expert')),
    xp_reward INTEGER DEFAULT 50,
    crystal_reward INTEGER DEFAULT 10,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER TERRITORY PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_territories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    territory_id TEXT NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'unlocked' CHECK (status IN ('locked', 'unlocked', 'in_progress', 'captured')),
    stars INTEGER DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
    captured_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, territory_id)
);

-- 5. PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS public.problems (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Expert')),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    initial_code JSONB NOT NULL DEFAULT '{"python": "# write code here", "javascript": "// write code here"}'::jsonb,
    test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
    hints JSONB DEFAULT '[]'::jsonb,
    time_limit_ms INTEGER DEFAULT 2000,
    memory_limit_mb INTEGER DEFAULT 128,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CODE SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('accepted', 'failed', 'compilation_error', 'runtime_error', 'timeout')),
    passed_tests INTEGER DEFAULT 0,
    total_tests INTEGER DEFAULT 0,
    execution_time_ms NUMERIC,
    memory_kb NUMERIC,
    ai_feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLASH ROOMS (Multiplayer Arena)
CREATE TABLE IF NOT EXISTS public.clash_rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed')),
    game_mode TEXT DEFAULT 'territory_control' CHECK (game_mode IN ('territory_control', 'speed_duel', 'survival')),
    max_players INTEGER DEFAULT 4,
    time_limit_seconds INTEGER DEFAULT 600,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CLASH ROOM PLAYERS
CREATE TABLE IF NOT EXISTS public.clash_room_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id TEXT NOT NULL REFERENCES public.clash_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    color TEXT DEFAULT '#10B981',
    is_ready BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    captured_territories INTEGER DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (room_id, user_id)
);

-- 9. USER COURSES & MODULES (AI Course Generator)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    target_skill_level TEXT NOT NULL,
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DAILY QUESTS & USER QUEST STATUS
CREATE TABLE IF NOT EXISTS public.quests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_count INTEGER DEFAULT 1,
    xp_reward INTEGER DEFAULT 100,
    crystal_reward INTEGER DEFAULT 15,
    quest_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quest_id TEXT NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    date DATE DEFAULT CURRENT_DATE,
    UNIQUE (user_id, quest_id, date)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.islands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clash_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clash_room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

-- Public read permissions
CREATE POLICY "Public islands view" ON public.islands FOR SELECT USING (true);
CREATE POLICY "Public territories view" ON public.territories FOR SELECT USING (true);
CREATE POLICY "Public problems view" ON public.problems FOR SELECT USING (true);
CREATE POLICY "Public quests view" ON public.quests FOR SELECT USING (true);
CREATE POLICY "Public profiles view" ON public.profiles FOR SELECT USING (true);

-- User data access policies
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own territory progress" ON public.user_territories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own submissions" ON public.submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own courses" ON public.courses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own quests" ON public.user_quests FOR ALL USING (auth.uid() = user_id);

-- Clash multiplayer policies
CREATE POLICY "Public read clash rooms" ON public.clash_rooms FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create clash rooms" ON public.clash_rooms FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Host can update clash rooms" ON public.clash_rooms FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Public read clash room players" ON public.clash_room_players FOR SELECT USING (true);
CREATE POLICY "Users can join clash room" ON public.clash_room_players FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clash status" ON public.clash_room_players FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- AUTO-SYNC USER TRIGGER (From auth.users to public.profiles)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEED DATA (Default Islands, Territories, Quests)
-- ============================================================

INSERT INTO public.islands (id, name, biome, description, required_level, total_territories, difficulty, color, bg_gradient) VALUES
('python-shores', 'Python Shores', 'Cyber Coastal', 'Master basic Python syntax, data types, and operations across neo-beaches.', 1, 5, 'Beginner', 'text-emerald-400', 'from-emerald-900/40 to-cyan-900/30'),
('loop-lagoon', 'Loop Lagoon', 'Bioluminescent Archipelago', 'Traverse while-loops, nested iterations, and list comprehensions.', 3, 5, 'Intermediate', 'text-cyan-400', 'from-cyan-900/40 to-blue-900/30'),
('array-archipelago', 'Array Archipelago', 'Volcanic Crystal Islands', 'Conquer array transformations, two-pointer sweeps, and slicing.', 5, 5, 'Intermediate', 'text-blue-400', 'from-blue-900/40 to-indigo-900/30'),
('recursion-reef', 'Recursion Reef', 'Deep Coral Abyss', 'Dive deep into call stacks, base cases, and divide-and-conquer puzzles.', 8, 5, 'Advanced', 'text-purple-400', 'from-purple-900/40 to-fuchsia-900/30'),
('algorithm-atoll', 'Algorithm Atoll', 'Plasma Highlands', 'Dynamic programming, greedy choices, and high-frequency algorithms.', 12, 5, 'Master', 'text-amber-400', 'from-amber-900/40 to-orange-900/30')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.territories (id, island_id, title, topic, description, difficulty, xp_reward, crystal_reward, order_index) VALUES
('t-py-1', 'python-shores', 'Variables & Types', 'Variables', 'Learn variable binding and primitive datatypes.', 'Easy', 50, 10, 1),
('t-py-2', 'python-shores', 'Conditionals & Logic', 'Control Flow', 'Branch logic using if-elif-else statements.', 'Easy', 60, 12, 2),
('t-py-3', 'python-shores', 'String Slicing', 'Strings', 'Slice, reverse, and manipulate string tokens.', 'Easy', 75, 15, 3),
('t-py-4', 'python-shores', 'List Basics', 'Lists', 'Create, index, and mutate Python lists.', 'Easy', 80, 15, 4),
('t-py-5', 'python-shores', 'Boss: Island Gatekeeper', 'Syntax Mastery', 'Combine types, flow, and functions to capture the harbor.', 'Medium', 150, 30, 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quests (id, title, description, target_count, xp_reward, crystal_reward, quest_type) VALUES
('q1', 'Complete 3 Practice Problems', 'Solve any 3 algorithms in the Practice Lab', 3, 100, 20, 'solve_problems'),
('q2', 'Capture 1 New Territory', 'Conquer an uncharted territory node on the Island Map', 1, 150, 25, 'capture_territory'),
('q3', 'Participate in 1 Island Clash', 'Enter a multiplayer clash duel and battle for the flag', 1, 120, 15, 'clash_battle')
ON CONFLICT (id) DO NOTHING;
