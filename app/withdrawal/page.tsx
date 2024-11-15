"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  //   Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WITHDRAWAL_STRATEGIES = [
  { value: "4percent", label: "4% Rule" },
  { value: "variable", label: "Variable Percentage" },
  { value: "fixed", label: "Fixed Dollar" },
];

export default function WithdrawalStrategyPlanner() {
  const [portfolioValue, setPortfolioValue] = useState(1000000);
  const [retirementYears, setRetirementYears] = useState(30);
  const [annualExpenses, setAnnualExpenses] = useState(40000);
  const [withdrawalStrategy, setWithdrawalStrategy] = useState("4percent");
  const [results, setResults] = useState<
    | {
        year: number;
        withdrawal: number;
        portfolioValue: number;
      }[]
    | null
  >(null);

  const calculateWithdrawal = () => {
    let remainingPortfolio = portfolioValue;
    const withdrawalResults = [];

    for (let year = 1; year <= retirementYears; year++) {
      let withdrawal;

      switch (withdrawalStrategy) {
        case "4percent":
          withdrawal = portfolioValue * 0.04;
          break;
        case "variable":
          withdrawal = remainingPortfolio * 0.05;
          break;
        case "fixed":
          withdrawal = annualExpenses;
          break;
        default:
          withdrawal = portfolioValue * 0.04;
      }

      remainingPortfolio = Math.max(0, remainingPortfolio - withdrawal);

      withdrawalResults.push({
        year,
        withdrawal: Math.round(withdrawal),
        portfolioValue: Math.round(remainingPortfolio),
      });

      if (remainingPortfolio <= 0) break;
    }

    setResults(withdrawalResults);
  };

  const chartConfig = {
    withdrawal: {
      label: "Annual Withdrawal",
      color: "hsl(var(--chart-1))",
    },
    portfolioValue: {
      label: "Remaining Portfolio Value",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Withdrawal Strategy Planner</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Plan Your Withdrawal Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="portfolioValue">
                  Initial Portfolio Value ($)
                </Label>
                <Input
                  id="portfolioValue"
                  type="number"
                  value={portfolioValue}
                  onChange={(e) => setPortfolioValue(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="retirementYears">
                  Retirement Duration (years)
                </Label>
                <Input
                  id="retirementYears"
                  type="number"
                  value={retirementYears}
                  onChange={(e) => setRetirementYears(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="annualExpenses">Annual Expenses ($)</Label>
                <Input
                  id="annualExpenses"
                  type="number"
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="withdrawalStrategy">Withdrawal Strategy</Label>
                <Select
                  value={withdrawalStrategy}
                  onValueChange={setWithdrawalStrategy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {WITHDRAWAL_STRATEGIES.map((strategy) => (
                      <SelectItem key={strategy.value} value={strategy.value}>
                        {strategy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={calculateWithdrawal} className="w-full">
                Calculate Withdrawal Strategy
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Strategy Projection</CardTitle>
          </CardHeader>
          <CardContent>
            {results && (
              <>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `Year ${value}`}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) =>
                          `$${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="withdrawal"
                        stroke="var(--color-withdrawal)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="portfolioValue"
                        stroke="var(--color-portfolioValue)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Summary:</h3>
                  <ul className="space-y-1">
                    <li>
                      Initial Portfolio: ${portfolioValue.toLocaleString()}
                    </li>
                    <li>
                      Final Portfolio: $
                      {results[
                        results.length - 1
                      ].portfolioValue.toLocaleString()}
                    </li>
                    <li>Years Sustained: {results.length}</li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
