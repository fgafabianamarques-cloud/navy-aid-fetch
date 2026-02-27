import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import marinhaLogo from "@/assets/marinha-logo.svg";

interface Props {
  onNext: () => void;
}

const DELAY_MS = 5000;

const StepPresell = ({ onNext }: Props) => {
  const [secondsLeft, setSecondsLeft] = useState(DELAY_MS / 1000);
  const [interacted, setInteracted] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const timerDone = secondsLeft <= 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const mark = () => setInteracted(true);
    window.addEventListener("scroll", mark, { once: true, passive: true });
    window.addEventListener("mousemove", mark, { once: true, passive: true });
    window.addEventListener("touchstart", mark, { once: true, passive: true });
    return () => {
      window.removeEventListener("scroll", mark);
      window.removeEventListener("mousemove", mark);
      window.removeEventListener("touchstart", mark);
    };
  }, []);

  const isReady = timerDone && interacted;

  const handleClick = () => {
    if (honeypotRef.current?.value) return;
    if (!isReady) return;
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 sm:p-10 text-center">
        <img src={marinhaLogo} alt="Marinha do Brasil" className="w-20 h-20 mx-auto mb-6" />

        <span className="inline-block bg-accent text-accent-foreground text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-4">
          Inscrições Abertas
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Concurso Marinha do Brasil 2026
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Garanta sua vaga com salários de até R$ 9.663,60 + benefícios. Vagas para todos os níveis.
        </p>

        <input
          ref={honeypotRef}
          type="text"
          name="website_url"
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute opacity-0 h-0 w-0 pointer-events-none"
        />

        <button
          onClick={handleClick}
          disabled={!isReady}
          className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-md inline-flex items-center justify-center gap-2 hover:opacity-90 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!timerDone ? (
            <>Aguarde {secondsLeft}s...</>
          ) : (
            <>Fazer Minha Inscrição <ArrowRight className="w-5 h-5" /></>
          )}
        </button>

        <p className="text-xs text-muted-foreground mt-6">
          Ao continuar, você concorda com nossa{" "}
          <Link to="/politica-de-privacidade" className="underline hover:text-foreground">
            Política de Privacidade
          </Link>.
        </p>
      </div>
    </div>
  );
};

export default StepPresell;