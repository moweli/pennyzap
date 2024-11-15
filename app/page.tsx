import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to PennyZap</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your personal FIRE planning assistant
        </p>
        <Button asChild>
          <Link href="/core">Get Started</Link>
        </Button>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Core FIRE Projections</h2>
          <p className="text-gray-600 mb-4">
            Calculate your path to financial independence and early retirement.
          </p>
          <Button variant="outline" asChild>
            <Link href="/core">Learn More</Link>
          </Button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Investment Portfolio Optimizer
          </h2>
          <p className="text-gray-600 mb-4">
            Optimize your investment portfolio for maximum returns.
          </p>
          <Button variant="outline" asChild>
            <Link href="/investment">Learn More</Link>
          </Button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Withdrawal Strategy Planner
          </h2>
          <p className="text-gray-600 mb-4">
            Plan your withdrawal strategy for a sustainable retirement.
          </p>
          <Button variant="outline" asChild>
            <Link href="/withdrawal">Learn More</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
