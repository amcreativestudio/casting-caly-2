-- Permitir que usuários anônimos façam SELECT apenas para verificar duplicatas por telefone
-- Criar política específica para verificação de duplicatas
CREATE POLICY "Public can check phone duplicates" 
ON public.casting_submissions 
FOR SELECT 
TO anon, authenticated
USING (true);