import {
  FormData,
  ProjectionResult,
  CrossoverPoint,
  ValidationError,
} from "@/types";
import { formDataSchema } from "@/types";
import { FIRE_CALCULATION } from "@/constants";
import { z } from "zod";
import { clsx, type ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (
  value: number,
  currency: FormData["currency"]
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatAge = (age: number): string => {
  const years = Math.floor(age);
  const months = Math.round((age - years) * FIRE_CALCULATION.MONTHS_IN_YEAR);
  return `${years} years${months > 0 ? ` ${months} months` : ""}`;
};

export const formatYearsToReachFire = (years: number): string => {
  const fullYears = Math.floor(years);
  const months = Math.round(
    (years - fullYears) * FIRE_CALCULATION.MONTHS_IN_YEAR
  );
  return `${fullYears} year${fullYears !== 1 ? "s" : ""} ${months} month${
    months !== 1 ? "s" : ""
  }`;
};

export const calculateFutureDate = (yearsTillFire: number): string => {
  const date = new Date();
  const yearsToAdd = Math.floor(yearsTillFire);
  const monthsToAdd = Math.round(
    (yearsTillFire % 1) * FIRE_CALCULATION.MONTHS_IN_YEAR
  );

  date.setFullYear(date.getFullYear() + yearsToAdd);
  date.setMonth(date.getMonth() + monthsToAdd);

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const validateFormData = (
  data: Partial<FormData>
): ValidationError[] => {
  try {
    formDataSchema.parse(data);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map((err: z.ZodIssue) => ({
        field: err.path[0] as keyof FormData,
        message: err.message,
      }));
    }
    return [{ field: "currentAge", message: "Invalid form data" }];
  }
};

export const calculateMonthlyFireNumber = (
  monthlyExpenses: number,
  inflationRate: number,
  monthsElapsed: number
): number => {
  const inflatedExpenses =
    monthlyExpenses *
    Math.pow(
      1 + inflationRate / 100,
      monthsElapsed / FIRE_CALCULATION.MONTHS_IN_YEAR
    );
  return (
    (inflatedExpenses * FIRE_CALCULATION.MONTHS_IN_YEAR) /
    FIRE_CALCULATION.SAFE_WITHDRAWAL_RATE
  );
};

export const calculateFireProjections = (
  formData: FormData
): { projections: ProjectionResult[]; crossover: CrossoverPoint | null } => {
  const errors = validateFormData(formData);
  if (errors.length > 0) {
    throw new Error("Invalid form data");
  }

  const years = formData.retirementAge - formData.currentAge;
  const totalMonths = years * FIRE_CALCULATION.MONTHS_IN_YEAR;
  const projections: ProjectionResult[] = [];
  let crossover: CrossoverPoint | null = null;

  for (let month = 0; month <= totalMonths; month++) {
    const age = formData.currentAge + month / FIRE_CALCULATION.MONTHS_IN_YEAR;

    // Calculate monthly values
    const yearlyAnnualSavings =
      formData.annualSavings *
      Math.pow(
        1 + formData.annualSavingsIncrease / 100,
        month / FIRE_CALCULATION.MONTHS_IN_YEAR
      );
    const monthlySavings =
      yearlyAnnualSavings / FIRE_CALCULATION.MONTHS_IN_YEAR;

    // Calculate current savings with returns
    const prevSavings =
      month === 0 ? formData.currentSavings : projections[month - 1].savings;
    const monthlyReturn =
      formData.investmentReturn / 100 / FIRE_CALCULATION.MONTHS_IN_YEAR;
    const savings = prevSavings * (1 + monthlyReturn) + monthlySavings;

    // Calculate expenses and fire number
    const monthlyExpenses =
      formData.annualExpenses / FIRE_CALCULATION.MONTHS_IN_YEAR;
    const fireNumber = calculateMonthlyFireNumber(
      monthlyExpenses,
      formData.inflationRate,
      month
    );

    const projection: ProjectionResult = {
      age,
      savings: Math.round(savings),
      expenses: Math.round(monthlyExpenses * FIRE_CALCULATION.MONTHS_IN_YEAR),
      fireNumber: Math.round(fireNumber),
    };

    projections.push(projection);

    // Check for FIRE achievement
    if (!crossover && savings >= fireNumber) {
      crossover = {
        age,
        savings,
        yearsTillFire: month / FIRE_CALCULATION.MONTHS_IN_YEAR,
        fireDate: calculateFutureDate(month / FIRE_CALCULATION.MONTHS_IN_YEAR),
      };
    }
  }

  return { projections, crossover };
};

// Type guard
export const isCrossoverPoint = (
  point: CrossoverPoint | null
): point is CrossoverPoint => {
  return point !== null;
};
