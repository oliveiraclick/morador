-- Enable RLS
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Public Read Access"
ON marketplace_items FOR SELECT
USING (true);

-- Allow authenticated upload/insert
CREATE POLICY "Authenticated Insert"
ON marketplace_items FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = seller_id);

-- Allow owners to update
CREATE POLICY "Owner Update"
ON marketplace_items FOR UPDATE
TO authenticated
USING (auth.uid() = seller_id);
