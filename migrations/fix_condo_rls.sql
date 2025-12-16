-- Enable RLS on Condos
alter table public.condos enable row level security;

-- Allow read for everyone (so users can select condo)
drop policy if exists "Condos are viewable by everyone" on public.condos;
create policy "Condos are viewable by everyone" on public.condos for select using (true);

-- Allow Insert/Update/Delete for authenticated users (TEMPORARY: ideally should be Admin only)
-- Since we are simplifying auth, allowing logged users to manage for now to fix the bug quickly.
drop policy if exists "Authenticated users can manage condos" on public.condos;
create policy "Authenticated users can manage condos" on public.condos for all using (auth.role() = 'authenticated');
