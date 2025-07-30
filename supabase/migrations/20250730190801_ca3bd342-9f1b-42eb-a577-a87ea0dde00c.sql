-- Limpar dados anteriores e reconfigurar o sistema admin
DELETE FROM admin_profiles WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Recriar função para lidar com cadastro de admin
CREATE OR REPLACE FUNCTION public.handle_admin_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Se for o email admin, criar perfil automaticamente
    IF NEW.email = 'alcymedia.app@gmail.com' THEN
        INSERT INTO public.admin_profiles (user_id, name, role)
        VALUES (NEW.id, 'Administrador Casting Caly II', 'admin')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar trigger
DROP TRIGGER IF EXISTS on_admin_user_signup ON auth.users;
CREATE TRIGGER on_admin_user_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_admin_user_signup();