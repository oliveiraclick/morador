-- SAFE STORAGE CREATION SCRIPT
-- Fixes Error 42710 (Policy already exists)

-- 1. Create Bucket (Safe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace', 'marketplace', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to avoid conflicts
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
    DROP POLICY IF EXISTS "User Update Own Images" ON storage.objects;
    DROP POLICY IF EXISTS "User Delete Own Images" ON storage.objects;
    -- Drop potential variations
    DROP POLICY IF EXISTS "Public Access Marketplace" ON storage.objects;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- 3. Re-create Policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'marketplace' );

CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'marketplace' );

CREATE POLICY "User Update Own Images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'marketplace' AND auth.uid() = owner );

CREATE POLICY "User Delete Own Images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'marketplace' AND auth.uid() = owner );
