import { Portfolio, InvestmentGoal, ExperienceLevel } from '@/types';

export const COLORS: Record<string, string> = {
  Stocks: "hsl(var(--chart-1))",
  Bonds: "hsl(var(--chart-2))",
  Cash: "hsl(var(--chart-3))",
  "Real Estate": "hsl(var(--chart-4))",
};

export const HISTORICAL_DATA = {
  Stocks: { return: 10.0, risk: 15.0, sharpeRatio: 0.67 },
  Bonds: { return: 5.0, risk: 5.0, sharpeRatio: 1.0 },
  Cash: { return: 2.0, risk: 0.5, sharpeRatio: 4.0 },
  "Real Estate": { return: 7.0, risk: 10.0, sharpeRatio: 0.7 },
};

export const RISK_FREE_RATE = 2.0;

export const formatMoney = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const getRiskDescription = (riskTolerance: number): string => {
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

export const calculateSharpeRatio = (portfolio: Portfolio[]): number => {
  const portfolioReturn = portfolio.reduce((acc, asset) => {
    const historicalData = HISTORICAL_DATA[asset.name];
    return acc + (historicalData.return * (asset.value / 100));
  }, 0);

  const portfolioRisk = Math.sqrt(
    portfolio.reduce((acc, asset) => {
      const historicalData = HISTORICAL_DATA[asset.name];
      return acc + Math.pow(historicalData.risk * (asset.value / 100), 2);
    }, 0)
  );

  return (portfolioReturn - RISK_FREE_RATE) / portfolioRisk;
};

export const calculateDrawdownRisk = (portfolio: Portfolio[]): number => {
  const weightedRisk = portfolio.reduce((acc, asset) => {
    const historicalData = HISTORICAL_DATA[asset.name];
    return acc + (historicalData.risk * (asset.value / 100));
  }, 0);

  return weightedRisk * 1.5; // Simplified drawdown calculation
};

export const getRecommendations = (
  riskTolerance: number,
  age: number,
  timeHorizon: number,
  goal: InvestmentGoal,
  experience: ExperienceLevel,
  portfolio: Portfolio[],
  sharpeRatio: number,
  drawdownRisk: number
): string[] => {
  const recommendations: string[] = [];
  const retirementAge = 65;
  const yearsToRetirement = retirementAge - age;
  const riskCapacity = Math.min(100, (yearsToRetirement / 40) * 100);

  if (age < 30 && riskTolerance === 0 && riskCapacity > 80) {
    recommendations.push(
      "Your age suggests high risk capacity. Consider increasing equity exposure to maximize long-term growth potential."
    );
  } else if (age > 50 && riskTolerance === 2 && riskCapacity < 40) {
    recommendations.push(
      "Given your proximity to retirement, consider gradually shifting to more conservative assets to protect wealth."
    );
  }

  if (timeHorizon < 5) {
    if (riskTolerance === 2) {
      recommendations.push(
        "Short investment horizon detected. Consider implementing a 2-year glide path to reduce equity exposure."
      );
    }
    recommendations.push(
      "For short-term goals, maintain higher cash reserves (15-20%) to handle market volatility."
    );
  } else if (timeHorizon > 20) {
    if (riskTolerance === 0) {
      recommendations.push(
        "Your long time horizon allows for higher risk tolerance. Consider a dynamic asset allocation strategy that gradually increases equity exposure."
      );
    }
    recommendations.push(
      "Long-term horizon enables focus on total return rather than income generation. Consider growth-oriented assets."
    );
  }

  switch (goal) {
    case "Retirement":
      recommendations.push(
        "Consider tax-advantaged retirement accounts like 401(k) or IRA.",
        `Target a ${Math.min(90, 110 - age)}% equity allocation for long-term growth.`,
        "Implement automatic rebalancing to maintain target allocations."
      );
      break;
    case "Income Generation":
      recommendations.push(
        "Focus on dividend aristocrats and high-quality bonds for stable income.",
        "Consider REITs for additional income diversification.",
        "Implement a bond ladder strategy to manage interest rate risk."
      );
      break;
    case "Capital Preservation":
      recommendations.push(
        "Maintain high-grade bonds and TIPS to protect against inflation.",
        "Consider certificates of deposit for guaranteed returns.",
        "Keep duration short to moderate interest rate risk."
      );
      break;
    case "Wealth Building":
      recommendations.push(
        "Consider factor investing strategies (value, momentum, quality).",
        "Explore international markets for additional diversification.",
        "Consider small allocation to alternative investments (5-10%)."
      );
      break;
  }

  if (sharpeRatio < 0.5) {
    recommendations.push(
      "Current portfolio shows low risk-adjusted returns. Consider rebalancing to improve efficiency."
    );
  }
  if (drawdownRisk > 20) {
    recommendations.push(
      "High drawdown risk detected. Consider implementing stop-loss strategies or increasing defensive positions."
    );
  }

  switch (experience) {
    case "Beginner":
      recommendations.push(
        "Start with low-cost index funds for core positions.",
        "Consider target-date funds for automated allocation management.",
        "Recommended reading: 'The Intelligent Investor' for investment basics."
      );
      break;
    case "Intermediate":
      recommendations.push(
        "Consider factor ETFs for smart beta exposure.",
        "Explore dollar-cost averaging strategies.",
        "Learn about options strategies for income generation."
      );
      break;
    case "Advanced":
      recommendations.push(
        "Consider tactical asset allocation strategies.",
        "Explore alternative investments and derivatives.",
        "Implement tax-loss harvesting strategies."
      );
      break;
  }

  return recommendations;
};
