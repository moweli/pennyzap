import { Portfolio } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DiversificationChartProps {
  portfolio: Portfolio[];
}

export const DiversificationChart = ({ portfolio }: DiversificationChartProps) => {
  const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);
  const diversificationScore = Math.min(
    100,
    (portfolio.length / 4) * 100 * (1 - Math.max(...portfolio.map(a => a.value / totalValue)))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Diversification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Score:</span>
            <span className="font-semibold">{diversificationScore.toFixed(1)}%</span>
          </div>
          <div className="space-y-2">
            {portfolio.map((asset) => (
              <div key={asset.name} className="flex justify-between items-center">
                <span>{asset.name}</span>
                <span>{asset.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
