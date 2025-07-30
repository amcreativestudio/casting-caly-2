-- Verificar se já existe usuário admin e atualizar se necessário
DO $$
DECLARE
    admin_exists boolean;
BEGIN
    -- Verificar se já existe um admin com esse email
    SELECT EXISTS (
        SELECT 1 FROM auth.users u
        JOIN admin_profiles ap ON u.id = ap.user_id
        WHERE u.email = 'alcymedia.app@gmail.com'
    ) INTO admin_exists;

    -- Se não existir, tentar criar um perfil admin para usuário existente
    IF NOT admin_exists THEN
        -- Verificar se existe usuário com esse email na tabela auth.users
        INSERT INTO admin_profiles (user_id, name, role)
        SELECT u.id, 'Administrador Casting Caly II', 'admin'
        FROM auth.users u
        WHERE u.email = 'alcymedia.app@gmail.com'
        AND NOT EXISTS (
            SELECT 1 FROM admin_profiles ap WHERE ap.user_id = u.id
        );
    END IF;
END $$;