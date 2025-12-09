/* ADMINS Table */
create table if not exists public.admins (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* RLS Policies */
alter table public.admins enable row level security;

/* Permitir leitura para todos */
select create_policy_if_not_exists('Admins are viewable by everyone', 'admins', 'select', ARRAY['public'], 'true', null);

/* Permitir inserção pela aplicação (CORRIGIDO: INSERT aceita apenas WITH CHECK, passar null no using_expr) */
select create_policy_if_not_exists('Admins can be inserted by public', 'admins', 'insert', ARRAY['public'], null, 'true');

/* Permitir deleção pela aplicação */
select create_policy_if_not_exists('Admins can be deleted by public', 'admins', 'delete', ARRAY['public'], 'true', null);

/* Inserir o Super Admin Inicial */
insert into public.admins (email, full_name)
values ('denys@morador.app', 'Super Admin')
on conflict (email) do nothing;
