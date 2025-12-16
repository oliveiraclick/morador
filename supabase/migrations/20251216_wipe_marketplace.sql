-- Wipe all marketplace items to ensure no mocks remain
TRUNCATE TABLE public.marketplace_items RESTART IDENTITY CASCADE;

-- Re-enable RLS just in case
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
