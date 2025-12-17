-- 1. Create the 'ads' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('ads', 'ads', true)
on conflict (id) do nothing;

-- 2. Drop existing policies to avoid conflicts
drop policy if exists "Ads images are publicly accessible" on storage.objects;
drop policy if exists "Authenticated users can upload ad images" on storage.objects;
drop policy if exists "Users can delete own ad images" on storage.objects;

-- 3. Create Policy: Public Read Access
create policy "Ads images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'ads' );

-- 4. Create Policy: Authenticated Upload Access (INSERT)
-- Ideally this should be Admin only, but for now allow any authenticated user to upload
create policy "Authenticated users can upload ad images"
on storage.objects for insert
with check ( bucket_id = 'ads' and auth.role() = 'authenticated' );

-- 5. Create Policy: Update/Delete (Optional, for managing images)
create policy "Users can update/delete ad images"
on storage.objects for all
using ( bucket_id = 'ads' and auth.role() = 'authenticated' );
