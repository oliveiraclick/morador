-- 1. Fix handle_new_user trigger casting bug (Address persistence fix)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    condo_id, 
    unit, 
    avatar_url
  )
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'resident'),
    -- Fix: Cast to bigint with NULL handle
    (NULLIF(new.raw_user_meta_data->>'condo_id', ''))::bigint,
    new.raw_user_meta_data->>'unit',
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = excluded.full_name,
    role = excluded.role,
    condo_id = excluded.condo_id,
    unit = excluded.unit,
    avatar_url = excluded.avatar_url;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enhance Profiles RLS (Fix 'Erro ao salvar' / Hanging updates)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public Read Access" ON public.profiles;
CREATE POLICY "Public Read Access" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Fix Marketplace RLS (Fix 'Não salva produto')
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can see items" ON public.marketplace_items;
CREATE POLICY "Anyone can see items" ON public.marketplace_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create items" ON public.marketplace_items;
CREATE POLICY "Users can create items" ON public.marketplace_items FOR INSERT WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can update own items" ON public.marketplace_items;
CREATE POLICY "Users can update own items" ON public.marketplace_items FOR UPDATE USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can delete own items" ON public.marketplace_items;
CREATE POLICY "Users can delete own items" ON public.marketplace_items FOR DELETE USING (auth.uid() = seller_id);
