-- Confirmar email do usuário admin
UPDATE auth.users 
SET email_confirmed_at = now(),
    updated_at = now()
WHERE email = 'alcymedia.app@gmail.com' 
AND email_confirmed_at IS NULL;