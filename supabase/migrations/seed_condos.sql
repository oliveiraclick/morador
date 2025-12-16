-- Insert a default condo if it doesn't exist
INSERT INTO public.condos (name, address, plan)
SELECT 'Residencial Splendido', 'Rua das Flores, 123', 'PREMIUM'
WHERE NOT EXISTS (
    SELECT 1 FROM public.condos WHERE name = 'Residencial Splendido'
);
