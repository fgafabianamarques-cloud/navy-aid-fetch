import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CpfData } from "@/types/registration";

const UF_OPTIONS = [
  { sigla: "AC", nome: "Acre" }, { sigla: "AL", nome: "Alagoas" }, { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" }, { sigla: "BA", nome: "Bahia" }, { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" }, { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" }, { sigla: "MA", nome: "Maranhão" }, { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" }, { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" }, { sigla: "PB", nome: "Paraíba" }, { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" }, { sigla: "PI", nome: "Piauí" }, { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" }, { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" }, { sigla: "RR", nome: "Roraima" }, { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" }, { sigla: "SE", nome: "Sergipe" }, { sigla: "TO", nome: "Tocantins" },
];

interface Props {
  cpfData: CpfData;
  onNext: (uf: string) => void;
  onBack: () => void;
}

const cepCache = new Map<string, any>();

const StepEndereco = ({ cpfData, onNext }: Props) => {
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [celular, setCelular] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const fillAddress = (data: any) => {
    setLogradouro(data.logradouro || "");
    setBairro(data.bairro || "");
    setCidade(data.localidade || "");
    setUf(data.uf || "");
  };

  const handleCepChange = async (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    const digits = formatted.replace(/\D/g, "");
    if (digits.length === 8) {
      if (cepCache.has(digits)) { fillAddress(cepCache.get(digits)); return; }
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (!data.erro) { cepCache.set(digits, data); fillAddress(data); }
      } catch { /* silently fail */ } finally { setLoadingCep(false); }
    }
  };

  const handleSubmit = () => {
    if (!cep || cep.replace(/\D/g, "").length < 8) { setError("Por favor, insira um CEP válido."); return; }
    if (!logradouro.trim()) { setError("Por favor, insira o logradouro."); return; }
    if (!numero.trim()) { setError("Por favor, insira o número."); return; }
    if (!bairro.trim()) { setError("Por favor, insira o bairro."); return; }
    if (!cidade.trim()) { setError("Por favor, insira a cidade."); return; }
    if (!uf) { setError("Por favor, selecione o estado."); return; }
    if (celular.replace(/\D/g, "").length < 10) { setError("Por favor, insira um celular válido."); return; }
    setError(null);
    onNext(uf);
  };

  const inputClass = "w-full px-4 py-3 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Cadastro de Endereço</h2>
          <p className="text-muted-foreground mt-1">Informe seu endereço residencial para contato e recebimento de notificações</p>
        </div>

        <div className="border-l-4 border-navy bg-muted rounded-r-md p-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:gap-12 gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Candidato</span>
              <p className="font-bold text-foreground">{cpfData.nome ? String(cpfData.nome) : "N/A"}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CPF</span>
              <p className="font-bold text-foreground">{cpfData.cpf ? String(cpfData.cpf) : "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">CEP <span className="text-destructive">*</span></label>
            <div className="relative">
              <input type="text" value={cep} onChange={(e) => handleCepChange(e.target.value)} placeholder="00000-000" className={inputClass} />
              {loadingCep && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Logradouro (Rua/Avenida) <span className="text-destructive">*</span></label>
            <input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} placeholder="Nome da rua ou avenida" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Número <span className="text-destructive">*</span></label>
              <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Ex: 123" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Complemento</label>
              <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} placeholder="Apto, Bloco, etc." className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Bairro <span className="text-destructive">*</span></label>
            <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Seu bairro" className={inputClass} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Cidade <span className="text-destructive">*</span></label>
              <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Sua cidade" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Estado (UF) <span className="text-destructive">*</span></label>
              <select value={uf} onChange={(e) => setUf(e.target.value)} className={cn(inputClass, !uf && "text-muted-foreground")}>
                <option value="">Selecione...</option>
                {UF_OPTIONS.map((state) => (<option key={state.sigla} value={state.sigla}>{state.nome}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Celular / WhatsApp <span className="text-destructive">*</span></label>
            <input type="text" value={celular} onChange={(e) => setCelular(formatPhone(e.target.value))} placeholder="(00) 00000-0000" className={inputClass} />
          </div>
        </div>

        {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md p-3 mt-5">{error}</div>}

        <button onClick={handleSubmit} className="w-full mt-8 py-4 rounded-md bg-primary text-primary-foreground font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          Confirmar e Continuar <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepEndereco;