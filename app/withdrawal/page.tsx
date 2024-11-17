"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const WITHDRAWAL_STRATEGIES = [
  { value: "4percent", label: "4% Rule" },
  { value: "variable", label: "Variable Percentage" },
  { value: "fixed", label: "Fixed Dollar" },
];

interface WithdrawalResult {
  year: number;
  withdrawal: number;
  portfolioValue: number;
  inflationAdjustedExpenses: number;
}

export default function WithdrawalStrategyPlanner() {
  const [portfolioValue, setPortfolioValue] = useState(1000000);
  const [retirementYears, setRetirementYears] = useState(30);
  const [annualExpenses, setAnnualExpenses] = useState(40000);
  const [withdrawalStrategy, setWithdrawalStrategy] = useState("4percent");
  const [expectedReturn, setExpectedReturn] = useState(6.0); // as percentage
  const [inflationRate, setInflationRate] = useState(2.0); // as percentage
  const [results, setResults] = useState<WithdrawalResult[] | null>(null);

  const calculateWithdrawal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let remainingPortfolio = portfolioValue;
    const withdrawalResults: WithdrawalResult[] = [];
    const returnRate = expectedReturn / 100;
    const inflationRateDecimal = inflationRate / 100;

    for (let year = 1; year <= retirementYears; year++) {
      let withdrawal;
      const inflationAdjustedExpenses = annualExpenses * Math.pow(1 + inflationRateDecimal, year - 1);

      switch (withdrawalStrategy) {
        case "4percent":
          withdrawal = portfolioValue * 0.04 * Math.pow(1 + inflationRateDecimal, year - 1);
          break;
        case "variable":
          withdrawal = remainingPortfolio * 0.05;
          break;
        case "fixed":
          withdrawal = inflationAdjustedExpenses;
          break;
        default:
          withdrawal = portfolioValue * 0.04 * Math.pow(1 + inflationRateDecimal, year - 1);
      }

      // Apply investment returns before withdrawal
      remainingPortfolio = Math.max(0, (remainingPortfolio * (1 + returnRate)) - withdrawal);

      withdrawalResults.push({
        year,
        withdrawal: Math.round(withdrawal),
        portfolioValue: Math.round(remainingPortfolio),
        inflationAdjustedExpenses: Math.round(inflationAdjustedExpenses),
      });

      if (remainingPortfolio <= 0) break;
    }

    setResults(withdrawalResults);
  };

  const chartConfig: ChartConfig = {
    portfolioValue: {
      label: "Portfolio Value",
      color: "hsl(var(--chart-1))",
    },
    withdrawal: {
      label: "Annual Withdrawal",
      color: "hsl(var(--chart-2))",
    },
    inflationAdjustedExpenses: {
      label: "Inflation-Adjusted Expenses",
      color: "hsl(var(--chart-3))",
    },
  };

  const formatMoney = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStrategyDescription = () => {
    switch (withdrawalStrategy) {
      case "4percent":
        return "The 4% Rule suggests withdrawing 4% of your initial portfolio value annually, adjusted for inflation. This is a widely-used rule of thumb for retirement planning.";
      case "variable":
        return "Variable withdrawal takes 5% of your current portfolio value each year. This adjusts your withdrawals based on market performance, providing flexibility but less predictable income.";
      case "fixed":
        return "Fixed withdrawal maintains your desired annual expenses, adjusted for inflation. This provides steady income but may deplete your portfolio faster in down markets.";
      default:
        return "";
    }
  };

  const getPortfolioHealth = () => {
    if (!results) return null;
    
    const finalValue = results[results.length - 1].portfolioValue;
    const initialValue = portfolioValue;
    
    if (finalValue <= 0) return {
      status: "critical",
      message: "Your portfolio may be depleted before the end of your retirement period.",
      color: "text-red-600",
    };
    
    if (finalValue >= initialValue) return {
      status: "excellent",
      message: "Your portfolio is very healthy and likely to grow throughout retirement.",
      color: "text-green-600",
    };
    
    if (finalValue >= initialValue * 0.5) return {
      status: "good",
      message: "Your portfolio is sustainable but will decline over time.",
      color: "text-emerald-600",
    };
    
    return {
      status: "warning",
      message: "Your portfolio may be at risk of significant depletion.",
      color: "text-yellow-600",
    };
  };

  const memoizedChart = useMemo(
    () => (
      <ChartContainer config={chartConfig} className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={
              results && results.length > 0
                ? results
                : [
                    {
                      year: 1,
                      withdrawal: 0,
                      portfolioValue: 0,
                      inflationAdjustedExpenses: 0,
                    },
                  ]
            }
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPortfolioValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorWithdrawal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tickFormatter={(value) => `Year ${value}`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) =>
                `$${(value / 1000).toFixed(0)}k`
              }
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg text-sm">
                      <p className="font-bold mb-2">Year {label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className={`flex justify-between items-center gap-4 ${index < payload.length - 1 ? 'mb-1' : ''}`}>
                          <span style={{ color: entry.color }}>{entry.name}:</span>
                          <span className="font-semibold">{formatMoney(Number(entry.value))}</span>
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="portfolioValue"
              name="Portfolio Value"
              stroke="var(--color-portfolioValue)"
              fill="url(#colorPortfolioValue)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="withdrawal"
              name="Annual Withdrawal"
              stroke="var(--color-withdrawal)"
              fill="url(#colorWithdrawal)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="inflationAdjustedExpenses"
              name="Inflation-Adjusted Expenses"
              stroke="var(--color-inflationAdjustedExpenses)"
              fill="url(#colorExpenses)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    ),
    [results]
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Withdrawal Strategy Planner</h1>
      <p className="text-gray-600 mb-8">
        Plan your retirement withdrawals and visualize portfolio sustainability over time.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Your Withdrawal Strategy</CardTitle>
              <CardDescription>Enter your retirement portfolio details</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="portfolioValue">Initial Portfolio Value ($)</Label>
                  <Input
                    id="portfolioValue"
                    type="number"
                    value={portfolioValue}
                    onChange={(e) => setPortfolioValue(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="retirementYears">Retirement Duration (years)</Label>
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
                <div>
                  <Label htmlFor="inflationRate">Expected Inflation Rate (%)</Label>
                  <Input
                    id="inflationRate"
                    type="number"
                    step="0.1"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Historical average is around 2-3% in developed economies
                  </p>
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
                  <p className="mt-2 text-sm text-gray-500">{getStrategyDescription()}</p>
                </div>
                <Button onClick={calculateWithdrawal} className="w-full">
                  Calculate Strategy
                </Button>
              </form>
            </CardContent>
          </Card>

          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Summary of your withdrawal strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500">Initial Annual Withdrawal</h3>
                    <p className="text-2xl font-bold text-primary">
                      {formatMoney(results[0].withdrawal)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500">Final Portfolio Value</h3>
                    <p className="text-2xl font-bold text-primary">
                      {formatMoney(results[results.length - 1].portfolioValue)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500">Portfolio Sustainability</h3>
                    <p className={`text-lg ${getPortfolioHealth()?.color}`}>
                      {getPortfolioHealth()?.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {results && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Projection</CardTitle>
                  <CardDescription>{retirementYears}-year withdrawal strategy simulation</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {memoizedChart}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assumptions</CardTitle>
                  <CardDescription>Key assumptions used in calculations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Return:</span>
                      <span className="font-semibold">{expectedReturn.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Inflation Rate:</span>
                      <span className="font-semibold">{inflationRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Real Return:</span>
                      <span className="font-semibold">{(expectedReturn - inflationRate).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Horizon:</span>
                      <span className="font-semibold">{retirementYears} years</span>
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
