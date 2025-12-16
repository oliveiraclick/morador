-- Delete known mock items
DELETE FROM public.marketplace_items 
WHERE title IN (
  'Bicicleta Infantil Aro 16', 
  'Sofá 3 lugares Retrátil', 
  'Kit Body Infantil - 3 Peças', 
  'Hidratante Facial Natural',
  'Mundo Baby',
  'EcoBeleza'
);

-- Ensure RLS is enabled
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

-- Policy for viewing items (Everyone can view)
DROP POLICY IF EXISTS "Anyone can view marketplace items" ON public.marketplace_items;
CREATE POLICY "Anyone can view marketplace items"
ON public.marketplace_items
FOR SELECT
USING (true);

-- Policy for inserting items (Authenticated users only)
DROP POLICY IF EXISTS "Authenticated users can insert marketplace items" ON public.marketplace_items;
CREATE POLICY "Authenticated users can insert marketplace items"
ON public.marketplace_items
FOR INSERT
WITH CHECK (auth.uid() = seller_id);

-- Policy for deleting items (Owners only)
DROP POLICY IF EXISTS "Users can delete their own items" ON public.marketplace_items;
CREATE POLICY "Users can delete their own items"
ON public.marketplace_items
FOR DELETE
USING (auth.uid() = seller_id);
