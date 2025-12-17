-- Create broadcasts table
create table if not exists public.broadcasts (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    message text not null,
    target text default 'all', -- 'all', 'residents', 'professionals'
    read boolean default false, -- maybe used for 'archived' state?
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.broadcasts enable row level security;

-- Public Read (Authenticated users)
create policy "Broadcasts are viewable by authenticated users"
on public.broadcasts for select
to authenticated
using (true);

-- Insert (Authenticated users - ideally Admin only but keeping simple)
create policy "Authenticated users can create broadcasts"
on public.broadcasts for insert
to authenticated
with check (true);
