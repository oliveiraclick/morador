-- Update handle_new_user to populate all profile fields from metadata
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    condo_id, 
    unit, 
    avatar_url
  )
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'resident'),
    (new.raw_user_meta_data->>'condo_id')::uuid,
    new.raw_user_meta_data->>'unit',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = excluded.role,
    condo_id = excluded.condo_id,
    unit = excluded.unit,
    avatar_url = excluded.avatar_url;
  return new;
end;
$$ language plpgsql security definer;
