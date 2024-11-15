"use client";

import React, { useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const noSpinnerClass =
  "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

interface ProjectionResult {
  age: number;
  savings: number;
  expenses: number;
  fireNumber: number;
}

interface FormData {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualSavings: number;
  annualSavingsIncrease: number;
  annualExpenses: number;
  investmentReturn: number;
  inflationRate: number;
  currency: string;
}

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

const chartConfig: ChartConfig = {
  savings: {
    label: "Savings",
    color: "hsl(var(--chart-1))",
  },
  fireNumber: {
    label: "FIRE Number",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Annual Expenses",
    color: "hsl(var(--chart-3))",
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

export default function CoreFIREProjections(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    currentAge: 47,
    retirementAge: 67,
    currentSavings: 0,
    annualSavings: 18000,
    annualSavingsIncrease: 10,
    annualExpenses: 48000,
    investmentReturn: 6.8,
    inflationRate: 2,
    currency: "GBP",
  });
  const [projections, setProjections] = useState<ProjectionResult[]>([]);
  const [crossoverPoint, setCrossoverPoint] = useState<CrossoverPoint | null>(
    null
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    let numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    numericValue = isNaN(numericValue) ? 0 : numericValue;

    if (
      name === "currentSavings" ||
      name === "annualSavings" ||
      name === "annualExpenses"
    ) {
      e.target.value = formatCurrency(numericValue, formData.currency);
    }

    setFormData((prev) => ({ ...prev, [name]: numericValue }));
  };

  const handleCurrencyChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, currency: value }));
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
        className="w-full h-[300px] sm:h-[400px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={
              projections.length > 0
                ? projections
                : [
                    {
                      age: formData.currentAge,
                      savings: 0,
                      expenses: 0,
                      fireNumber: 0,
                    },
                  ]
            }
            margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="age"
              domain={[formData.currentAge, formData.retirementAge]}
              tickFormatter={(value: number) => `${value}`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value: number) => {
                if (value === 0) return `${formData.currency} 0`;
                if (value >= 1000000) {
                  return `${formData.currency} ${(value / 1000000).toFixed(
                    0
                  )}M`;
                }
                if (value >= 1000) {
                  return `${formData.currency} ${(value / 1000).toFixed(0)}K`;
                }
                return `${formData.currency} ${value}`;
              }}
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const isCrossover =
                    crossoverPoint &&
                    Math.abs(Number(label) - crossoverPoint.age) < 0.01;
                  if (isCrossover) {
                    return (
                      <div className="bg-green-100 p-2 sm:p-4 border border-green-500 rounded shadow-lg text-xs sm:text-sm">
                        <p className="font-bold text-green-700">
                          FIRE Achieved!
                        </p>
                        <p>Age: {formatAge(Number(label))}</p>
                        <p>
                          Savings:{" "}
                          {formatCurrency(
                            crossoverPoint.savings,
                            formData.currency
                          )}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-white p-2 sm:p-4 border border-gray-200 rounded shadow-lg text-xs sm:text-sm">
                      <p className="font-bold">Age: {label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }}>
                          {entry.name}:{" "}
                          {formatCurrency(
                            entry.value as number,
                            formData.currency
                          )}
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
              stroke="var(--color-savings)"
              fill="var(--color-savings)"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="fireNumber"
              stroke="var(--color-fireNumber)"
              fill="var(--color-fireNumber)"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="var(--color-expenses)"
              fill="var(--color-expenses)"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    ),
    [
      projections,
      crossoverPoint,
      formData.currentAge,
      formData.retirementAge,
      formData.currency,
    ]
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Core FIRE Projections
      </h1>
      <div className="grid gap-4 sm:gap-6">
        {crossoverPoint && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4 sm:pt-6">
              <div
                className="text-green-600 font-bold text-sm sm:text-base lg:text-lg"
                aria-live="polite">
                <span className="block text-lg sm:text-xl lg:text-2xl mb-2">
                  🎉 FIRE Achieved!
                </span>
                Savings crosses FIRE number at age{" "}
                <span className="text-green-800">
                  {formatAge(crossoverPoint.age)}
                </span>{" "}
                with savings of{" "}
                <span className="text-green-800">
                  {formatCurrency(crossoverPoint.savings, formData.currency)}
                </span>
                <span className="block mt-2">
                  Time to reach FIRE:{" "}
                  <span className="text-green-800">
                    {formatYearsToReachFire(crossoverPoint.yearsTillFire)}
                  </span>
                </span>
                <span className="block mt-2">
                  Estimated FIRE date:{" "}
                  <span className="text-green-800">
                    {crossoverPoint.fireDate}
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Input Your Data</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4 sm:space-y-5"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  calculateProjections();
                }}>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <UILabel
                      htmlFor="currentAge"
                      className="text-sm sm:text-base">
                      Current Age
                    </UILabel>
                    <Input
                      id="currentAge"
                      name="currentAge"
                      type="number"
                      value={formData.currentAge}
                      onChange={handleInputChange}
                      aria-label="Current Age"
                      className={`${noSpinnerClass} mt-1 sm:mt-2`}
                    />
                  </div>
                  <div>
                    <UILabel
                      htmlFor="retirementAge"
                      className="text-sm sm:text-base">
                      Retirement Age
                    </UILabel>
                    <Input
                      id="retirementAge"
                      name="retirementAge"
                      type="number"
                      value={formData.retirementAge}
                      onChange={handleInputChange}
                      aria-label="Retirement Age"
                      className={`${noSpinnerClass} mt-1 sm:mt-2`}
                    />
                  </div>
                </div>
                <div>
                  <UILabel htmlFor="currency" className="text-sm sm:text-base">
                    Currency
                  </UILabel>
                  <Select
                    value={formData.currency}
                    onValueChange={handleCurrencyChange}>
                    <SelectTrigger className="w-full mt-1 sm:mt-2">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <UILabel
                    htmlFor="currentSavings"
                    className="text-sm sm:text-base">
                    Current Savings
                  </UILabel>
                  <Input
                    id="currentSavings"
                    name="currentSavings"
                    type="text"
                    inputMode="numeric"
                    value={formatCurrency(
                      formData.currentSavings,
                      formData.currency
                    )}
                    onChange={handleInputChange}
                    aria-label="Current Savings"
                    className={`${noSpinnerClass} mt-1 sm:mt-2`}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <UILabel
                      htmlFor="annualSavings"
                      className="text-sm sm:text-base">
                      Annual Savings
                    </UILabel>
                    <Input
                      id="annualSavings"
                      name="annualSavings"
                      type="text"
                      inputMode="numeric"
                      value={formatCurrency(
                        formData.annualSavings,
                        formData.currency
                      )}
                      onChange={handleInputChange}
                      aria-label="Annual Savings"
                      className={`${noSpinnerClass} mt-1 sm:mt-2`}
                    />
                  </div>
                  <div>
                    <UILabel
                      htmlFor="annualSavingsIncrease"
                      className="text-sm sm:text-base">
                      Annual Savings Increase (%)
                    </UILabel>
                    <Input
                      id="annualSavingsIncrease"
                      name="annualSavingsIncrease"
                      type="number"
                      value={formData.annualSavingsIncrease}
                      onChange={handleInputChange}
                      aria-label="Annual Savings Increase"
                      className={`${noSpinnerClass} mt-1 sm:mt-2`}
                    />
                  </div>
                </div>
                <div>
                  <UILabel
                    htmlFor="annualExpenses"
                    className="text-sm sm:text-base">
                    Annual Expenses
                  </UILabel>
                  <Input
                    id="annualExpenses"
                    name="annualExpenses"
                    type="text"
                    inputMode="numeric"
                    value={formatCurrency(
                      formData.annualExpenses,
                      formData.currency
                    )}
                    onChange={handleInputChange}
                    aria-label="Annual Expenses"
                    className={`${noSpinnerClass} mt-1 sm:mt-2`}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <UILabel
                      htmlFor="investmentReturn"
                      className="text-sm sm:text-base">
                      Investment Return (%)
                    </UILabel>
                    <Input
                      id="investmentReturn"
                      name="investmentReturn"
                      type="number"
                      value={formData.investmentReturn}
                      onChange={handleInputChange}
                      aria-label="Investment Return"
                      className={`${noSpinnerClass} mt-1 sm:mt-2`}
                    />
                  </div>
                  <div>
                    <UILabel
                      htmlFor="inflationRate"
                      className="text-sm sm:text-base">
                      Inflation Rate (%)
                    </UILabel>
                    <Input
                      id="inflationRate"
                      name="inflationRate"
                      type="number"
                      value={formData.inflationRate}
                      onChange={handleInputChange}
                      aria-label="Inflation Rate"
                      className={`${noSpinnerClass} mt-1 sm:mt-2`}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Calculate
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>FIRE Projections</CardTitle>
              <CardDescription>
                Showing projected savings, expenses, and FIRE number over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-2">{memoizedChart}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
