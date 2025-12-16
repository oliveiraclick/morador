-- Comprehensive Schema Check & Fix for marketplace_items
DO $$
BEGIN
    -- 1. Check/Add 'category'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'category') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN category text DEFAULT 'Outros';
    END IF;

    -- 2. Check/Add 'status'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'status') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN status text DEFAULT 'active';
    END IF;

    -- 3. Check/Add 'type' (Note: assumes enum or text. If enum exists, fine. If not, text default)
    -- We know 'item_type' enum exists now. If column is missing:
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'type') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN type item_type DEFAULT 'desapego';
    END IF;

    -- 4. Check/Add 'description'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'description') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN description text;
    END IF;

    -- 5. Check/Add 'image_url'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'image_url') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN image_url text;
    END IF;

    -- 6. Check/Add 'condition' (New!)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'condition') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN condition text;
    END IF;
    
    -- 7. Check/Add 'price' (Should exist, but safety first)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketplace_items' AND column_name = 'price') THEN
        ALTER TABLE public.marketplace_items ADD COLUMN price numeric DEFAULT 0;
    END IF;

END $$;
