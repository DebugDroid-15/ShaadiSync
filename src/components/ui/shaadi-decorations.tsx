import * as React from "react";

/**
 * Traditional Indian wedding decorative toran / garland border with marigold florals,
 * kalash motifs, and auspicious golden bells.
 */
export function WeddingToranHeader() {
  return (
    <div className="w-full overflow-hidden pointer-events-none select-none relative -mt-1 -mb-2">
      <div className="flex justify-between items-center w-full px-2 sm:px-8">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            {/* Scalloped Arch & Flower */}
            <div className="h-4 w-12 sm:w-20 border-b-2 border-gold-400/80 rounded-b-full flex justify-center items-end pb-0.5">
              <span className="text-[10px] sm:text-xs">🌸</span>
            </div>
            {/* Hanging golden bell / marigold bud */}
            <div className="w-0.5 h-3 sm:h-5 bg-gold-400/70" />
            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-linear-to-b from-amber-400 to-gold-600 shadow-xs" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Regal Indian Wedding corner ornamental mandala flourish
 */
export function IndianOrnamentalCorner({ position = "top-left" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-0 left-0";
      case "top-right":
        return "top-0 right-0 rotate-90";
      case "bottom-right":
        return "bottom-0 right-0 rotate-180";
      case "bottom-left":
        return "bottom-0 left-0 -rotate-90";
    }
  };

  return (
    <div className={`absolute ${getPositionClasses()} w-24 h-24 sm:w-36 sm:h-36 pointer-events-none opacity-25 z-0`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gold-600">
        <path d="M0 0C50 0 100 50 100 100C100 50 50 0 0 0Z" fill="currentColor" fillOpacity="0.3"/>
        <path d="M0 0C30 0 60 30 60 60C60 30 30 0 0 0Z" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="4" fill="currentColor"/>
        <circle cx="45" cy="45" r="3" fill="currentColor"/>
        <path d="M0 0L35 35" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>
    </div>
  );
}

/**
 * Animated floating wedding elements across page scroll (marigolds, shehnai notes, kalash, diya sparks)
 */
export function FloatingShaadiMotifs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
      {/* Floating Diya Flame Spark */}
      <div className="absolute top-[8%] left-[6%] animate-float-slow text-2xl sm:text-3xl opacity-60">
        🪔
      </div>

      {/* Floating Marigold Flower 1 */}
      <div className="absolute top-[14%] right-[8%] animate-float-reverse text-2xl sm:text-4xl opacity-75">
        🏵️
      </div>

      {/* Golden Kalash Motif */}
      <div className="absolute top-[32%] left-[4%] animate-float-reverse text-2xl sm:text-3xl opacity-65">
        ✨
      </div>

      {/* Auspicious Lotus / Floral */}
      <div className="absolute top-[38%] right-[5%] animate-float-slow text-2xl sm:text-4xl opacity-70">
        🪷
      </div>

      {/* Shehnai / Music Note Motif */}
      <div className="absolute top-[55%] left-[5%] animate-float-slow text-2xl sm:text-3xl opacity-70">
        🎺
      </div>

      {/* Auspicious Swastik / Dhol Spark */}
      <div className="absolute top-[62%] right-[6%] animate-float-reverse text-2xl sm:text-3xl opacity-75">
        🥁
      </div>

      {/* Traditional Pheras Sacred Fire / Sparkle */}
      <div className="absolute top-[78%] left-[6%] animate-float-reverse text-2xl sm:text-3xl opacity-65">
        🔥
      </div>

      {/* Regal Paisley Shimmer */}
      <div className="absolute top-[85%] right-[7%] animate-float-slow text-2xl sm:text-4xl opacity-75">
        🌸
      </div>
    </div>
  );
}
