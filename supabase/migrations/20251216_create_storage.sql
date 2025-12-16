-- Create the marketplace bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace', 'marketplace', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public viewing of marketplace images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'marketplace' );

-- Policy to allow authenticated users to upload images
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'marketplace' );

-- Policy to allow users to update their own images (optional, but good)
CREATE POLICY "User Update Own Images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'marketplace' AND auth.uid() = owner );

-- Policy to allow users to delete their own images
CREATE POLICY "User Delete Own Images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'marketplace' AND auth.uid() = owner );
