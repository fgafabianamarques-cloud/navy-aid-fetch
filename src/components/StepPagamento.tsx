import { useState, useEffect, useCallback } from "react";
import { Copy, AlertTriangle, Loader2, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/hooks/use-toast";
import type { CpfData } from "@/types/registration";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  cpfData: CpfData;
}

const StepPagamento = ({ cpfData }: Props) => {
  const { toast } = useToast();
  const [pixCode, setPixCode] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const createPix = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke("create-pix", {
          body: {
            name: cpfData.nome || "",
            document: cpfData.cpf || "",
            amount: 4150,
            description: "Pagamento seguro",
          },
        });

        if (fnError) throw fnError;

        if (data?.success) {
          setPixCode(data.qr_code || "");
          
          if (data.expires_at) {
            setExpiresAt(data.expires_at);
          }
        } else {
          setError(data?.error || "Erro ao gerar PIX.");
        }
      } catch (err: any) {
        console.error("Erro ao criar PIX:", err);
        setError("Erro ao gerar PIX. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    createPix();
  }, [cpfData]);

  // Timer de expiração
  useEffect(() => {
    if (!expiresAt) return;

    const calcTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) setExpired(true);
    };

    calcTimeLeft();
    const interval = setInterval(calcTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleCopy = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode).then(() => {
      toast({ title: "Código copiado!", description: "Cole no app do seu banco." });
    }).catch(() => {
      toast({ title: "Erro ao copiar", variant: "destructive" });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-navy text-primary-foreground text-xs py-2 px-4">
        <div className="max-w-4xl mx-auto">Inscrição &gt; Concurso Marinha &gt; Confirmação</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
        <div className="border border-navy rounded-lg p-4 sm:p-5 mb-6 text-center bg-card">
          <h2 className="text-base sm:text-lg font-bold text-navy uppercase mb-2">⚠ Aviso Importante!</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ao prosseguir, você concorda em adicionar seu CPF na lista de participantes do Concurso Público Marinha do Brasil 2026 e se compromete em concluir o processo de Inscrição!
          </p>
        </div>

        <div className="border border-border rounded-lg mb-6 bg-card">
          <div className="p-4 sm:p-5 border-b border-border">
            <h3 className="text-base sm:text-lg font-bold text-navy mb-1">Inscrição Marinha do Brasil</h3>
            <p className="text-sm font-semibold text-foreground mb-3">Detalhes do Pagamento</p>
            <div className="space-y-1 text-sm text-foreground">
              <p><span className="font-bold">Nome:</span> {cpfData.nome ? String(cpfData.nome) : ""}</p>
              <p><span className="font-bold">CPF:</span> {cpfData.cpf ? String(cpfData.cpf) : ""}</p>
              <p><span className="font-bold">Valor:</span> <span className="font-bold">R$ 41,50</span></p>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-muted/50 text-center">
            <h4 className="text-sm sm:text-base font-bold text-navy mb-2">Escaneie o QR Code PIX</h4>

            {timeLeft !== null && !loading && !error && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm font-semibold ${
                expired
                  ? "bg-destructive/10 text-destructive"
                  : timeLeft <= 120
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-emerald-100 text-emerald-800"
              }`}>
                <Clock className="w-4 h-4" />
                {expired ? "PIX expirado — gere um novo código" : `Expira em ${formatTime(timeLeft)}`}
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-navy" />
                <p className="text-sm text-muted-foreground font-medium">Gerando código PIX...</p>
              </div>
            ) : error ? (
              <div className="py-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <p className="text-sm text-destructive font-semibold">{error}</p>
                </div>
              </div>
            ) : expired ? (
              <div className="py-6">
                <div className="flex flex-col items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                  <p className="text-sm text-destructive font-semibold">Este código PIX expirou.</p>
                  <p className="text-xs text-muted-foreground">Recarregue a página para gerar um novo código.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto bg-card border border-border rounded-md mb-4 flex items-center justify-center overflow-hidden p-2">
                  {pixCode ? (
                    <QRCodeSVG value={pixCode} size={176} level="M" />
                  ) : (
                    <p className="text-xs text-muted-foreground">QR Code indisponível</p>
                  )}
                </div>

                <p className="text-sm font-semibold text-foreground mb-2">Copie o código PIX:</p>

                <div className="flex items-center border border-border rounded-md bg-card mb-3 mx-auto max-w-lg">
                  <input type="text" readOnly value={pixCode || "Erro: Pix não encontrado."} className="flex-1 px-3 py-2 text-xs bg-transparent text-muted-foreground truncate outline-none" />
                  <button onClick={handleCopy} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors border-l border-border" aria-label="Copiar código">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <button onClick={handleCopy} className="w-full max-w-lg mx-auto py-3 rounded-md font-bold uppercase tracking-wider text-primary-foreground text-sm flex items-center justify-center gap-2" style={{ background: "linear-gradient(135deg, hsl(var(--navy-blue)) 0%, hsl(150, 60%, 35%) 100%)" }}>
                  <Copy className="w-4 h-4" /> Copiar código do QR Code
                </button>
              </>
            )}

            <ol className="mt-5 text-xs sm:text-sm text-muted-foreground space-y-2 text-left max-w-lg mx-auto">
              <li><span className="font-bold">1.</span> Abra o ambiente do Pix do seu banco ou instituição financeira.</li>
              <li><span className="font-bold">2.</span> Copie o código em "Copiar código do QR Code" e selecione no seu app a opção "Pix Copia e Cola".</li>
            </ol>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">© Concurso Marinha do Brasil 2026 | Ambiente Seguro</div>
      </div>
    </div>
  );
};

export default StepPagamento;
