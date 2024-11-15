import { ChartConfig, Currency, FormData } from "@/types";

export const CHART_CONFIG: ChartConfig = {
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
} as const;

export const CURRENCIES: Currency[] = [
  { code: "GBP", symbol: "£" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "JPY", symbol: "¥" },
] as const;

export const INITIAL_FORM_DATA: FormData = {
  currentAge: 47,
  retirementAge: 67,
  currentSavings: 0,
  annualSavings: 18000,
  annualSavingsIncrease: 10,
  annualExpenses: 48000,
  investmentReturn: 6.8,
  inflationRate: 2,
  currency: "GBP",
} as const;

export const NO_SPINNER_CLASS =
  "appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" as const;

export const CHART_DIMENSIONS = {
  margin: { top: 10, right: 10, bottom: 0, left: 0 },
  height: {
    default: 300,
    sm: 400,
    lg: 500,
  },
} as const;

export const FIRE_CALCULATION = {
  SAFE_WITHDRAWAL_RATE: 0.04, // 4% rule
  MONTHS_IN_YEAR: 12,
  MIN_AGE: 18,
  MAX_AGE: 100,
} as const;
