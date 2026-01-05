-- =====================================================
-- DESABILITAR RLS PARA STORAGE AVATARS
-- RODAR NO SUPABASE > SQL EDITOR
-- =====================================================

-- 1. Remover políticas existentes do bucket avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "avatars_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatars_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatars_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete_policy" ON storage.objects;

-- 2. Permitir TUDO para o bucket avatars (teste)
CREATE POLICY "Allow all for avatars"
ON storage.objects FOR ALL
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- 3. Verificar se o bucket existe
SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Se não existir, criar:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
