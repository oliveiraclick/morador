-- Fix RLS policy for condos to ensure admins can delete
-- The previous policy might have failed due to enum casing ('admin' vs 'ADMIN')

ALTER TABLE public.condos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admins full access" ON public.condos;

CREATE POLICY "Allow admins full access" ON public.condos
FOR ALL
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE role::text ILIKE 'admin' 
    OR role::text ILIKE 'ADMIN'
  )
);
