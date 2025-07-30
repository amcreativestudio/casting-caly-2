import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  nome: string;
  telefone: string;
  idade: string;
  sexo: string;
  provincia: string;
  perfil: string;
  motivacao: string;
}

export const useCastingSubmission = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const uploadFiles = async (files: FileList | null, bucket: string, folder: string) => {
    if (!files || files.length === 0) return [];

    const uploadPromises = Array.from(files).map(async (file) => {
      const fileName = `${folder}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;
      return data.path;
    });

    return Promise.all(uploadPromises);
  };

  const checkDuplicatePhone = async (phone: string) => {
    const { data, error } = await supabase
      .from("casting_submissions")
      .select("id")
      .eq("phone", phone)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return !!data;
  };

  const submitForm = async (
    formData: FormData,
    photosFiles: FileList | null,
    cvFiles: FileList | null
  ) => {
    setLoading(true);

    try {
      // Validate photos (minimum 2, maximum 5)
      if (!photosFiles || photosFiles.length < 2 || photosFiles.length > 5) {
        throw new Error("É necessário enviar entre 2 e 5 fotos.");
      }

      // Check for duplicate phone
      const isDuplicate = await checkDuplicatePhone(formData.telefone);
      if (isDuplicate) {
        throw new Error("Este número de telefone já está registrado em nosso sistema.");
      }

      // Upload photos
      const photoPaths = await uploadFiles(photosFiles, "casting-files", "photos");

      // Upload CV if provided
      let cvPath: string[] = [];
      if (cvFiles && cvFiles.length > 0) {
        cvPath = await uploadFiles(cvFiles, "casting-files", "cv");
      }

      // Insert submission
      const { data, error } = await supabase
        .from("casting_submissions")
        .insert({
          full_name: formData.nome,
          age: parseInt(formData.idade),
          gender: formData.sexo,
          phone: formData.telefone,
          province: formData.provincia,
          profile_type: formData.perfil,
          motivation: formData.motivacao,
          photos: photoPaths,
          cv_portfolio: cvPath.length > 0 ? cvPath[0] : null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Inscrição enviada com sucesso!",
        description: "Sua inscrição foi recebida. Nossa equipe entrará em contato em breve.",
      });

      return data;
    } catch (error: any) {
      console.error("Error submitting form:", error);
      
      let errorMessage = "Erro ao enviar inscrição. Tente novamente.";
      
      if (error.message.includes("telefone já está registrado")) {
        errorMessage = error.message;
      } else if (error.message.includes("fotos")) {
        errorMessage = error.message;
      } else if (error.code === "23505") {
        errorMessage = "Este número de telefone já está registrado em nosso sistema.";
      }

      toast({
        title: "Erro na inscrição",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitForm,
    loading,
  };
};