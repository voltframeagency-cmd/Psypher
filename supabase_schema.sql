-- PSYPHER INTELLIGENCE ENGINE: DATABASE SCHEMA
-- Version: 1.0.0
-- Purpose: Production-grade data persistence for psychological assessments and AI-generated reports.

-- 1. PROFILES (Anonymized or Authenticated)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ASSESSMENTS (Raw Data)
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('quick', 'deep', 'full_decode')),
    raw_answers JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 3. REPORTS (Derived Data & AI Output)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE UNIQUE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Scoring Metrics (Normalized 1-100)
    scores JSONB NOT NULL, -- { bfi: {}, darkTriad: {}, attachment: {} }
    
    -- AI Generated Content
    content_text TEXT NOT NULL,
    
    -- Metadata
    model_version TEXT DEFAULT 'gemini-1.5-pro',
    is_unlocked BOOLEAN DEFAULT false, -- Paywall status
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ROW LEVEL SECURITY (RLS)
-- Profiles: Users can only see their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Assessments: Only creator can see their assessments
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assessments." ON public.assessments FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own assessments." ON public.assessments FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Reports: Only creator can see their reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reports." ON public.reports FOR SELECT USING (auth.uid() = profile_id);

-- 5. HELPER FUNCTIONS
-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
