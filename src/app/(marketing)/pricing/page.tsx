import * as React from "react";
import Link from "next/link";
import { Check, Sparkles, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="gold" className="mb-4">Zero-Cost Mandate</Badge>
        <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight sm:text-5xl">
          Honest, Transparent Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
          ShaadiSync is engineered to run on free-tier infrastructure. No hidden API subscription fees, no credit card required to manage your weddings.
        </p>

        <div className="mt-12 max-w-lg mx-auto">
          <Card className="border-2 border-gold-400 shadow-elevated bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold-500 text-navy-950 font-bold text-[10px] uppercase tracking-wider py-1 px-4 rounded-bl-lg">
              Active Tier
            </div>
            <CardHeader className="text-left pb-4">
              <CardTitle className="text-2xl text-navy-900">Community & Planner MVP</CardTitle>
              <CardDescription>Full access to all 10 operational pillars</CardDescription>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-navy-900">₹0</span>
                <span className="text-sm font-semibold text-slate-500">/ forever free for MVP</span>
              </div>
            </CardHeader>
            <CardContent className="text-left space-y-4 pt-4 border-t border-slate-100">
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Weddings & Functions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Selective Function RSVP Portal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed Headcount Catering Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Mobile Gate QR Pass Scanner</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Vendor Contracts & Advance Ledger</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>1-Click WhatsApp Personalized Links</span>
                </li>
              </ul>

              <div className="pt-6">
                <Link href="/dashboard">
                  <Button className="w-full font-semibold gap-2 shadow-subtle" size="lg">
                    <Sparkles className="h-4 w-4 text-gold-400" />
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
