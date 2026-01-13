-- 1. Add is_public column (default false)
ALTER TABLE public.frameworks ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- 2. Drop existing SELECT policy (which was "Users can view their own frameworks")
DROP POLICY IF EXISTS "Users can view their own frameworks" ON public.frameworks;

-- 3. Create new SELECT policy (Own OR Public)
CREATE POLICY "Users can view their own or public frameworks" ON public.frameworks FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);

-- 4. Create Index on is_public for performance
CREATE INDEX IF NOT EXISTS idx_frameworks_is_public ON public.frameworks(is_public);

-- 5. (Optional but recommended) Update existing RLS policies for consistency
-- Ensure UPDATE/DELETE are still restricted to owner only (which they are by default policies created in 001, but good to double check)
-- "Users can update their own frameworks" USING (auth.uid() = user_id) -> Remains valid. Public frameworks clearly shouldn't be editable by everyone.
