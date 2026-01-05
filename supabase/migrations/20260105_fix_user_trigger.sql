-- Migração para corrigir o gatilho de novos usuários e garantir persistência de dados
-- 20260105_fix_user_trigger.sql

create or replace function public.handle_new_user() 
returns trigger as $$
declare
  user_full_name text;
begin
  -- Pega o nome de diferentes chaves possíveis no metadata
  user_full_name := coalesce(
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'name',
    'Morador'
  );
  
  insert into public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    condo_id, 
    unit,
    profession,
    service_history,
    status
  )
  values (
    new.id, 
    new.email, 
    user_full_name,
    coalesce(nullif(lower(new.raw_user_meta_data->>'role'), '')::user_role, 'resident'),
    case 
      when (new.raw_user_meta_data->>'condo_id') is not null and (new.raw_user_meta_data->>'condo_id') <> ''
      then (new.raw_user_meta_data->>'condo_id')::uuid 
      else null 
    end,
    new.raw_user_meta_data->>'unit',
    new.raw_user_meta_data->>'profession',
    new.raw_user_meta_data->>'service_history',
    case 
      when (new.raw_user_meta_data->>'role') = 'professional' then 'pending'::user_status
      else 'active'::user_status
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    role = coalesce(excluded.role, profiles.role),
    condo_id = coalesce(excluded.condo_id, profiles.condo_id),
    unit = coalesce(excluded.unit, profiles.unit),
    profession = coalesce(excluded.profession, profiles.profession),
    service_history = coalesce(excluded.service_history, profiles.service_history),
    updated_at = now();
    
  return new;
end;
$$ language plpgsql security definer;

-- Recriar o trigger para garantir que ele aponte para a função atualizada
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
