-- Add phone column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Refresh schema cache (notify PostgREST)
NOTIFY pgrst, 'reload schema';
