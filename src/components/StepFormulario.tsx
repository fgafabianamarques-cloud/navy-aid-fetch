import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CpfData } from "@/types/registration";

const CARGO_GROUPS = [
  { label: "Nível Fundamental/Médio", options: ["Soldado Fuzileiro Naval", "Aprendiz-Marinheiro", "CAP - Eletricidade", "CAP - Mecânica", "CAP - Enfermagem"] },
  { label: "Nível Superior – Engenharia (Corpo de Engenheiros)", options: ["Engenharia Naval", "Engenharia Mecânica", "Engenharia Elétrica", "Engenharia Civil", "Engenharia Eletrônica", "Engenharia de Telecomunicações", "Engenharia Química", "Engenharia de Produção"] },
  { label: "Nível Superior – Saúde (CSM)", options: ["Médico - Clínica Médica", "Médico - Cirurgia Geral", "Médico - Ortopedia", "Cirurgião-Dentista", "Enfermagem (Apoio à Saúde)", "Farmácia (Apoio à Saúde)", "Psicologia (Apoio à Saúde)"] },
  { label: "Nível Superior – Quadro Técnico (QT)", options: ["Direito", "Administração", "Informática / TI", "Comunicação Social", "Pedagogia"] },
];

type Question = { id: number; text: string; options: string[] };

const QUESTIONS: Question[] = [
  { id: 1, text: "Em qual setor de atividade você trabalha atualmente?", options: ["Setor público (Federal, Estadual ou Municipal)", "Setor privado (Empresa privada, comércio, etc.)", "Autônomo / Profissional liberal", "Não estou trabalhando atualmente"] },
  { id: 2, text: "Qual o seu nível de escolaridade concluído?", options: ["Ensino Médio completo", "Ensino Técnico completo", "Ensino Superior incompleto", "Ensino Superior completo ou pós-graduação"] },
  { id: 3, text: "Você já serviu ou estagiou na Marinha do Brasil?", options: ["Sim, como militar de carreira ou temporário", "Sim, como estagiário(a) ou jovem aprendiz", "Sim, como prestador(a) de serviço (terceirizado)", "Não, nunca tive vínculo"] },
  { id: 4, text: "Qual o principal motivo para sua inscrição neste concurso?", options: ["Estabilidade financeira e profissional", "Identificação com a carreira naval", "Plano de carreira e benefícios oferecidos", "Vocação militar"] },
  { id: 5, text: "Como você avalia seu conhecimento sobre as atividades da Marinha do Brasil?", options: ["Excelente (conheço bem a Força e suas missões)", "Bom (conheço as principais atribuições)", "Regular (conheço apenas o básico)", "Baixo (ainda estou buscando informações)"] },
  { id: 6, text: "Qual a sua renda familiar mensal aproximada?", options: ["Até 2 salários mínimos", "De 2 a 5 salários mínimos", "De 5 a 10 salários mínimos", "Mais de 10 salários mínimos"] },
  { id: 7, text: "Como você tomou conhecimento deste processo seletivo?", options: ["Redes Sociais (Instagram, Facebook, LinkedIn)", "Site oficial da Marinha ou Gov.br", "Indicação de amigos ou familiares", "Noticiários e jornais"] },
  { id: 8, text: "Você possui disponibilidade para residir em qualquer estado onde a Marinha do Brasil atua?", options: ["Sim, total disponibilidade", "Apenas em determinados estados/regiões", "Não, apenas no meu estado atual"] },
  { id: 9, text: "Qual o seu nível de proficiência em língua inglesa?", options: ["Básico (leitura inicial)", "Intermediário (leitura e conversação básica)", "Avançado / Fluente", "Não possuo conhecimentos"] },
  { id: 10, text: "Você se considera apto(a) a servir em regimes diferenciados (ex: embarcado ou escalas)?", options: ["Sim, sem restrições", "Sim, mas prefiro regime administrativo", "Não, apenas regime administrativo"] },
];

interface Props { cpfData: CpfData; onNext: () => void; onBack: () => void; }

const StepFormulario = ({ cpfData, onNext }: Props) => {
  const [cargo, setCargo] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);

  const totalFields = QUESTIONS.length + 1;
  const filledFields = (cargo ? 1 : 0) + Object.keys(answers).length;
  const progress = Math.round((filledFields / totalFields) * 100);
  const allAnswered = !!cargo && Object.keys(answers).length === QUESTIONS.length;

  const handleAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    if (!cargo) { setError("Por favor, selecione o cargo desejado."); return; }
    const unanswered = QUESTIONS.find((q) => !answers[q.id]);
    if (unanswered) { setError(`Por favor, responda a questão ${unanswered.id}.`); return; }
    setError(null);
    onNext();
  };

  const inputClass = "w-full px-4 py-3 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Questionário Socioeconômico</h2>
          <p className="text-muted-foreground mt-1">As informações abaixo são fundamentais para o processo de inscrição.</p>
        </div>

        <div className="border-l-4 border-navy bg-muted rounded-r-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:gap-12 gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Candidato</span>
              <p className="font-bold text-foreground">{cpfData.nome ? String(cpfData.nome) : "CANDIDATO"}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">CPF</span>
              <p className="font-bold text-foreground">{cpfData.cpf ? String(cpfData.cpf) : "---"}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progresso do questionário</span>
          <div className="w-full bg-muted rounded-full h-3 mt-2 overflow-hidden">
            <div className="h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, background: "linear-gradient(90deg, hsl(var(--navy-blue)) 0%, hsl(150, 80%, 45%) 100%)" }} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 mb-5">
          <h3 className="text-base font-bold text-foreground mb-3">Selecione o cargo para o qual deseja se inscrever:</h3>
          <select value={cargo} onChange={(e) => setCargo(e.target.value)} className={cn(inputClass, !cargo && "text-muted-foreground")}>
            <option value="">Selecione uma opção</option>
            {CARGO_GROUPS.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((c) => (<option key={c} value={c}>{c}</option>))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="space-y-5">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-base font-bold text-foreground mb-4">{q.id}. {q.text}</h3>
              <div className="space-y-3">
                {q.options.map((opt) => (
                  <label key={opt} className={cn("flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors", answers[q.id] === opt ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50")}>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", answers[q.id] === opt ? "border-primary" : "border-muted-foreground/40")}>
                      {answers[q.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                    <span className="text-sm text-foreground">{opt}</span>
                    <input type="radio" name={`question-${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => handleAnswer(q.id, opt)} className="sr-only" />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md p-3 mt-5">{error}</div>}

        <button onClick={handleSubmit} disabled={!allAnswered} className="w-full mt-8 py-4 rounded-md bg-primary text-primary-foreground font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
          Confirmar e Continuar <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepFormulario;