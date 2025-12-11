/* 
  MANUAL BRANDING FIX SCRIPT
  Run this in your Supabase SQL Editor.
  It is safe to run multiple times (idempotent).
*/

-- 1. Add Columns to app_settings (Check if exists first)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'app_settings' and column_name = 'splash_logo_url') then
    alter table public.app_settings add column splash_logo_url text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'app_settings' and column_name = 'login_logo_url') then
    alter table public.app_settings add column login_logo_url text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'app_settings' and column_name = 'pwa_icon_url') then
    alter table public.app_settings add column pwa_icon_url text;
  end if;
end $$;

-- 2. Create Bucket (Insert or Update if exists)
insert into storage.buckets (id, name, public) 
values ('branding', 'branding', true) 
on conflict (id) do update set public = true;

-- 3. RLS Policies (Check if exists first)
do $$
begin
    -- Update policy for app_settings (Allow public update for demo/admin)
    if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'app_settings' and policyname = 'Enable update for all users') then
        create policy "Enable update for all users" on public.app_settings for update using (true) with check (true);
    end if;

    -- Storage Select Policy
    if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public Access Branding') then
        create policy "Public Access Branding" on storage.objects for select using ( bucket_id = 'branding' );
    end if;
    
    -- Storage Insert Policy
    if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public Upload Branding') then
        create policy "Public Upload Branding" on storage.objects for insert with check ( bucket_id = 'branding' );
    end if;
    
    -- Storage Update Policy
    if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public Update Branding') then
        create policy "Public Update Branding" on storage.objects for update using ( bucket_id = 'branding' );
    end if;
end $$;
