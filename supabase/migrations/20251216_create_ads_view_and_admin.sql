CREATE OR REPLACE VIEW destaques AS SELECT * FROM ads;

GRANT ALL ON destaques TO anon, authenticated, service_role;

UPDATE public.profiles
SET role = 'ADMIN'
WHERE email = 'denys@morador.app';
