import * as React from "react";
import Link from "next/link";
import { CalendarHeart, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
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
          <h2 className="text-xl font-bold text-navy-900">Sign in to your organiser account</h2>
          <p className="text-xs text-slate-500 mt-1">Manage wedding functions, guests, and check-in</p>
        </div>

        <Card className="shadow-card border-slate-200">
          <CardHeader className="pb-4">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
              <strong>Phase 1 Notice:</strong> Supabase authentication activates in Phase 2. Click below to enter the live interactive dashboard shell.
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="planner@royalheritage.com"
              defaultValue="amar.khera@shaadisync.com"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              defaultValue="password123"
            />
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-slate-600">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-gold-600" />
                Remember me
              </label>
              <a href="#" className="font-semibold text-gold-600 hover:underline">Forgot password?</a>
            </div>

            <Link href="/dashboard" className="block pt-2">
              <Button className="w-full font-semibold gap-2 shadow-subtle" size="lg">
                Enter Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className="text-center text-xs text-slate-500 pt-2">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-navy-800 hover:underline">
                Create Organisation
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
