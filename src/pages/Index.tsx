import { useState, useEffect } from "react";
import GovBar from "@/components/GovBar";
import NavyHeader from "@/components/NavyHeader";
import Stepper from "@/components/Stepper";
import StepPresell from "@/components/StepPresell";
import StepInicio from "@/components/StepInicio";
import StepDados from "@/components/StepDados";
import StepEndereco from "@/components/StepEndereco";
import StepFormulario from "@/components/StepFormulario";
import StepAgendamento from "@/components/StepAgendamento";
import StepConfirmacao from "@/components/StepConfirmacao";
import StepPagamento from "@/components/StepPagamento";
import type { CpfData } from "@/types/registration";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cpfData, setCpfData] = useState<CpfData | null>(null);
  const [enderecoUf, setEnderecoUf] = useState("");

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", currentStep === 0 ? "index, follow" : "noindex, nofollow");

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://ingressemarinheiro.site/");
  }, [currentStep]);

  const goTo = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <GovBar />
      <NavyHeader />
      {currentStep >= 1 && currentStep <= 5 && <Stepper currentStep={currentStep} />}

      {currentStep === 0 && (
        <StepPresell onNext={() => goTo(1)} />
      )}
      <div data-nosnippet>
        {currentStep === 1 && (
          <StepInicio onNext={(data) => { setCpfData(data); goTo(2); }} />
        )}
        {currentStep === 2 && cpfData && (
          <StepDados cpfData={cpfData} onNext={() => goTo(3)} onBack={() => goTo(1)} />
        )}
        {currentStep === 3 && cpfData && (
          <StepEndereco cpfData={cpfData} onNext={(uf) => { setEnderecoUf(uf); goTo(4); }} onBack={() => goTo(2)} />
        )}
        {currentStep === 4 && cpfData && (
          <StepFormulario cpfData={cpfData} onNext={() => goTo(5)} onBack={() => goTo(3)} />
        )}
        {currentStep === 5 && cpfData && (
          <StepAgendamento cpfData={cpfData} uf={enderecoUf} onNext={() => goTo(6)} onBack={() => goTo(4)} />
        )}
        {currentStep === 6 && cpfData && (
          <StepConfirmacao cpfData={cpfData} onNext={() => goTo(7)} />
        )}
        {currentStep === 7 && cpfData && (
          <StepPagamento cpfData={cpfData} />
        )}
      </div>

      <footer className="text-center text-xs text-muted-foreground py-6 px-4">
        Brasília, DF - 2026 | Concurso Público regido pelo edital nº 01/2026.
      </footer>
    </div>
  );
};

export default Index;