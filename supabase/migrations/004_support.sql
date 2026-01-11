-- 004_support.sql
-- Support Inquiries Table

CREATE TABLE IF NOT EXISTS public.support_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_inquiries ENABLE ROW LEVEL SECURITY;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_support_inquiries_user_id ON public.support_inquiries(user_id);

-- RLS Policies
DROP POLICY IF EXISTS "Users can insert their own inquiries" ON public.support_inquiries;
CREATE POLICY "Users can insert their own inquiries"
ON public.support_inquiries
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own inquiries" ON public.support_inquiries;
CREATE POLICY "Users can view their own inquiries"
ON public.support_inquiries
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- GIN index for search if needed later
-- CREATE INDEX IF NOT EXISTS idx_support_inquiries_content ON public.support_inquiries USING GIN (to_tsvector('english', subject || ' ' || message));
