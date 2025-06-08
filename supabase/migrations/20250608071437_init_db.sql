-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    website TEXT,
    location TEXT,
    theme TEXT DEFAULT 'light'
);

CREATE TABLE IF NOT EXISTS case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    overview TEXT,
    challenge TEXT,
    solution TEXT,
    outcome TEXT,
    tools TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    duration TEXT,
    role TEXT,
    team_size INTEGER,
    cover_image TEXT,
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    live_url TEXT,
    github_url TEXT,
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS timelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    case_study_id UUID REFERENCES case_studies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    page_path TEXT NOT NULL,
    visitor_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_case_studies_user_id ON case_studies(user_id);
CREATE INDEX IF NOT EXISTS idx_timeline_case_study_id ON timelines(case_study_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Public case studies are viewable by everyone"
    ON case_studies FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own case studies"
    ON case_studies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case studies"
    ON case_studies FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own case studies"
    ON case_studies FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Timeline items are viewable by everyone"
    ON timelines FOR SELECT
    USING (true);

CREATE POLICY "Users can manage timelines items for their case studies"
    ON timelines FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM case_studies
            WHERE case_studies.id = timelines.case_study_id
            AND case_studies.user_id = auth.uid()
        )
    );

CREATE POLICY "Analytics are viewable by their owners"
    ON analytics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics"
    ON analytics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_case_studies
    BEFORE UPDATE ON case_studies
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
