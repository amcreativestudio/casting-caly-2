import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCastingSubmission } from "@/hooks/useCastingSubmission";
import Footer from "@/components/Footer";
import mainCastingImage from "/lovable-uploads/76630543-379d-4720-80db-0fdf17fb2487.png";
import stingImage from "/lovable-uploads/f20904c4-4bef-4647-b561-eaa8ea19da2c.png";
import sting1Image from "/lovable-uploads/74f15216-322e-4783-aa80-04a89e4d6762.png";

const Index = () => {
  const { toast } = useToast();
  const { submitForm, loading } = useCastingSubmission();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    idade: "",
    sexo: "",
    provincia: "",
    perfil: "",
    motivacao: "",
  });

  const [photosFiles, setPhotosFiles] = useState<FileList | null>(null);
  const [cvFiles, setCvFiles] = useState<FileList | null>(null);

  // Script principal do site Casting Caly II - equivalente ao DOMContentLoaded
  useEffect(() => {
    console.log('Casting Caly II - Site carregado com sucesso!');
    
    // Funcionalidades adicionais que podem ser úteis:
    // - Scroll suave para seções
    // - Verificação de dispositivo móvel
    // - Inicialização de animações específicas
    
    // Adicionar classe para animações CSS se necessário
    document.body.classList.add('site-loaded');
    
    // Limpar na desmontagem
    return () => {
      document.body.classList.remove('site-loaded');
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validations
    if (!photosFiles || photosFiles.length < 2 || photosFiles.length > 5) {
      toast({
        title: "Erro nas fotos",
        description: "É necessário enviar entre 2 e 5 fotos.",
        variant: "destructive",
      });
      return;
    }

    if (formData.motivacao.length < 150) {
      toast({
        title: "Motivação muito curta",
        description: "A motivação deve ter pelo menos 150 caracteres.",
        variant: "destructive",
      });
      return;
    }

    try {
      await submitForm(formData, photosFiles, cvFiles);
      
      // Reset form on success
      setFormData({
        nome: "",
        telefone: "",
        idade: "",
        sexo: "",
        provincia: "",
        perfil: "",
        motivacao: "",
      });
      setPhotosFiles(null);
      setCvFiles(null);

      // Reset file inputs
      const photosInput = document.getElementById("fotos") as HTMLInputElement;
      const cvInput = document.getElementById("cv") as HTMLInputElement;
      if (photosInput) photosInput.value = "";
      if (cvInput) cvInput.value = "";

    } catch (error) {
      // Error is already handled in the hook
    }
  };

  return (
    <div 
      className="min-h-screen font-space-grotesk casting-body"
      style={{
        backgroundImage: `url(/lovable-uploads/2f725c01-d538-4e72-9a45-2ce96e6538f8.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Fixed Header */}
      <header className="glass-header">
        <div className="max-w-6xl mx-auto px-8 flex justify-center items-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold font-evogria tracking-[3px] text-shadow-lg">
            CASTING CALY II
          </h1>
        </div>
      </header>

      {/* Main Content with floating images */}
      <main className="pt-40 min-h-screen flex justify-center items-center">
        <div className="relative text-center p-10">
          {/* Main floating image */}
          <div className="relative inline-block">
            <img
              src={mainCastingImage}
              alt="Casting Call Caly II"
              className="max-w-[450px] w-full h-auto rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105"
            />
            
            {/* Corner floating images */}
            <img
              src={stingImage}
              alt="Claquete Cinema"
              className="absolute top-4 right-4 w-24 h-auto z-10 rounded-xl opacity-90 animate-float-corner"
            />
            <img
              src={sting1Image}
              alt="Claquete Cinema"
              className="absolute bottom-4 left-4 w-24 h-auto z-10 rounded-xl opacity-90 animate-float-corner-bottom"
            />
          </div>
        </div>
      </main>

      {/* Casting Section */}
      <section className="py-4">
        <div className="max-w-4xl mx-auto px-10 text-white">
          <p className="text-center text-xl mb-3 text-gray-200 italic tracking-wide">
            Filme de ação moçambicano realizado por Alcy Caluamba
          </p>
          <div className="text-center mb-6">
            <p className="text-orange-400 font-semibold text-lg tracking-wide">
              🌍 Aceitamos candidatos de Moçambique, Portugal e Angola
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-2 max-w-6xl mx-auto">
            <div className="flex-1 text-center p-2">
              <h3 className="text-2xl font-bold mb-5 text-orange-400 tracking-[2px] uppercase border-b-2 border-orange-400/30 pb-4">
                PROCURAMOS
              </h3>
              <p className="text-lg leading-relaxed text-white tracking-wide">
                Novos rostos com atitude, presença e carisma.<br />
                Experiência não é obrigatória.
              </p>
            </div>

            <div className="flex-1 text-center p-2">
              <h3 className="text-2xl font-bold mb-5 text-orange-400 tracking-[2px] uppercase border-b-2 border-orange-400/30 pb-4">
                FAIXAS ETÁRIAS
              </h3>
              <ul className="text-lg space-y-3 text-left max-w-sm mx-auto">
                <li className="flex items-center pl-7 relative">
                  <span className="absolute left-0 text-orange-400 font-bold text-xl">•</span>
                  Homens e mulheres: 18 a 60 anos
                </li>
                <li className="flex items-center pl-7 relative">
                  <span className="absolute left-0 text-orange-400 font-bold text-xl">•</span>
                  Crianças e adolescentes: 6 a 17 anos (com autorização do encarregado)
                </li>
              </ul>
            </div>

            <div className="flex-1 text-center p-2">
              <h3 className="text-2xl font-bold mb-5 text-orange-400 tracking-[2px] uppercase border-b-2 border-orange-400/30 pb-4">
                PERFIS PROFISSIONAIS
              </h3>
              <ul className="text-lg space-y-3 text-left max-w-sm mx-auto">
                <li className="flex items-center pl-7 relative">
                  <span className="absolute left-0 text-orange-400 font-bold text-xl">•</span>
                  Atores
                </li>
                <li className="flex items-center pl-7 relative">
                  <span className="absolute left-0 text-orange-400 font-bold text-xl">•</span>
                  Modelos
                </li>
                <li className="flex items-center pl-7 relative">
                  <span className="absolute left-0 text-orange-400 font-bold text-xl">•</span>
                  Bailarinos
                </li>
                <li className="flex items-center pl-7 relative">
                  <span className="absolute left-0 text-orange-400 font-bold text-xl">•</span>
                  Criadores de conteúdo
                </li>
                <li className="flex items-center pl-7 relative">
                  <span className="absolute left-0 text-orange-400 font-bold text-xl">•</span>
                  Talentos emergentes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section with Glass Morphism */}
      <section className="py-20 bg-gradient-to-b from-black/20 to-black/30 backdrop-blur-[15px] min-h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-6">
          <form onSubmit={handleSubmit} className="glass-form space-y-8">
            {/* Form Header */}
            <div className="mb-4 text-left">
              <h2 className="text-white text-3xl font-semibold mb-4 tracking-tight">
                Formulário de Inscrição
              </h2>
              <p className="text-white/90 text-sm leading-relaxed max-w-[92%]">
                Preencha seus dados para participar do casting do filme de ação moçambicano. 
                Todos os campos marcados com * são obrigatórios.
              </p>
            </div>

            {/* Personal Data */}
            <div className="space-y-7">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label htmlFor="nome" className="block text-white/90 text-sm font-medium mb-2">
                    Nome Completo*
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full h-[58px] px-4 py-4 glass-input text-white text-sm"
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>

                <div className="flex-1">
                  <label htmlFor="telefone" className="block text-white/90 text-sm font-medium mb-2">
                    Telefone*
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full h-[58px] px-4 py-4 glass-input text-white text-sm"
                    placeholder="Digite seu telefone"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label htmlFor="idade" className="block text-white/90 text-sm font-medium mb-2">
                    Idade*
                  </label>
                  <input
                    type="number"
                    id="idade"
                    name="idade"
                    value={formData.idade}
                    onChange={handleInputChange}
                    className="w-full h-[58px] px-4 py-4 glass-input text-white text-sm"
                    placeholder="Digite sua idade"
                    min="6"
                    max="100"
                    required
                  />
                </div>

                <div className="flex-1">
                  <label htmlFor="sexo" className="block text-white/90 text-sm font-medium mb-2">
                    Sexo*
                  </label>
                  <select
                    id="sexo"
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleInputChange}
                    className="w-full h-[58px] px-4 py-4 glass-input text-white text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' fill=\'rgba(255, 255, 255, 0.7)\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 10L4 6h8l-4 4z\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_18px_center] pr-12 cursor-pointer"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label htmlFor="provincia" className="block text-white/90 text-sm font-medium mb-2">
                    Província*
                  </label>
                  <select
                    id="provincia"
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    className="w-full h-[58px] px-4 py-4 glass-input text-white text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' fill=\'rgba(255, 255, 255, 0.7)\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 10L4 6h8l-4 4z\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_18px_center] pr-12 cursor-pointer"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Maputo Cidade">Maputo Cidade</option>
                    <option value="Maputo Província">Maputo Província</option>
                    <option value="Gaza">Gaza</option>
                    <option value="Inhambane">Inhambane</option>
                    <option value="Sofala">Sofala</option>
                    <option value="Manica">Manica</option>
                    <option value="Tete">Tete</option>
                    <option value="Zambézia">Zambézia</option>
                    <option value="Nampula">Nampula</option>
                    <option value="Cabo Delgado">Cabo Delgado</option>
                    <option value="Niassa">Niassa</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label htmlFor="perfil" className="block text-white/90 text-sm font-medium mb-2">
                    Perfil*
                  </label>
                  <select
                    id="perfil"
                    name="perfil"
                    value={formData.perfil}
                    onChange={handleInputChange}
                    className="w-full h-[58px] px-4 py-4 glass-input text-white text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' fill=\'rgba(255, 255, 255, 0.7)\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 10L4 6h8l-4 4z\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_18px_center] pr-12 cursor-pointer"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Atores">Atores</option>
                    <option value="Modelos">Modelos</option>
                    <option value="Bailarinos">Bailarinos</option>
                    <option value="Criadores de conteúdo">Criadores de conteúdo</option>
                    <option value="Talentos emergentes">Talentos emergentes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File uploads */}
            <div className="space-y-6">
              <div>
                <label htmlFor="fotos" className="block text-white/90 text-sm font-medium mb-2">
                  Fotos*
                </label>
                <div className="file-drop-zone p-7 text-center cursor-pointer relative min-h-[100px] flex items-center justify-center">
                  <span className="text-white/80 text-sm pointer-events-none">
                    Clique ou arraste arquivos aqui
                  </span>
                  <input
                    type="file"
                    id="fotos"
                    name="fotos"
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                    accept="image/*"
                    multiple
                    required
                    onChange={(e) => setPhotosFiles(e.target.files)}
                  />
                </div>
                <small className="text-white/80 text-xs mt-2 block">
                  Envie de 2 a 5 fotos suas recentes em boa qualidade (formatos: jpg, png, jpeg)
                </small>
              </div>

              <div>
                <label htmlFor="cv" className="block text-white/90 text-sm font-medium mb-2">
                  CV (Opcional)
                </label>
                <div className="file-drop-zone p-7 text-center cursor-pointer relative min-h-[100px] flex items-center justify-center">
                  <span className="text-white/80 text-sm pointer-events-none">
                    Clique ou arraste arquivos aqui
                  </span>
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                    accept="application/pdf,.doc,.docx"
                    onChange={(e) => setCvFiles(e.target.files)}
                  />
                </div>
                <small className="text-white/80 text-xs mt-2 block">
                  Currículo opcional - Envie seu CV ou portfólio se tiver (formatos: PDF, DOC ou DOCX)
                </small>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label htmlFor="motivacao" className="block text-white/90 text-sm font-medium mb-2">
                Motivação e Experiência*
              </label>
              <textarea
                id="motivacao"
                name="motivacao"
                value={formData.motivacao}
                onChange={handleInputChange}
                className="w-full min-h-[160px] px-4 py-4 glass-input text-white text-sm resize-y leading-relaxed"
                placeholder="Conte-nos sobre sua motivação e experiência (mínimo 150 caracteres)"
                minLength={150}
                maxLength={1000}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="mt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 glass-button text-white font-semibold rounded-2xl flex items-center justify-center text-lg tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Enviar Inscrição"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;