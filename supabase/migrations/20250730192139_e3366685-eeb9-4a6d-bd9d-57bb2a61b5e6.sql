-- Corrigir políticas RLS para casting_submissions
-- Permitir que qualquer pessoa insira dados (usuários não autenticados)
-- Apenas admins podem ver e apagar

-- Remover políticas existentes
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.casting_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.casting_submissions;

-- Criar nova política para permitir inserção pública (sem autenticação)
CREATE POLICY "Public can insert submissions" 
ON public.casting_submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Criar política para admins verem todas as submissões
CREATE POLICY "Admins can view all submissions" 
ON public.casting_submissions 
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_profiles 
        WHERE admin_profiles.user_id = auth.uid()
    )
);

-- Criar política para admins apagarem submissões
CREATE POLICY "Admins can delete submissions" 
ON public.casting_submissions 
FOR DELETE 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admin_profiles 
        WHERE admin_profiles.user_id = auth.uid()
    )
);

-- Não permitir UPDATE (conforme solicitado)
-- Política UPDATE não será criada, mantendo o comportamento de não permitir edição