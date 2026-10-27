"use client";

import * as React from "react";
import confetti from "canvas-confetti";

/**
 * Royal Aerial Drone / Helicopter Genda Phool Petal Shower Launcher
 *
 * When clicked:
 * 1. An auspicious Royal Drone / Helicopter swoops across the sky (top of viewport).
 * 2. Rotating helicopter rotor blades & drone quad-rotors with prop-wash wind effects.
 * 3. Overhead continuous flower shower drops directly from the moving aerial craft,
 *    raining thousands of fresh marigold (genda phool) petals, red rose petals,
 *    and jasmine mogra florets across the screen.
 * 4. Strictly triggers ONLY when the user clicks the button.
 */
export function AerialDronePetalShowerLauncher() {
  const [isFlying, setIsFlying] = React.useState(false);
  const [craftX, setCraftX] = React.useState(-20); // starts offscreen left (-20%)
  const [craftY, setCraftY] = React.useState(60); // vertical flight level (px from top)

  const launchAerialShower = () => {
    if (isFlying) return;
    setIsFlying(true);
    setCraftX(-15);

    const startTime = Date.now();
    const flightDuration = 7000; // 7 seconds grand aerial sweep across screen

    // Authentic Indian Wedding Palette for Genda Phool & Rose Petals
    const colors = [
      "#FFB703", // Radiant Marigold Yellow
      "#FB8500", // Deep Saffron Orange
      "#EA580C", // Kesari Amber
      "#E11D48", // Fresh Red Rose Petal
      "#9F1239", // Royal Crimson
      "#FFFFFF", // Mogra Jasmine White
      "#D4AF37", // Imperial Gold
    ];

    // Helicopter / Drone Flight Path & Continuous Drop Animation Frame
    const runFlightLoop = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = elapsed / flightDuration;

      if (progress < 1) {
        // Move craft smoothly from -10% to 110% of window width
        const currentPercent = -10 + progress * 120;
        setCraftX(currentPercent);

        // Gentle sinusoidal altitude drift (altitude bobbing like a real drone/chopper)
        const currentAltitude = 50 + Math.sin(progress * Math.PI * 4) * 16;
        setCraftY(currentAltitude);

        // Convert percentage to fraction (0.0 to 1.0) for canvas-confetti origin
        const normalizedX = Math.max(0, Math.min(1, currentPercent / 100));

        // Drop marigold petals directly under the aircraft belly
        if (progress > 0.05 && progress < 0.95) {
          confetti({
            particleCount: 7,
            angle: 90, // Straight down from craft belly
            spread: 55, // Propeller downdraft spray
            origin: { x: normalizedX, y: currentAltitude / window.innerHeight },
            colors,
            ticks: 350,
            gravity: 0.8,
            scalar: 1.4,
            drift: (Math.random() - 0.5) * 1.8, // wind turbulence
            zIndex: 99999,
          });

          // Occasional side puff from rotor wash
          if (Math.random() > 0.6) {
            confetti({
              particleCount: 4,
              angle: Math.random() > 0.5 ? 65 : 115,
              spread: 60,
              origin: { x: normalizedX, y: (currentAltitude + 10) / window.innerHeight },
              colors,
              ticks: 280,
              gravity: 0.7,
              scalar: 1.2,
              zIndex: 99999,
            });
          }
        }

        requestAnimationFrame(runFlightLoop);
      } else {
        setIsFlying(false);
        setCraftX(-20);
      }
    };

    requestAnimationFrame(runFlightLoop);
  };

  return (
    <>
      {/* =========================================================================
          THE TRIGGER BUTTON
          ========================================================================= */}
      <button
        onClick={launchAerialShower}
        type="button"
        disabled={isFlying}
        className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-burgundy-600 to-amber-600 text-white font-serif font-bold text-sm shadow-royal hover:shadow-goldGlow hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-gold-300 ring-2 ring-gold-400/30 cursor-pointer disabled:opacity-80"
        title="Launch aerial drone & helicopter flower shower!"
      >
        <span
          className={`text-2xl transition-transform duration-300 ${
            isFlying ? "animate-spin" : "group-hover:rotate-12"
          }`}
        >
          🚁
        </span>
        <span className="tracking-wide text-sm sm:text-base">
          {isFlying
            ? "Royal Drone Showering Genda Phool! 🌸✨"
            : "Shower Wedding Blessings (Genda Phool)"}
        </span>
        <span className="text-xl animate-bounce">🏵️</span>
      </button>

      {/* =========================================================================
          ANIMATED AERIAL HELICOPTER / DRONE FLYING CRAFT (Fixed High Z-Index)
          ========================================================================= */}
      {isFlying && (
        <div
          className="fixed pointer-events-none z-[99998] transition-none select-none"
          style={{
            left: `${craftX}%`,
            top: `${craftY}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Drone / Helicopter Composite SVG */}
          <div className="relative w-44 h-24 sm:w-52 sm:h-28">
            {/* Rotor Propwash Wind Glint Waves */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-gold-300/40 to-transparent blur-xs animate-pulse" />

            <svg
              viewBox="0 0 220 120"
              className="w-full h-full drop-shadow-2xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="chopperGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>
                <linearGradient id="chopperBurgundy" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9F1239" />
                  <stop offset="50%" stopColor="#BE123C" />
                  <stop offset="100%" stopColor="#881337" />
                </linearGradient>
                <linearGradient id="glassCockpit" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* TOP ROTOR MAST & SPINNING HIGH-SPEED MAIN BLADES */}
              <rect x="98" y="14" width="6" height="12" fill="#475569" rx="1" />
              <ellipse cx="101" cy="14" rx="8" ry="3" fill="#D97706" />
              {/* Spinning Main Rotor Blades (Blurred Motion Illusion) */}
              <ellipse
                cx="101"
                cy="12"
                rx="85"
                ry="3.5"
                fill="#FEF08A"
                opacity="0.75"
                className="animate-spin"
                style={{ transformOrigin: "101px 12px", animationDuration: "0.08s" }}
              />
              <line x1="16" y1="12" x2="186" y2="12" stroke="#F59E0B" strokeWidth="2.5" opacity="0.6" />

              {/* HELICOPTER FUSELAGE / CABIN */}
              {/* Main Royal Body */}
              <path
                d="M48 50 C48 32, 85 24, 135 24 C165 24, 180 38, 175 56 C170 70, 150 78, 120 78 C70 78, 48 68, 48 50 Z"
                fill="url(#chopperGold)"
                stroke="#D97706"
                strokeWidth="1.5"
              />
              {/* Royal Crimson Ceremonial Side Stripe */}
              <path
                d="M52 50 C75 42, 135 42, 168 52 L164 60 C135 52, 75 52, 54 58 Z"
                fill="url(#chopperBurgundy)"
              />
              {/* Auspicious Wedding Crest (Om/Swastik/Floral Kalash Medallion) */}
              <circle cx="110" cy="55" r="7" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />
              <text x="110" y="58" textAnchor="middle" fontSize="7" fill="#991B1B" fontWeight="bold">
                卐
              </text>

              {/* GLASS COCKPIT WINDSHIELD */}
              <path
                d="M135 28 C158 28, 172 38, 168 50 L140 50 C132 40, 132 32, 135 28 Z"
                fill="url(#glassCockpit)"
                stroke="#BAE6FD"
                strokeWidth="1"
              />
              {/* Cockpit shine highlight */}
              <path d="M142 32 L158 32" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

              {/* TAIL BOOM & TAIL ROTOR */}
              <path d="M52 45 L10 38 L8 44 L48 56 Z" fill="#92400E" stroke="#78350F" strokeWidth="1" />
              {/* Tail Fin */}
              <path d="M10 38 L4 18 L16 37 Z" fill="url(#chopperGold)" />
              {/* Spinning Tail Rotor */}
              <circle
                cx="8"
                cy="26"
                r="10"
                stroke="#FDE047"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="animate-spin"
                style={{ transformOrigin: "8px 26px", animationDuration: "0.12s" }}
              />

              {/* LANDING SKIDS */}
              {/* Skid struts */}
              <line x1="72" y1="78" x2="65" y2="92" stroke="#64748B" strokeWidth="2.5" />
              <line x1="135" y1="78" x2="128" y2="92" stroke="#64748B" strokeWidth="2.5" />
              {/* Skid bar with curled front tip */}
              <path
                d="M45 92 L155 92 Q164 92 168 86"
                stroke="#94A3B8"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* WEDDING FLOWER BASKET DISPENSER UNDER THE BELLY */}
              <path
                d="M85 78 L125 78 L120 96 L90 96 Z"
                fill="#B45309"
                stroke="#78350F"
                strokeWidth="1.5"
              />
              {/* Genda Phool Garlands hanging from basket */}
              <path
                d="M86 85 Q105 92 124 85"
                stroke="#F59E0B"
                strokeWidth="3"
                fill="none"
                strokeDasharray="3 3"
              />
              <circle cx="92" cy="98" r="4.5" fill="#F97316" className="animate-bounce" />
              <circle cx="104" cy="100" r="4.5" fill="#FDE047" className="animate-bounce" style={{ animationDelay: "0.1s" }} />
              <circle cx="116" cy="98" r="4.5" fill="#E11D48" className="animate-bounce" style={{ animationDelay: "0.2s" }} />
            </svg>

            {/* Flying Banner Tag trailed behind helicopter */}
            <div className="absolute top-10 -left-36 bg-gradient-to-r from-amber-500 via-red-600 to-amber-500 text-white font-serif font-bold text-[10px] px-2.5 py-0.5 rounded shadow-md border border-gold-300 flex items-center gap-1">
              <span>🌸</span>
              <span>Shubh Vivah Blessings</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

