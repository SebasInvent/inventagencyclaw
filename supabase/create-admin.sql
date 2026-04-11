-- Crear usuario admin en InventAgency Platform
-- Ejecuta esto en Supabase SQL Editor

-- Primero necesitas crear el usuario en Auth
-- Ve a Authentication > Users en Supabase Dashboard y crea un usuario con:
-- Email: admin@inventagency.co
-- Password: (la que quieras)

-- Luego ejecuta esto para darle rol de admin:
-- Reemplaza 'USER_ID_AQUI' con el ID del usuario que acabas de crear

UPDATE profiles 
SET role = 'admin'
WHERE email = 'admin@inventagency.co';

-- Si el perfil no existe aún, créalo manualmente:
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('USER_ID_AQUI', 'admin@inventagency.co', 'Admin', 'admin');
