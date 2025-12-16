-- Add missing columns to condos table
ALTER TABLE public.condos 
ADD COLUMN IF NOT EXISTS units INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS manager TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Enable RLS
ALTER TABLE public.condos ENABLE ROW LEVEL SECURITY;

-- Allow public read access (residents need to see the list)
CREATE POLICY "Allow public read access" ON public.condos
FOR SELECT USING (true);

-- Allow admins full access (insert, update, delete)
CREATE POLICY "Allow admins full access" ON public.condos
FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'ADMIN'
  )
);
