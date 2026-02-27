import { useState } from "react";
import { AlertTriangle, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CpfData } from "@/types/registration";

interface Props {
  cpfData: CpfData;
  onNext: () => void;
}

const StepConfirmacao = ({ cpfData, onNext }: Props) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Confirmação de Inscrição</h2>
        <p className="text-muted-foreground mt-1">Sua pré-inscrição foi realizada com sucesso. Confira as informações abaixo.</p>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-4 sm:p-6 md:p-10">
        <div className="border-l-4 border-navy bg-muted rounded-r-md p-4 mb-8">
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

        <div className="space-y-6 mb-8">
          <div className="border-l-4 border-navy pl-4">
            <h3 className="text-base font-bold text-foreground mb-3">Formato da Prova</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="font-semibold text-foreground">Questões objetivas:</span> Múltipla escolha (Português, Matemática, Conhecimentos Gerais).</li>
              <li><span className="font-semibold text-foreground">Conhecimentos específicos:</span> Prova técnica conforme o cargo selecionado.</li>
              <li><span className="font-semibold text-foreground">Exames médicos:</span> Avaliação de aptidão física e mental para a função.</li>
            </ul>
          </div>
          <div className="border-l-4 border-navy pl-4">
            <h3 className="text-base font-bold text-foreground mb-3">Critérios de Aprovação</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Atingir nota mínima na prova objetiva estabelecida no edital.</li>
              <li>Ser aprovado em todas as etapas eliminatórias.</li>
              <li>Classificação final dentro do número de vagas oferecidas (1.680 vagas).</li>
            </ul>
          </div>
          <div className="border-l-4 border-navy pl-4">
            <h3 className="text-base font-bold text-foreground mb-3">Próximas Etapas</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>Convocação para exames médicos e investigação social.</li>
              <li>Curso de formação para novos servidores.</li>
              <li>Nomeação e posse no cargo pretendido.</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg p-5 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-700 dark:text-amber-400">PAGAMENTO PENDENTE:</span>{" "}
              <span className="text-sm text-amber-700 dark:text-amber-300">
                Sua inscrição ainda não foi confirmada. Para garantir sua participação no Concurso Público Marinha do Brasil 2026, é necessário efetuar o pagamento da taxa de inscrição imediatamente.
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowDialog(true)}
          className="w-full py-3 sm:py-4 rounded-md font-semibold uppercase tracking-wider flex items-center justify-center gap-2 text-primary-foreground transition-opacity hover:opacity-90 text-xs sm:text-sm md:text-base px-3"
          style={{ background: "linear-gradient(135deg, hsl(var(--navy-blue)) 0%, hsl(150, 60%, 35%) 100%)" }}
        >
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Pagar Taxa e Concluir Inscrição</span>
        </button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md p-4 sm:p-6 rounded-xl mx-auto">
            <DialogTitle className="sr-only">Aviso Importante</DialogTitle>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <h3 className="text-lg font-bold text-destructive uppercase">Aviso Importante</h3>
              </div>
              <p className="text-sm text-foreground">
                Ao prosseguir, você concorda com os termos do edital e se compromete a realizar o pagamento obrigatório da taxa de inscrição no valor de <span className="font-bold text-destructive">R$ 41,50</span>.
              </p>
              <div className="bg-muted rounded-lg p-4 text-left">
                <p className="text-sm font-bold text-foreground mb-2 text-center">Atenção:</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>O código PIX é gerado apenas uma vez por CPF.</li>
                  <li>O código tem validade de <span className="font-bold">10 minutos</span>.</li>
                  <li>O não pagamento no prazo pode invalidar sua inscrição.</li>
                </ul>
              </div>
              <p className="text-sm text-foreground font-semibold">✅ Sua inscrição será confirmada automaticamente após o pagamento.</p>
              <button
                onClick={() => { setShowDialog(false); onNext(); }}
                className="w-full py-4 rounded-lg font-bold uppercase tracking-wider text-primary-foreground text-sm"
                style={{ background: "linear-gradient(135deg, hsl(var(--navy-blue)) 0%, hsl(150, 60%, 35%) 100%)" }}
              >
                Vou Realizar o Pagamento Agora
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="mt-6 bg-muted rounded-lg p-4 border border-border">
          <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Aviso Importante</p>
          <p className="text-xs text-muted-foreground mb-2">
            Ao prosseguir, você concorda com os termos do edital e se compromete a realizar o pagamento obrigatório da taxa de inscrição no valor de <span className="font-bold">R$ 41,50</span>.
          </p>
          <p className="text-xs font-semibold text-muted-foreground mb-1">Atenção:</p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 mb-2">
            <li>O código PIX é gerado apenas uma vez por CPF.</li>
            <li>O código tem validade de <span className="font-bold">10 minutos</span>.</li>
            <li>O não pagamento no prazo pode invalidar sua inscrição.</li>
          </ul>
          <p className="text-xs text-muted-foreground">✅ Sua inscrição será confirmada automaticamente após o pagamento.</p>
        </div>
      </div>
    </div>
  );
};

export default StepConfirmacao;