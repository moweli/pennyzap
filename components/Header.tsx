import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary mb-4 sm:mb-0">
          PennyZap
        </Link>
        <nav>
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <li>
              <Button variant="ghost" asChild className="w-full sm:w-auto">
                <Link href="/core">Core</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild className="w-full sm:w-auto">
                <Link href="/investment">Investment</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild className="w-full sm:w-auto">
                <Link href="/withdrawal">Withdrawal</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
