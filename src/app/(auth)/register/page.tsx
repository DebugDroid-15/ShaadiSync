"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { signUpAction } from "@/lib/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await signUpAction(formData);
      if (!result.success) {
        setError(result.error || "Registration failed.");
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2 mb-4 group">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gold-200/80 bg-white shadow-md flex items-center justify-center p-1 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="ShaadiSync"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-navy-900 tracking-tight">
              Shaadi<span className="text-burgundy-700">Sync</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-navy-900">Create your wedding organisation</h2>
          <p className="text-xs text-slate-500 mt-1">Start managing multi-day Indian wedding operations</p>
        </div>

        <Card className="shadow-card border-slate-200">
          <CardHeader className="pb-2">
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
              <strong>Free-Tier First:</strong> No credit card required. Free forever for MVP operations.
            </div>
            {error && (
              <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Your Full Name"
                name="fullName"
                placeholder="e.g. Amar Khera"
                defaultValue="Amar Khera"
                required
              />
              <Input
                label="Organisation / Agency Name"
                name="organisationName"
                placeholder="e.g. Royal Heritage Events"
                defaultValue="Royal Heritage Events"
                required
              />
              <Input
                label="Work Email"
                name="email"
                type="email"
                placeholder="planner@domain.com"
                defaultValue="amar.khera@shaadisync.com"
                required
              />
              <Input
                label="Create Password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                defaultValue="password123"
                required
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold gap-2 shadow-subtle"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Organisation...
                    </>
                  ) : (
                    <>
                      Create Organisation & Continue
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-xs text-slate-500 pt-2">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-navy-800 hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
