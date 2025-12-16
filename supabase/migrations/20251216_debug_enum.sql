-- Reveal enum values
DO $$
DECLARE
    enum_vals text;
BEGIN
    SELECT string_agg(e.enumlabel, ', ') INTO enum_vals
    FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid  
    WHERE t.typname = 'item_type';

    RAISE EXCEPTION 'Valid enum values for item_type: %', enum_vals;
END $$;
