interface ProgressIndicatorProps {
  currentStep: number;
}

export const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  const steps = ["Profile", "Portfolio", "Goals", "Results"];

  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex items-center ${
            index < steps.length - 1 ? "flex-1" : ""
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 flex-1 mx-2 ${
                index < currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
