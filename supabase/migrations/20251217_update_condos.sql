-- Add missing columns to condos table
alter table public.condos 
add column if not exists units int default 0,
add column if not exists manager text,
add column if not exists status text default 'active'; -- active/inactive

-- Update RLS to allow Admins to manage condos
alter table public.condos enable row level security;

-- Drop existing policies to avoid errors
drop policy if exists "Condos are viewable by everyone" on public.condos;
drop policy if exists "Authenticated users can manage condos" on public.condos;

-- Re-create Policies
create policy "Condos are viewable by everyone"
on public.condos for select
using (true);

create policy "Authenticated users can manage condos"
on public.condos for all
to authenticated
using (true);
