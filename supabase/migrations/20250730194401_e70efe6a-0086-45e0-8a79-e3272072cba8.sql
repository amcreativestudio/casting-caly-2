-- Tornar o bucket público para permitir visualização das fotos
UPDATE storage.buckets 
SET public = true 
WHERE name = 'casting-files';

-- Criar políticas de storage para permitir acesso público às fotos
-- Política para visualizar fotos (público)
CREATE POLICY "Public can view photos" 
ON storage.objects 
FOR SELECT 
TO anon, authenticated
USING (bucket_id = 'casting-files');

-- Política para upload de fotos (público - para formulários de inscrição)
CREATE POLICY "Public can upload photos" 
ON storage.objects 
FOR INSERT 
TO anon, authenticated
WITH CHECK (bucket_id = 'casting-files');

-- Política para admins poderem deletar arquivos
CREATE POLICY "Admins can delete files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
    bucket_id = 'casting-files' AND 
    EXISTS (
        SELECT 1 FROM admin_profiles 
        WHERE admin_profiles.user_id = auth.uid()
    )
);