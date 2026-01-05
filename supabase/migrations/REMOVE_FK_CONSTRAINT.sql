-- =====================================================
-- REMOVER FK CONSTRAINT TEMPORARIAMENTE PARA TESTE
-- RODAR NO SUPABASE > SQL EDITOR
-- =====================================================

-- 1. Ver todas as constraints da tabela profiles
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass;

-- 2. REMOVER a FK constraint que está bloqueando
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Verificar se foi removida
SELECT conname FROM pg_constraint WHERE conrelid = 'public.profiles'::regclass;

-- NOTA: Depois de confirmar que funciona, podemos recriar com:
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey 
--   FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
