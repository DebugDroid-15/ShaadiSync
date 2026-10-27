"use client";

import * as React from "react";
import { UtensilsCrossed, Users, Sparkles, ChefHat } from "lucide-react";

/**
 * Animated Banquet Kitchen Visual
 * Displays a steaming copper Degchi/Handi with aromatic saffron swirls,
 * traditional royal Ladle, and decorative spices.
 */
export function AnimatedBanquetDegchi() {
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center select-none">
      {/* Golden Aura Glow */}
      <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-xl animate-pulse" />

      {/* SVG Royal Copper Handi / Degchi */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Steam Waves */}
        <g className="animate-pulse opacity-75">
          <path
            d="M85 50 C80 35, 95 25, 90 10"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 6"
          />
          <path
            d="M105 45 C100 30, 115 20, 110 5"
            stroke="#D97706"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="5 7"
          />
          <path
            d="M125 50 C120 35, 135 25, 130 10"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="3 5"
          />
        </g>

        {/* Handi Neck & Rim (Royal Brass & Copper gradient) */}
        <defs>
          <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="50%" stopColor="#C2410C" />
            <stop offset="100%" stopColor="#7C2D12" />
          </linearGradient>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Degchi Lid Handle */}
        <ellipse cx="100" cy="55" rx="14" ry="7" fill="url(#brassGrad)" stroke="#B45309" strokeWidth="1.5" />
        <path d="M100 48 L100 42" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />

        {/* Handi Rim */}
        <ellipse cx="100" cy="70" rx="60" ry="14" fill="url(#brassGrad)" stroke="#78350F" strokeWidth="2" />
        <ellipse cx="100" cy="68" rx="54" ry="10" fill="#9A3412" />

        {/* Handi Belly (Round Bottom Pot) */}
        <path
          d="M44 74 C35 110, 48 165, 100 165 C152 165, 165 110, 156 74 Z"
          fill="url(#copperGrad)"
          stroke="#7C2D12"
          strokeWidth="2"
        />

        {/* Royal Decorative Brass Engravings on Handi */}
        <path
          d="M58 100 C75 112, 125 112, 142 100"
          stroke="#FCD34D"
          strokeWidth="2"
          fill="none"
          strokeDasharray="3 4"
        />
        <circle cx="100" cy="120" r="5" fill="#FDE68A" stroke="#B45309" />
        <circle cx="80" cy="116" r="3.5" fill="#FDE68A" />
        <circle cx="120" cy="116" r="3.5" fill="#FDE68A" />

        {/* Handi Pedestal Ring */}
        <ellipse cx="100" cy="165" rx="35" ry="6" fill="url(#brassGrad)" stroke="#78350F" strokeWidth="1.5" />

        {/* Stirring Ladle / Karchi with Marigold Petal */}
        <path
          d="M135 60 L168 22"
          stroke="#F59E0B"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="170" cy="20" r="7" fill="#F59E0B" />
        {/* Floating Marigold Petal */}
        <ellipse cx="145" cy="45" rx="4" ry="6" fill="#F97316" transform="rotate(30 145 45)" />
      </svg>
    </div>
  );
}

/**
 * Animated High-Speed QR Scanner Gate Graphic
 * Shows a glowing holographic royal pass being authenticated with radar waves.
 */
export function AnimatedGateScannerGraphic() {
  return (
    <div className="relative w-52 h-52 mx-auto flex items-center justify-center select-none">
      {/* Radar scanning circle pulse */}
      <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping opacity-30" />
      <div className="absolute inset-4 rounded-full border border-gold-400/40 animate-pulse" />

      {/* Futuristic Royal Scanner Frame */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="scannerPhoneGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="laserBeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#34D399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Scanner Device / Phone Frame */}
        <rect
          x="55"
          y="20"
          width="90"
          height="160"
          rx="16"
          fill="url(#scannerPhoneGrad)"
          stroke="#F59E0B"
          strokeWidth="2.5"
        />

        {/* Screen Bezel */}
        <rect x="62" y="32" width="76" height="136" rx="8" fill="#030712" />

        {/* Decorative Indian Arch Header inside Screen */}
        <path
          d="M66 45 C75 38, 125 38, 134 45"
          stroke="#D4AF37"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Center QR Target Reticle */}
        <rect
          x="75"
          y="58"
          width="50"
          height="50"
          rx="4"
          fill="#0F172A"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* QR Code Matrix Elements */}
        <rect x="80" y="63" width="12" height="12" fill="#34D399" rx="1" />
        <rect x="108" y="63" width="12" height="12" fill="#34D399" rx="1" />
        <rect x="80" y="91" width="12" height="12" fill="#34D399" rx="1" />
        <rect x="96" y="75" width="8" height="8" fill="#F59E0B" rx="1" />
        <rect x="108" y="91" width="8" height="8" fill="#FCD34D" rx="1" />

        {/* Dynamic Scanning Laser Bar (animated via CSS in inline styles) */}
        <rect
          x="72"
          y="78"
          width="56"
          height="4"
          fill="url(#laserBeam)"
          className="animate-pulse"
        />

        {/* Status Verification Badge */}
        <rect x="70" y="120" width="60" height="18" rx="9" fill="#065F46" stroke="#34D399" strokeWidth="1" />
        <text
          x="100"
          y="132"
          textAnchor="middle"
          fill="#A7F3D0"
          fontSize="8"
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          ✓ VERIFIED (4)
        </text>

        {/* Pass ID in micro font */}
        <text
          x="100"
          y="152"
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="7"
          fontFamily="monospace"
        >
          PASS: SS-VIP-88
        </text>
      </svg>
    </div>
  );
}

