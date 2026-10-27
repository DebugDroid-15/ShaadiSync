"use client";

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
  Heart,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RoyalPalaceArchFrame,
  RoyalSectionDivider,
  SacredWeddingKalash,
  PalaceCornerJali,
  ScrollFestiveIndicator,
} from "@/components/ui/royal-wedding-elements";
import { WeddingToranHeader, FloatingShaadiMotifs } from "@/components/ui/shaadi-decorations";
import {
  RoyalCanvasPetalShower,
  AnimatedMandalaHero,
  AnimatedFlickerDiya,
  ShaadiCelebrationLauncher,
  AnimatedShaadiMusicBanner,
} from "@/components/ui/shaadi-motion-graphics";
import { SacredHavanPherasSplashScreen } from "@/components/ui/sacred-havan-splash-screen";
import { InteractiveFoodCalculationSection } from "@/components/ui/interactive-food-calculation";
import { InteractiveCrowdCalculationSection } from "@/components/ui/interactive-crowd-calculation";
import {
  AnimatedBanquetDegchi,
  AnimatedGateScannerGraphic,
} from "@/components/ui/shaadi-calculation-graphics";

export default function LandingPage() {
  return (
    <div className="flex flex-col relative bg-ivory-100 min-h-screen text-navy-900 font-sans selection:bg-gold-500/20 selection:text-navy-900 overflow-x-hidden">
      {/* Sacred Traditional Havan Kund & Circumambulating Pheras Splash Screen */}
      <SacredHavanPherasSplashScreen />

      {/* 1. Scroll-driven festive progress indicator */}
      <ScrollFestiveIndicator />

      {/* 2. Dynamic Live Canvas Petal & Starlight Shower (Marigold, Crimson Rose & Gold Glints) */}
      <RoyalCanvasPetalShower />

      {/* 3. Floating Festive Motifs across Entire Scroll */}
      <FloatingShaadiMotifs />

      {/* 4. Traditional Marigold Toran Garland across Top Header */}
      <WeddingToranHeader />

      {/* =========================================================================
          SECTION A: CINEMATIC ROYAL HERO
          ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-36 border-b border-navy-100 bg-gradient-to-b from-white via-ivory-100 to-ivory-200">
        <PalaceCornerJali position="top-left" />
        <PalaceCornerJali position="top-right" />
        <div className="absolute inset-0 bg-jali-pattern opacity-25 pointer-events-none" />

        {/* Dynamic Rotating Royal Palace Mandala Aura in Hero Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-40 sm:opacity-55 scale-90 sm:scale-110">
          <AnimatedMandalaHero />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Auspicious Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-50/90 px-4 py-1.5 text-xs font-semibold text-gold-900 shadow-xs mb-6">
            <AnimatedFlickerDiya size="sm" />
            <span className="font-serif tracking-wider uppercase text-[11px]">
              ₹0 Free Forever Tier • 22 Indian Languages • Zero Paid API Bills
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-navy-900 font-serif leading-[1.12]">
            The Operating System for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-burgundy-700 via-gold-600 to-burgundy-800 bg-clip-text text-transparent">
              Grand Indian Weddings
            </span>
          </h1>

          {/* Hero Story Subtitle */}
          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Eliminate event-day chaos across 500+ guests. One unified, high-speed platform for royal families and wedding planners to coordinate multi-day ceremonies, selective household RSVPs, banquet catering guarantees, vendor settlements in ₹ INR, hotel room blocks, and instant offline QR check-ins.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto font-bold gap-2 shadow-royal bg-gradient-to-r from-navy-800 via-burgundy-800 to-navy-900 hover:from-navy-900 hover:to-burgundy-900 text-white px-8 h-12 text-base border border-gold-400/40"
              >
                <Sparkles className="h-4 w-4 text-gold-400" />
                Launch Live Command Center
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto font-semibold px-8 h-12 text-base border-gold-300 bg-white hover:bg-gold-50/50 text-navy-900 shadow-xs"
              >
                Explore Zero-Cost Pricing
              </Button>
            </Link>
          </div>

          {/* Interactive Genda Phool Celebration Trigger */}
          <div className="mt-6 flex justify-center">
            <ShaadiCelebrationLauncher />
          </div>

          {/* Four Core Trust Pillars */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-gold-300/60 text-left">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-gold-200/80 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-navy-900">Multi-Event Passes</div>
                <div className="text-[11px] text-slate-500">Selective ceremony access</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-gold-200/80 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-navy-900">Banquet Guarantees</div>
                <div className="text-[11px] text-slate-500">Save lakhs on plate waste</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-gold-200/80 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-navy-900">Instant Gate QR Pass</div>
                <div className="text-[11px] text-slate-500">1-second gate verification</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-gold-200/80 shadow-xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-navy-900">22 Indian Languages</div>
                <div className="text-[11px] text-slate-500">Elders RSVP in native tongue</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION B: DECORATIVE TRANSITION INTO THE STORY & SHEHNAI MUSIC BANNER
          ========================================================================= */}
      <AnimatedShaadiMusicBanner />

      <RoyalSectionDivider
        title="Royal Command Center"
        subtitle="Precision engineering designed for the grandeur of Indian weddings"
      />

      {/* =========================================================================
          SECTION C: LIVE DASHBOARD SIMULATION PREVIEW (UDAIPUR PALACE)
          ========================================================================= */}
      <section className="py-16 bg-navy-900 text-white relative overflow-hidden border-b border-navy-800">
        <PalaceCornerJali position="top-right" />
        <PalaceCornerJali position="bottom-left" />
        <div className="absolute inset-0 bg-jali-pattern opacity-10 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="gold" className="mb-3 uppercase tracking-wider text-[10px]">
              Real-Time Control Room
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white">
              One Unified Command Center for Your Entire Big Fat Wedding
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base">
              Say goodbye to messy 40-column Google Sheets, lost WhatsApp messages, and stressed-out banquet managers.
            </p>
          </div>

          {/* Mock Dashboard UI Card */}
          <div className="rounded-2xl border-2 border-gold-400/60 bg-navy-800/95 shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-navy-700 bg-navy-950/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-medium text-slate-300">
                  ShaadiSync Command Center • Royal Palace Udaipur • Laxman & Simran
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gold-300 font-semibold bg-gold-950/60 border border-gold-800/60 px-3 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live Sync Active
              </div>
            </div>

            {/* Dashboard Mock Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Stat 1 */}
              <div className="rounded-xl bg-navy-900/90 border border-gold-500/20 p-4 shadow-sm">
                <div className="text-xs text-slate-400 font-medium">Total Invited Guests</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white font-mono">482</div>
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
              <div className="rounded-xl bg-navy-900/90 border border-gold-500/20 p-4 shadow-sm">
                <div className="text-xs text-slate-400 font-medium">Confirmed RSVPs</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-emerald-400 font-mono">412</div>
                  <span className="text-xs text-slate-400 font-medium">85.4% Rate</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> 380 Veg
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400 ml-2" /> 32 Jain
                </div>
                <div className="mt-2 text-[11px] text-gold-400 font-semibold">0 Overbooking alerts</div>
              </div>

              {/* Stat 3 */}
              <div className="rounded-xl bg-navy-900/90 border border-gold-500/20 p-4 shadow-sm">
                <div className="text-xs text-slate-400 font-medium">Banquet Guarantee</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-gold-300 font-mono">435 Plates</div>
                  <span className="text-xs text-emerald-400 font-semibold">Saved ₹1.85L</span>
                </div>
                <div className="mt-3 text-[11px] text-slate-300">
                  Calculated at +5% buffer over confirmed RSVP to eliminate buffet wastage.
                </div>
              </div>

              {/* Stat 4 */}
              <div className="rounded-xl bg-navy-900/90 border border-gold-500/20 p-4 shadow-sm">
                <div className="text-xs text-slate-400 font-medium">Gate Entrance Activity</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white font-mono">294 <span className="text-sm font-normal text-slate-400">/ 412</span></div>
                  <span className="text-xs text-emerald-400 font-semibold">Live Scanning</span>
                </div>
                <div className="mt-3 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <QrCode className="h-3.5 w-3.5 text-gold-400" />
                  Avg scan time: 0.8 seconds
                </div>
              </div>
            </div>

            {/* Quick Live Ceremonies Strip */}
            <div className="border-t border-navy-700 bg-navy-950/60 p-4 px-6 flex flex-wrap items-center justify-between gap-4 text-xs">
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
                <Link href="/dashboard/check-in" className="text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1.5">
                  Open Live Scanner Desk <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: THE INDIAN WEDDING DILEMMA: OLD WAY VS SHAADISYNC
          ========================================================================= */}
      <section className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
        <PalaceCornerJali position="top-left" />
        <PalaceCornerJali position="bottom-right" />
        <div className="absolute inset-0 bg-jali-pattern opacity-15 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-3 uppercase tracking-wider text-[10px]">
              Why Generic Event Apps Fail
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-navy-900 tracking-tight">
              Why Western Event Tools Break at Indian Weddings
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Western wedding apps assume 1 single wedding dinner with 80 guests. Indian weddings feature 5 to 7 celebrations over 3 days, 500+ guests, joint family dynamics, strict dietary splits, and VIP arrivals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-6 sm:p-8 shadow-xs relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  ✕
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-950 font-serif">The Old Way (Spreadsheet Chaos)</h3>
                  <p className="text-xs text-rose-700">Google Sheets, forwarded WhatsApp messages, and guesswork</p>
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
            <div className="rounded-2xl border-2 border-gold-400 bg-gradient-to-br from-white via-amber-50/30 to-amber-50/10 p-6 sm:p-8 shadow-card relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-500 to-burgundy-700 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy-950 font-serif">The ShaadiSync Way</h3>
                  <p className="text-xs text-emerald-800 font-semibold">Precision automation engineered for Indian dynamics</p>
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

      {/* =========================================================================
          SECTION E: THE 8 CORE OPERATIONAL PILLARS
          ========================================================================= */}
      <section id="features" className="py-20 bg-ivory-100 border-b border-slate-200 relative overflow-hidden">
        <PalaceCornerJali position="top-right" />
        <PalaceCornerJali position="bottom-left" />
        <div className="absolute inset-0 bg-jali-pattern opacity-25 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="gold" className="mb-3 uppercase tracking-wider text-[10px]">
              Complete Platform Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-navy-900 tracking-tight">
              8 Pillars of Flawless Wedding Execution
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Every ceremonial detail considered—from the initial Roka announcement to final vendor settlement receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <RoyalPalaceArchFrame>
              <div className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <CalendarHeart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-serif">Multi-Event Scheduling</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Create Roka, Mehendi, Haldi, Sangeet, Pheras, and Reception with distinct timings, dress codes, Google Maps venues, and guest caps.
                </p>
              </div>
            </RoyalPalaceArchFrame>

            {/* Pillar 2 */}
            <RoyalPalaceArchFrame>
              <div className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-serif">Household & Joint Family RSVP</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Add entire Indian joint families under 1 lead contact. Guests confirm who is attending which function in 1 click without any password.
                </p>
              </div>
            </RoyalPalaceArchFrame>

            {/* Pillar 3 */}
            <RoyalPalaceArchFrame>
              <div className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-serif">22 Indian Languages</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Full localization in Hindi, Punjabi, Gujarati, Marathi, Bengali, Telugu, Tamil, Urdu, Sanskrit, Rajasthani, and 12 more languages.
                </p>
              </div>
            </RoyalPalaceArchFrame>

            {/* Pillar 4 */}
            <RoyalPalaceArchFrame>
              <div className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <Share2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-serif">1-Click WhatsApp Engine</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Send authentic, culturally personalized invitations over WhatsApp via native links (`wa.me`) without paying per-message API fees.
                </p>
              </div>
            </RoyalPalaceArchFrame>

            {/* Pillar 5 */}
            <RoyalPalaceArchFrame>
              <div className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <UtensilsCrossed className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-serif">Catering Headcount Engine</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Automatically calculates exact banquet plate minimums per function, segregating Jain, Pure Vegetarian, Non-Veg, and Child portions.
                </p>
              </div>
            </RoyalPalaceArchFrame>

            {/* Pillar 6 */}
            <RoyalPalaceArchFrame>
              <div className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <QrCode className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-serif">Gate Check-in & Passes</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Every confirmed guest gets a digital entry pass with a dynamic QR code. Scanners operate offline on any mobile browser.
                </p>
              </div>
            </RoyalPalaceArchFrame>

            {/* Pillar 7 */}
            <RoyalPalaceArchFrame>
              <div className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <IndianRupee className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-serif">Budget & Vendor Balances</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Track advance tokens, milestones, and pending cash/UPI balances across decorators, caterers, makeup artists, and DJs in ₹ INR.
                </p>
              </div>
            </RoyalPalaceArchFrame>

            {/* Pillar 8 */}
            <RoyalPalaceArchFrame>
              <div className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-gold-600 mb-2">
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 font-serif">Rooms & Flight Transfers</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Manage hotel room allocations, arrival flights/train schedules, airport driver dispatch sheets, and luggage tags without chaos.
                </p>
              </div>
            </RoyalPalaceArchFrame>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E1: DEEP DIVE: BANQUET FOOD & PLATE OPTIMIZATION CALCULATION
          ========================================================================= */}
      <section id="food-calculation" className="py-20 bg-gradient-to-b from-white via-amber-50/20 to-ivory-100 border-b border-gold-200/60 relative overflow-hidden">
        <PalaceCornerJali position="top-left" />
        <PalaceCornerJali position="bottom-right" />
        <div className="absolute inset-0 bg-jali-pattern opacity-15 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <Badge variant="gold" className="mb-3 uppercase tracking-wider text-[10px]">
                Banquet Engineering & Plate Optimization
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-navy-950 tracking-tight leading-tight">
                Precision Food Calculation: <br />
                <span className="bg-gradient-to-r from-amber-600 via-gold-600 to-burgundy-700 bg-clip-text text-transparent">
                  Zero Starved Guests. Zero Food in the Bin.
                </span>
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                Indian weddings are legendary for extraordinary feasts—and infamous for lakhs of rupees thrown away on surplus plates.
                ShaadiSync brings algorithmic precision to Halwai and Banquet operations, automatically calculating confirmed attendee counts, safe buffer margins, and separate Jain/Veg/Non-Veg kitchen slips.
              </p>
            </div>

            {/* Dynamic Animated Copper Degchi Visual */}
            <div className="shrink-0 flex flex-col items-center">
              <AnimatedBanquetDegchi />
              <span className="text-xs font-serif text-gold-800 font-semibold mt-1">
                Aromatic Royal Handi • Live Kitchen Sync
              </span>
            </div>
          </div>

          {/* Interactive Calculator Component */}
          <InteractiveFoodCalculationSection />
        </div>
      </section>

      {/* =========================================================================
          SECTION E2: DEEP DIVE: BARAAT SURGE & CROWD FLOW CALCULATION
          ========================================================================= */}
      <section id="crowd-calculation" className="py-20 bg-navy-900 border-b border-navy-800 relative overflow-hidden text-white">
        <PalaceCornerJali position="top-right" />
        <PalaceCornerJali position="bottom-left" />
        <div className="absolute inset-0 bg-jali-pattern opacity-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="max-w-2xl">
              <Badge variant="gold" className="mb-3 uppercase tracking-wider text-[10px]">
                High-Volume Gate Ingress & Crowd Velocity
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight">
                Crowd Surge Calculations: <br />
                <span className="bg-gradient-to-r from-gold-300 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                  1-Second Verification, Zero Baraat Bottlenecks
                </span>
              </h2>
              <p className="mt-4 text-slate-300 text-base leading-relaxed">
                When 600 guests descend upon palace gates simultaneously as Dhol beats crescendo, paper spreadsheets collapse.
                ShaadiSync turns any volunteer’s mobile phone into a sub-second scanner desk with offline cryptographic security and instant anti-gatecrashing checks.
              </p>
            </div>

            {/* Dynamic Animated Gate Scanner Graphic */}
            <div className="shrink-0 flex flex-col items-center">
              <AnimatedGateScannerGraphic />
              <span className="text-xs font-serif text-gold-300 font-semibold mt-1">
                Sub-Second Gate Scanner Desk
              </span>
            </div>
          </div>

          {/* Interactive Crowd Flow Simulation Component */}
          <InteractiveCrowdCalculationSection />
        </div>
      </section>

      {/* =========================================================================
          SECTION F: THE ROYAL GUEST RSVP EXPERIENCE & ENTRY PASS
          ========================================================================= */}
      <section className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
        <PalaceCornerJali position="top-left" />
        <PalaceCornerJali position="bottom-right" />
        <div className="absolute inset-0 bg-jali-pattern opacity-15 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="gold" className="mb-3 uppercase tracking-wider text-[10px]">
                Zero Friction Guest Journey
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-navy-900 tracking-tight">
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
                    <h4 className="font-bold text-navy-900 text-sm">Instant Digital Entry Pass & Luxury Badge</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Upon confirmation, guests instantly receive an entry pass they can download or share to mobile wallets.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/dashboard/guests">
                  <Button variant="outline" className="border-gold-400 font-semibold gap-2 hover:bg-gold-50">
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
                <h3 className="font-serif text-lg font-bold text-navy-900">Laxman & Simran</h3>
                <p className="text-[11px] text-slate-500">The Grand Ballroom • Udaipur</p>
              </div>

              <div className="mt-4 rounded-xl bg-ivory-100 p-3 border border-gold-200/60 text-center">
                <div className="text-xs font-semibold text-navy-900">नमस्ते Omm Prakash Sahoo जी 🙏</div>
                <div className="text-[10px] text-slate-600 mt-0.5">You are cordially invited with family (4 Passes)</div>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs">
                  <div>
                    <div className="font-bold text-navy-900 font-serif">Sangeet & Cocktail Gala</div>
                    <div className="text-[10px] text-slate-500">7:30 PM • Indo-Western</div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">Attending</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs">
                  <div>
                    <div className="font-bold text-navy-900 font-serif">Baraat, Varmala & Pheras</div>
                    <div className="text-[10px] text-slate-500">11:00 AM • Traditional Royal</div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">Attending</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-dashed border-gold-400 bg-gold-50/40 p-3 text-center">
                <div className="text-[11px] font-bold text-navy-900 flex items-center justify-center gap-1.5 font-serif">
                  <QrCode className="h-4 w-4 text-gold-700" />
                  Official Entry Pass Generated
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

      {/* =========================================================================
          SECTION G: CELEBRATION ATMOSPHERE & EMOTIONAL INTERLUDE
          ========================================================================= */}
      <section className="py-24 bg-gradient-to-r from-navy-950 via-burgundy-950 to-navy-950 text-white relative overflow-hidden text-center border-y border-gold-400/40">
        <div className="absolute inset-0 bg-jali-pattern opacity-10 pointer-events-none" />
        <PalaceCornerJali position="top-left" />
        <PalaceCornerJali position="top-right" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-4">
            <SacredWeddingKalash className="w-14 h-14" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-gold-shimmer leading-tight">
            &ldquo;From Roka to Vidai, Every Moment Handled with Royal Perfection.&rdquo;
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Weddings are a sacred once-in-a-lifetime milestone. ShaadiSync handles the relentless backstage operations so you can celebrate, laugh, and dance with the people you love.
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gold-400 font-serif uppercase tracking-widest">
            <span>✨ Zero Commercial API Bills</span>
            <span>•</span>
            <span>✨ DPDPA 2023 Compliant</span>
            <span>•</span>
            <span>✨ 22 Indian Mother Tongues</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION H: PLANNERS VS SELF-ORGANISING FAMILIES
          ========================================================================= */}
      <section id="benefits" className="py-20 bg-ivory-100 border-b border-slate-200 relative overflow-hidden">
        <PalaceCornerJali position="top-right" />
        <PalaceCornerJali position="bottom-left" />
        <div className="absolute inset-0 bg-jali-pattern opacity-25 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="gold" className="mb-3 uppercase tracking-wider text-[10px]">
              Tailored Experience
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-navy-900 tracking-tight">
              Built for Professional Planners. Loved by Families.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Planners */}
            <div className="rounded-2xl border-2 border-slate-200 p-8 sm:p-10 bg-white shadow-card relative">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-navy-800 text-gold-400 flex items-center justify-center">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-serif text-navy-900">For Wedding Planners & Agencies</h3>
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
            <div className="rounded-2xl border-2 border-gold-300 p-8 sm:p-10 bg-gradient-to-br from-white via-amber-50/40 to-amber-50/10 shadow-card relative">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gold-500 text-navy-950 flex items-center justify-center">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-serif text-navy-900">For Self-Organising Families</h3>
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

      {/* =========================================================================
          SECTION I: FINAL INVITATION-INSPIRED CALL TO ACTION
          ========================================================================= */}
      <section className="py-24 bg-gradient-to-b from-white via-ivory-100 to-ivory-200 border-b border-navy-100 text-center relative overflow-hidden">
        <PalaceCornerJali position="top-left" />
        <PalaceCornerJali position="top-right" />
        <div className="absolute inset-0 bg-jali-pattern opacity-30 pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-100 px-4 py-1.5 text-xs font-semibold text-gold-900 shadow-xs mb-6">
            <Sparkles className="h-4 w-4 text-gold-600" />
            <span className="font-serif tracking-wider uppercase text-[11px]">Ready for the Wedding Season</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-navy-900 tracking-tight leading-tight">
            Bring Royal Order to Your Wedding Celebrations
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600 text-base sm:text-lg">
            Join Indian couples and premier wedding planners who eliminated spreadsheet chaos and saved lakhs on catering.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto font-bold gap-2 shadow-royal bg-gradient-to-r from-navy-800 via-burgundy-800 to-navy-900 hover:from-navy-900 hover:to-burgundy-900 text-white px-8 h-12 text-base border border-gold-400/40"
              >
                <Sparkles className="h-4 w-4 text-gold-400" />
                Enter Live Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto font-semibold px-8 h-12 text-base border-gold-300 bg-white hover:bg-gold-50/50 text-navy-900 shadow-xs"
              >
                Create Free Account
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-xs text-slate-500 font-serif italic">
            No credit card required • Free forever for individual weddings • Setup in under 5 minutes
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION J: PALACE-INSPIRED FOOTER
          ========================================================================= */}
      <footer className="bg-navy-950 text-white py-16 relative overflow-hidden border-t-2 border-gold-400/40">
        <PalaceCornerJali position="top-left" />
        <PalaceCornerJali position="top-right" />
        <div className="absolute inset-0 bg-jali-pattern opacity-10 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
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
                <span className="text-2xl font-bold font-serif tracking-tight">Shaadi<span className="text-gold-400">Sync</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                The premier operating system for Indian wedding management and multi-day ceremony logistics. Closed-source proprietary software engineered by Team SHATRUJEET.
              </p>
              <div className="flex items-center gap-2 text-xs text-gold-300 font-serif">
                <ShieldCheck className="h-4 w-4" /> DPDPA 2023 Privacy Compliant
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4 font-serif">Operations Suite</h4>
              <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                <li><Link href="/dashboard/functions" className="hover:text-gold-300 transition-colors">Ceremony Scheduler</Link></li>
                <li><Link href="/dashboard/guests" className="hover:text-gold-300 transition-colors">Household Guest Directory</Link></li>
                <li><Link href="/dashboard/check-in" className="hover:text-gold-300 transition-colors">Gate Scanner Desk</Link></li>
                <li><Link href="/dashboard/catering" className="hover:text-gold-300 transition-colors">Catering Guarantee Engine</Link></li>
                <li><Link href="/dashboard/logistics" className="hover:text-gold-300 transition-colors">Room & Transport Blocks</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4 font-serif">Indian Languages (22)</h4>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Full native localization across English, हिन्दी, ਪੰਜਾਬੀ, ગુજરાતી, मराठी, বাংলা, తెలుగు, தமிழ், ಕನ್ನಡ, മലയാളം, ଓଡ଼ିଆ, असमীয়া, اردو, संस्कृतम्, and more.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link href="/pricing" className="hover:text-gold-300 transition-colors">Pricing & Zero-Cost Tier</Link></li>
                <li><Link href="/privacy" className="hover:text-gold-300 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gold-300 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4 font-serif">Engineering & Source</h4>
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
                Built with Next.js 15, TypeScript, Tailwind CSS & Supabase.
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© 2026 Team SHATRUJEET. All rights reserved. Proprietary software.</p>
            <p className="flex items-center gap-1.5 text-slate-400 font-serif italic">
              Made with precision for Indian wedding celebrations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
