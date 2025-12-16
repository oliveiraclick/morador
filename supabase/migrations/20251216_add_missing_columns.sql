-- Add status and other missing columns to marketplace_items (Safe)
DO $$
BEGIN
    -- Add status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'status') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN status text DEFAULT 'active';
    END IF;

    -- Add type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'type') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN type text DEFAULT 'PRODUCT';
    END IF;

    -- Add description
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'description') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN description text;
    END IF;

    -- Add image_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'image_url') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN image_url text;
    END IF;
    
     -- Add category (again, just to be sure)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'category') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN category text DEFAULT 'Outros';
    END IF;
END $$;
