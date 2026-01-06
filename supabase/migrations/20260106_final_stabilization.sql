-- =====================================================
-- ESTABILIZAÇÃO FINAL DO BANCO DE DADOS (2026-01-06)
-- Unifica a lógica do trigger e garante RLS correto.
-- =====================================================

-- 1. Tabela de Logs do Sistema (Para debug profundo)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type text NOT NULL,
    details jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Garantir tipos Enums (se não existirem)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('resident', 'professional', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('pending', 'active', 'blocked');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Garantir coluna phone
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- 3. Função handle_new_user Refatorada e Robusta
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  user_full_name text;
  final_condo_id uuid;
  user_role_val user_role;
  raw_role text;
BEGIN
  -- Log de início (ajuda muito se algo falhar silenciosamente)
  INSERT INTO public.system_logs (event_type, details)
  VALUES ('TRIGGER_SIGNUP_START', jsonb_build_object('user_id', new.id, 'email', new.email, 'metadata', new.raw_user_meta_data));

  -- Extração segura do nome
  user_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'name',
    'Usuário'
  );
  
  -- Tratamento seguro do condo_id (Regex para garantir que é um UUID válido)
  BEGIN
    IF (new.raw_user_meta_data->>'condo_id') ~ '^[0-9a-fA-F-]{36}$' THEN
       final_condo_id := (new.raw_user_meta_data->>'condo_id')::uuid;
    ELSE
       final_condo_id := NULL;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    final_condo_id := NULL;
  END;

  -- Tratamento do Role (Normalização)
  raw_role := LOWER(COALESCE(new.raw_user_meta_data->>'role', 'resident'));
  IF raw_role = 'professional' THEN
    user_role_val := 'professional'::user_role;
  ELSIF raw_role = 'admin' THEN
    user_role_val := 'admin'::user_role;
  ELSE
    user_role_val := 'resident'::user_role;
  END IF;

  -- Inserção com ON CONFLICT (idempotente)
  BEGIN
      INSERT INTO public.profiles (
        id, email, full_name, role, condo_id, unit, status, phone
      )
      VALUES (
        new.id, 
        new.email, 
        user_full_name,
        user_role_val,
        final_condo_id,
        new.raw_user_meta_data->>'unit',
        CASE 
          WHEN user_role_val = 'professional' THEN 'pending'::user_status 
          ELSE 'active'::user_status 
        END,
        new.raw_user_meta_data->>'phone'
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        condo_id = COALESCE(EXCLUDED.condo_id, profiles.condo_id),
        unit = COALESCE(EXCLUDED.unit, profiles.unit),
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        updated_at = now();
        
      INSERT INTO public.system_logs (event_type, details)
      VALUES ('TRIGGER_SIGNUP_SUCCESS', jsonb_build_object('user_id', new.id));
      
  EXCEPTION WHEN OTHERS THEN
      INSERT INTO public.system_logs (event_type, details)
      VALUES ('TRIGGER_SIGNUP_ERROR', jsonb_build_object('user_id', new.id, 'error', SQLERRM, 'detail', SQLSTATE));
      -- Crítico: Retornar NEW para não travar o Auth do Supabase!
      RETURN new;
  END;
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-vincular o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Políticas de RLS de Segurança e Acesso
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permissões básicas
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles 
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Garantir que anon e authenticated possam ler (importante para o fetch inicial)
GRANT SELECT ON public.profiles TO authenticated, anon;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
