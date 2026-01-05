-- =====================================================
-- CORREÇÃO EMERGENCIAL: POLICY TOTALMENTE PERMISSIVA
-- RODAR NO SUPABASE > SQL EDITOR
-- =====================================================

-- 1. REMOVER TODAS AS POLÍTICAS EXISTENTES DE PROFILES
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public Read Access" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated can insert profile" ON public.profiles;
DROP POLICY IF EXISTS "Public Access" ON public.profiles;
DROP POLICY IF EXISTS "Individual Access" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- 2. GARANTIR QUE RLS ESTÁ ATIVADO
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICAS SIMPLES E PERMISSIVAS
-- SELECT: Qualquer um pode ler
CREATE POLICY "Anyone can read profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

-- INSERT: TOTALMENTE PERMISSIVO PARA TESTE
CREATE POLICY "Anyone can insert profiles" 
  ON public.profiles FOR INSERT 
  WITH CHECK (true);

-- UPDATE: Usuário só pode atualizar seu próprio perfil
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 4. VERIFICAR SE AS POLÍTICAS FORAM CRIADAS
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';
