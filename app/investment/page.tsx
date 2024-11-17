"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const RISK_LEVELS = ["Conservative", "Moderate", "Aggressive"];
const ASSET_CLASSES = ["Stocks", "Bonds", "Cash", "Real Estate"];
const INVESTMENT_PREFERENCES = [
  "Index Funds",
  "ETFs",
  "Individual Stocks",
  "Real Estate",
  "Bonds",
  "Commodities",
];

interface Portfolio {
  name: string;
  value: number;
  amount: string;
}

interface OptimizationResult {
  currentPortfolio: Portfolio[];
  optimizedPortfolio: Portfolio[];
  expectedReturn: number;
  riskLevel: number;
  timelineImpact: number;
}

export default function InvestmentPortfolioOptimizer() {
  const [expectedReturn, setExpectedReturn] = useState(8.0); // New state for custom return
  const [age, setAge] = useState(30);
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [riskTolerance, setRiskTolerance] = useState(1); // 0: Conservative, 1: Moderate, 2: Aggressive
  const [timeHorizon, setTimeHorizon] = useState(20);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [currentPortfolio, setCurrentPortfolio] = useState<{
    [key: string]: number;
  }>({
    Stocks: 60,
    Bonds: 30,
    Cash: 5,
    "Real Estate": 5,
  });
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  const handleCurrentPortfolioChange = (assetClass: string, value: number) => {
    setCurrentPortfolio((prev) => ({
      ...prev,
      [assetClass]: value,
    }));
  };

  const optimizePortfolio = () => {
    const portfolios = [
      [20, 50, 25, 5], // Conservative
      [50, 30, 10, 10], // Moderate
      [70, 20, 5, 5], // Aggressive
    ];

    const baseReturns = [6, 8, 10]; // Base expected returns
    const riskLevels = [0.05, 0.12, 0.18]; // Standard deviation for each risk level
    const selectedPortfolio = portfolios[riskTolerance];
    
    const currentTotal = Object.values(currentPortfolio).reduce((a, b) => a + b, 0);
    const normalizedCurrent = ASSET_CLASSES.map((assetClass) => ({
      name: assetClass,
      value: currentTotal === 0 ? 0 : (currentPortfolio[assetClass] / currentTotal) * 100,
      amount: formatMoney(investmentAmount * (currentTotal === 0 ? 0 : currentPortfolio[assetClass] / currentTotal) / 100),
    }));

    const optimized = ASSET_CLASSES.map((assetClass, index) => ({
      name: assetClass,
      value: selectedPortfolio[index],
      amount: formatMoney(investmentAmount * selectedPortfolio[index] / 100),
    }));

    // Use custom expected return for moderate risk, base returns for others
    const portfolioReturn = riskTolerance === 1 ? expectedReturn : baseReturns[riskTolerance];
    const riskLevel = riskLevels[riskTolerance];
    
    const futureValue = investmentAmount * Math.pow(1 + portfolioReturn / 100, timeHorizon);
    const timelineImpact = Math.round(futureValue / investmentAmount - 1);

    setOptimizationResult({
      currentPortfolio: normalizedCurrent,
      optimizedPortfolio: optimized,
      expectedReturn: portfolioReturn,
      riskLevel,
      timelineImpact,
    });
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskDescription = () => {
    switch (riskTolerance) {
      case 0:
        return "Conservative: Focus on capital preservation with steady, modest returns";
      case 1:
        return "Moderate: Balance between growth and stability";
      case 2:
        return "Aggressive: Maximum growth potential with higher volatility";
      default:
        return "";
    }
  };

  const COLORS = {
    Stocks: "hsl(var(--chart-1))",
    Bonds: "hsl(var(--chart-2))",
    Cash: "hsl(var(--chart-3))",
    "Real Estate": "hsl(var(--chart-4))",
  };

  const CustomPieChart = ({ data, title }: { data: Portfolio[]; title: string }) => (
    <div className="relative">
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={({ name, value }) => `${value}%`}
            outerRadius={100}
            innerRadius={60}
            paddingAngle={2}
            dataKey="value">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name as keyof typeof COLORS]}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold" style={{ color: COLORS[data.name as keyof typeof COLORS] }}>
                      {data.name}
                    </p>
                    <p className="text-sm">
                      Allocation: {data.value}%
                    </p>
                    <p className="text-sm">
                      Amount: {data.amount}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2">
        <ul className="flex flex-wrap justify-center gap-3 text-sm">
          {data.map((entry, index) => (
            <li key={`legend-${index}`} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
              />
              <span className="text-xs">{entry.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Investment Portfolio Optimizer</h1>
      <p className="text-gray-600 mb-8">
        Optimize your investment strategy based on your risk tolerance and goals.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Tell us about your investment goals</CardDescription>
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
                  <Label htmlFor="timeHorizon">Investment Time Horizon (years)</Label>
                  <Input
                    id="timeHorizon"
                    type="number"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(Number(e.target.value))}
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
                  <p className="text-sm text-gray-500">{getRiskDescription()}</p>
                </div>
                <div>
                  <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    step="0.1"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Historical S&P 500 average return is around 10% (7% after inflation)
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Portfolio Allocation</CardTitle>
              <CardDescription>Enter your current investment allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ASSET_CLASSES.map((assetClass) => (
                  <div key={assetClass}>
                    <Label>{assetClass} (%)</Label>
                    <Input
                      type="number"
                      value={currentPortfolio[assetClass]}
                      onChange={(e) =>
                        handleCurrentPortfolioChange(assetClass, Number(e.target.value))
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button onClick={optimizePortfolio} className="w-full">
            Optimize Portfolio
          </Button>
        </div>

        <div className="space-y-8">
          {optimizationResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Comparison</CardTitle>
                  <CardDescription>Current vs. Optimized Portfolio</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-8">
                    <CustomPieChart 
                      data={optimizationResult.currentPortfolio}
                      title="Current Portfolio"
                    />
                    <CustomPieChart 
                      data={optimizationResult.optimizedPortfolio}
                      title="Optimized Portfolio"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Metrics</CardTitle>
                  <CardDescription>Key portfolio statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500">Expected Annual Return</h3>
                      <p className="text-2xl font-bold text-primary">
                        {optimizationResult.expectedReturn.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500">Risk Level (Volatility)</h3>
                      <p className="text-2xl font-bold text-primary">
                        {(optimizationResult.riskLevel * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-500">Future Value ({timeHorizon} years)</h3>
                      <p className="text-2xl font-bold text-primary">
                        {formatMoney(investmentAmount * Math.pow(1 + optimizationResult.expectedReturn / 100, timeHorizon))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Analysis</CardTitle>
                  <CardDescription>How this affects your retirement timeline</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Impact on Retirement Timeline</h3>
                      <p className="text-lg">
                        {optimizationResult.timelineImpact > 0 ? (
                          <span className="text-green-600">
                            Reduces time to retirement by approximately{" "}
                            {optimizationResult.timelineImpact} years
                          </span>
                        ) : optimizationResult.timelineImpact < 0 ? (
                          <span className="text-red-600">
                            Increases time to retirement by approximately{" "}
                            {Math.abs(optimizationResult.timelineImpact)} years
                          </span>
                        ) : (
                          <span className="text-gray-600">
                            No significant impact on retirement timeline
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Detailed Allocation</h3>
                      <div className="space-y-2">
                        {optimizationResult.optimizedPortfolio.map((asset) => (
                          <div key={asset.name} className="flex justify-between">
                            <span>{asset.name}</span>
                            <span>
                              {asset.amount} ({asset.value}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
