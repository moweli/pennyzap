"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
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
  Tooltip,
} from "recharts";
import { Calculator, TrendingDown, DollarSign } from "lucide-react";

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
  const [expectedReturn, setExpectedReturn] = useState(6.0);
  const [inflationRate, setInflationRate] = useState(2.0);
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
        <AreaChart
          width={711}
          height={400}
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
      </ChartContainer>
    ),
    [results]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden bg-gradient-to-br from-rose-900 via-red-800 to-orange-700 w-full">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16" />
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="border-orange-200/10 text-orange-200 mb-4">
              Retirement Withdrawal Planner
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl/none mb-4">
              Plan Your Retirement Income
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-orange-100">
              Optimize your retirement withdrawals to ensure your savings last through your golden years.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-primary" />
                <Badge variant="secondary">Withdrawal Strategy</Badge>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Smart Withdrawal Planning</h2>
              <p className="text-muted-foreground">
                Compare different withdrawal strategies to find the best fit for your retirement
              </p>
            </div>
          </div>

          {/* Input Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <CardTitle>Portfolio Details</CardTitle>
                </div>
                <CardDescription>Enter your portfolio and retirement details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Initial Portfolio Value</Label>
                  <Input
                    type="number"
                    value={portfolioValue}
                    onChange={(e) => setPortfolioValue(Number(e.target.value))}
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Annual Expenses</Label>
                  <Input
                    type="number"
                    value={annualExpenses}
                    onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Retirement Duration (Years)</Label>
                  <Input
                    type="number"
                    value={retirementYears}
                    onChange={(e) => setRetirementYears(Number(e.target.value))}
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <CardTitle>Strategy Settings</CardTitle>
                </div>
                <CardDescription>Configure your withdrawal strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Withdrawal Strategy</Label>
                  <Select value={withdrawalStrategy} onValueChange={setWithdrawalStrategy}>
                    <SelectTrigger>
                      <SelectValue />
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
                <div className="space-y-2">
                  <Label>Expected Return (%)</Label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                    step="0.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Inflation Rate (%)</Label>
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="[&::-webkit-inner-spin-button]:appearance-none"
                    step="0.1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          {results && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  <CardTitle>Withdrawal Projection</CardTitle>
                </div>
                <CardDescription>Your projected portfolio value and withdrawals over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ChartContainer config={{}}>
                    <AreaChart
                      data={results}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="portfolioValue"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary)/.2)"
                        name="Portfolio Value"
                      />
                      <Area
                        type="monotone"
                        dataKey="withdrawal"
                        stroke="hsl(var(--destructive))"
                        fill="hsl(var(--destructive)/.2)"
                        name="Withdrawal Amount"
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={calculateWithdrawal}
            >
              Calculate Withdrawal Strategy
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
