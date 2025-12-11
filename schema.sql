/* Enable UUID extension */
create extension if not exists "uuid-ossp";

/* PROFILES (Users) */
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  phone text,
  user_type text check (user_type in ('resident', 'provider')),
  bio text,
  address text,
  condo_name text,
  birth_date date,
  city text,
  state text,
  zip_code text,
  /* Provider specific fields */
  document text,
  provider_type text check (provider_type in ('service', 'product')),
  categories text[],
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* Ensure columns exist if table was already created */
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'document') then
    alter table public.profiles add column document text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'provider_type') then
    alter table public.profiles add column provider_type text check (provider_type in ('service', 'product'));
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'categories') then
    alter table public.profiles add column categories text[];
  end if;
end $$;

/* APP SETTINGS */
create table if not exists public.app_settings (
  id bigint primary key generated always as identity,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* Insert default settings if not exists */
insert into public.app_settings (id, logo_url)
overriding system value
values (1, null)
on conflict (id) do nothing;

/* CATEGORIES */
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  icon text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* SERVICES */
create table if not exists public.services (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.profiles(id) not null,
  category_id uuid references public.categories(id),
  title text not null,
  description text,
  price decimal(10,2),
  duration_minutes integer,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* BOOKINGS */
create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  service_id uuid references public.services(id) not null,
  provider_id uuid references public.profiles(id) not null,
  customer_id uuid references public.profiles(id) not null,
  booking_date date not null,
  booking_time text not null, /* Changed to text to store period ID or time range */
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'pending',
  notes text,
  total_price decimal(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* PRODUCTS (Desapego/Marketplace) */
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  price decimal(10,2) not null,
  category text,
  condition text check (condition in ('new', 'like_new', 'good', 'fair', 'poor')),
  images text[], /* Array of image URLs */
  is_available boolean default true,
  location text,
  /* New columns for Desapego vs Store distinction */
  product_type text check (product_type in ('store', 'desapego')) default 'store',
  contact_phone text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* Ensure new columns exist for products */
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'products' and column_name = 'product_type') then
    alter table public.products add column product_type text check (product_type in ('store', 'desapego')) default 'store';
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'products' and column_name = 'contact_phone') then
    alter table public.products add column contact_phone text;
  end if;
end $$;

/* ORDERS */
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.profiles(id) not null,
  provider_id uuid references public.profiles(id) not null,
  status text check (status in ('new', 'preparing', 'ready', 'completed', 'cancelled')) default 'new',
  total_amount decimal(10,2) not null,
  payment_method text default 'pix',
  delivery_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* ORDER ITEMS */
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null,
  price_at_purchase decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* MESSAGES */
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* REVIEWS */
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  reviewer_id uuid references public.profiles(id) not null,
  reviewed_id uuid references public.profiles(id) not null,
  service_id uuid references public.services(id),
  booking_id uuid references public.bookings(id),
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

/* RLS POLICIES (Row Level Security) */
/* We use DO blocks to avoid errors if policies already exist */

alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.products enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

/* Helper function to create policy if not exists */
create or replace function create_policy_if_not_exists(
    policy_name text,
    table_name text,
    cmd text,
    roles text[],
    using_expr text,
    check_expr text
)
returns void as $$
declare
    exists_policy boolean;
    sql_cmd text;
begin
    select exists (
        select 1 from pg_policies 
        where schemaname = 'public' 
        and tablename = table_name 
        and policyname = policy_name
    ) into exists_policy;

    if not exists_policy then
        sql_cmd := format('create policy %I on public.%I for %s to %s', policy_name, table_name, cmd, array_to_string(roles, ','));
        
        if using_expr is not null then
            sql_cmd := sql_cmd || format(' using (%s)', using_expr);
        end if;
        
        if check_expr is not null then
            sql_cmd := sql_cmd || format(' with check (%s)', check_expr);
        end if;

        execute sql_cmd;
    end if;
end;
$$ language plpgsql;

/* Profiles */
select create_policy_if_not_exists('Public profiles are viewable by everyone', 'profiles', 'select', ARRAY['public'], 'true', null);
/* INSERT policies cannot have USING clause */
select create_policy_if_not_exists('Users can insert their own profile', 'profiles', 'insert', ARRAY['public'], null, 'auth.uid() = id');
select create_policy_if_not_exists('Users can update own profile', 'profiles', 'update', ARRAY['public'], 'auth.uid() = id', null);

/* App Settings */
select create_policy_if_not_exists('App settings are viewable by everyone', 'app_settings', 'select', ARRAY['public'], 'true', null);
select create_policy_if_not_exists('Enable update for all users', 'app_settings', 'update', ARRAY['public'], 'true', 'true');

/* Storage Policies (Branding) */
insert into storage.buckets (id, name, public) values ('branding', 'branding', true) on conflict (id) do update set public = true;

do $$
begin
    if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public Access Branding') then
        create policy "Public Access Branding" on storage.objects for select using ( bucket_id = 'branding' );
    end if;
    if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public Upload Branding') then
        create policy "Public Upload Branding" on storage.objects for insert with check ( bucket_id = 'branding' );
    end if;
    if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public Update Branding') then
        create policy "Public Update Branding" on storage.objects for update using ( bucket_id = 'branding' );
    end if;
end $$;

/* Categories */
select create_policy_if_not_exists('Categories are viewable by everyone', 'categories', 'select', ARRAY['public'], 'true', null);

/* Services */
select create_policy_if_not_exists('Services are viewable by everyone', 'services', 'select', ARRAY['public'], 'true', null);
select create_policy_if_not_exists('Providers can insert their own services', 'services', 'insert', ARRAY['public'], null, 'auth.uid() = provider_id');
select create_policy_if_not_exists('Providers can update their own services', 'services', 'update', ARRAY['public'], 'auth.uid() = provider_id', null);

/* Bookings */
select create_policy_if_not_exists('Users can view their own bookings', 'bookings', 'select', ARRAY['public'], 'auth.uid() = customer_id or auth.uid() = provider_id', null);
select create_policy_if_not_exists('Customers can create bookings', 'bookings', 'insert', ARRAY['public'], null, 'auth.uid() = customer_id');
select create_policy_if_not_exists('Involved parties can update bookings', 'bookings', 'update', ARRAY['public'], 'auth.uid() = customer_id or auth.uid() = provider_id', null);

/* Products */
select create_policy_if_not_exists('Products are viewable by everyone', 'products', 'select', ARRAY['public'], 'true', null);
select create_policy_if_not_exists('Sellers can insert their own products', 'products', 'insert', ARRAY['public'], null, 'auth.uid() = seller_id');
select create_policy_if_not_exists('Sellers can update their own products', 'products', 'update', ARRAY['public'], 'auth.uid() = seller_id', null);

/* Orders */
select create_policy_if_not_exists('Users can view their own orders', 'orders', 'select', ARRAY['public'], 'auth.uid() = customer_id or auth.uid() = provider_id', null);
select create_policy_if_not_exists('Customers can create orders', 'orders', 'insert', ARRAY['public'], null, 'auth.uid() = customer_id');
select create_policy_if_not_exists('Involved parties can update orders', 'orders', 'update', ARRAY['public'], 'auth.uid() = customer_id or auth.uid() = provider_id', null);

/* Order Items */
select create_policy_if_not_exists('Users can view their own order items', 'order_items', 'select', ARRAY['public'], 'exists (select 1 from orders where orders.id = order_items.order_id and (orders.customer_id = auth.uid() or orders.provider_id = auth.uid()))', null);
select create_policy_if_not_exists('Customers can create order items', 'order_items', 'insert', ARRAY['public'], null, 'exists (select 1 from orders where orders.id = order_items.order_id and orders.customer_id = auth.uid())');

/* TRIGGERS */
/* Function to handle new user signup */
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, user_type)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', new.raw_user_meta_data->>'user_type')
  )
  on conflict (id) do nothing; /* Prevent error if profile already exists */
  return new;
end;
$$ language plpgsql security definer;

/* Trigger (Drop and recreate to ensure it's correct) */
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
