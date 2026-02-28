import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import type { CpfData } from "@/types/registration";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  cpfData: CpfData;
  transactionId: string;
}

const TAGS = [
  { id: "AW-17960420953/_L-HCLa1xYAcENmMmfRC", label: "Tag 1 (AW-17960420953)" },
  { id: "AW-17951920855/yPaKCLH8jf8bENelkvBC", label: "Tag 2 (AW-17951920855)" },
];

const StepPagamentoAprovado = ({ cpfData, transactionId }: Props) => {
  useEffect(() => {
    // Google Ads conversion tracking + log to database
    TAGS.forEach((tag) => {
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "conversion", {
          send_to: tag.id,
          value: 1.0,
          currency: "BRL",
          transaction_id: transactionId || "",
        });
      }

      // Log conversion to database
      supabase.functions.invoke("log-conversion", {
        body: {
          tag_id: tag.id,
          tag_label: tag.label,
          transaction_id: transactionId,
          customer_name: cpfData.nome || null,
          customer_cpf: cpfData.cpf || null,
          amount: 4150,
        },
      }).catch((err) => console.error("Error logging conversion:", err));
    });
  }, [transactionId, cpfData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-navy text-primary-foreground text-xs py-2 px-4">
        <div className="max-w-4xl mx-auto">Inscrição &gt; Pagamento &gt; Confirmado</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        <div className="bg-card border border-border rounded-lg p-6 sm:p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Pagamento Aprovado!
          </h2>
          <p className="text-muted-foreground mb-6">
            Seu pagamento foi confirmado com sucesso.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 sm:p-6 max-w-md mx-auto mb-6 text-left space-y-2 text-sm">
            <p>
              <span className="font-bold text-foreground">Nome:</span>{" "}
              <span className="text-foreground">{cpfData.nome || ""}</span>
            </p>
            <p>
              <span className="font-bold text-foreground">CPF:</span>{" "}
              <span className="text-foreground">{cpfData.cpf || ""}</span>
            </p>
            <p>
              <span className="font-bold text-foreground">Valor:</span>{" "}
              <span className="text-foreground font-bold">R$ 41,50</span>
            </p>
            <p>
              <span className="font-bold text-foreground">ID da Transação:</span>{" "}
              <span className="text-muted-foreground">{transactionId}</span>
            </p>
            <p>
              <span className="font-bold text-foreground">Status:</span>{" "}
              <span className="text-emerald-600 font-bold">Aprovado ✓</span>
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Um comprovante será enviado para o e-mail cadastrado.
          </p>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-8">
          © Concurso Marinha do Brasil 2026 | Ambiente Seguro
        </div>
      </div>
    </div>
  );
};

export default StepPagamentoAprovado;
