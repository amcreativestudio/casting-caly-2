import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleCopyrightClick = () => {
    navigate("/admin");
  };

  return (
    <footer className="bg-white/10 backdrop-blur-md text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Casting Caly II</h3>
            <p className="text-gray-300 text-sm">
              Filme de ação moçambicano dirigido por Alcy Caluamba. 
              Uma oportunidade única para descobrir novos talentos.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Diretor: Alcy Caluamba</p>
              <p>Produção: AM Creative Studio</p>
              <p>Gênero: Ação</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Informações</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Casting aberto para todas as idades</p>
              <p>Não é necessária experiência prévia</p>
              <p>Inscrições gratuitas</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Casting Caly II. 
            <button 
              onClick={handleCopyrightClick}
              className="ml-1 hover:text-white transition-colors cursor-pointer underline-offset-2 hover:underline"
            >
              Todos os direitos reservados.
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;