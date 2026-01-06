-- =====================================================
-- FIX: CAPTURA DE AVATAR E MELHORIA NO TRIGGER (2026-01-06)
-- Adiciona suporte para avatar_url e picture do metadado.
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  user_full_name text;
  final_condo_id uuid;
  user_role_val user_role;
  raw_role text;
  user_avatar text;
BEGIN
  -- Log de início
  INSERT INTO public.system_logs (event_type, details)
  VALUES ('TRIGGER_SIGNUP_START', jsonb_build_object('user_id', new.id, 'email', new.email, 'metadata', new.raw_user_meta_data));

  -- 1. Extração segura do nome
  user_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'name',
    'Usuário'
  );

  -- 2. Extração segura do avatar (Suporta Google e outros)
  user_avatar := COALESCE(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture'
  );
  
  -- 3. Tratamento seguro do condo_id
  BEGIN
    IF (new.raw_user_meta_data->>'condo_id') ~ '^[0-9a-fA-F-]{36}$' THEN
       final_condo_id := (new.raw_user_meta_data->>'condo_id')::uuid;
    ELSE
       final_condo_id := NULL;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    final_condo_id := NULL;
  END;

  -- 4. Tratamento do Role
  raw_role := LOWER(COALESCE(new.raw_user_meta_data->>'role', 'resident'));
  IF raw_role = 'professional' THEN
    user_role_val := 'professional'::user_role;
  ELSIF raw_role = 'admin' THEN
    user_role_val := 'admin'::user_role;
  ELSE
    user_role_val := 'resident'::user_role;
  END IF;

  -- 5. Inserção / Atualização
  BEGIN
      INSERT INTO public.profiles (
        id, email, full_name, role, condo_id, unit, status, phone, avatar_url
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
        new.raw_user_meta_data->>'phone',
        user_avatar
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        condo_id = COALESCE(EXCLUDED.condo_id, profiles.condo_id),
        unit = COALESCE(EXCLUDED.unit, profiles.unit),
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        updated_at = now();
        
      INSERT INTO public.system_logs (event_type, details)
      VALUES ('TRIGGER_SIGNUP_SUCCESS', jsonb_build_object('user_id', new.id));
      
  EXCEPTION WHEN OTHERS THEN
      INSERT INTO public.system_logs (event_type, details)
      VALUES ('TRIGGER_SIGNUP_ERROR', jsonb_build_object('user_id', new.id, 'error', SQLERRM));
      RETURN new;
  END;
    
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
