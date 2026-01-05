-- 1. Create App Settings Table
CREATE TABLE IF NOT EXISTS public.app_settings (
    key text PRIMARY KEY,
    value text,
    description text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Trial Days (Only if not exists)
INSERT INTO public.app_settings (key, value, description)
VALUES ('professional_trial_days', '7', 'Número de dias de teste grátis para novos profissionais')
ON CONFLICT (key) DO NOTHING;

-- 2. Create Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id serial PRIMARY KEY,
    name text NOT NULL,
    price text NOT NULL,
    features text[] DEFAULT '{}',
    color text DEFAULT 'bg-purple-600',
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Only One Professional Plan
DELETE FROM public.plans; -- Ensure we only have one
INSERT INTO public.plans (name, price, features, color)
VALUES 
('Morador Pro', 'R$ 29,90', '{"Sem anúncios", "Agenda Automática", "Suporte Prioritário", "Selo de Verificação"}', 'bg-purple-600');

-- 3. Update Profiles Table
DO $$ 
BEGIN 
    -- Add is_free column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_free') THEN
        ALTER TABLE public.profiles ADD COLUMN is_free boolean DEFAULT false;
    END IF;
END $$;

-- 4. Enable RLS for new tables
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public can read settings" ON public.app_settings;
CREATE POLICY "Public can read settings" ON public.app_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read plans" ON public.plans;
CREATE POLICY "Public can read plans" ON public.plans FOR SELECT USING (true);
