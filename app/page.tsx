"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { ArrowRight, PiggyBank, TrendingUp, LineChart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { FIRECalculator } from "@/components/fire-calculator";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // Add your email submission logic here
    setEmail("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changing:", e.target.value);
    setEmail(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 flex flex-col">
        {/* Hero Section with Gradient Background */}
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-custom w-full">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-16" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <Badge variant="outline" className="border-white/10 text-white/90 mb-2 bg-white/5 backdrop-blur-sm">
                    Your Path to Financial Freedom
                  </Badge>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl xl:text-6xl/none">
                    Master Your Journey to Financial Independence
                  </h1>
                  <p className="max-w-[600px] text-white/90 text-lg md:text-xl mx-auto lg:mx-0">
                    PennyZap helps you calculate, optimize, and plan your path to FIRE with powerful tools and expert guidance.
                  </p>
                </div>
                <div className="space-y-4 w-full sm:w-auto">
                  <div className="w-full max-w-sm space-y-2 mx-auto lg:mx-0">
                    <form onSubmit={handleSubmit} className="relative z-20 flex space-x-2">
                      <input
                        type="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="relative z-20 max-w-lg flex-1 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/30 transition-all duration-200 px-3 py-2 outline-none backdrop-blur-sm"
                        required
                      />
                      <button
                        type="submit"
                        className="relative z-20 bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-white/20 px-4 py-2 rounded-md transition-all duration-200 font-medium"
                      >
                        Get Started
                      </button>
                    </form>
                    <p className="text-xs text-white/80">
                      Join 10,000+ members on their FIRE journey. No spam ever.
                    </p>
                  </div>
                </div>
                {/* Social Proof */}
                <div className="flex flex-col items-center lg:items-start space-y-2 pt-4">
                  <div className="flex -space-x-2">
                    {[
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                    ].map((avatar, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                      >
                        <Image
                          src={avatar}
                          alt={`User ${i + 1} avatar`}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-cyan-200">
                    Trusted by <span className="font-semibold text-white">1,000+</span> FIRE achievers
                  </p>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-square relative lg:mt-0">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="Financial Growth Chart"
                  width={500}
                  height={500}
                  className="object-cover rounded-xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Powerful Tools for Your FIRE Journey
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to calculate, track, and achieve your financial independence goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-6 py-12 lg:grid-cols-3">
              <Card className="relative overflow-hidden transition-all hover:shadow-lg hover:bg-card-hover border-border/40">
                <CardContent className="p-6">
                  <PiggyBank className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-2">FIRE Calculator</h3>
                  <p className="text-muted-foreground mb-4">
                    Calculate your path to financial independence with our advanced FIRE calculator.
                  </p>
                  <Link
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    href="/fire-calculator"
                  >
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden transition-all hover:shadow-lg hover:bg-card-hover border-border/40">
                <CardContent className="p-6">
                  <LineChart className="h-12 w-12 text-secondary mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Investment Tracker</h3>
                  <p className="text-muted-foreground mb-4">
                    Track your investments and monitor your progress towards financial independence.
                  </p>
                  <Link
                    className="inline-flex items-center text-secondary hover:text-secondary/80 transition-colors"
                    href="/investment-tracker"
                  >
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden transition-all hover:shadow-lg hover:bg-card-hover border-border/40">
                <CardContent className="p-6">
                  <TrendingUp className="h-12 w-12 text-accent mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Withdrawal Strategy</h3>
                  <p className="text-muted-foreground mb-4">
                    Plan your withdrawal strategy for a sustainable retirement with our advanced calculators.
                  </p>
                  <Link
                    className="inline-flex items-center text-accent hover:text-accent/80 transition-colors"
                    href="/withdrawal-strategy"
                  >
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-custom">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
                  Trusted by FIRE Enthusiasts
                </h2>
                <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of others who are using PennyZap to achieve their financial independence goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  name: "Alex Johnson",
                  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop&crop=face",
                  title: "Early Retiree",
                  review: "PennyZap helped me optimize my investment strategy and reach my FIRE goals 2 years ahead of schedule!"
                },
                {
                  name: "Samantha Lee",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
                  title: "Financial Blogger",
                  review: "The insights from PennyZap's tools have been invaluable for my personal finance journey and my readers."
                },
                {
                  name: "Michael Chen",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                  title: "Tech Professional",
                  review: "I thought I had my finances figured out, but PennyZap showed me how to accelerate my path to FIRE."
                }
              ].map((testimonial, i) => (
                <Card key={i} className="relative overflow-hidden transition-all hover:shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
                        <Image
                          src={testimonial.avatar}
                          alt={`${testimonial.name}'s avatar`}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-white/80 text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                    <p className="text-white/90">{testimonial.review}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Latest News/Blog Preview Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Latest FIRE Insights</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Stay informed with our latest articles and updates on achieving financial independence.
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-6 py-12 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <Image
                      src={`/placeholder.svg?height=200&width=400`}
                      alt="Blog post image"
                      width={400}
                      height={200}
                      className="rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold mb-2">Essential FIRE Strategy #{i + 1}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Learn about the latest strategies and tips for achieving financial independence...
                    </p>
                    <Link
                      className="inline-flex items-center text-emerald-500 hover:text-emerald-600"
                      href="/blog"
                    >
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="relative max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
                  Stay Updated on Your FIRE Journey
                </h2>
                <p className="max-w-[900px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get the latest FIRE strategies, investment tips, and early access to new features.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleChange}
                    className="flex-1 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/30 transition-all duration-200 px-3 py-2 outline-none backdrop-blur-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-white text-secondary hover:bg-white/90 shadow-lg hover:shadow-white/20 px-4 py-2 rounded-md transition-all duration-200 font-medium whitespace-nowrap"
                  >
                    Subscribe Now
                  </button>
                </form>
                <p className="text-xs text-white/80">
                  Join our newsletter for exclusive FIRE insights. No spam ever.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
