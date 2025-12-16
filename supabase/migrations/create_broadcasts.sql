-- Create broadcasts table
create table if not exists public.broadcasts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  message text not null,
  target text not null check (target in ('all', 'residents', 'professionals')),
  active boolean default true
);

-- Enable RLS
alter table public.broadcasts enable row level security;

-- Policies
create policy "Admins can insert broadcasts"
  on public.broadcasts for insert
  with check (true); -- Ideally restrict to admin role if you have it, keeping it open for now for demo

create policy "Admins can update broadcasts"
  on public.broadcasts for update
  using (true);

create policy "Everyone can read broadcasts"
  on public.broadcasts for select
  using (true);
