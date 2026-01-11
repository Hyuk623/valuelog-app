-- 003_hardening.sql
-- ValueLog Hardening Migration
-- Assumption: This script is either run on an empty database or existing records have valid foreign keys.

-- 1. Tighten public.children
-- Set NOT NULL if not already set (Manual check or assuming empty/clean data)
-- NOTE: If data exists, ensure user_id is populated before running.
DO $$ 
BEGIN
  ALTER TABLE public.children ALTER COLUMN user_id SET NOT NULL;
EXCEPTION
  WHEN others THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_children_user_id ON public.children(user_id);

-- Reinforce RLS for children (FOR ALL)
DROP POLICY IF EXISTS "Users can manage their own children" ON public.children;
DROP POLICY IF EXISTS "Users can view their own children" ON public.children;
DROP POLICY IF EXISTS "Users can insert their own children" ON public.children;
DROP POLICY IF EXISTS "Users can update their own children" ON public.children;
DROP POLICY IF EXISTS "Users can delete their own children" ON public.children;

CREATE POLICY "Users can manage their own children"
ON public.children
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);


-- 2. Tighten public.experiences
DO $$ 
BEGIN
  ALTER TABLE public.experiences ALTER COLUMN user_id SET NOT NULL;
  ALTER TABLE public.experiences ALTER COLUMN child_id SET NOT NULL;
EXCEPTION
  WHEN others THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_experiences_user_id ON public.experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_child_id ON public.experiences(child_id);

-- GIN Indexes for tags (Idempotent)
CREATE INDEX IF NOT EXISTS idx_experiences_tags_category ON public.experiences USING GIN (tags_category);
CREATE INDEX IF NOT EXISTS idx_experiences_tags_competency ON public.experiences USING GIN (tags_competency);

-- FK CASCADE (Idempotent drop and recreate)
-- NOTE: This will delete experiences if the linked child is deleted. This is intended behavior.
ALTER TABLE public.experiences
  DROP CONSTRAINT IF EXISTS experiences_child_id_fkey,
  ADD CONSTRAINT experiences_child_id_fkey
    FOREIGN KEY (child_id)
    REFERENCES public.children(id)
    ON DELETE CASCADE;

-- Reinforce RLS for experiences
DROP POLICY IF EXISTS "Users can view their own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can insert their own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can update their own experiences" ON public.experiences;
DROP POLICY IF EXISTS "Users can delete their own experiences" ON public.experiences;

CREATE POLICY "Users can manage their own experiences"
ON public.experiences
FOR ALL
TO authenticated
USING (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM public.children c WHERE c.id = child_id AND c.user_id = auth.uid())
)
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM public.children c WHERE c.id = child_id AND c.user_id = auth.uid())
);


-- 3. Storage Hardening (experience-images)
-- Strictly isolated to 'experience-images' bucket
DROP POLICY IF EXISTS "Users can upload their own experience images" ON storage.objects;
CREATE POLICY "Users can upload their own experience images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'experience-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can view their own experience images" ON storage.objects;
CREATE POLICY "Users can view their own experience images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'experience-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete their own experience images" ON storage.objects;
CREATE POLICY "Users can delete their own experience images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'experience-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
