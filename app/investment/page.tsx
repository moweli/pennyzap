"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ChartPie, Target, TrendingUp, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomPieChart } from "@/components/CustomPieChart";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { RiskScoreGauge } from "@/components/RiskScoreGauge";
import { DiversificationChart } from "@/components/DiversificationChart";
import {
  getRiskDescription,
  calculateSharpeRatio,
  calculateDrawdownRisk,
  getRecommendations,
} from "@/utils";
import { Portfolio, OptimizationResult, InvestmentGoal, ExperienceLevel } from "@/types";

export default function InvestmentPortfolioOptimizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [age, setAge] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [riskTolerance, setRiskTolerance] = useState(1);
  const [investmentGoal, setInvestmentGoal] = useState<InvestmentGoal>("Retirement");
  const [experience, setExperience] = useState<ExperienceLevel>("Beginner");
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio[]>([
    { name: "Stocks", value: 60, amount: "60000" },
    { name: "Bonds", value: 30, amount: "30000" },
    { name: "Cash", value: 10, amount: "10000" },
  ]);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  const handleOptimize = () => {
    const sharpeRatio = calculateSharpeRatio(currentPortfolio);
    const drawdownRisk = calculateDrawdownRisk(currentPortfolio);
    
    const optimizedPortfolio: Portfolio[] = [
      { name: "Stocks", value: 70, amount: "70000" },
      { name: "Bonds", value: 20, amount: "20000" },
      { name: "Cash", value: 5, amount: "5000" },
      { name: "Real Estate", value: 5, amount: "5000" },
    ];

    const recommendations = getRecommendations(
      riskTolerance,
      parseInt(age),
      parseInt(timeHorizon),
      investmentGoal,
      experience,
      currentPortfolio,
      sharpeRatio,
      drawdownRisk
    );

    setOptimizationResult({
      currentPortfolio,
      optimizedPortfolio,
      expectedReturn: 8.5,
      riskLevel: riskTolerance,
      timelineImpact: 2,
      recommendations,
      rebalanceFrequency: "Quarterly",
      riskScore: 65,
      diversificationScore: 85,
      sharpeRatio,
      drawdownRisk,
    });

    setCurrentStep(3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-violet-700 w-full">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16" />
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center">
            <Badge variant="outline" className="border-blue-200/10 text-blue-200 mb-4">
              Smart Portfolio Optimizer
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl/none mb-4">
              Optimize Your Investment Strategy
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-blue-100">
              Get personalized portfolio recommendations based on modern portfolio theory and your risk tolerance.
            </p>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ChartPie className="h-5 w-5 text-primary" />
                <Badge variant="secondary">Investment Portfolio</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Smart Portfolio Optimization</h1>
              <p className="text-muted-foreground">
                Optimize your investment strategy based on your goals and risk tolerance
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
                    handleOptimize();
                  } else {
                    setCurrentStep(Math.min(3, currentStep + 1));
                  }
                }}
              >
                {currentStep === 2 ? "Optimize Portfolio" : "Next"}
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
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle>Investment Goals</CardTitle>
                  </div>
                  <CardDescription>Tell us about your investment objectives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Investment Goal</Label>
                    <Select 
                      value={investmentGoal} 
                      onValueChange={(value) => setInvestmentGoal(value as InvestmentGoal)}
                    >
                      <SelectTrigger className="w-full p-2 border rounded-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Retirement", "Wealth Building", "Income Generation", "Capital Preservation"].map(
                          (goal) => (
                            <SelectItem key={goal} value={goal}>
                              {goal}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Horizon (years)</Label>
                    <Input
                      type="number"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(e.target.value)}
                      className="[&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                      max="50"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <CardTitle>Personal Details</CardTitle>
                  </div>
                  <CardDescription>Help us understand your situation better</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Your Age</Label>
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="[&::-webkit-inner-spin-button]:appearance-none"
                      min="18"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Investment Experience</Label>
                    <Select 
                      value={experience} 
                      onValueChange={(value) => setExperience(value as ExperienceLevel)}
                    >
                      <SelectTrigger className="w-full p-2 border rounded-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>Risk Assessment</CardTitle>
                </div>
                <CardDescription>Define your risk tolerance and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Risk Tolerance</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[riskTolerance]}
                      onValueChange={([value]) => setRiskTolerance(value)}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">{riskTolerance}/10</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{getRiskDescription(riskTolerance)}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ChartPie className="h-5 w-5 text-primary" />
                  <CardTitle>Current Portfolio</CardTitle>
                </div>
                <CardDescription>Enter your current investment allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    {currentPortfolio.map((asset, index) => (
                      <div key={asset.name} className="space-y-2">
                        <Label>{asset.name}</Label>
                        <Input
                          type="number"
                          value={asset.amount}
                          onChange={(e) => {
                            const newPortfolio = [...currentPortfolio];
                            newPortfolio[index] = {
                              ...asset,
                              amount: e.target.value,
                              value: parseFloat(e.target.value) / 1000,
                            };
                            setCurrentPortfolio(newPortfolio);
                          }}
                          className="[&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center">
                    <CustomPieChart 
                      data={currentPortfolio} 
                      title="Current Portfolio Allocation" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && optimizationResult && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Analysis</CardTitle>
                  <CardDescription>Your optimized portfolio details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RiskScoreGauge score={optimizationResult.riskScore} />
                  <DiversificationChart portfolio={optimizationResult.optimizedPortfolio} />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Expected Return</span>
                      <span className="font-medium">{optimizationResult.expectedReturn}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sharpe Ratio</span>
                      <span className="font-medium">{optimizationResult.sharpeRatio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Drawdown Risk</span>
                      <span className="font-medium">{optimizationResult.drawdownRisk}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Suggested portfolio adjustments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {optimizationResult.recommendations.map((rec, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted">
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
