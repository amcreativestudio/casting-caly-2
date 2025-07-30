import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    idade: "",
    sexo: "",
    provincia: "",
    perfil: "",
    motivacao: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscrição enviada!",
      description: "Sua inscrição foi recebida. Entraremos em contato em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-background font-space-grotesk">
      {/* Header */}
      <header className="header bg-gradient-to-r from-primary to-primary-foreground text-white py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-wide">CASTING CALY II</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative py-16">
        <div className="container mx-auto text-center">
          {/* Placeholder for floating images - will be replaced when you send the CSS */}
          <div className="mb-8">
            <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
              <span className="text-muted-foreground">Alcy Image</span>
            </div>
          </div>
        </div>
      </main>

      {/* Casting Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto">
          <p className="text-center text-xl mb-12 text-muted-foreground">
            Filme de ação moçambicano realizado por Alcy Caluamba
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">PROCURAMOS</h3>
              <p className="text-muted-foreground">
                Novos rostos com atitude, presença e carisma.<br />
                Experiência não é obrigatória.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">FAIXAS ETÁRIAS</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>Homens e mulheres: 18 a 60 anos</li>
                <li>Crianças e adolescentes: 6 a 17 anos (com autorização do encarregado)</li>
              </ul>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">PERFIS PROFISSIONAIS</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>Atores</li>
                <li>Modelos</li>
                <li>Bailarinos</li>
                <li>Criadores de conteúdo</li>
                <li>Talentos emergentes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Formulário de Inscrição</h2>
              <p className="text-muted-foreground">
                Preencha seus dados para participar do casting do filme de ação moçambicano. 
                Todos os campos marcados com * são obrigatórios.
              </p>
            </div>

            {/* Personal Data */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium mb-2">
                  Nome Completo*
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium mb-2">
                  Telefone*
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Digite seu telefone"
                  required
                />
              </div>

              <div>
                <label htmlFor="idade" className="block text-sm font-medium mb-2">
                  Idade*
                </label>
                <input
                  type="number"
                  id="idade"
                  name="idade"
                  value={formData.idade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Digite sua idade"
                  min="6"
                  max="100"
                  required
                />
              </div>

              <div>
                <label htmlFor="sexo" className="block text-sm font-medium mb-2">
                  Sexo*
                </label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label htmlFor="provincia" className="block text-sm font-medium mb-2">
                  Província*
                </label>
                <select
                  id="provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
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

              <div>
                <label htmlFor="perfil" className="block text-sm font-medium mb-2">
                  Perfil*
                </label>
                <select
                  id="perfil"
                  name="perfil"
                  value={formData.perfil}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
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

            {/* File uploads */}
            <div className="space-y-6">
              <div>
                <label htmlFor="fotos" className="block text-sm font-medium mb-2">
                  Fotos*
                </label>
                <input
                  type="file"
                  id="fotos"
                  name="fotos"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  accept="image/*"
                  multiple
                  required
                />
                <small className="text-muted-foreground">
                  Envie de 2 a 5 fotos suas recentes em boa qualidade (formatos: jpg, png, jpeg)
                </small>
              </div>

              <div>
                <label htmlFor="cv" className="block text-sm font-medium mb-2">
                  CV (Opcional)
                </label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  accept="application/pdf,.doc,.docx"
                />
                <small className="text-muted-foreground">
                  Currículo opcional - Envie seu CV ou portfólio se tiver (formatos: PDF, DOC ou DOCX)
                </small>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label htmlFor="motivacao" className="block text-sm font-medium mb-2">
                Motivação e Experiência*
              </label>
              <textarea
                id="motivacao"
                name="motivacao"
                value={formData.motivacao}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Conte-nos sobre sua motivação e experiência (mínimo 150 caracteres)"
                rows={4}
                minLength={150}
                maxLength={1000}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Enviar Inscrição
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Index;
