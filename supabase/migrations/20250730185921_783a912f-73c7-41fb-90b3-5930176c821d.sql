-- Create admin user
-- Note: This will create the user in the auth system
-- The password will need to be set through Supabase Auth

-- First, let's insert a profile for the admin user
-- We'll use a specific UUID for this admin user
DO $$
DECLARE
    admin_user_id UUID := 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
BEGIN
    -- Insert admin profile (this will be linked when user signs up)
    INSERT INTO public.admin_profiles (id, user_id, name, role)
    VALUES (
        gen_random_uuid(),
        admin_user_id,
        'Administrador Casting Caly II',
        'admin'
    ) ON CONFLICT (user_id) DO NOTHING;
END $$;

-- Create a function to automatically create admin profile when the admin user signs up
CREATE OR REPLACE FUNCTION public.handle_admin_user_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is the admin email
    IF NEW.email = 'alcymedia.app@gmail.com' THEN
        INSERT INTO public.admin_profiles (user_id, name, role)
        VALUES (NEW.id, 'Administrador Casting Caly II', 'admin')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign admin role to the admin email
DROP TRIGGER IF EXISTS on_admin_user_signup ON auth.users;
CREATE TRIGGER on_admin_user_signup
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_admin_user_signup();