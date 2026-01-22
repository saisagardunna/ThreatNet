-- Create profiles table for user names
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Create reviews table (if not exists)
CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" 
    ON reviews FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can insert reviews" 
    ON reviews FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Create community_messages table for real-time chat
CREATE TABLE IF NOT EXISTS community_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;

-- Community messages policies
CREATE POLICY "Messages are viewable by authenticated users" 
    ON community_messages FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert messages" 
    ON community_messages FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_messages_created_at ON community_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- Create threat_analyses table to store all analysis results
CREATE TABLE IF NOT EXISTS threat_analyses (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    user_email TEXT NOT NULL,
    input_text TEXT NOT NULL,
    prediction TEXT NOT NULL,
    confidence FLOAT NOT NULL,
    mitigation JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE threat_analyses ENABLE ROW LEVEL SECURITY;

-- Threat analyses policies
CREATE POLICY "Users can view their own analyses" 
    ON threat_analyses FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert analyses" 
    ON threat_analyses FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Admins can view all analyses
CREATE POLICY "Admins can view all analyses" 
    ON threat_analyses FOR SELECT 
    USING (auth.jwt() ->> 'email' = 'admin@threatnet.com');

-- Create index for threat analyses
CREATE INDEX IF NOT EXISTS idx_threat_analyses_created_at ON threat_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threat_analyses_user_id ON threat_analyses(user_id);

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON reviews TO authenticated;
GRANT ALL ON community_messages TO authenticated;
GRANT ALL ON threat_analyses TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
