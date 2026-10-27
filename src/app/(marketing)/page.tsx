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
  ChevronDown,
  Globe,
  Share2,
  FileSpreadsheet,
  Printer,
  Bell,
  Clock,
  MapPin,
  Lock,
  Zap,
  TrendingDown,
  UserCheck,
  Check,
  PhoneCall,
  CheckCheck,
  BadgeCheck,
  Hotel,
  ShieldAlert,
  Flame,
  Music,
  Wine,
  Camera,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-navy-100 bg-gradient-to-b from-white via-ivory-100 to-ivory-200">
        <div className="absolute inset-0 bg-[radial-gradient(#c6a15b_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50/90 px-4 py-1.5 text-xs font-semibold text-gold-900 shadow-xs mb-6">
            <Sparkles className="h-3.5 w-3.5 text-gold-600 animate-pulse" />
            <span>₹0 Free Forever Tier • 22 Indian Languages • Zero Paid API Bills</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-900 leading-[1.15]">
            The Operating System for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-burgundy-700 via-gold-600 to-navy-900 bg-clip-text text-transparent">
              Grand Indian Wedding Operations
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Eliminate event-day confusion across 500+ guests. One unified, high-speed platform for wedding planners and families to automate selective multi-day RSVPs, banquet catering guarantees, vendor payments in ₹ INR, hotel room blocks, and instant offline QR check-ins.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-semibold gap-2 shadow-elevated bg-navy-800 hover:bg-navy-900 text-white px-8 h-12 text-base">
                <Sparkles className="h-4 w-4 text-gold-400" />
                Launch Live Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-semibold px-8 h-12 text-base border-slate-300 bg-white">
                Explore Zero-Cost Pricing
              </Button>
            </Link>
          </div>

          {/* Core Trust & Metrics Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80 text-left">
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-navy-900">Multi-Event Passes</div>
                <div className="text-[11px] text-slate-500">Selective ceremony access</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-navy-900">Banquet Guarantees</div>
                <div className="text-[11px] text-slate-500">Eliminate plate overpayment</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-navy-900">Instant Gate QR Pass</div>
                <div className="text-[11px] text-slate-500">Fast 1-second entrance</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-slate-200/60 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-navy-900">22 Indian Languages</div>
                <div className="text-[11px] text-slate-500">Elders RSVP in native tongue</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Interactive UI Simulation Preview */}
      <section className="py-16 bg-navy-900 text-white relative overflow-hidden border-b border-navy-800">
        <div className="absolute inset-0 bg-[radial-gradient(#c6a15b_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="gold" className="mb-3">Real-Time Control Room</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              One Command Center for Your Entire Big Fat Wedding
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base">
              Say goodbye to messy 40-column Google Sheets, lost WhatsApp messages, and confused banquet coordinators.
            </p>
          </div>

          {/* Mock Dashboard UI Card */}
          <div className="rounded-2xl border border-navy-700 bg-navy-800/90 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-navy-700 bg-navy-950/70 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-medium text-slate-400">ShaadiSync Command Center • Royal Palace Udaipur • Amar & Simran</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gold-400 font-semibold bg-gold-950/60 border border-gold-800/60 px-3 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live Sync Active
              </div>
            </div>

            {/* Dashboard Mock Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Stat 1 */}
              <div className="rounded-xl bg-navy-900/80 border border-navy-700 p-4">
                <div className="text-xs text-slate-400 font-medium">Total Invited Guests</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">482</div>
                  <span className="text-xs text-emerald-400 font-semibold">+18 added</span>
                </div>
                <div className="mt-3 h-1.5 w-full bg-navy-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-400 rounded-full" style={{ width: "88%" }} />
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                  <span>Groom Side: 250</span>
                  <span>Bride Side: 232</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="rounded-xl bg-navy-900/80 border border-navy-700 p-4">
                <div className="text-xs text-slate-400 font-medium">Confirmed RSVPs</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-emerald-400">412</div>
                  <span className="text-xs text-slate-400 font-medium">85.4% Rate</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> 380 Veg
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400 ml-2" /> 32 Jain
                </div>
                <div className="mt-2 text-[11px] text-gold-400">0 Overbooking alerts</div>
              </div>

              {/* Stat 3 */}
              <div className="rounded-xl bg-navy-900/80 border border-navy-700 p-4">
                <div className="text-xs text-slate-400 font-medium">Banquet Plate Guarantee</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-gold-300">435</div>
                  <span className="text-xs text-emerald-400 font-semibold">Saved ₹1.85L</span>
                </div>
                <div className="mt-3 text-[11px] text-slate-300">
                  Calculated at +5% buffer over confirmed RSVP to avoid food waste.
                </div>
              </div>

              {/* Stat 4 */}
              <div className="rounded-xl bg-navy-900/80 border border-navy-700 p-4">
                <div className="text-xs text-slate-400 font-medium">Gate Entrance Activity</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white">294 <span className="text-sm font-normal text-slate-400">/ 412</span></div>
                  <span className="text-xs text-emerald-400 font-semibold">Active</span>
                </div>
                <div className="mt-3 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <QrCode className="h-3.5 w-3.5 text-gold-400" />
                  Avg scan time: 0.8 seconds
                </div>
              </div>
            </div>

            {/* Quick Live Ceremonies Strip */}
            <div className="border-t border-navy-700 bg-navy-950/40 p-4 px-6 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">Current Event:</span>
                  <span className="text-slate-300">Sangeet & Cocktail Gala (7:30 PM)</span>
                </div>
                <div className="hidden md:flex items-center gap-2 text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-gold-400" />
                  <span>Grand Ballroom, The Oberoi Udaivilas</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/dashboard/check-in" className="text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1">
                  Open Scanner Desk <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Indian Wedding Dilemma: Western Tools vs ShaadiSync */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-3">Why Generic Tools Fail</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Why Generic Event Apps Fail at Indian Weddings
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Western wedding apps assume 1 single wedding dinner with 80 guests. Indian weddings feature 5 to 7 celebrations over 3 days, 500+ guests, joint family dynamics, strict dietary splits, and VIP arrivals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  ✕
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-950">The Old Way (Spreadsheet Chaos)</h3>
                  <p className="text-xs text-rose-700">Google Sheets, WhatsApp forwarded links, and verbal promises</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-rose-600 font-bold mt-0.5">✕</span>
                  <span><strong>Plate Overordering:</strong> You pay caterers for 500 plates when only 380 turn up, throwing away ₹2,00,000+ per event.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-600 font-bold mt-0.5">✕</span>
                  <span><strong>Unfiltered RSVPs:</strong> Distant relatives mistakenly show up at intimate Mehendi ceremonies because links were forwardable.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-600 font-bold mt-0.5">✕</span>
                  <span><strong>Gate Queues & Crashers:</strong> Gatekeepers flip through 15 pages of paper spreadsheets while elderly guests stand in heat.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-600 font-bold mt-0.5">✕</span>
                  <span><strong>Dietary Nightmares:</strong> Caterers run out of Jain food because dietary preferences were buried in phone chats.</span>
                </li>
              </ul>
            </div>

            {/* The ShaadiSync Way */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/40 p-6 sm:p-8 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-950">The ShaadiSync Way</h3>
                  <p className="text-xs text-emerald-800">Precision automation engineered for Indian dynamics</p>
                </div>
              </div>
              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dynamic Plate Optimizer:</strong> ShaadiSync computes guaranteed plate headcounts with buffer margins, saving ₹1.5L to ₹4L.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Selective Ceremony Access:</strong> Each guest sees only the specific events they are invited to. No awkward misinvitations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Instant 1-Second QR Passes:</strong> Guests flash digital QR passes on their phone screen. Seamless VIP welcome.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Live Kitchen Headcount:</strong> Caterers receive exact breakdown of Pure Veg, Jain, Non-Veg, and Kids in real time.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Feature Suite (The 8 Pillars) */}
      <section id="features" className="py-20 bg-ivory-100 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="gold" className="mb-3">Complete Platform Architecture</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              8 Pillars of Flawless Wedding Execution
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Every detail considered—from the initial Roka announcement to final vendor settlement receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <Card className="hover:border-gold-400 transition-all shadow-xs hover:shadow-card bg-white">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <CalendarHeart className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Multi-Event Scheduling</CardTitle>
                <CardDescription className="text-xs">
                  Create Roka, Mehendi, Haldi, Sangeet, Pheras, and Reception with distinct timings, dress codes, Google Maps venues, and guest caps.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pillar 2 */}
            <Card className="hover:border-gold-400 transition-all shadow-xs hover:shadow-card bg-white">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Household & Selective RSVP</CardTitle>
                <CardDescription className="text-xs">
                  Add entire Indian joint families under 1 lead contact. Guests confirm who is attending which function in 1 click without any password.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pillar 3 */}
            <Card className="hover:border-gold-400 transition-all shadow-xs hover:shadow-card bg-white">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <Globe className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">22 Indian Languages</CardTitle>
                <CardDescription className="text-xs">
                  Full localization in Hindi, Punjabi, Gujarati, Marathi, Bengali, Telugu, Tamil, Urdu, Sanskrit, Rajasthani, and 12 more languages.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pillar 4 */}
            <Card className="hover:border-gold-400 transition-all shadow-xs hover:shadow-card bg-white">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <Share2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">1-Click WhatsApp Engine</CardTitle>
                <CardDescription className="text-xs">
                  Send authentic, culturally personalized invitations over WhatsApp via native links (`wa.me`) without paying per-message API fees.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pillar 5 */}
            <Card className="hover:border-gold-400 transition-all shadow-xs hover:shadow-card bg-white">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <UtensilsCrossed className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Catering Headcount Engine</CardTitle>
                <CardDescription className="text-xs">
                  Automatically calculates exact banquet plate minimums per function, segregating Jain, Pure Vegetarian, Non-Veg, and Child portions.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pillar 6 */}
            <Card className="hover:border-gold-400 transition-all shadow-xs hover:shadow-card bg-white">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <QrCode className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Gate Check-in & Passes</CardTitle>
                <CardDescription className="text-xs">
                  Every confirmed guest gets a digital entry pass with a dynamic QR code. Scanners operate offline on any mobile browser.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pillar 7 */}
            <Card className="hover:border-gold-400 transition-all shadow-xs hover:shadow-card bg-white">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <IndianRupee className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Budget & Vendor Balances</CardTitle>
                <CardDescription className="text-xs">
                  Track advance tokens, milestones, and pending cash/UPI balances across decorators, caterers, makeup artists, and DJs in ₹ INR.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Pillar 8 */}
            <Card className="hover:border-gold-400 transition-all shadow-xs hover:shadow-card bg-white">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <Car className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Rooms & Airport Logistics</CardTitle>
                <CardDescription className="text-xs">
                  Manage hotel room allocations, arrival flights/train schedules, airport driver dispatch sheets, and luggage tags without chaos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Deep-Dive Section: The Guest RSVP Experience */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="gold" className="mb-3">Zero Friction Guest Journey</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                No App Downloads. No Passwords. <br />
                Just One Elegant Tap.
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                Indian wedding guests range from tech-savvy college cousins to 80-year-old grandparents. Forcing them to create passwords or download an app guarantees an empty guest list.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-800 font-bold text-xs mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Personalized Magic Link via WhatsApp</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Guests tap their secure invitation link straight from their chat.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-800 font-bold text-xs mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Mother-Tongue Language Switcher</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Guests can toggle the entire RSVP into Hindi, Punjabi, Gujarati, Bengali, Tamil, etc.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-800 font-bold text-xs mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">Instant Digital Entry Pass & QR</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Upon confirmation, guests instantly receive an entry pass they can screenshot or save to Apple/Google Wallet.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/dashboard/guests">
                  <Button variant="outline" className="border-navy-300 font-semibold gap-2">
                    <UserCheck className="h-4 w-4 text-navy-800" />
                    Preview Guest Directory
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile RSVP Mockup Card */}
            <div className="relative mx-auto max-w-sm w-full rounded-3xl border-4 border-slate-800 bg-white p-6 shadow-2xl">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-28 bg-slate-800 rounded-b-xl" />
              
              <div className="text-center pt-4 pb-2 border-b border-slate-100">
                <Badge variant="gold" className="text-[10px] mb-1">Wedding Invitation</Badge>
                <h3 className="font-serif text-lg font-bold text-navy-900">Amar & Simran</h3>
                <p className="text-[11px] text-slate-500">The Grand Ballroom • Udaipur</p>
              </div>

              <div className="mt-4 rounded-xl bg-ivory-100 p-3 border border-gold-200/60 text-center">
                <div className="text-xs font-semibold text-navy-900">नमस्ते Omm Prakash Sahoo जी 🙏</div>
                <div className="text-[10px] text-slate-600 mt-0.5">You are cordially invited with family (4 Passes)</div>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs">
                  <div>
                    <div className="font-bold text-navy-900">Sangeet & Cocktail Gala</div>
                    <div className="text-[10px] text-slate-500">7:30 PM • Indo-Western</div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">Attending</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs">
                  <div>
                    <div className="font-bold text-navy-900">Baraat, Varmala & Pheras</div>
                    <div className="text-[10px] text-slate-500">11:00 AM • Traditional Royal</div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">Attending</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-dashed border-gold-400 bg-gold-50/40 p-3 text-center">
                <div className="text-[11px] font-bold text-navy-900 flex items-center justify-center gap-1.5">
                  <QrCode className="h-4 w-4 text-gold-700" />
                  Digital Entry Pass Generated
                </div>
                <div className="mt-2 mx-auto h-20 w-20 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1">
                  <QrCode className="h-16 w-16 text-navy-900" />
                </div>
                <div className="text-[9px] text-slate-500 mt-1 font-mono">TOKEN: SS-UDAI-9842</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Deep-Dive Section: Banquet Plate Guarantee & Kitchen Audit */}
      <section className="py-20 bg-ivory-100 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Calculator Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card order-2 lg:order-1">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="font-bold text-navy-900 text-lg">Catering Minimum Guarantee Calculator</h3>
                  <p className="text-xs text-slate-500">Sangeet & Dinner Reception (Plate Price: ₹2,400)</p>
                </div>
                <Badge variant="gold">Audit Safe</Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                  <span className="text-slate-600">Total Invited Guests:</span>
                  <span className="font-bold text-navy-900 font-mono">500 guests</span>
                </div>

                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                  <span className="text-slate-600">Confirmed RSVPs (Adults + Kids):</span>
                  <span className="font-bold text-emerald-600 font-mono">390 confirmed</span>
                </div>

                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                  <span className="text-slate-600">Safety Buffer Percentage:</span>
                  <span className="font-bold text-navy-900 font-mono">+8% (31 plates)</span>
                </div>

                <div className="rounded-xl bg-gold-50/80 border border-gold-300 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-gold-900 uppercase tracking-wider">Recommended Guarantee</div>
                      <div className="text-2xl font-extrabold text-navy-900 font-mono mt-0.5">421 Plates</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Calculated Savings</div>
                      <div className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5">₹1,89,600</div>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600">
                    Avoided committing to 500 flat plates based on traditional guesswork.
                  </div>
                </div>

                {/* Dietary split */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-slate-500 text-[10px]">Pure Veg</div>
                    <div className="font-bold text-navy-900 mt-0.5">280 Plates</div>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="text-amber-800 text-[10px]">Strict Jain</div>
                    <div className="font-bold text-amber-900 mt-0.5">65 Plates</div>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                    <div className="text-rose-800 text-[10px]">Non-Veg</div>
                    <div className="font-bold text-rose-900 mt-0.5">76 Plates</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation text */}
            <div className="order-1 lg:order-2">
              <Badge variant="gold" className="mb-3">Financial Protection</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
                Save ₹2 Lakhs to ₹5 Lakhs on Banquet Waste
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                Catering represents up to 45% of a total wedding budget in India. Without accurate RSVP data, hosts panic and over-guarantee plate numbers to the venue, paying for hundreds of untouched meals.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700"><strong>Contractual Protection:</strong> Export standardized PDF/CSV audit slips to hand over to hotel banquet managers 48 hours before the event.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700"><strong>Separate Jain & Vegan Counts:</strong> Ensure the halwai and kitchen staff know the exact count for garlic-free Jain counters.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700"><strong>Real-time Food Replenishment:</strong> Gate check-in signals give kitchen managers 45 minutes advance warning before peak buffet rush.</span>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/dashboard/catering">
                  <Button className="bg-navy-800 hover:bg-navy-900 text-white font-semibold gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-gold-400" />
                    Open Catering Calculator
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How It Works (Step-by-Step Interactive Workflow) */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-3">Operational Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              From Planning to Pheras in 5 Simple Steps
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Engineered to get wedding agencies and families up and running in under 15 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-ivory-50 p-6 shadow-xs">
              <div className="h-9 w-9 rounded-full bg-navy-800 text-gold-400 flex items-center justify-center font-bold text-sm mb-4">1</div>
              <h3 className="font-bold text-navy-900 text-base mb-2">Create Ceremonies</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add Haldi, Mehendi, Sangeet, Wedding, and Reception with venue maps and dress codes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-ivory-50 p-6 shadow-xs">
              <div className="h-9 w-9 rounded-full bg-navy-800 text-gold-400 flex items-center justify-center font-bold text-sm mb-4">2</div>
              <h3 className="font-bold text-navy-900 text-base mb-2">Import Guest List</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your contact spreadsheet via CSV or add families with bride/groom side tags.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-ivory-50 p-6 shadow-xs">
              <div className="h-9 w-9 rounded-full bg-navy-800 text-gold-400 flex items-center justify-center font-bold text-sm mb-4">3</div>
              <h3 className="font-bold text-navy-900 text-base mb-2">1-Click WhatsApp</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dispatch personalized invitations in any of 22 Indian languages with individual magic RSVP links.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-ivory-50 p-6 shadow-xs">
              <div className="h-9 w-9 rounded-full bg-navy-800 text-gold-400 flex items-center justify-center font-bold text-sm mb-4">4</div>
              <h3 className="font-bold text-navy-900 text-base mb-2">Lock In Logistics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculate banquet guarantees, allocate hotel room numbers, and track vendor advance balances.
              </p>
            </div>

            {/* Step 5 */}
            <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-ivory-50 p-6 shadow-xs">
              <div className="h-9 w-9 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center font-bold text-sm mb-4">5</div>
              <h3 className="font-bold text-navy-900 text-base mb-2">Gate Day Check-in</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Station staff with phones to scan QR passes in 1 second, greeting guests warmly with zero lines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Dedicated Profiles: Planners vs Self-Organising Families */}
      <section id="benefits" className="py-20 bg-ivory-100 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="gold" className="mb-3">Tailored Experience</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Built for Professional Planners. Loved by Families.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Planners */}
            <div className="rounded-2xl border border-slate-200 p-8 sm:p-10 bg-white shadow-card relative">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-navy-800 text-gold-400 flex items-center justify-center">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-navy-900">For Wedding Planners & Event Agencies</h3>
                  <p className="text-xs text-slate-500">Run 10+ destination weddings simultaneously with flawless SOPs</p>
                </div>
              </div>
              
              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Multi-Client Workspace Isolation:</strong> Manage multiple weddings under distinct organization dashboards with zero data leakage.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Role-Scoped On-Ground Staff:</strong> Grant scanner desk or logistics volunteers access strictly to check-in, without revealing confidential budget contracts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Client Audit Reports:</strong> Impress high-net-worth clients with real-time analytics, verified catering audits, and arrival heatmaps.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Vendor Contract Tracker:</strong> Keep milestone payments, deposit receipts, and GST invoices organized in one central ledger.</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Agency Tier Available</span>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="font-semibold text-navy-800 border-navy-200">
                    Create Agency Account
                  </Button>
                </Link>
              </div>
            </div>

            {/* For Families */}
            <div className="rounded-2xl border border-gold-300 p-8 sm:p-10 bg-gradient-to-br from-white to-gold-50/30 shadow-card relative">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gold-500 text-navy-950 flex items-center justify-center">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-navy-900">For Self-Organising Families</h3>
                  <p className="text-xs text-slate-500">Total peace of mind for parents, bride, and groom</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>No Tech Headache for Relatives:</strong> Elders don&apos;t need to remember passwords or configure settings. Everything opens in WhatsApp.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Bride & Groom Side Peace:</strong> Keep guest allocations, hotel room wings, and invitations transparent and balanced between both families.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Free Forever Core Features:</strong> Full access to RSVP links, check-in scanner, guest management, and catering tools at zero platform fee.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Instant VIP Arrival Alerts:</strong> Ensure close family elders and VIP dignitaries receive their dedicated royal welcome upon entrance.</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-gold-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-gold-900">100% Free for Family Weddings</span>
                <Link href="/register">
                  <Button size="sm" className="font-semibold bg-navy-800 hover:bg-navy-900 text-white">
                    Start Your Wedding Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Security & Compliance Guarantee (DPDPA 2023 & Zero Leakage) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-navy-100 bg-gradient-to-r from-navy-900 to-navy-800 p-8 sm:p-12 text-white shadow-elevated">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-500/10 px-3.5 py-1 text-xs font-semibold text-gold-300">
                  <ShieldCheck className="h-4 w-4 text-gold-400" />
                  Enterprise-Grade Privacy & Security
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Your Guest Phone Numbers and Family Details Remain 100% Private
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Indian wedding data contains high-profile phone numbers and family addresses. Unlike commercial wedding portals that sell your guest data to jewelers, banquet halls, and telemarketers, ShaadiSync operates under strict Row Level Security (RLS) and is fully compliant with India&apos;s Digital Personal Data Protection Act (DPDPA 2023).
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-gold-300 font-semibold">
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4" /> Zero Third-Party Ad Trackers</span>
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4" /> PostgreSQL Row-Level Security</span>
                  <span className="flex items-center gap-1.5"><Check className="h-4 w-4" /> End-to-End Encrypted Tokens</span>
                </div>
              </div>

              <div className="text-center md:text-right">
                <Link href="/privacy">
                  <Button variant="secondary" className="bg-white text-navy-900 font-bold hover:bg-ivory-100 px-6">
                    Read Privacy Commitment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Comprehensive Indian Wedding FAQ */}
      <section id="faq" className="py-20 bg-ivory-100 border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="gold" className="mb-3">Clarity First</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Everything you need to know about setting up ShaadiSync for your ceremonies.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-navy-900 mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-gold-600" />
                Can guests be invited to selective ceremonies only (e.g. Reception only)?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Yes, absolutely. This is one of ShaadiSync&apos;s most celebrated features. An intimate Haldi can have 80 guests, Sangeet can have 250, and the Grand Wedding Reception can have 600. When each guest opens their unique link, they only see and RSVP to the exact events they are tagged for.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-navy-900 mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-gold-600" />
                How does the WhatsApp 1-click invitation system work without paying API fees?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                ShaadiSync generates native WhatsApp deep-links (`wa.me`) pre-populated with personalized text, recipient phone numbers, and unique RSVP magic links. When you tap &quot;Send via WhatsApp&quot;, it opens WhatsApp directly on your phone or web browser ready to send. No monthly Twilio or WhatsApp Business Meta API bills.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-navy-900 mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-gold-600" />
                What if the palace or farmhouse venue has spotty internet connection?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The gate check-in scanner desk is architected with client-side caching. Once loaded on your smartphone browser, check-in staff can scan QR passes or perform instant instant-search by guest name or phone number even with intermittent connectivity.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-navy-900 mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-gold-600" />
                Which 22 Indian languages are supported?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                ShaadiSync supports Hindi, Punjabi, Gujarati, Marathi, Bengali, Telugu, Tamil, Kannada, Malayalam, Odia, Assamese, Urdu, Sanskrit, Kashmiri, Sindhi, Nepali, Konkani, Maithili, Bhojpuri, Rajasthani/Marwari, Dogri, and English. Both the guest portal and generated WhatsApp messages adapt seamlessly.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-navy-900 mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-gold-600" />
                How can multiple family members or wedding planners collaborate?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Organizers can create role-scoped accounts. You can grant groom-side leads access to manage their family invitations, bride-side leads access to theirs, and on-ground coordinators access strictly to the gate check-in scanner without exposing financial vendor contracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-white via-ivory-100 to-ivory-200 border-b border-navy-100 text-center relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-100 px-4 py-1.5 text-xs font-semibold text-gold-900 shadow-xs mb-6">
            <Sparkles className="h-4 w-4 text-gold-600" />
            <span>Ready for the Wedding Season</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight">
            Bring Royal Order to Your Wedding Celebrations
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600 text-base sm:text-lg">
            Join hundreds of Indian couples and premier wedding planners who eliminated spreadsheet chaos and saved lakhs on catering.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-semibold gap-2 shadow-elevated bg-navy-800 hover:bg-navy-900 text-white px-8 h-12 text-base">
                <Sparkles className="h-4 w-4 text-gold-400" />
                Enter Dashboard Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-semibold px-8 h-12 text-base border-slate-300 bg-white">
                Create Free Account
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-xs text-slate-500">
            No credit card required • Free forever for individual weddings • Setup in under 5 minutes
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="bg-navy-950 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-navy-800">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-gold-400/40 bg-white shadow-sm flex items-center justify-center p-0.5">
                  <Image
                    src="/logo.png"
                    alt="ShaadiSync"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <span className="text-2xl font-bold tracking-tight">Shaadi<span className="text-gold-400">Sync</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The premier operating system for Indian wedding management and multi-day ceremony logistics. Closed-source proprietary software engineered by Team SHATRUJEET.
              </p>
              <div className="flex items-center gap-2 text-xs text-gold-300">
                <ShieldCheck className="h-4 w-4" /> DPDPA 2023 Privacy Compliant
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4">Operations Suite</h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li><Link href="/dashboard/events" className="hover:text-gold-300 transition-colors">Ceremony Scheduler</Link></li>
                <li><Link href="/dashboard/guests" className="hover:text-gold-300 transition-colors">Household Guest Directory</Link></li>
                <li><Link href="/dashboard/check-in" className="hover:text-gold-300 transition-colors">Gate Scanner Desk</Link></li>
                <li><Link href="/dashboard/catering" className="hover:text-gold-300 transition-colors">Catering Guarantee Engine</Link></li>
                <li><Link href="/dashboard/logistics" className="hover:text-gold-300 transition-colors">Room & Transport Blocks</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4">Indian Languages (22)</h4>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Full native localization across English, हिन्दी, ਪੰਜਾਬੀ, ગુજરાતી, मराठी, বাংলা, తెలుగు, தமிழ், ಕನ್ನಡ, മലയാളം, ଓଡ଼ିଆ, অসমীয়া, اردو, संस्कृतम्, and more.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link href="/pricing" className="hover:text-gold-300 transition-colors">Pricing & Zero-Cost Tier</Link></li>
                <li><Link href="/privacy" className="hover:text-gold-300 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gold-300 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4">Engineering & Source</h4>
              <p className="text-xs text-slate-400 mb-2">Canonical Repository:</p>
              <a
                href="https://github.com/DebugDroid-15/ShaadiSync"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gold-400 hover:underline break-all block mb-3 font-mono"
              >
                github.com/DebugDroid-15/ShaadiSync
              </a>
              <div className="rounded-xl border border-navy-800 bg-navy-900/60 p-3 text-[11px] text-slate-400">
                Built with Next.js 14, TypeScript, Tailwind CSS & Supabase.
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 Team SHATRUJEET. All rights reserved. Proprietary software.</p>
            <p className="flex items-center gap-1.5 text-slate-400">
              Made with precision for Indian wedding celebrations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
