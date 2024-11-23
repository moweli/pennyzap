interface RiskScoreGaugeProps {
  score: number;
}

export const RiskScoreGauge = ({ score }: RiskScoreGaugeProps) => {
  const percentage = (score / 100) * 100;
  
  return (
    <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden">
      <div
        className="absolute h-full bg-primary transition-all duration-500 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {score.toFixed(1)}
      </div>
    </div>
  );
};
