"use client";

import * as React from "react";
import {
  UtensilsCrossed,
  Calculator,
  TrendingDown,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Flame,
  Award,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { AnimatedFlickerDiya } from "@/components/ui/shaadi-motion-graphics";

/**
 * Interactive Shaadi Food & Banquet Plate Calculation Engine
 * Demonstrates the exact Indian wedding catering guarantee formula,
 * dietary distribution splits (Pure Veg, Jain, Non-Veg, Kids),
 * dynamic buffer sliders, and calculated rupee savings compared to traditional over-ordering.
 */
export function InteractiveFoodCalculationSection() {
  // Interactive state
  const [invitedGuests, setInvitedGuests] = React.useState<number>(500);
  const [expectedAttendancePct, setExpectedAttendancePct] = React.useState<number>(85);
  const [bufferPct, setBufferPct] = React.useState<number>(8);
  const [plateCost, setPlateCost] = React.useState<number>(1850);
  const [pureVegPct, setPureVegPct] = React.useState<number>(65);
  const [jainPct, setJainPct] = React.useState<number>(25);

  // Derived calculations
  const confirmedAttendees = Math.round((invitedGuests * expectedAttendancePct) / 100);
  const bufferCount = Math.ceil((confirmedAttendees * bufferPct) / 100);
  const guaranteedPlates = confirmedAttendees + bufferCount;

  // Traditional unscientific ordering (often +20% to +30% or flat invite count)
  const traditionalPlatesOrdered = invitedGuests; 
  const traditionalTotalCost = traditionalPlatesOrdered * plateCost;
  const shaadiSyncTotalCost = guaranteedPlates * plateCost;
  const rupeeSavings = Math.max(0, traditionalTotalCost - shaadiSyncTotalCost);
  const wastedPlatesEliminated = Math.max(0, traditionalPlatesOrdered - guaranteedPlates);

  // Dietary breakdowns
  const nonVegPct = Math.max(0, 100 - pureVegPct - jainPct);
  const vegPlates = Math.round((guaranteedPlates * pureVegPct) / 100);
  const jainPlates = Math.round((guaranteedPlates * jainPct) / 100);
  const nonVegPlates = Math.max(0, guaranteedPlates - vegPlates - jainPlates);

  return (
    <div className="relative rounded-3xl border-2 border-gold-400/60 bg-gradient-to-br from-white via-amber-50/30 to-amber-100/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
      {/* Decorative Traditional Jaali & Diya Accents */}
      <div className="absolute top-4 right-6 flex items-center gap-2 opacity-80 pointer-events-none">
        <AnimatedFlickerDiya size="sm" />
        <span className="text-[11px] font-serif uppercase tracking-widest text-gold-800 font-semibold">
          Halwai & Banquet Algorithm
        </span>
      </div>

      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-gold-100/90 px-3.5 py-1 text-xs font-semibold text-gold-950 mb-3">
          <UtensilsCrossed className="h-3.5 w-3.5 text-gold-700" />
          <span>Automated Banquet Plate & Catering Optimizer</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-navy-950 tracking-tight">
          How ShaadiSync Calculates Exact Food Guarantees & Saves Lakhs
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          In Indian weddings, families typically book plates equal to total invitations—paying caterers for 500 guests when only 410 turn up.
          ShaadiSync pairs live RSVP confirmation status with automated buffer margins and precise dietary splits to prevent catastrophic buffet waste.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Sliders & Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6 bg-white/90 backdrop-blur-xs p-6 rounded-2xl border border-gold-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold font-serif text-navy-900 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-gold-600" />
              Adjust Celebration Parameters
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Live Recalculation</span>
          </div>

          {/* Slider 1: Total Invited */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-navy-900 mb-1.5">
              <span>Total Invited Guests (Lead & Joint Family Passes)</span>
              <span className="font-mono text-sm font-bold text-navy-950 bg-slate-100 px-2 py-0.5 rounded">
                {invitedGuests} Guests
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="1500"
              step="25"
              value={invitedGuests}
              onChange={(e) => setInvitedGuests(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gold-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>150 (Intimate)</span>
              <span>500 (Standard)</span>
              <span>1500 (Grand Royal)</span>
            </div>
          </div>

          {/* Slider 2: RSVP Rate */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-navy-900 mb-1.5">
              <span>Expected RSVP Attendance Confirmation Rate</span>
              <span className="font-mono text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {expectedAttendancePct}% ({confirmedAttendees} Confirmed)
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              step="1"
              value={expectedAttendancePct}
              onChange={(e) => setExpectedAttendancePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>60% (Out-of-town)</span>
              <span>85% (Average)</span>
              <span>100% (Full Attendance)</span>
            </div>
          </div>

          {/* Slider 3: Dynamic Safety Buffer */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-navy-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                Dynamic Halwai Safety Buffer
                <span className="text-[10px] font-normal text-slate-500">(Over Confirmed)</span>
              </span>
              <span className="font-mono text-sm font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded">
                +{bufferPct}% (+{bufferCount} buffer plates)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={bufferPct}
              onChange={(e) => setBufferPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gold-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0% (Tight)</span>
              <span>8% (Recommended Indian Standard)</span>
              <span>20% (Conservative)</span>
            </div>
          </div>

          {/* Slider 4: Per Plate Rate in INR */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-navy-900 mb-1.5">
              <span>Caterer Per-Plate Rate (INR)</span>
              <span className="font-mono text-sm font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
                ₹{plateCost.toLocaleString("en-IN")} / Plate
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="5000"
              step="50"
              value={plateCost}
              onChange={(e) => setPlateCost(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-navy-800"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹800 (Tier-2/3)</span>
              <span>₹1,850 (Metro Banquet)</span>
              <span>₹5,000 (5-Star Palace)</span>
            </div>
          </div>

          {/* Dietary Distribution Breakdown */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-navy-950 mb-2 font-serif flex items-center justify-between">
              <span>Automated Kitchen Segregation</span>
              <span className="text-[10px] text-slate-500 font-sans font-normal">Based on guest dietary preferences</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
                <div className="text-[11px] font-bold text-emerald-950">Pure Vegetarian</div>
                <div className="text-base font-extrabold text-emerald-700 font-mono">{vegPlates}</div>
                <div className="text-[10px] text-emerald-800">{pureVegPct}% of guaranteed</div>
              </div>
              <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60">
                <div className="text-[11px] font-bold text-amber-950">Strict Jain (No Root)</div>
                <div className="text-base font-extrabold text-amber-700 font-mono">{jainPlates}</div>
                <div className="text-[10px] text-amber-800">{jainPct}% segregated</div>
              </div>
              <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/60">
                <div className="text-[11px] font-bold text-rose-950">Non-Veg / Kids</div>
                <div className="text-base font-extrabold text-rose-700 font-mono">{nonVegPlates}</div>
                <div className="text-[10px] text-rose-800">{nonVegPct}% portions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Financial Comparison Card (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Calculation Output Card */}
          <div className="rounded-2xl border-2 border-gold-400 bg-navy-950 text-white p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-serif uppercase tracking-wider text-gold-300 font-semibold">
                Guaranteed Banquet Order
              </span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5">
                ShaadiSync Optimized
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-gold-300">
                {guaranteedPlates}
              </span>
              <span className="text-sm text-slate-300 font-medium">Guaranteed Plates</span>
            </div>

            <div className="text-xs text-slate-400 mt-1 font-mono">
              = {confirmedAttendees} Confirmed RSVPs + {bufferCount} Safe Buffer ({bufferPct}%)
            </div>

            <div className="mt-6 pt-5 border-t border-navy-800 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Approved Catering Bill:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {formatINR(shaadiSyncTotalCost)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-rose-300/80">
                <span>Traditional Blind Order ({invitedGuests} plates):</span>
                <span className="font-mono line-through">
                  {formatINR(traditionalTotalCost)}
                </span>
              </div>
            </div>

            {/* Rupee Savings Hero Banner */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-navy-900 border border-emerald-500/40 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                Estimated Family Savings
              </div>
              <div className="mt-1 text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
                {formatINR(rupeeSavings)}
              </div>
              <div className="text-[11px] text-emerald-200/90 mt-1">
                Zero food discarded in trash. Eliminates <strong>{wastedPlatesEliminated} unnecessary plates</strong> on this function alone!
              </div>
            </div>
          </div>

          {/* Operational Highlight Box */}
          <div className="rounded-2xl border border-gold-300 bg-white p-5 shadow-sm space-y-3">
            <h5 className="text-xs font-bold font-serif text-navy-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4 text-gold-600" />
              The ShaadiSync Catering Protocol
            </h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Explicit Organiser Sign-Off:</strong> Headcounts lock 24 hours prior to prevent caterers from padding counts.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Instant Printable Kitchen Slip:</strong> Generate PDF slips with exact Jain, Veg, Non-Veg portions for the head chef.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Milestone Advance Settlement:</strong> Deduct token payments from the final plate audit seamlessly.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

