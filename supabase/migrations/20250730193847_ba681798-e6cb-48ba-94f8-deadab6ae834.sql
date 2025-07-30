-- Adicionar campo perfil à tabela casting_submissions
ALTER TABLE public.casting_submissions 
ADD COLUMN profile_type TEXT;