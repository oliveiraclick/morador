-- Create appointments table
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  professional_id uuid references auth.users(id) not null,
  resident_id uuid references auth.users(id), -- Nullable if added manually by pro
  client_name text not null, -- Manual name or copied from resident profile
  service_title text not null,
  date date not null,
  start_time time not null,
  end_time time,
  status text not null default 'AGENDADO' check (status in ('AGENDADO', 'CONCLUIDO', 'CANCELADO', 'BLOQUEADO')),
  condo_id uuid
);

-- Enable RLS
alter table public.appointments enable row level security;

-- Policies

-- Professional can view their own appointments
create policy "Professionals can view own appointments"
  on public.appointments for select
  using (auth.uid() = professional_id);

-- Professional can insert appointments
create policy "Professionals can insert appointments"
  on public.appointments for insert
  with check (auth.uid() = professional_id);

-- Professional can update own appointments
create policy "Professionals can update own appointments"
  on public.appointments for update
  using (auth.uid() = professional_id);

-- Professional can delete (cancel) own appointments
create policy "Professionals can delete own appointments"
  on public.appointments for delete
  using (auth.uid() = professional_id);
