-- Add missing columns to condos table
ALTER TABLE public.condos 
ADD COLUMN IF NOT EXISTS units INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS manager TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Enable RLS
ALTER TABLE public.condos ENABLE ROW LEVEL SECURITY;

-- Allow public read access (residents need to see the list)
DROP POLICY IF EXISTS "Allow public read access" ON public.condos;
CREATE POLICY "Allow public read access" ON public.condos
FOR SELECT USING (true);

-- Allow admins full access (insert, update, delete)
-- Casting 'admin' to user_role enum if necessary, or just using the string if postgres handles it.
-- Based on the error, the value must be one of the enum labels. Trying lowercase 'admin'.
DROP POLICY IF EXISTS "Allow admins full access" ON public.condos;
CREATE POLICY "Allow admins full access" ON public.condos
FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'::user_role
    -- OR just role = 'admin' if explicit cast isn't needed but value matches
  )
);
