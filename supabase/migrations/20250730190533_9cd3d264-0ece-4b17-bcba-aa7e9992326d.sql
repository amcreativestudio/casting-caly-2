-- Atualizar senha do usuário admin
UPDATE auth.users 
SET encrypted_password = crypt('@Casting321', gen_salt('bf'))
WHERE email = 'alcymedia.app@gmail.com';