-- Migration: Add Professional Categories and Extend Profiles
-- Created at: 2026-01-10

-- 1. Create professional_categories table
create table if not exists public.professional_categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. RLS for Categories
alter table public.professional_categories enable row level security;

-- Public read access
create policy "Categories are viewable by everyone" 
on public.professional_categories for select using (true);

-- Admin write access (Assuming admin has role 'admin' in profiles or auth metadata)
-- For simplicity, allowing authenticated users with role 'admin' via checking profiles table logic or app metadata
-- Here we use a generic check, assuming the app enforces admin logic via UI/API for mutations
create policy "Admins can manage categories" 
on public.professional_categories for all 
using (
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);

-- 3. Seed Initial Categories (Organized List)
insert into public.professional_categories (name) values 
('Eletricista'),
('Encanador'),
('Pedreiro'),
('Pintor'),
('Jardineiro'),
('Manicure / Pedicure'),
('Cabelereiro(a)'),
('Limpeza / Diarista'),
('Babá'),
('Cuidador de Idosos'),
('Professor Particular'),
('Personal Trainer'),
('Mecânico'),
('Chaveiro'),
('Montador de Móveis'),
('Outros')
on conflict (name) do nothing;

-- 4. Extend Profiles Table
do $$ 
begin
    -- Add phone if not exists
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'phone') then
        alter table public.profiles add column phone text;
    end if;

    -- Add company_name if not exists
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'company_name') then
        alter table public.profiles add column company_name text;
    end if;

    -- Add address if not exists
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'address') then
        alter table public.profiles add column address text;
    end if;
end $$;
