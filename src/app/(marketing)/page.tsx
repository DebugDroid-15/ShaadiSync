import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarHeart,
  Users,
  UtensilsCrossed,
  IndianRupee,
  Car,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Building,
  HeartHandshake,
  Layers,
  Smartphone,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-navy-100 bg-gradient-to-b from-white via-ivory-100 to-ivory-200">
        <div className="absolute inset-0 bg-[radial-gradient(#c6a15b_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50/80 px-4 py-1.5 text-xs font-semibold text-gold-900 shadow-xs mb-6">
            <Sparkles className="h-3.5 w-3.5 text-gold-600" />
            <span>₹0 MVP Operational Cost • Zero Paid API Dependencies</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-900 leading-tight">
            The Operating System for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-navy-800 via-gold-600 to-navy-900 bg-clip-text text-transparent">
              Indian Wedding Operations
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            Eliminate event-day chaos. One unified, mobile-first SaaS for wedding planners and families to coordinate multi-day functions, selective guest RSVPs, banquet catering guarantees, vendor balances, and QR check-ins.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-semibold gap-2 shadow-elevated">
                <Sparkles className="h-4 w-4 text-gold-400" />
                Explore Demo Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-medium">
                View Zero-Cost Plan
              </Button>
            </Link>
          </div>

          {/* Social Proof / Guarantee Strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium text-navy-800">Multi-Function Selective Invitations</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium text-navy-800">Guaranteed Catering Headcounts</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium text-navy-800">Instant Gate QR Pass Scanning</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium text-navy-800">Zero Commercial API Lock-in</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 10 Core Pillars of ShaadiSync */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="gold" className="mb-3">Comprehensive Scope</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
              Engineered Specifically for Indian Weddings
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Western event software fails when confronted with 6 functions, bride vs groom sides, and joint family RSVPs. ShaadiSync was built from the ground up for Indian event dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="hover:border-gold-400">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <CalendarHeart className="h-6 w-6" />
                </div>
                <CardTitle>Multi-Function Scheduling</CardTitle>
                <CardDescription>
                  Roka, Mehendi, Haldi, Sangeet, Pheras, Reception. Configure distinct times, dress codes, Google Maps venues, and guest caps.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="hover:border-gold-400">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Household & Selective RSVP</CardTitle>
                <CardDescription>
                  Group families together. Invite guests strictly to the functions intended for them. Guests RSVP via secure web links without logging in.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="hover:border-gold-400">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <UtensilsCrossed className="h-6 w-6" />
                </div>
                <CardTitle>Catering Guarantee Engine</CardTitle>
                <CardDescription>
                  Stop overpaying caterers. Dynamically compute banquet plate guarantees based on real confirmed RSVPs + configurable safety buffers.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="hover:border-gold-400">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <IndianRupee className="h-6 w-6" />
                </div>
                <CardTitle>Budget & Vendor Balances</CardTitle>
                <CardDescription>
                  Track advance tokens, contract values, and outstanding balances across decorators, caterers, makeup artists, and DJs in ₹ INR.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="hover:border-gold-400">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <Car className="h-6 w-6" />
                </div>
                <CardTitle>Logistics, Rooms & Transport</CardTitle>
                <CardDescription>
                  Hotel room assignments, airport/railway pickup dispatch schedules, and venue parking zone vehicle passes with conflict alerts.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="hover:border-gold-400">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <QrCode className="h-6 w-6" />
                </div>
                <CardTitle>Event-Day Gate Check-in</CardTitle>
                <CardDescription>
                  Scan QR passes on any smartphone browser or use instantaneous manual name/phone search. Prevents uninvited gate crashers.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-ivory-100 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-3">Simplified Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
              From Planning to Pheras in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="h-8 w-8 rounded-full bg-navy-700 text-gold-400 flex items-center justify-center font-bold text-sm mb-4">1</div>
              <h3 className="font-bold text-navy-900 mb-2">Create Wedding & Events</h3>
              <p className="text-xs text-slate-600">Define ceremonies with timings, locations, dress codes, and capacity limits.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="h-8 w-8 rounded-full bg-navy-700 text-gold-400 flex items-center justify-center font-bold text-sm mb-4">2</div>
              <h3 className="font-bold text-navy-900 mb-2">Import & Tag Guests</h3>
              <p className="text-xs text-slate-600">Upload CSV or add families. Assign guests to specific events (e.g. Sangeet + Shaadi).</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="h-8 w-8 rounded-full bg-navy-700 text-gold-400 flex items-center justify-center font-bold text-sm mb-4">3</div>
              <h3 className="font-bold text-navy-900 mb-2">Share RSVP Links</h3>
              <p className="text-xs text-slate-600">Send personalized WhatsApp invitations with 1-click links. Track confirmed headcounts.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="h-8 w-8 rounded-full bg-navy-700 text-gold-400 flex items-center justify-center font-bold text-sm mb-4">4</div>
              <h3 className="font-bold text-navy-900 mb-2">Operate on Event Day</h3>
              <p className="text-xs text-slate-600">Gate check-in desk, real-time arrival counts, banquet plate verification, and driver dispatch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Planners vs Families Benefits */}
      <section id="benefits" className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Planners */}
            <div className="rounded-2xl border border-slate-200 p-8 bg-gradient-to-br from-white to-slate-50 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-navy-700 text-gold-400 flex items-center justify-center">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-900">For Wedding Planners & Agencies</h3>
                  <p className="text-xs text-slate-500">Professional multi-client event operations</p>
                </div>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Multi-Wedding Tenancy:</strong> Manage dozens of weddings concurrently under isolated client workspaces.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Role-Scoped Staff Permissions:</strong> Assign gate check-in staff without exposing client contract pricing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Catering Guarantee Protection:</strong> Save clients lakhs in wasted banquet plates with dynamic RSVP audits.</span>
                </li>
              </ul>
            </div>

            {/* For Families */}
            <div className="rounded-2xl border border-slate-200 p-8 bg-gradient-to-br from-white to-ivory-100 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gold-500 text-navy-900 flex items-center justify-center">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-900">For Self-Organising Families</h3>
                  <p className="text-xs text-slate-500">Clarity and serenity for bride and groom sides</p>
                </div>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>No App Download Required:</strong> Relatives and elders RSVP instantly via regular mobile browser links.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Bride & Groom Side Clarity:</strong> Separate family lists, dietary flags (Jain/Pure Veg), and hotel allocations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>1-Click WhatsApp Messages:</strong> Share beautiful personalized invitations straight from your phone.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section id="faq" className="py-20 bg-ivory-100 border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="gold" className="mb-3">Answers</Badge>
            <h2 className="text-3xl font-bold text-navy-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-navy-900 mb-2">Can guests be invited to some events but not others?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Yes, absolutely. That is a foundational principle of ShaadiSync. An intimate Haldi guest list can have 120 guests, while the Wedding Ceremony has 400. Public RSVP links show each guest only the events they are invited to.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-navy-900 mb-2">How does the ₹0 MVP operational cost work?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                ShaadiSync avoids expensive third-party SMS gateways and WhatsApp Business API monthly bills by utilizing native mobile URI schemes (`wa.me`) and printable QR passes. Database persistence runs within Supabase free-tier allowances.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-navy-900 mb-2">What happens if internet connectivity is spotty at the palace venue?</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The gate check-in desk caches the guest list locally in browser memory and supports instant offline manual search by guest name or phone number, ensuring check-in continues smoothly without bottlenecks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-navy-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-navy-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-gold-400/40 bg-white shadow-sm flex items-center justify-center p-0.5">
                  <Image
                    src="/logo.png"
                    alt="ShaadiSync"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-bold">Shaadi<span className="text-gold-400">Sync</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The complete Indian wedding management and event operations SaaS platform. Engineered by Team SHATRUJEET.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3">Product</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link href="/#features" className="hover:text-gold-300">Features</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-gold-300">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-gold-300">Zero-Cost Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-gold-300">Live Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3">Legal & Privacy</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link href="/privacy" className="hover:text-gold-300">Privacy Policy (DPDPA 2023)</Link></li>
                <li><Link href="/terms" className="hover:text-gold-300">Terms of Service</Link></li>
                <li><span className="text-slate-400">Proprietary Software Notice</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3">Team SHATRUJEET</h4>
              <p className="text-xs text-slate-400 mb-2">Canonical Repository:</p>
              <a
                href="https://github.com/DebugDroid-15/ShaadiSync"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gold-400 hover:underline break-all"
              >
                github.com/DebugDroid-15/ShaadiSync
              </a>
              <p className="mt-3 text-[11px] text-slate-500">November 2026</p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© November 2026 Team SHATRUJEET. All rights reserved. Proprietary software.</p>
            <p className="flex items-center gap-1">
              Made with precision for Indian celebrations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
