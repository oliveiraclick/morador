-- CORRECTED: Cast to UUID, not BIGINT
-- The previous script assumed condo_id was a number, but the schema uses UUIDs.
-- This script fixes the Type Mismatch error.

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
    -- Fix: Cast to UUID. Handle empty string gracefully.
    (NULLIF(new.raw_user_meta_data->>'condo_id', ''))::uuid,
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
