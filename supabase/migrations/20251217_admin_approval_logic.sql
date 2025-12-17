-- 1. Add require_approval column to condos
alter table public.condos 
add column if not exists require_approval boolean default true;

-- 2. Update the handle_new_user function to respect the condo setting
create or replace function public.handle_new_user() 
returns trigger as $$
declare
  user_condo_id uuid;
  user_unit text;
  user_role public.user_role;
  approval_needed boolean;
  initial_status public.user_status;
begin
  -- Extract metadata
  user_condo_id := (new.raw_user_meta_data->>'condo_id')::uuid;
  user_unit := new.raw_user_meta_data->>'unit';
  
  -- Cast explicit string to enum type
  begin
    user_role := (new.raw_user_meta_data->>'role')::public.user_role;
  exception when others then
    user_role := 'resident'::public.user_role;
  end;

  -- Default to pending
  initial_status := 'pending';

  -- Check condo setting if condo_id exists
  if user_condo_id is not null then
    select require_approval into approval_needed from public.condos where id = user_condo_id;
    
    -- If condo exists and does NOT require approval, set active
    if approval_needed is false then
      initial_status := 'active';
    end if;
  end if;

  -- Insert profile
  insert into public.profiles (id, email, full_name, role, condo_id, unit, status)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    user_role,
    user_condo_id,
    user_unit,
    initial_status
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;
