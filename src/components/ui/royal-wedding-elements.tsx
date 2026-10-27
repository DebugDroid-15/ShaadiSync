"use client";

import * as React from "react";
import Image from "next/image";

/**
 * Royal Rajasthani Palace Jharokha Arch SVG Frame
 * Intricately carved Indian cusped arch with floral finial and kalash peak.
 */
export function RoyalPalaceArchFrame({
  children,
  className = "",
  glow = true,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Decorative Golden Arch Peak Top */}
      <div className="flex justify-center -mb-2 relative z-10">
        <svg
          viewBox="0 0 240 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 sm:w-64 h-10 text-gold-500 drop-shadow-sm"
        >
          {/* Kalash finial center */}
          <path
            d="M120 4 C117 12 112 16 112 22 C112 28 116 32 120 34 C124 32 128 28 128 22 C128 16 123 12 120 4 Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
          <circle cx="120" cy="4" r="2.5" fill="#8B1E3F" />
          {/* Symmetrical cusped arches extending outward */}
          <path
            d="M112 24 C90 14 60 28 30 32 L2 36"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M128 24 C150 14 180 28 210 32 L238 36"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="70" cy="22" r="3" fill="currentColor" fillOpacity="0.6" />
          <circle cx="170" cy="22" r="3" fill="currentColor" fillOpacity="0.6" />
        </svg>
      </div>

      {/* Main Container with royal gold double border & optional warm glow */}
      <div
        className={`rounded-2xl border-2 border-gold-400/80 bg-white/95 backdrop-blur-md shadow-card transition-all duration-300 relative overflow-hidden ${
          glow ? "hover:border-gold-500 hover:shadow-royal" : ""
        }`}
      >
        {/* Inner thin ceremonial hairline border */}
        <div className="absolute inset-1.5 rounded-xl border border-gold-200/60 pointer-events-none z-10" />

        {/* Subtle background Jaali watermark */}
        <div className="absolute inset-0 bg-jali-pattern opacity-10 pointer-events-none" />

        <div className="relative z-20">{children}</div>
      </div>
    </div>
  );
}

/**
 * Royal Indian Wedding Section Divider with floral medallion & kalash finial
 */
export function RoyalSectionDivider({
  title,
  subtitle,
  variant = "light",
}: {
  title?: string;
  subtitle?: string;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";

  return (
    <div className="w-full text-center py-8 relative select-none">
      <div className="flex items-center justify-center gap-3 sm:gap-6 max-w-2xl mx-auto px-4">
        {/* Left flourish line */}
        <div className="flex-1 flex items-center">
          <div className={`h-px w-full ${isDark ? "bg-gradient-to-r from-transparent via-gold-500 to-gold-400" : "bg-gradient-to-r from-transparent via-gold-400 to-gold-600"}`} />
          <div className="h-1.5 w-1.5 rounded-full bg-gold-500 shrink-0" />
        </div>

        {/* Center Ceremonial Medallion */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-gold-300/60 bg-gold-50/50 backdrop-blur-xs">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gold-600">
            <path
              d="M12 2L14.4 8.6L21.5 9.2L16.1 14L17.8 21L12 17.3L6.2 21L7.9 14L2.5 9.2L9.6 8.6L12 2Z"
              fill="currentColor"
              fillOpacity="0.4"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {title && (
            <span className={`text-xs uppercase tracking-widest font-serif font-bold ${isDark ? "text-gold-300" : "text-burgundy-800"}`}>
              {title}
            </span>
          )}
        </div>

        {/* Right flourish line */}
        <div className="flex-1 flex items-center">
          <div className="h-1.5 w-1.5 rounded-full bg-gold-500 shrink-0" />
          <div className={`h-px w-full ${isDark ? "bg-gradient-to-l from-transparent via-gold-500 to-gold-400" : "bg-gradient-to-l from-transparent via-gold-400 to-gold-600"}`} />
        </div>
      </div>

      {subtitle && (
        <p className={`mt-2 text-xs font-serif italic ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Traditional Indian Shubh Vivah Kalash & Diya Motifs
 */
export function SacredWeddingKalash({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} text-gold-500`}>
      {/* Coconut on top */}
      <path d="M50 8 C40 22 40 32 50 42 C60 32 60 22 50 8 Z" fill="#8B1E3F" stroke="#C6A15B" strokeWidth="2" />
      {/* Mango leaves (Aam ke patte) */}
      <path d="M50 36 C35 30 25 36 20 44 C32 46 44 42 50 36 Z" fill="#15803D" stroke="#C6A15B" strokeWidth="1.5" />
      <path d="M50 36 C65 30 75 36 80 44 C68 46 56 42 50 36 Z" fill="#15803D" stroke="#C6A15B" strokeWidth="1.5" />
      {/* Brass Kalash Body */}
      <path d="M34 44 C26 56 24 74 36 86 C44 92 56 92 64 86 C76 74 74 56 66 44 Z" fill="#C6A15B" stroke="#9A7736" strokeWidth="2" />
      {/* Swastik / Auspicious red dot center */}
      <circle cx="50" cy="65" r="4" fill="#8B1E3F" />
      <path d="M46 65H54M50 61V69" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      {/* Base */}
      <ellipse cx="50" cy="88" rx="14" ry="4" fill="#9A7736" />
    </svg>
  );
}

/**
 * Regal Rajasthani Palace Corner Flourish (Gold + Burgundy Linework)
 */
export function PalaceCornerJali({
  position = "top-left",
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
}) {
  const getRotation = () => {
    switch (position) {
      case "top-left":
        return "top-0 left-0";
      case "top-right":
        return "top-0 right-0 -scale-x-100";
      case "bottom-left":
        return "bottom-0 left-0 -scale-y-100";
      case "bottom-right":
        return "bottom-0 right-0 -scale-x-100 -scale-y-100";
    }
  };

  return (
    <div className={`absolute ${getRotation()} w-28 h-28 sm:w-40 sm:h-40 pointer-events-none z-10 opacity-70 ${className}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gold-500">
        <path d="M4 4H44C44 26 26 44 4 44V4Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
        <path d="M4 4H76C76 43 43 76 4 76V4Z" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="20" cy="20" r="5" fill="#8B1E3F" fillOpacity="0.6" stroke="currentColor" strokeWidth="1" />
        <circle cx="4" cy="4" r="2.5" fill="currentColor" />
        <path d="M4 14C10 14 14 10 14 4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/**
 * Scroll Progress Festive Marigold Indicator (Gentle celebratory indicator)
 */
export function ScrollFestiveIndicator() {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-50 pointer-events-none bg-slate-200/20">
      <div
        className="h-full bg-gradient-to-r from-gold-400 via-burgundy-600 to-gold-400 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

