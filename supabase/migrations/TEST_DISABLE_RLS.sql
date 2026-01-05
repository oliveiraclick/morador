-- =====================================================
-- TESTE EXTREMO: DESABILITAR RLS PARA PROFILES
-- RODAR NO SUPABASE > SQL EDITOR
-- ⚠️ APENAS PARA TESTE - NÃO USAR EM PRODUÇÃO PERMANENTE
-- =====================================================

-- OPÇÃO 1: Desabilitar RLS completamente para a tabela profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Verificar se foi desabilitado
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';
