import { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CpfData } from "@/types/registration";

const FAKE_NAMES = [
  "JEFFERSON GABRIEL SOUZA DE OLIVEIRA",
  "LUCAS PEREIRA MENDES",
  "CARLOS EDUARDO SILVA SANTOS",
  "RAFAEL AUGUSTO LIMA FERREIRA",
  "BRUNO HENRIQUE COSTA ALMEIDA",
  "ANDERSON LUIZ RIBEIRO MARTINS",
  "FERNANDO ANTONIO DIAS ROCHA",
  "THIAGO RODRIGUES NASCIMENTO",
  "GUSTAVO FELIPE MOREIRA BARBOSA",
  "DIEGO ALEXSANDRO GOMES ARAUJO",
  "PEDRO LUCAS CARVALHO MONTEIRO",
  "MARCOS VINICIUS TEIXEIRA RAMOS",
  "MATHEUS HENRIQUE PINTO CARDOSO",
  "WILLIAM PATRICK CORREIA NUNES",
  "DANIEL FRANCISCO BATISTA FREITAS",
];

const FAKE_DATES = [
  "17/08/2002", "25/03/1998", "14/11/1995", "03/06/2000", "22/01/1997",
  "09/09/1999", "30/04/1994", "12/12/2001", "07/02/1993", "19/10/1996",
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface Props {
  cpfData: CpfData;
  onNext: () => void;
  onBack: () => void;
}

type QuizPhase = "name" | "date";

const StepDados = ({ cpfData, onNext }: Props) => {
  const [phase, setPhase] = useState<QuizPhase>("name");
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const realName = cpfData.nome ? String(cpfData.nome).toUpperCase() : "CANDIDATO";
  const realDate = cpfData.data_nascimento ? String(cpfData.data_nascimento) : "";

  const nameOptions = useMemo(() => {
    const filtered = FAKE_NAMES.filter((n) => n.toUpperCase() !== realName);
    const picked = shuffleArray(filtered).slice(0, 2);
    return shuffleArray([realName, ...picked]);
  }, [realName]);

  const dateOptions = useMemo(() => {
    const filtered = FAKE_DATES.filter((d) => d !== realDate);
    const picked = shuffleArray(filtered).slice(0, 2);
    return shuffleArray([realDate, ...picked]);
  }, [realDate]);

  const currentOptions = phase === "name" ? nameOptions : dateOptions;
  const correctAnswer = phase === "name" ? realName : realDate;
  const questionText = phase === "name" ? "Confirme seu nome completo:" : "Confirme sua data de nascimento:";
  const errorText = phase === "name"
    ? "Nome incorreto. Por favor, selecione o nome correto para continuar."
    : "Data incorreta. Por favor, selecione a data correta para continuar.";
  const emptyText = phase === "name"
    ? "Por favor, selecione seu nome para continuar."
    : "Por favor, selecione sua data de nascimento para continuar.";

  const handleSubmit = () => {
    if (selected === null) { setError(emptyText); return; }
    if (currentOptions[selected] !== correctAnswer) { setError(errorText); setSelected(null); return; }
    setError(null);
    setSelected(null);
    if (phase === "name") { setPhase("date"); } else { onNext(); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Validação de Identidade</h2>
          <p className="text-muted-foreground mt-1">Confirme seus dados para prosseguir com a inscrição</p>
        </div>

        <p className="font-bold text-foreground mb-4">{questionText}</p>

        <div className="space-y-3 mb-8">
          {currentOptions.map((option, index) => (
            <button
              key={`${phase}-${index}`}
              onClick={() => { setSelected(index); setError(null); }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-lg border-2 text-left transition-all",
                selected === index ? "border-navy bg-secondary" : "border-input bg-card hover:border-muted-foreground"
              )}
            >
              <span className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                selected === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {index + 1}
              </span>
              <span className="font-semibold text-foreground text-sm sm:text-base">{option}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md p-3 mb-4">{error}</div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-md bg-primary text-primary-foreground font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          Confirmar e Continuar <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepDados;