-- =====================================================
-- MIGRAÇÃO DEFINITIVA: CORREÇÃO DE CADASTRO DE USUÁRIOS
-- RODAR NO PAINEL DO SUPABASE > SQL EDITOR
-- =====================================================

-- 1. Recriar a função do Trigger com tipagem correta
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_full_name text;
BEGIN
  user_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'name',
    'Morador'
  );
  
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    condo_id, 
    unit,
    status
  )
  VALUES (
    new.id, 
    new.email, 
    user_full_name,
    COALESCE(NULLIF(LOWER(new.raw_user_meta_data->>'role'), '')::public.user_role, 'resident'),
    CASE 
      WHEN (new.raw_user_meta_data->>'condo_id') IS NOT NULL AND (new.raw_user_meta_data->>'condo_id') <> ''
      THEN (new.raw_user_meta_data->>'condo_id')::uuid 
      ELSE NULL 
    END,
    new.raw_user_meta_data->>'unit',
    CASE 
      WHEN (new.raw_user_meta_data->>'role') = 'professional' THEN 'pending'::public.user_status
      ELSE 'active'::public.user_status
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    role = COALESCE(EXCLUDED.role, profiles.role),
    condo_id = COALESCE(EXCLUDED.condo_id, profiles.condo_id),
    unit = COALESCE(EXCLUDED.unit, profiles.unit),
    updated_at = NOW();
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Recriar o Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Garantir políticas RLS corretas para profiles
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Public Read Access" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Authenticated can insert profile" ON public.profiles;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- IMPORTANT: More permissive INSERT - just requires authentication, not id match
-- This is needed because auth.uid() may not be available immediately after signUp
CREATE POLICY "Authenticated can insert profile" ON public.profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
