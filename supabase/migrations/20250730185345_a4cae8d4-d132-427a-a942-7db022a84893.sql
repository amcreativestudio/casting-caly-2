-- Create table for casting submissions
CREATE TABLE public.casting_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 6 AND age <= 100),
    gender TEXT NOT NULL CHECK (gender IN ('Masculino', 'Feminino', 'Outro')),
    phone TEXT NOT NULL,
    province TEXT NOT NULL,
    motivation TEXT NOT NULL CHECK (char_length(motivation) >= 150 AND char_length(motivation) <= 1000),
    photos TEXT[] NOT NULL,
    cv_portfolio TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.casting_submissions ENABLE ROW LEVEL SECURITY;

-- Create unique constraint to prevent duplicates by email and phone
CREATE UNIQUE INDEX idx_casting_submissions_phone ON public.casting_submissions(phone);

-- Create policies for submissions
CREATE POLICY "Anyone can insert submissions" 
ON public.casting_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create admin profiles table
CREATE TABLE public.admin_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for admin profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access to submissions
CREATE POLICY "Admins can view all submissions" 
ON public.casting_submissions 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admin_profiles 
        WHERE user_id = auth.uid()
    )
);

-- Create policies for admin profiles
CREATE POLICY "Admins can view their own profile" 
ON public.admin_profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_casting_submissions_updated_at
    BEFORE UPDATE ON public.casting_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for submission files
INSERT INTO storage.buckets (id, name, public) VALUES ('casting-files', 'casting-files', false);

-- Create storage policies
CREATE POLICY "Anyone can upload casting files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'casting-files');

CREATE POLICY "Admins can view all casting files" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
    bucket_id = 'casting-files' AND
    EXISTS (
        SELECT 1 FROM public.admin_profiles 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Admins can delete casting files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
    bucket_id = 'casting-files' AND
    EXISTS (
        SELECT 1 FROM public.admin_profiles 
        WHERE user_id = auth.uid()
    )
);