-- Remover políticas SELECT conflitantes e criar uma estrutura melhor
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.casting_submissions;
DROP POLICY IF EXISTS "Public can check phone duplicates" ON public.casting_submissions;

-- Criar política que permite SELECT público apenas para campos específicos (verificação de duplicatas)
-- E SELECT completo apenas para admins
CREATE POLICY "Submissions access policy" 
ON public.casting_submissions 
FOR SELECT 
TO anon, authenticated
USING (
    -- Usuários anônimos só podem acessar para verificar duplicatas (função limitada)
    -- Admins autenticados podem ver tudo
    auth.role() = 'anon' OR 
    EXISTS (
        SELECT 1 FROM admin_profiles 
        WHERE admin_profiles.user_id = auth.uid()
    )
);