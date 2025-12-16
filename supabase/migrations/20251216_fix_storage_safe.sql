-- 1. Ensure the bucket exists (Safe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace', 'marketplace', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Safely create Policies (ignoring if they already exist)
DO $$
BEGIN
    -- Public Read Access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'marketplace' );
    END IF;

    -- Authenticated Upload Access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Authenticated Upload'
    ) THEN
        CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'marketplace' );
    END IF;

    -- Delete Access (Owner only)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'User Delete Own Images'
    ) THEN
        CREATE POLICY "User Delete Own Images" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'marketplace' AND auth.uid() = owner );
    END IF;
END $$;
