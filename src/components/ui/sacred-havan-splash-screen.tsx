"use client";

import * as React from "react";

/**
 * Traditional Indian Vedic Havan Kund with sacred flaming agni,
 * surrounded by 7 auspicious circumambulating Phera chakras.
 * Plays on initial landing page load and dissolves seamlessly into the royal hero.
 */
export function SacredHavanPherasSplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = React.useState<"active" | "fading" | "hidden">("active");
  const [currentPhera, setCurrentPhera] = React.useState(1);

  React.useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setPhase("hidden");
      onComplete?.();
      return;
    }

    // Advance 7 Phera vows illusion
    const interval = setInterval(() => {
      setCurrentPhera((prev) => (prev < 7 ? prev + 1 : 7));
    }, 380);

    // Fade out after 2.8s
    const timer = setTimeout(() => {
      setPhase("fading");
      setTimeout(() => {
        setPhase("hidden");
        onComplete?.();
      }, 700);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (phase === "hidden") return null;

  const pheraNames = [
    "1st Phera: Nourishment & Prosperity (प्रथमे उपक्रम)",
    "2nd Phera: Strength & Protection (द्वितीये बलम्)",
    "3rd Phera: Spiritual Wealth (तृतीये सम्पदम्)",
    "4th Phera: Joy & Respect (चतुर्थे सुखम्)",
    "5th Phera: Family & Lineage (पञ्चमे सन्तानम्)",
    "6th Phera: Harmony & Long Life (षष्ठे ऋतुभ्यः)",
    "7th Phera: Eternal Companionship (सप्तमे सखित्वम्)",
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial from-[#1e070e] via-[#0f172a] to-[#080c16] text-white transition-opacity duration-700 select-none ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Sacred Jaali Aura */}
      <div className="absolute inset-0 bg-jali-pattern opacity-15 pointer-events-none" />

      {/* Skipping Button */}
      <button
        onClick={() => {
          setPhase("fading");
          setTimeout(() => {
            setPhase("hidden");
            onComplete?.();
          }, 300);
        }}
        className="absolute top-6 right-6 text-xs font-serif text-gold-300 hover:text-white border border-gold-400/30 px-3 py-1 rounded-full bg-navy-950/60 backdrop-blur-xs transition-all z-50"
      >
        Skip Ceremony →
      </button>

      <div className="relative flex items-center justify-center">
        {/* ============================================================== */}
        {/* 1. OUTER ROTATING CHAKRA: 7 SACRED PHERA ORBITAL TRAILS         */}
        {/* ============================================================== */}
        <div className="absolute w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] rounded-full border border-gold-500/30 border-dashed animate-spin-extremely-slow" />

        {/* 2. FAST PHERA VORTEX (CHAKRA REVOLVING AROUND HAVAN KUND) */}
        <svg
          viewBox="0 0 400 400"
          className="w-80 h-80 sm:w-[420px] sm:h-[420px] animate-spin-reverse-slow absolute pointer-events-none"
        >
          {/* Circular Orbit Path */}
          <circle cx="200" cy="200" r="150" stroke="url(#pheraGoldGrad)" strokeWidth="2" strokeDasharray="8 6" fill="none" opacity="0.6" />
          <circle cx="200" cy="200" r="170" stroke="url(#pheraGoldGrad)" strokeWidth="1" strokeDasharray="3 9" fill="none" opacity="0.4" />

          {/* 7 Auspicious Phera Lotus Nodes Around the Fire */}
          {[...Array(7)].map((_, i) => {
            const angle = (i * 360) / 7;
            const isCompleted = i + 1 <= currentPhera;
            return (
              <g key={i} transform={`rotate(${angle} 200 200)`}>
                {/* Connector line towards center */}
                <line x1="200" y1="50" x2="200" y2="70" stroke="#C6A15B" strokeWidth="1" opacity="0.5" />
                {/* Node Jewel */}
                <circle
                  cx="200"
                  cy="50"
                  r={isCompleted ? "9" : "6"}
                  fill={isCompleted ? "#F59E0B" : "#8B1E3F"}
                  stroke="#FDE047"
                  strokeWidth="2"
                  className={isCompleted ? "filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]" : ""}
                />
                <text
                  x="200"
                  y="54"
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="bold"
                  fill="#172B4D"
                  className="font-serif select-none"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}

          <defs>
            <linearGradient id="pheraGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C6A15B" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#8B1E3F" />
            </linearGradient>
          </defs>
        </svg>

        {/* ============================================================== */}
        {/* 3. TRADITIONAL COPPER HAVAN KUND WITH BURNING SACRED AGNI      */}
        {/* ============================================================== */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Radiant Agni Heat Glow */}
          <div className="absolute -top-14 w-36 h-36 rounded-full bg-radial from-amber-400/50 via-rose-600/30 to-transparent blur-xl animate-pulse" />

          {/* Dynamic Layered Flame SVGs */}
          <div className="relative -mb-4 z-20">
            <svg viewBox="0 0 100 120" className="w-24 h-28 sm:w-28 sm:h-32 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
              {/* Outer Saffron/Crimson Flame */}
              <path
                d="M50 5 C65 30 85 55 75 85 C65 110 35 110 25 85 C15 55 35 30 50 5 Z"
                fill="url(#outerAgni)"
                className="animate-flame-flicker origin-bottom"
              />
              {/* Mid Golden Agni */}
              <path
                d="M50 25 C60 45 72 65 65 90 C58 105 42 105 35 90 C28 65 40 45 50 25 Z"
                fill="url(#midAgni)"
                className="animate-pulse origin-bottom"
              />
              {/* Inner White-Hot Flame Core */}
              <ellipse cx="50" cy="85" rx="10" ry="18" fill="#FFFBEB" className="animate-ping opacity-60" />
              <ellipse cx="50" cy="88" rx="8" ry="14" fill="#FEF08A" />

              <defs>
                <linearGradient id="outerAgni" x1="50" y1="5" x2="50" y2="110" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FDE047" />
                  <stop offset="0.3" stopColor="#F59E0B" />
                  <stop offset="0.7" stopColor="#DC2626" />
                  <stop offset="1" stopColor="#7F1D1D" />
                </linearGradient>
                <linearGradient id="midAgni" x1="50" y1="25" x2="50" y2="105" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FEF08A" />
                  <stop offset="0.5" stopColor="#F59E0B" />
                  <stop offset="1" stopColor="#EA580C" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Stepped Copper Havan Kund Geometry */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Kund Top Lip (Wide Tier) */}
            <div className="w-36 sm:w-44 h-4 rounded-xs bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 border-t border-amber-300 shadow-md flex items-center justify-center">
              <div className="w-28 sm:w-36 h-2 bg-gradient-to-r from-red-950 via-amber-950 to-red-950 rounded-xs" />
            </div>
            {/* Kund Mid Tier */}
            <div className="w-28 sm:w-36 h-5 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-900 border-x-2 border-b-2 border-amber-900/60 shadow-inner flex items-center justify-center">
              <span className="text-[10px] text-amber-200/80 font-serif tracking-widest">卐  ॐ  卐</span>
            </div>
            {/* Kund Bottom Tier (Narrower Base) */}
            <div className="w-20 sm:w-28 h-4 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-950 rounded-b-sm border-t border-amber-900 shadow-lg" />
            {/* Havan Platform Stand */}
            <div className="w-40 sm:w-52 h-2.5 bg-gradient-to-r from-amber-950 via-gold-700 to-amber-950 rounded-full mt-0.5 border border-gold-500/50 shadow-royal" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SACRED CHANT & PHERA PROGRESSION ANNOUNCEMENT               */}
      {/* ============================================================== */}
      <div className="mt-10 text-center z-20 space-y-2 max-w-md px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/40 bg-gold-950/40 text-gold-300 text-xs font-serif tracking-widest uppercase">
          <span className="animate-spin text-sm">🏵️</span>
          <span>Pavithra Pheras • Saat Vachan</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-amber-200 to-gold-400 tracking-wide">
          {pheraNames[currentPhera - 1]}
        </h3>

        <p className="text-xs text-slate-300 font-sans italic tracking-wide">
          &ldquo;मङ्गलम् भगवान् विष्णुः, मङ्गलम् गरुडध्वजः। मङ्गलम् पुण्डरीकाक्षः, मङ्गलाय तनो हरिः॥&rdquo;
        </p>

        {/* 7 Dots Indicator */}
        <div className="flex justify-center items-center gap-2 pt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div
              key={num}
              className={`h-2 rounded-full transition-all duration-300 ${
                num <= currentPhera ? "w-6 bg-gold-400 shadow-goldGlow" : "w-2 bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
