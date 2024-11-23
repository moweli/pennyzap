"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Area, AreaChart, XAxis, YAxis, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label as UILabel } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Wallet, DollarSign, Target } from "lucide-react";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import confetti from "canvas-confetti";

const noSpinnerClass =
  "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

interface ProjectionResult {
  age: number;
  savings: number;
  expenses: number;
  fireNumber: number;
}

type CurrencyCode = 'GBP' | 'USD' | 'EUR' | 'JPY' | 'CNY' | 'INR';

interface FormData {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualSavings: number;
  annualSavingsIncrease: number;
  investmentReturn: number;
  annualExpenses: number;
  inflationRate: number;
  currency: CurrencyCode;
}

type FormDataKey = keyof FormData;

interface CrossoverPoint {
  age: number;
  savings: number;
  yearsTillFire: number;
  fireDate: string;
}

interface Currency {
  code: string;
  symbol: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const chartConfig: ChartConfig = {
  savings: {
    label: "Savings",
    color: "#4f46e5"
  },
  fireNumber: {
    label: "FIRE Number",
    color: "#10b981"
  },
  expenses: {
    label: "Annual Expenses",
    color: "#ef4444"
  },
};

const currencies: Currency[] = [
  { code: "GBP", symbol: "£" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "JPY", symbol: "¥" },
];

const formatCurrency = (value: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatAge = (age: number): string => {
  const years = Math.floor(age);
  const months = Math.round((age - years) * 12);
  return `${years} years${months > 0 ? ` ${months} months` : ""}`;
};

const formatYearsToReachFire = (years: number): string => {
  const fullYears = Math.floor(years);
  const months = Math.round((years - fullYears) * 12);
  return `${fullYears} year${fullYears !== 1 ? "s" : ""} ${months} month${
    months !== 1 ? "s" : ""
  }`;
};

const calculateFutureDate = (yearsTillFire: number): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + Math.floor(yearsTillFire));
  date.setMonth(date.getMonth() + Math.round((yearsTillFire % 1) * 12));
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const getCurrencySymbol = (currency: CurrencyCode) => {
  const symbols: { [key in CurrencyCode]: string } = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€',
    'JPY': '¥',
    'CNY': '¥',
    'INR': '₹'
  };
  return symbols[currency];
};

