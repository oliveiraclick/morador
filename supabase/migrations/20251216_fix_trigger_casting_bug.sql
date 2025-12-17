-- Fix handle_new_user trigger to cast condo_id to bigint instead of uuid
-- Also handles the case where condo_id might be missing (Google Auth)

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
    -- Fix: Cast to bigint. Handle empty string or null gracefully if possible, though casting null is fine.
    -- If raw_user_meta_data->>'condo_id' is an empty string, NULLIF makes it NULL, which casts to NULL bigint.
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
