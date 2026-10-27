"use client";

import * as React from "react";
import {
  Users,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  Filter,
  Flame,
} from "lucide-react";
import { AnimatedFlickerDiya } from "@/components/ui/shaadi-motion-graphics";

/**
 * Interactive Shaadi Crowd Flow, Arrival Heatmap & Gate Scanner Simulation
 * Allows users to simulate peak guest arrival surges (Baraat entrance, dinner rush, Muhurat time),
 * multi-scanner throughput capacity, queue wait times, and fraud/duplicate pass prevention.
 */
export function InteractiveCrowdCalculationSection() {
  const [totalExpectedGuests, setTotalExpectedGuests] = React.useState<number>(650);
  const [activeScanners, setActiveScanners] = React.useState<number>(3);
  const [arrivalWindowMinutes, setArrivalWindowMinutes] = React.useState<number>(90); // e.g. 90 min rush
  const [peakArrivalDistribution, setPeakArrivalDistribution] = React.useState<"concentrated" | "staggered">("concentrated");

  // Calculations
  // Avg scanning speed per guest with ShaadiSync QR is ~1.2 seconds (vs 15-20s paper check)
  const shaadiSyncScanSecs = 1.2;
  const paperScanSecs = 18.0;

  // Peak 30-minute burst: 60% of guests arrive during peak 30 mins in concentrated mode, or 40% in staggered
  const peakFraction = peakArrivalDistribution === "concentrated" ? 0.65 : 0.45;
  const peakGuestsIn30Min = Math.round(totalExpectedGuests * peakFraction);
  const guestsPerMinuteDuringPeak = Math.round(peakGuestsIn30Min / 30);

  // Scanner throughput
  const totalScansPerMinuteCapable = Math.round((activeScanners * 60) / shaadiSyncScanSecs);
  const paperScansPerMinuteCapable = Math.round((activeScanners * 60) / paperScanSecs);

  // Peak wait time in queue
  const isCongested = guestsPerMinuteDuringPeak > totalScansPerMinuteCapable;
  const avgWaitTimeSecondsWithShaadiSync = Math.max(
    3,
    Math.round((guestsPerMinuteDuringPeak / totalScansPerMinuteCapable) * 12)
  );
  const avgWaitTimeMinutesPaper = Math.max(
    8,
    Math.round((peakGuestsIn30Min / (paperScansPerMinuteCapable || 1)) * 0.8)
  );

  return (
    <div className="relative rounded-3xl border-2 border-gold-400/60 bg-gradient-to-br from-navy-950 via-slate-900 to-navy-950 text-white p-6 sm:p-10 shadow-2xl overflow-hidden">
      {/* Decorative Traditional Jaali & Diya Accents */}
      <div className="absolute top-4 right-6 flex items-center gap-2 opacity-80 pointer-events-none">
        <AnimatedFlickerDiya size="sm" />
        <span className="text-[11px] font-serif uppercase tracking-widest text-gold-300 font-semibold">
          High-Velocity Baraat Logistics
        </span>
      </div>

      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-950/60 px-3.5 py-1 text-xs font-semibold text-gold-300 mb-3">
          <Users className="h-3.5 w-3.5 text-gold-400" />
          <span>Real-Time Crowd Flow & Peak Gate Capacity Simulator</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-tight">
          How ShaadiSync Prevents Massive Gate Jams & Crush Hours
        </h3>
        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
          At an Indian wedding, 70% of guests don&apos;t arrive spread out over hours—they arrive in a 40-minute flood as soon as the Baraat reaches the venue gates.
          Test how multiple offline-capable QR scanner desks handle peak ingress surges with zero waiting queues.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6 bg-navy-900/80 backdrop-blur-xs p-6 rounded-2xl border border-gold-500/30 shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <h4 className="text-sm font-bold font-serif text-gold-300 flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold-400" />
              Simulate Gate Conditions
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Dynamic Ingress Metrics</span>
          </div>

          {/* Slider 1: Expected Crowd */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-200 mb-1.5">
              <span>Expected Event Attendance</span>
              <span className="font-mono text-sm font-bold text-gold-300 bg-navy-950 px-2 py-0.5 rounded border border-navy-700">
                {totalExpectedGuests} Guests
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={totalExpectedGuests}
              onChange={(e) => setTotalExpectedGuests(Number(e.target.value))}
              className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-gold-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>200 (Mehendi)</span>
              <span>650 (Grand Sangeet)</span>
              <span>2,000 (Mega Reception)</span>
            </div>
          </div>

          {/* Slider 2: Number of Active Scanner Desks */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-200 mb-1.5">
              <span>Active Smartphone Scanner Desks (Gates/Staff)</span>
              <span className="font-mono text-sm font-bold text-emerald-400 bg-navy-950 px-2 py-0.5 rounded border border-navy-700">
                {activeScanners} Scanners ({totalScansPerMinuteCapable} guests/min capacity)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={activeScanners}
              onChange={(e) => setActiveScanners(Number(e.target.value))}
              className="w-full h-2 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 Desk</span>
              <span>3 Desks (Standard)</span>
              <span>8 Desks (High Capacity)</span>
            </div>
          </div>

          {/* Arrival Pattern Toggle */}
          <div>
            <div className="text-xs font-semibold text-slate-200 mb-2">Arrival Concentration Pattern</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPeakArrivalDistribution("concentrated")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  peakArrivalDistribution === "concentrated"
                    ? "border-gold-400 bg-gold-950/40 text-gold-200"
                    : "border-navy-700 bg-navy-950/40 text-slate-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold font-serif">Baraat Surge (Concentrated)</div>
                <div className="text-[10px] mt-0.5">65% of guests arrive within 30 min of Baraat entry</div>
              </button>

              <button
                type="button"
                onClick={() => setPeakArrivalDistribution("staggered")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  peakArrivalDistribution === "staggered"
                    ? "border-gold-400 bg-gold-950/40 text-gold-200"
                    : "border-navy-700 bg-navy-950/40 text-slate-400 hover:text-white"
                }`}
              >
                <div className="text-xs font-bold font-serif">Cocktail / Open Reception</div>
                <div className="text-[10px] mt-0.5">Staggered flow across evening hours</div>
              </button>
            </div>
          </div>

          {/* Real-time Peak Ingress Telemetry */}
          <div className="pt-3 border-t border-navy-800 grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-700">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Peak Surge Rate</div>
              <div className="text-xl font-bold font-mono text-gold-300 mt-0.5">
                {guestsPerMinuteDuringPeak} <span className="text-xs font-normal">guests/min</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-700">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Scan Throughput</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {totalScansPerMinuteCapable} <span className="text-xs font-normal">scans/min</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-700">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Queue Security Status</div>
              <div className="text-sm font-bold font-mono text-emerald-300 mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Zero Bottlenecks
              </div>
            </div>
          </div>
        </div>

        {/* Right Output & Old vs New Comparison (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Ingress Velocity Card */}
          <div className="rounded-2xl border-2 border-emerald-400/60 bg-gradient-to-b from-navy-900 to-navy-950 p-6 shadow-xl relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-serif uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                <QrCode className="h-4 w-4" />
                ShaadiSync Gate Velocity
              </span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/40">
                1-Sec Check-in
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-300">
                ~{avgWaitTimeSecondsWithShaadiSync}s
              </span>
              <span className="text-sm text-slate-300">Average Guest Queue Wait</span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-navy-800">
                <span>Peak 30-Min Influx:</span>
                <span className="font-mono font-bold text-white">{peakGuestsIn30Min} guests</span>
              </div>
              <div className="flex justify-between py-1 border-b border-navy-800">
                <span>Total Verification Time:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {Math.round((peakGuestsIn30Min * shaadiSyncScanSecs) / (activeScanners * 60))} minutes
                </span>
              </div>
              <div className="flex justify-between py-1 text-rose-300">
                <span>Paper Guest-List Wait:</span>
                <span className="font-mono font-bold">{avgWaitTimeMinutesPaper} - 35 minutes of heat & chaos</span>
              </div>
            </div>

            {/* Anti-Gatecrashing Protection */}
            <div className="mt-6 rounded-xl bg-navy-950 border border-gold-500/40 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gold-300 font-serif">
                <ShieldCheck className="h-4 w-4 text-gold-400" />
                Zero Gatecrashing & Duplicate Pass Defense
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                When a pass is scanned, ShaadiSync plays an auspicious sound, reveals authorized family members count, and locks the token instantly across all gates with cryptographic verification.
              </p>
            </div>
          </div>

          {/* Operational Advantages */}
          <div className="rounded-2xl border border-navy-800 bg-navy-900/60 p-5 space-y-2.5 text-xs text-slate-300">
            <div className="font-bold font-serif text-white uppercase tracking-wider text-[11px]">
              Why On-Ground Wedding Planners Rely On ShaadiSync
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
              <span><strong>Runs Offline:</strong> Weak 4G/WiFi in remote palace basements? Scanners cache passes offline and sync automatically upon reconnection.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
              <span><strong>VIP Dignitary Chime:</strong> Chachas, Dadas, and celebrity guests trigger special VIP alerts for instant garland welcomes.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

