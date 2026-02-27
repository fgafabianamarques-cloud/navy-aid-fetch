import { useState } from "react";
import { ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CpfData } from "@/types/registration";

const LOCAIS_POR_UF: Record<string, string[]> = {
  AC: ["Rio Branco - AC", "Cruzeiro do Sul - AC"],
  AL: ["Maceió - AL", "Arapiraca - AL"],
  AP: ["Macapá - AP", "Santana - AP"],
  AM: ["Manaus - AM", "Parintins - AM", "Tabatinga - AM"],
  BA: ["Salvador - BA", "Feira de Santana - BA", "Ilhéus - BA", "Vitória da Conquista - BA"],
  CE: ["Fortaleza - CE", "Juazeiro do Norte - CE", "Sobral - CE"],
  DF: ["Brasília - DF", "Taguatinga - DF"],
  ES: ["Vitória - ES", "Vila Velha - ES", "Cachoeiro de Itapemirim - ES"],
  GO: ["Goiânia - GO", "Anápolis - GO", "Rio Verde - GO"],
  MA: ["São Luís - MA", "Imperatriz - MA", "Caxias - MA"],
  MT: ["Cuiabá - MT", "Rondonópolis - MT", "Sinop - MT"],
  MS: ["Campo Grande - MS", "Dourados - MS", "Corumbá - MS"],
  MG: ["Belo Horizonte - MG", "Uberlândia - MG", "Juiz de Fora - MG", "Montes Claros - MG"],
  PA: ["Belém - PA", "Santarém - PA", "Marabá - PA"],
  PB: ["João Pessoa - PB", "Campina Grande - PB"],
  PR: ["Curitiba - PR", "Londrina - PR", "Maringá - PR", "Foz do Iguaçu - PR"],
  PE: ["Recife - PE", "Caruaru - PE", "Petrolina - PE", "Olinda - PE"],
  PI: ["Teresina - PI", "Parnaíba - PI"],
  RJ: ["Rio de Janeiro - RJ", "Angra dos Reis - RJ", "Nova Friburgo - RJ", "São Pedro da Aldeia - RJ"],
  RN: ["Natal - RN", "Mossoró - RN"],
  RS: ["Porto Alegre - RS", "Pelotas - RS", "Rio Grande - RS", "Santa Maria - RS"],
  RO: ["Porto Velho - RO", "Ji-Paraná - RO"],
  RR: ["Boa Vista - RR"],
  SC: ["Florianópolis - SC", "Joinville - SC", "Itajaí - SC"],
  SP: ["São Paulo - SP", "Santos - SP", "Campinas - SP", "Ribeirão Preto - SP"],
  SE: ["Aracaju - SE", "Lagarto - SE"],
  TO: ["Palmas - TO", "Araguaína - TO"],
};

interface Props { cpfData: CpfData; uf: string; onNext: () => void; onBack: () => void; }

const StepAgendamento = ({ cpfData, uf, onNext }: Props) => {
  const locais = LOCAIS_POR_UF[uf] || LOCAIS_POR_UF["RJ"];
  const [local, setLocal] = useState(locais[0]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!local) { setError("Por favor, selecione o local de prova."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Por favor, digite um e-mail válido."); return; }
    setError(null);
    onNext();
  };

  const inputClass = "w-full px-4 py-3 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Local de Prova</h2>
          <p className="text-muted-foreground mt-1">Selecione onde deseja realizar sua prova e confirme seu e-mail.</p>
        </div>

        <div className="border-l-4 border-navy bg-muted rounded-r-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:gap-12 gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Candidato</span>
              <p className="font-bold text-foreground">{cpfData.nome ? String(cpfData.nome) : "CANDIDATO"}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CPF</span>
              <p className="font-bold text-foreground">{cpfData.cpf ? String(cpfData.cpf) : "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="bg-accent/30 border border-accent rounded-lg p-5 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent-foreground">Cargo Selecionado</span>
          </div>
          <p className="font-bold text-foreground mb-1">Cargo confirmado nas etapas anteriores</p>
          <p className="text-sm text-muted-foreground">Salário: R$ 1.303,90 a R$ 9.070,60 | Vagas: 1.680</p>
          <p className="text-sm text-muted-foreground">Banca: MARINHA DO BRASIL | Prova: 24 de maio de 2026</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-navy" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Município de Prova em <span className="bg-navy text-primary-foreground px-2 py-0.5 rounded text-xs">{uf || "RJ"}</span>
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Selecione o local onde deseja realizar sua prova. Identificamos o polo mais próximo: <span className="font-semibold text-primary">{locais[0]}</span>
          </p>
          <div className="space-y-3">
            {locais.map((loc) => (
              <label key={loc} className={cn("flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors", local === loc ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50")}>
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", local === loc ? "border-primary" : "border-muted-foreground/40")}>
                  {local === loc && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <span className="text-sm font-medium text-foreground">{loc}</span>
                <input type="radio" name="local-prova" value={loc} checked={local === loc} onChange={() => setLocal(loc)} className="sr-only" />
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">E-mail para recebimento do comprovante:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite um e-mail válido" className={inputClass} />
          <p className="text-xs text-muted-foreground mt-2">Certifique-se de que o e-mail está correto para receber seu cartão de confirmação.</p>
        </div>

        {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md p-3 mt-5">{error}</div>}

        <button onClick={handleSubmit} className="w-full mt-8 py-4 rounded-md bg-primary text-primary-foreground font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          Gerar Cartão de Inscrição <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepAgendamento;