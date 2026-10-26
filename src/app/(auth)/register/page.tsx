import * as React from "react";
import Link from "next/link";
import { CalendarHeart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-700 text-gold-400 shadow-md">
              <CalendarHeart className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-navy-900">Shaadi<span className="text-gold-500">Sync</span></span>
          </Link>
          <h2 className="text-xl font-bold text-navy-900">Create your wedding organisation</h2>
          <p className="text-xs text-slate-500 mt-1">Start managing multi-day Indian wedding operations</p>
        </div>

        <Card className="shadow-card border-slate-200">
          <CardHeader className="pb-4">
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
              <strong>Free-Tier First:</strong> No credit card required. Free forever for MVP operations.
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Your Full Name"
              placeholder="e.g. Amar Khera"
              defaultValue="Amar Khera"
            />
            <Input
              label="Organisation / Agency Name"
              placeholder="e.g. Royal Heritage Events"
              defaultValue="Royal Heritage Events"
            />
            <Input
              label="Work Email"
              type="email"
              placeholder="planner@domain.com"
              defaultValue="amar.khera@shaadisync.com"
            />
            <Input
              label="Create Password"
              type="password"
              placeholder="At least 8 characters"
              defaultValue="password123"
            />

            <Link href="/dashboard" className="block pt-2">
              <Button className="w-full font-semibold gap-2 shadow-subtle" size="lg">
                Create Organisation & Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="text-center text-xs text-slate-500 pt-2">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-navy-800 hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
