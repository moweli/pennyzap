"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const RISK_LEVELS = ["Conservative", "Moderate", "Aggressive"];
const ASSET_CLASSES = ["Stocks", "Bonds", "Cash", "Real Estate"];

export default function InvestmentPortfolioOptimizer() {
  const [age, setAge] = useState(30);
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [riskTolerance, setRiskTolerance] = useState(1); // 0: Conservative, 1: Moderate, 2: Aggressive
  const [optimizedPortfolio, setOptimizedPortfolio] = useState<
    | {
        name: string;
        value: number;
        amount: string;
      }[]
    | null
  >(null);

  const optimizePortfolio = () => {
    // This is a simplified portfolio optimization logic
    // In a real application, this would be much more complex
    const portfolios = [
      [20, 50, 25, 5], // Conservative
      [50, 30, 10, 10], // Moderate
      [70, 20, 5, 5], // Aggressive
    ];

    const selectedPortfolio = portfolios[riskTolerance];
    const optimized = ASSET_CLASSES.map((assetClass, index) => ({
      name: assetClass,
      value: selectedPortfolio[index],
      amount: ((investmentAmount * selectedPortfolio[index]) / 100).toFixed(2),
    }));

    setOptimizedPortfolio(optimized);
  };

  const chartConfig = {
    Stocks: {
      label: "Stocks",
      color: "hsl(var(--chart-1))",
    },
    Bonds: {
      label: "Bonds",
      color: "hsl(var(--chart-2))",
    },
    Cash: {
      label: "Cash",
      color: "hsl(var(--chart-3))",
    },
    "Real Estate": {
      label: "Real Estate",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Investment Portfolio Optimizer
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Input Your Data</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="investmentAmount">Investment Amount ($)</Label>
                <Input
                  id="investmentAmount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Risk Tolerance</Label>
                <Slider
                  min={0}
                  max={2}
                  step={1}
                  value={[riskTolerance]}
                  onValueChange={(value) => setRiskTolerance(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  {RISK_LEVELS.map((level, index) => (
                    <span
                      key={level}
                      className={index === riskTolerance ? "font-bold" : ""}>
                      {level}
                    </span>
                  ))}
                </div>
              </div>
              <Button onClick={optimizePortfolio} className="w-full">
                Optimize Portfolio
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Optimized Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            {optimizedPortfolio && (
              <>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={optimizedPortfolio}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label>
                        {optimizedPortfolio.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`var(--color-${entry.name
                              .toLowerCase()
                              .replace(" ", "-")})`}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Allocation:</h3>
                  <ul className="space-y-1">
                    {optimizedPortfolio.map((asset) => (
                      <li key={asset.name} className="flex justify-between">
                        <span>{asset.name}</span>
                        <span>
                          ${asset.amount} ({asset.value}%)
                        </span>
                      </li>
                    ))}
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
