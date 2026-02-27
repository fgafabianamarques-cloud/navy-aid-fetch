import { cn } from "@/lib/utils";

const steps = [
  { number: 1, label: "INÍCIO" },
  { number: 2, label: "DADOS" },
  { number: 3, label: "ENDEREÇO" },
  { number: 4, label: "FORMULÁRIO" },
  { number: 5, label: "AGENDAMENTO" },
];

interface StepperProps {
  currentStep?: number;
}

const Stepper = ({ currentStep = 1 }: StepperProps) => {
  return (
    <div className="flex items-center justify-center py-6 sm:py-8 px-2 w-full">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-colors shrink-0",
                step.number === currentStep
                  ? "bg-step-active border-step-active text-primary-foreground"
                  : "bg-card border-step-inactive text-step-inactive"
              )}
            >
              {step.number}
            </div>
            <span
              className={cn(
                "text-[8px] sm:text-[10px] mt-1 font-semibold tracking-wider",
                step.number === currentStep
                  ? "text-step-active"
                  : "text-step-inactive"
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-6 sm:w-20 h-[2px] bg-step-inactive mx-0.5 sm:mx-1 mb-5" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;