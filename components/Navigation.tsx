"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: "Core FIRE", href: "/core" },
    { name: "Investment", href: "/investment" },
    { name: "Withdrawal", href: "/withdrawal" },
    { name: "Blog", href: "/blog" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600">PennyZap</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-500"
              >
                {link.name}
              </Link>
            ))}
            <Button asChild>
              <Link href="/core">Get Started</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-emerald-600 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button asChild onClick={() => setIsMenuOpen(false)}>
                <Link href="/core">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
