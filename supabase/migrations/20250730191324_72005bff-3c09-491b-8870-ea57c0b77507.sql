-- Configurar usuário admin com senha forte
-- Verificar se existe usuário com esse email e criar perfil admin
DO $$
DECLARE
    admin_user_id uuid;
    strong_password text := 'AdminCasting2024!#';
BEGIN
    -- Verificar se usuário já existe
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'alcymedia.app@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Usuário existe, atualizar senha
        UPDATE auth.users 
        SET encrypted_password = crypt(strong_password, gen_salt('bf')),
            updated_at = now()
        WHERE id = admin_user_id;
        
        -- Garantir que tem perfil admin
        INSERT INTO public.admin_profiles (user_id, name, role)
        VALUES (admin_user_id, 'Administrador Casting Caly II', 'admin')
        ON CONFLICT (user_id) DO UPDATE SET
            name = 'Administrador Casting Caly II',
            role = 'admin',
            updated_at = now();
            
        RAISE NOTICE 'Usuário admin atualizado com nova senha';
    ELSE
        RAISE NOTICE 'Usuário não encontrado. Use o cadastro na interface para criar a conta.';
    END IF;
END $$;