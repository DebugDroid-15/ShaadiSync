"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Menu, X, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-gold-200/60 bg-white shadow-sm flex items-center justify-center p-0.5">
            <Image
              src="/logo.png"
              alt="ShaadiSync"
              width={38}
              height={38}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-navy-800">Shaadi<span className="text-burgundy-700">Sync</span></span>
              <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-semibold text-gold-900 border border-gold-300">SaaS</span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">Indian Wedding Operations</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-navy-700">
          <Link href="/#features" className="hover:text-gold-600 transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-gold-600 transition-colors">How It Works</Link>
          <Link href="/#benefits" className="hover:text-gold-600 transition-colors">Planners & Families</Link>
          <Link href="/#faq" className="hover:text-gold-600 transition-colors">FAQ</Link>
          <Link href="/pricing" className="hover:text-gold-600 transition-colors">Pricing</Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-semibold text-navy-700">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="font-semibold gap-1.5 shadow-subtle">
              <Sparkles className="h-4 w-4 text-gold-400" />
              Launch Dashboard
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-navy-700 hover:bg-slate-100 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle navigation menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-navy-800">
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              How It Works
            </Link>
            <Link
              href="/#benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              Planners & Families
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              FAQ
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              Pricing (₹0 MVP)
            </Link>
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">Sign In</Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center gap-2">
                <Sparkles className="h-4 w-4 text-gold-400" />
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
