import GovBar from "@/components/GovBar";
import NavyHeader from "@/components/NavyHeader";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-background">
      <GovBar />
      <NavyHeader />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-1 text-primary hover:underline mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="bg-card rounded-lg shadow-sm border border-border p-6 sm:p-10 prose prose-sm max-w-none text-foreground">
          <h1 className="text-2xl font-bold mb-6">Política de Privacidade</h1>

          <p>Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais ao utilizar este site.</p>

          <h2 className="text-lg font-semibold mt-6 mb-2">1. Informações Coletadas</h2>
          <p>Podemos coletar as seguintes informações: nome completo, CPF, data de nascimento, endereço, e-mail, telefone e dados necessários para o processo de inscrição.</p>

          <h2 className="text-lg font-semibold mt-6 mb-2">2. Uso das Informações</h2>
          <p>As informações coletadas são utilizadas exclusivamente para processar sua inscrição, entrar em contato quando necessário e melhorar nossos serviços.</p>

          <h2 className="text-lg font-semibold mt-6 mb-2">3. Compartilhamento de Dados</h2>
          <p>Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros sem seu consentimento, exceto quando exigido por lei.</p>

          <h2 className="text-lg font-semibold mt-6 mb-2">4. Segurança</h2>
          <p>Adotamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>

          <h2 className="text-lg font-semibold mt-6 mb-2">5. Cookies</h2>
          <p>Utilizamos cookies para melhorar a experiência do usuário. Você pode desativá-los nas configurações do seu navegador.</p>

          <h2 className="text-lg font-semibold mt-6 mb-2">6. Seus Direitos</h2>
          <p>De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a acessar, corrigir, excluir e portar seus dados pessoais.</p>

          <h2 className="text-lg font-semibold mt-6 mb-2">7. Contato</h2>
          <p>Para dúvidas sobre esta política, entre em contato através do e-mail disponibilizado no site.</p>

          <p className="text-muted-foreground text-xs mt-8">Última atualização: Fevereiro de 2026.</p>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidade;