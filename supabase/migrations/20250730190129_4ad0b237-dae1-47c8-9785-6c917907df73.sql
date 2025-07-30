-- Recriar o trigger para automaticamente dar permissões de admin
CREATE OR REPLACE FUNCTION public.handle_admin_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar se este é o email admin
    IF NEW.email = 'alcymedia.app@gmail.com' THEN
        INSERT INTO public.admin_profiles (user_id, name, role)
        VALUES (NEW.id, 'Administrador Casting Caly II', 'admin')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para automaticamente atribuir papel de admin ao email admin
DROP TRIGGER IF EXISTS on_admin_user_signup ON auth.users;
CREATE TRIGGER on_admin_user_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_admin_user_signup();

-- Função para criar usuário admin via SQL
CREATE OR REPLACE FUNCTION public.create_admin_user()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Inserir usuário na tabela auth.users usando extensão de autenticação
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change_token_current,
        email_change_confirm_status,
        banned_until,
        reauthentication_token,
        reauthentication_sent_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000'::uuid,
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'alcymedia.app@gmail.com',
        crypt('casting123@', gen_salt('bf')),
        NOW(),
        NULL,
        '',
        NULL,
        '',
        NULL,
        '',
        '',
        NULL,
        NULL,
        '{"provider":"email","providers":["email"]}',
        '{}',
        FALSE,
        NOW(),
        NOW(),
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        0,
        NULL,
        '',
        NULL
    ) RETURNING id INTO new_user_id;

    -- Inserir perfil admin
    INSERT INTO public.admin_profiles (user_id, name, role)
    VALUES (new_user_id, 'Administrador Casting Caly II', 'admin');

    RETURN new_user_id;
END;
$$;

-- Executar a função para criar o usuário admin
SELECT public.create_admin_user();