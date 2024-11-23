import { z } from "zod";

export const RISK_LEVELS = ["Conservative", "Moderate", "Aggressive"] as const;
export const ASSET_CLASSES = ["Stocks", "Bonds", "Cash", "Real Estate"] as const;
export const INVESTMENT_GOALS = ["Retirement", "Wealth Building", "Income Generation", "Capital Preservation"] as const;
export const INVESTMENT_EXPERIENCE = ["Beginner", "Intermediate", "Advanced"] as const;

export type AssetClass = typeof ASSET_CLASSES[number];
export type InvestmentGoal = typeof INVESTMENT_GOALS[number];
export type ExperienceLevel = typeof INVESTMENT_EXPERIENCE[number];

export interface Portfolio {
  name: AssetClass;
  value: number;
  amount: string;
  historicalReturn?: number;
  risk?: number;
  sharpeRatio?: number;
}

export interface OptimizationResult {
  currentPortfolio: Portfolio[];
  optimizedPortfolio: Portfolio[];
  expectedReturn: number;
  riskLevel: number;
  timelineImpact: number;
  recommendations: string[];
  rebalanceFrequency: string;
  riskScore: number;
  diversificationScore: number;
  sharpeRatio: number;
  drawdownRisk: number;
}

// Validation schemas
export const formDataSchema = z.object({
  currentAge: z.number().min(18).max(100),
  retirementAge: z.number().min(18).max(100),
  currentSavings: z.number().min(0),
  annualSavings: z.number().min(0),
  annualSavingsIncrease: z.number().min(0).max(100),
  annualExpenses: z.number().min(0),
  investmentReturn: z.number().min(-20).max(50),
  inflationRate: z.number().min(-5).max(20),
  currency: z.enum(["USD", "GBP", "EUR", "JPY"]),
});

export const projectionResultSchema = z.object({
  age: z.number(),
  savings: z.number(),
  expenses: z.number(),
  fireNumber: z.number(),
});

export const crossoverPointSchema = z.object({
  age: z.number(),
  savings: z.number(),
  yearsTillFire: z.number(),
  fireDate: z.string(),
});

export const currencySchema = z.object({
  code: z.enum(["USD", "GBP", "EUR", "JPY"]),
  symbol: z.string(),
});

export const chartConfigSchema = z.record(
  z.string(),
  z.object({
    label: z.string(),
    color: z.string(),
  })
);

// Derived types
export type FormData = z.infer<typeof formDataSchema>;
export type ProjectionResult = z.infer<typeof projectionResultSchema>;
export type CrossoverPoint = z.infer<typeof crossoverPointSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type ChartConfig = z.infer<typeof chartConfigSchema>;

// Error types
export interface ValidationError {
  field: keyof FormData;
  message: string;
}

// Event types
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type FormSubmitEvent = React.FormEvent<HTMLFormElement>;

// Props types
export interface FireFormProps {
  formData: FormData;
  errors: ValidationError[];
  onInputChange: (e: InputChangeEvent) => void;
  onCurrencyChange: (value: Currency["code"]) => void;
  onSubmit: (e: FormSubmitEvent) => void;
}

export interface FireChartProps {
  projections: ProjectionResult[];
  crossoverPoint: CrossoverPoint | null;
  formData: FormData;
}

export interface FireResultsProps {
  crossoverPoint: CrossoverPoint;
  formData: FormData;
}

export interface ChartContainerProps {
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
}
