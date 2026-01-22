-- ============================================
-- THREATNET SUPABASE SETUP - RUN THIS ENTIRE FILE
-- ============================================
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- Then click RUN

-- 1. CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;

CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. CREATE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Reviews viewable by all" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated can insert reviews" ON public.reviews;

CREATE POLICY "Reviews viewable by all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);

-- 3. CREATE COMMUNITY MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.community_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Messages viewable by authenticated" ON public.community_messages;
DROP POLICY IF EXISTS "Authenticated can send messages" ON public.community_messages;

CREATE POLICY "Messages viewable by authenticated" ON public.community_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can send messages" ON public.community_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 4. CREATE THREAT ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.threat_analyses (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user_email TEXT NOT NULL,
    input_text TEXT NOT NULL,
    prediction TEXT NOT NULL,
    confidence FLOAT NOT NULL,
    mitigation JSONB NOT NULL,
    message_type TEXT DEFAULT 'email',
    spam_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.threat_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own analyses" ON public.threat_analyses;
DROP POLICY IF EXISTS "Authenticated insert analyses" ON public.threat_analyses;
DROP POLICY IF EXISTS "Admins view all analyses" ON public.threat_analyses;

CREATE POLICY "Users view own analyses" ON public.threat_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated insert analyses" ON public.threat_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all analyses" ON public.threat_analyses FOR SELECT USING (auth.jwt() ->> 'email' = 'admin@threatnet.com');

-- 5. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_reviews_created ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_created ON public.community_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_threat_created ON public.threat_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threat_user ON public.threat_analyses(user_id);

-- 6. GRANT PERMISSIONS
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.reviews TO authenticated;
GRANT ALL ON public.community_messages TO authenticated;
GRANT ALL ON public.threat_analyses TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 7. VERIFY TABLES CREATED
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'reviews', 'community_messages', 'threat_analyses')
ORDER BY tablename;

-- SUCCESS MESSAGE
DO $$
BEGIN
    RAISE NOTICE '✅ ALL TABLES CREATED SUCCESSFULLY!';
    RAISE NOTICE 'Tables created: profiles, reviews, community_messages, threat_analyses';
    RAISE NOTICE 'Next step: Go to Database > Replication and enable Realtime for community_messages';
END $$;
