-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Enums (Idempotent approach using DO block)
do $$ begin
    create type user_role as enum ('resident', 'professional', 'admin');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type item_type as enum ('desapego', 'loja');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type user_status as enum ('pending', 'active', 'blocked');
exception
    when duplicate_object then null;
end $$;

-- 2. Condos Table
create table if not exists public.condos (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Initial Condo (Only if table is empty to avoid duplicates)
insert into public.condos (name, address) 
select 'Residencial Flores do Campo', 'Av. Principal, 500'
where not exists (select 1 from public.condos);

-- 3. Profiles Table (Extends auth.users)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key, -- 1:1 with auth.users
    email text unique not null,
    full_name text,
    role user_role default 'resident',
    avatar_url text,
    
    -- Resident specifics
    condo_id uuid references public.condos(id),
    unit text, -- e.g. "Bl A, Ap 101"
    
    -- Professional specifics
    profession text,
    service_history text,
    is_verified boolean default false,
    is_on_site boolean default false,
    is_vacation boolean default false,
    
    -- Status
    status user_status default 'pending',
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Marketplace Items
create table if not exists public.marketplace_items (
    id uuid primary key default uuid_generate_v4(),
    seller_id uuid references public.profiles(id) not null,
    title text not null,
    description text,
    price numeric(10,2) not null,
    image_url text,
    type item_type default 'desapego',
    active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. System Ads (Managed by Admin)
create table if not exists public.ads (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    image_url text,
    link text,
    active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Coupons
create table if not exists public.coupons (
    id uuid primary key default uuid_generate_v4(),
    code text unique not null, -- e.g. "VILA100"
    discount_label text, -- e.g. "100% OFF"
    duration_months int default 1,
    uses_count int default 0,
    active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Subscriptions (For Professionals)
create table if not exists public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) not null,
    status text default 'active', -- active, inactive, past_due
    expires_at timestamp with time zone,
    plan_type text default 'professional',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) - Basic Setup

-- Profiles: Public read (for social features), Self update
alter table public.profiles enable row level security;
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Marketplace: Public read, potential seller update
alter table public.marketplace_items enable row level security;
drop policy if exists "Marketplace items are viewable by everyone" on public.marketplace_items;
create policy "Marketplace items are viewable by everyone" on public.marketplace_items for select using (true);

drop policy if exists "Users can insert own items" on public.marketplace_items;
create policy "Users can insert own items" on public.marketplace_items for insert with check (auth.uid() = seller_id);

drop policy if exists "Users can update own items" on public.marketplace_items;
create policy "Users can update own items" on public.marketplace_items for update using (auth.uid() = seller_id);

-- Ads: Public read, Admin only write (requires admin check logic, omitted for brevity but typically using a claim or profile role)
alter table public.ads enable row level security;
drop policy if exists "Ads are viewable by everyone" on public.ads;
create policy "Ads are viewable by everyone" on public.ads for select using (true);

-- Functions to handle new user signup automatically
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing; -- Prevent duplicate insert
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new auth user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