export default function CoreFIREProjections(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 10000,
    annualSavings: 12000,
    annualSavingsIncrease: 2,
    investmentReturn: 7,
    annualExpenses: 40000,
    inflationRate: 2,
    currency: "GBP",
  });
  const [projections, setProjections] = useState<ProjectionResult[]>([]);
  const [crossoverPoint, setCrossoverPoint] = useState<CrossoverPoint | null>(
    null
  );
  const [showConfetti, setShowConfetti] = useState(false);

  const handleInputChange = (field: FormDataKey, value: string | number) => {
    let parsedValue: number | string = value;
    
    if (field === 'currency') {
      parsedValue = value as string;
    } else {
      parsedValue = Number(value);
      if (isNaN(parsedValue)) return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: parsedValue
    }));
  };

  const handleCurrencyChange = (currency: CurrencyCode) => {
    handleInputChange('currency', currency);
  };

  const calculateProjections = (): void => {
    if (formData.currentAge >= formData.retirementAge) {
      alert("Retirement age must be greater than current age.");
      return;
    }

    const years = formData.retirementAge - formData.currentAge;
    const newProjections: ProjectionResult[] = [];
    let newCrossover: CrossoverPoint | null = null;

    for (let i = 0; i <= years * 12; i++) {
      const age = formData.currentAge + i / 12;
      const yearlyAnnualSavings =
        formData.annualSavings *
        Math.pow(1 + formData.annualSavingsIncrease / 100, i / 12);
      const monthlySavings = yearlyAnnualSavings / 12;
      const savings =
        (i === 0 ? formData.currentSavings : newProjections[i - 1].savings) *
          (1 + formData.investmentReturn / 100 / 12) +
        monthlySavings;
      const expenses =
        (formData.annualExpenses / 12) *
        Math.pow(1 + formData.inflationRate / 100, i / 12);
      const fireNumber = expenses * 12 * 25; // Using the 4% rule

      const projection: ProjectionResult = {
        age,
        savings: Math.round(savings),
        expenses: Math.round(expenses * 12),
        fireNumber: Math.round(fireNumber),
      };

      newProjections.push(projection);

      if (newCrossover === null && savings >= fireNumber) {
        const yearsTillFire = i / 12;
        newCrossover = {
          age,
          savings,
          yearsTillFire,
          fireDate: calculateFutureDate(yearsTillFire),
        };
        break;
      }
    }

    setProjections(newProjections);
    setCrossoverPoint(newCrossover);
  };

  const memoizedChart = useMemo(
    () => (
      <ChartContainer
        config={chartConfig}
        className="w-full h-full">
        <AreaChart
          width={500}
          height={350}
          data={projections}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="age"
            type="number"
            domain={['dataMin', 'dataMax']}
            ticks={Array.from(
              { length: Math.ceil((formData.retirementAge - formData.currentAge) / 5) + 1 },
              (_, i) => formData.currentAge + i * 5
            )}
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
            label={{ value: 'Age', position: 'bottom', fill: '#6B7280', offset: 0 }}
          />
          <YAxis
            stroke="#6B7280"
            tick={{ fill: '#6B7280' }}
            tickFormatter={(value: number) => {
              return `${(value / 1000000).toFixed(2)}`;
            }}
            label={{
              value: `Amount (${getCurrencySymbol(formData.currency)}, Millions)`,
              angle: -90,
              position: 'insideLeft',
              fill: '#6B7280',
              offset: 0,
              style: { textAnchor: 'middle' }
            }}
            domain={['auto', 'auto']}
            padding={{ top: 20 }}
          />
          <Tooltip
            content={({ active, payload, label }: TooltipProps) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
                    <p className="font-bold">Age: {label}</p>
                    {payload.map((entry) => (
                      <p key={entry.name} style={{ color: entry.color }}>
                        {entry.name}: {formatCurrency(entry.value, formData.currency)}
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="savings"
            stroke={chartConfig.savings.color}
            fill={chartConfig.savings.color}
            fillOpacity={0.1}
            name="Savings"
          />
          <Area
            type="monotone"
            dataKey="fireNumber"
            stroke={chartConfig.fireNumber.color}
            fill={chartConfig.fireNumber.color}
            fillOpacity={0.1}
            name="FIRE Number"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke={chartConfig.expenses.color}
            fill={chartConfig.expenses.color}
            fillOpacity={0.1}
            name="Annual Expenses"
          />
        </AreaChart>
      </ChartContainer>
    ),
    [projections, formData.currentAge, formData.retirementAge, formData.currency]
  );

  useEffect(() => {
    if (crossoverPoint && !showConfetti) {
      setShowConfetti(true);
      
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      // Launch from left edge
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        origin: { x: 0 }
      });
      fire(0.2, {
        spread: 60,
        origin: { x: 0 }
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        origin: { x: 0 }
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        origin: { x: 0 }
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
        origin: { x: 0 }
      });

      // Mirror from right edge
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        origin: { x: 1 }
      });
      fire(0.2, {
        spread: 60,
        origin: { x: 1 }
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        origin: { x: 1 }
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        origin: { x: 1 }
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
        origin: { x: 1 }
      });

      // Add center burst for wide screens (>1280px)
      if (typeof window !== 'undefined' && window.innerWidth > 1280) {
        // Slightly delayed center burst for dramatic effect
        setTimeout(() => {
          fire(0.2, {
            spread: 180,
            startVelocity: 55,
            origin: { x: 0.5 }
          });
          fire(0.35, {
            spread: 160,
            decay: 0.91,
            scalar: 0.8,
            origin: { x: 0.5 }
          });
          fire(0.1, {
            spread: 140,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2,
            origin: { x: 0.5 }
          });
          fire(0.1, {
            spread: 120,
            startVelocity: 45,
            origin: { x: 0.5 }
          });
          // Rainbow colors for center burst
          confetti({
            ...defaults,
            origin: { x: 0.5, y: 0.7 },
            particleCount: 80,
            spread: 100,
            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
            startVelocity: 30,
            gravity: 0.8,
            scalar: 1.2,
            drift: 0
          });
        }, 600);
      }
    }
  }, [crossoverPoint, showConfetti]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-violet-700 w-full">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16" />
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="border-blue-200/10 text-blue-200 mb-4">
              Core FIRE Calculator
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl/none mb-4">
              Plan Your Path to Financial Freedom
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-blue-100">
              Calculate exactly when you&apos;ll achieve financial independence with our advanced FIRE calculator.
            </p>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <Badge variant="secondary">FIRE Planning</Badge>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Financial Independence Calculator</h2>
              <p className="text-muted-foreground">
                Calculate your path to financial independence and early retirement
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (currentStep === 2) {
                    calculateProjections();
                    setCurrentStep(3);
                  } else {
                    setCurrentStep(Math.min(3, currentStep + 1));
                  }
                }}
              >
                {currentStep === 2 ? "Calculate FIRE" : "Next"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-3">
              <CardHeader className="border-b border-border/40 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg font-medium">Progress</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ProgressIndicator currentStep={currentStep} />
              </CardContent>
            </Card>
          </div>

          {currentStep === 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="border-b border-border/40 bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <CardTitle>Current Status</CardTitle>
                  </div>
                  <CardDescription>Enter your current age and savings</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <UILabel>Currency</UILabel>
                    <Select
                      value={formData.currency}
                      onValueChange={handleCurrencyChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GBP">British Pound (£)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="JPY">Japanese Yen (¥)</SelectItem>
                        <SelectItem value="CNY">Chinese Yuan (¥)</SelectItem>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <UILabel>Current Age</UILabel>
                    <Input
                      type="number"
                      value={formData.currentAge}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleInputChange('currentAge', e.target.value)}
                      min={0}
                      max={formData.retirementAge}
                    />
                  </div>
                  <div className="space-y-2">
                    <UILabel>Target Retirement Age</UILabel>
                    <Input
                      type="number"
                      value={formData.retirementAge}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleInputChange('retirementAge', e.target.value)}
                      min={formData.currentAge}
                    />
                  </div>
                  <div className="space-y-2">
                    <UILabel>Current Savings</UILabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        {getCurrencySymbol(formData.currency)}
                      </span>
                      <Input
                        type="number"
                        value={formData.currentSavings}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleInputChange('currentSavings', e.target.value)}
                        min={0}
                        className="pl-7"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="border-b border-border/40 bg-muted/50">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>Savings & Growth</CardTitle>
                  </div>
                  <CardDescription>Configure your savings and growth assumptions</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <UILabel>Annual Savings</UILabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        {getCurrencySymbol(formData.currency)}
                      </span>
                      <Input
                        type="number"
                        value={formData.annualSavings}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleInputChange('annualSavings', e.target.value)}
                        min={0}
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <UILabel>Annual Savings Increase (%)</UILabel>
                    <Input
                      type="number"
                      value={formData.annualSavingsIncrease}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleInputChange('annualSavingsIncrease', e.target.value)}
                      min={0}
                      max={100}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-2">
                    <UILabel>Investment Return (%)</UILabel>
                    <Input
                      type="number"
                      value={formData.investmentReturn}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleInputChange('investmentReturn', e.target.value)}
                      min={0}
                      max={100}
                      step={0.1}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="border-b border-border/40 bg-muted/50">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle>Expenses & Currency</CardTitle>
                  </div>
                  <CardDescription>Set your expenses and preferred currency</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <UILabel>Annual Expenses</UILabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        {getCurrencySymbol(formData.currency)}
                      </span>
                      <Input
                        type="number"
                        value={formData.annualExpenses}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleInputChange('annualExpenses', e.target.value)}
                        min={0}
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <UILabel>Inflation Rate (%)</UILabel>
                    <Input
                      type="number"
                      value={formData.inflationRate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleInputChange('inflationRate', e.target.value)}
                      min={0}
                      max={100}
                      step={0.1}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 3 && projections.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader className="border-b border-border/40 bg-muted/50">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>FIRE Projection</CardTitle>
                </div>
                <CardDescription>Your path to financial independence</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {crossoverPoint ? (
                  <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent p-4 rounded-lg border border-green-500/20 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-500/10 rounded-full">
                        <Target className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-green-500 mb-2">
                          Congratulations! You&apos;ll reach FIRE! 🎉
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Based on your current savings rate and investment assumptions, you&apos;re on track to achieve financial independence in {Math.floor(crossoverPoint.yearsTillFire)} years
                          {Math.floor((crossoverPoint.yearsTillFire % 1) * 12) > 0 && ` ${Math.floor((crossoverPoint.yearsTillFire % 1) * 12)} months`}.
                        </p>
                        <div className="grid gap-6 md:grid-cols-3">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">FIRE Date</p>
                            <p className="text-lg font-semibold">{crossoverPoint.fireDate}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">FIRE Age</p>
                            <p className="text-lg font-semibold">{formatAge(crossoverPoint.age)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Required Savings</p>
                            <p className="text-lg font-semibold">{formatCurrency(crossoverPoint.savings, formData.currency)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10 rounded-lg border border-orange-500/20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-500/10 rounded-full">
                        <Target className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-orange-500 mb-2">
                          Not quite there yet
                        </h3>
                        <p className="text-muted-foreground">
                          Based on your current plan, you won't reach FIRE by your target age. Consider adjusting your:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-muted-foreground">
                          <li>Savings rate</li>
                          <li>Investment returns</li>
                          <li>Target retirement age</li>
                          <li>Annual expenses</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-rows-[400px_auto] gap-8">
                  <div className="w-full h-full">
                    {memoizedChart}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
