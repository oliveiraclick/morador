-- EMERGENCY FIX: ULTIMATE FAILSAFE TRIGGER
-- Este script REESCREVE a função de criar usuário de forma que ela NUNCA falhe.
-- Se der erro ao criar o perfil, ele ignora o erro e deixa o usuário ser criado no Auth.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role text;
BEGIN
  -- Tenta executar a lógica principal
  BEGIN
    -- 1. Tenta pegar o role (sem arriscar travar por JSON mal formatado)
    BEGIN
        default_role := new.raw_user_meta_data->>'role';
    EXCEPTION WHEN OTHERS THEN
        default_role := 'resident'; -- Fallback seguro
    END;

    IF default_role IS NULL OR default_role = '' THEN
        default_role := 'resident';
    END IF;

    -- 2. Tenta inserir no Profile (com Conflict Do Nothing para evitar erro de duplicação)
    INSERT INTO public.profiles (
        id, 
        email, 
        role, 
        full_name, 
        avatar_url,
        status,
        created_at,
        updated_at
    )
    VALUES (
        new.id,
        new.email,
        default_role,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
        COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
        'active',
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        updated_at = now();

  EXCEPTION WHEN OTHERS THEN
    -- SE DER QUALQUER ERRO, LOGA NO CONSOLE DO POSTGRES E CONTINUA
    -- ISSO IMPEDE O "DATABASE ERROR SAVING NEW USER"
    RAISE WARNING 'Erro no trigger handle_new_user: %', SQLERRM;
  END;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garante que o trigger está ativo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
