-- Add missing category column to marketplace_items
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'marketplace_items'
        AND column_name = 'category'
    ) THEN
        ALTER TABLE public.marketplace_items
        ADD COLUMN category text DEFAULT 'Outros';
    END IF;
END $$;
