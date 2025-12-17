-- =============================================
-- SQL para configurar usuário Admin
-- Execute no Supabase: SQL Editor
-- =============================================

-- 1. Primeiro verifique se o usuário existe (pelo email)
SELECT 
    au.id,
    au.email,
    p.role,
    p.full_name
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'denys@morador.app';

-- 2. Se o usuário existe mas role não é 'admin', atualize:
UPDATE profiles 
SET role = 'admin'
WHERE id = (
    SELECT id FROM auth.users WHERE email = 'denys@morador.app'
);

-- 3. Se o usuário NÃO existe no profiles, mas existe no auth.users, crie:
-- (Isso pode acontecer se o usuário foi criado mas não completou o registro)
INSERT INTO profiles (id, email, role, full_name, created_at)
SELECT 
    id,
    email,
    'admin',
    'Denys Cesar',
    NOW()
FROM auth.users 
WHERE email = 'denys@morador.app'
AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'denys@morador.app')
);

-- 4. Confirme a configuração
SELECT 
    au.id,
    au.email,
    p.role,
    p.full_name
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'denys@morador.app';
