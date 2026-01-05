-- =====================================================
-- GATILHO DE CADASTRO À PROVA DE FALHAS (FAILSAFE)
-- RODAR NO SUPABASE > SQL EDITOR
-- =====================================================

create or replace function public.handle_new_user() 
returns trigger as $$
declare
  user_full_name text;
  final_condo_id uuid;
begin
  -- 1. Extração segura do nome
  user_full_name := coalesce(
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'name',
    'Morador'
  );
  
  -- 2. Tratamento seguro do condo_id (Regex para evitar erro de cast)
  begin
    if (new.raw_user_meta_data->>'condo_id') ~ '^[0-9a-fA-F-]{36}$' then
       final_condo_id := (new.raw_user_meta_data->>'condo_id')::uuid;
    else
       final_condo_id := null;
    end if;
  exception when others then
    final_condo_id := null;
  end;

  -- 3. Inserção com tratamento de exceção
  begin
      insert into public.profiles (
        id, email, full_name, role, condo_id, unit, status
      )
      values (
        new.id, 
        new.email, 
        user_full_name,
        coalesce(nullif(lower(new.raw_user_meta_data->>'role'), '')::user_role, 'resident'),
        final_condo_id,
        new.raw_user_meta_data->>'unit',
        case 
          when (new.raw_user_meta_data->>'role') = 'professional' then 'pending'::user_status 
          else 'active'::user_status 
        end
      )
      on conflict (id) do update set
        email = excluded.email,
        full_name = coalesce(excluded.full_name, profiles.full_name),
        condo_id = coalesce(excluded.condo_id, profiles.condo_id),
        unit = coalesce(excluded.unit, profiles.unit),
        updated_at = now();
  exception when others then
      -- CRÍTICO: Se houver erro (conflito de email, etc), NÃO trava o cadastro no Auth.
      -- O frontend já faz o fallback manual se o perfil não aparecer.
      return new;
  end;
    
  return new;
end;
$$ language plpgsql security definer;

-- Recriar o trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
