import { useState } from "react";
import { Info, ArrowRight, Printer, Shirt, Scissors, Tag, Leaf, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CpfData } from "@/types/registration";

const CPF_API_URL = "https://api.amnesiatecnologia.rocks";
const CPF_API_TOKEN = "c5eebbc9-0469-4324-85f6-0c994b42d18a";

const captchaIcons = [
  { id: "printer", Icon: Printer, label: "Impressora" },
  { id: "shirt", Icon: Shirt, label: "Camiseta" },
  { id: "scissors", Icon: Scissors, label: "Tesoura" },
  { id: "tag", Icon: Tag, label: "Etiqueta" },
  { id: "leaf", Icon: Leaf, label: "Folha", correct: true },
];

interface Props {
  onNext: (data: CpfData) => void;
}

const StepInicio = ({ onNext }: Props) => {
  const [cpf, setCpf] = useState("");
  const [selectedCaptcha, setSelectedCaptcha] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const handleSubmit = async () => {
    const rawCpf = cpf.replace(/\D/g, "");
    if (rawCpf.length < 11) {
      setError("Por favor, insira um CPF válido.");
      return;
    }
    if (!selectedCaptcha) {
      setError("Por favor, selecione a imagem correta.");
      return;
    }
    const correct = captchaIcons.find((i) => i.id === selectedCaptcha);
    if (!correct?.correct) {
      setError("Imagem incorreta. Por favor, selecione a imagem da folha para continuar.");
      setSelectedCaptcha(null);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${CPF_API_URL}/?token=${CPF_API_TOKEN}&cpf=${rawCpf}`);
      if (!response.ok) throw new Error(`Erro: ${response.status}`);
      const data = await response.json();
      const cpfInfo = data.DADOS || data;
      onNext({
        nome: cpfInfo.nome,
        cpf: cpfInfo.cpf,
        data_nascimento: cpfInfo.data_nascimento,
        sexo: cpfInfo.sexo,
        mae: cpfInfo.nome_mae || cpfInfo.mae,
      });
    } catch {
      setError("Não foi possível consultar o CPF. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Inscrição Online</h2>
          <p className="text-muted-foreground mt-1">Concurso Público Marinha do Brasil 2026</p>
        </div>

        <div className="border-l-4 border-info-border bg-info-bg rounded-r-md p-5 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-info-text" />
            <h3 className="font-bold text-info-text">Informações Importantes</h3>
          </div>
          <p className="text-sm text-foreground mb-3">
            Seja bem-vindo ao sistema oficial de inscrições. Confira os detalhes do certame:
          </p>
          <ul className="text-sm text-foreground space-y-1.5 list-disc list-inside">
            <li><strong>Vagas:</strong> Diversas oportunidades (Médio, Técnico e Superior)</li>
            <li><strong>Salário:</strong> Até R$ 9.663,60 + Benefícios</li>
            <li><strong>Inscrições:</strong> Até 08 de Abril de 2026</li>
            <li><strong>Banca:</strong> SSPM (Seleção do Pessoal da Marinha) | Prova: 24/05/2026</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            CPF do Candidato <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(formatCPF(e.target.value))}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mb-8">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Verificação de Segurança <span className="text-destructive">*</span>
          </label>
          <p className="text-sm text-foreground mb-3">
            Selecione a imagem de uma <strong>FOLHA</strong>:
          </p>
          <div className="grid grid-cols-5 gap-3">
            {captchaIcons.map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => { setSelectedCaptcha(id); setError(null); }}
                className={cn(
                  "aspect-square rounded-lg border-2 flex items-center justify-center transition-all hover:border-navy",
                  selectedCaptcha === id ? "border-navy bg-secondary" : "border-input bg-card"
                )}
              >
                <Icon className="w-8 h-8 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-3 py-4 mb-4 bg-info-bg rounded-md">
            <Loader2 className="w-5 h-5 animate-spin text-info-text" />
            <span className="text-sm text-info-text font-medium">
              Validando CPF... Aguarde enquanto consultamos seus dados na base federal.
            </span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={cn(
            "w-full py-4 rounded-md bg-primary text-primary-foreground font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-opacity",
            loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
          )}
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Consultando...</>
          ) : (
            <>Iniciar Inscrição <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default StepInicio;