-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Frameworks Table
CREATE TABLE public.frameworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    schema JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for frameworks
CREATE INDEX idx_frameworks_user_id ON public.frameworks(user_id);

-- RLS for frameworks
ALTER TABLE public.frameworks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own frameworks" ON public.frameworks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own frameworks" ON public.frameworks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own frameworks" ON public.frameworks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own frameworks" ON public.frameworks FOR DELETE
    USING (auth.uid() = user_id);


-- 2. Children Table
CREATE TABLE public.children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    birth_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for children
CREATE INDEX idx_children_user_id ON public.children(user_id);

-- RLS for children
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own children" ON public.children FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own children" ON public.children FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own children" ON public.children FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own children" ON public.children FOR DELETE
    USING (auth.uid() = user_id);


-- 3. Experiences Table
CREATE TABLE public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE,
    activity_type TEXT,
    location TEXT,
    framework_id UUID REFERENCES public.frameworks(id),
    framework_version INTEGER,
    responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    tags_category TEXT[],
    tags_competency TEXT[],
    satisfaction_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for experiences
CREATE INDEX idx_experiences_user_id ON public.experiences(user_id);
CREATE INDEX idx_experiences_child_id ON public.experiences(child_id);
-- GIN Indexes for tags (Mandatory)
CREATE INDEX idx_experiences_tags_category ON public.experiences USING GIN (tags_category);
CREATE INDEX idx_experiences_tags_competency ON public.experiences USING GIN (tags_competency);

-- RLS for experiences
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own experiences" ON public.experiences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own experiences" ON public.experiences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own experiences" ON public.experiences FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own experiences" ON public.experiences FOR DELETE
    USING (auth.uid() = user_id);
