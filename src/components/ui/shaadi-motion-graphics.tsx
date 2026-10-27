"use client";

import * as React from "react";

/**
 * High-performance Canvas Petal & Sparkle Shower
 * Renders fluttering marigold (genda phool) petals, rose petals, and golden starlight particles
 * with organic sinusoidal sway, 3D rotation, and responsive density.
 */
export function RoyalCanvasPetalShower() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle types:
    // 1: Marigold petal (deep amber gold)
    // 2: Rose petal (royal crimson / burgundy)
    // 3: Golden glint / starlight spark (gold / white)
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      angularSpeed: number;
      type: "marigold" | "rose" | "goldGlint";
      opacity: number;
      wobble: number;
      wobbleSpeed: number;
    }

    const particleCount = window.innerWidth < 768 ? 28 : 55;
    const particles: Particle[] = [];

    const createParticle = (initialY?: number): Particle => {
      const types: ("marigold" | "rose" | "goldGlint")[] = ["marigold", "marigold", "rose", "goldGlint"];
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        size: type === "goldGlint" ? Math.random() * 2.5 + 1.5 : Math.random() * 8 + 6,
        speedY: type === "goldGlint" ? Math.random() * 0.4 + 0.2 : Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 0.6 - 0.3,
        angle: Math.random() * 360,
        angularSpeed: (Math.random() - 0.5) * 2,
        type,
        opacity: Math.random() * 0.5 + 0.35,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 1.2 + p.speedX;
        p.y += p.speedY;
        p.angle += p.angularSpeed;

        if (p.y > height + 20) {
          particles[i] = createParticle(-15);
          continue;
        }
        if (p.x > width + 20) p.x = -10;
        if (p.x < -20) p.x = width + 10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.type === "marigold") {
          // Curving Marigold Petal
          const grad = ctx.createLinearGradient(-p.size / 2, -p.size, p.size / 2, p.size);
          grad.addColorStop(0, "#F59E0B"); // Bright amber
          grad.addColorStop(0.5, "#D97706"); // Rich marigold
          grad.addColorStop(1, "#B45309"); // Deep saffron edge
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size, -p.size * 0.2, p.size * 0.4, p.size);
          ctx.quadraticCurveTo(0, p.size * 0.6, -p.size * 0.4, p.size);
          ctx.quadraticCurveTo(-p.size, -p.size * 0.2, 0, -p.size);
          ctx.fill();
        } else if (p.type === "rose") {
          // Romantic Crimson Rose Petal
          const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
          grad.addColorStop(0, "#E11D48"); // Rose crimson
          grad.addColorStop(0.6, "#9F1239"); // Deep burgundy
          grad.addColorStop(1, "#4C0519"); // Royal dark velvet
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.6, p.size, Math.PI / 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 4-Point Golden Starlight Sparkle
          ctx.fillStyle = "#FDE047";
          ctx.shadowColor = "#F59E0B";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          for (let s = 0; s < 4; s++) {
            ctx.rotate(Math.PI / 2);
            ctx.lineTo(p.size * 2, 0);
            ctx.lineTo(p.size * 0.5, p.size * 0.5);
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20 w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
}

/**
 * Animated Pulsing Royal Mandala with slow continuous rotation and glowing concentric rings
 */
export function AnimatedMandalaHero({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* Outer Radiating Aura */}
      <div className="absolute w-[380px] h-[380px] sm:w-[540px] sm:h-[540px] rounded-full bg-radial from-amber-400/20 via-rose-500/10 to-transparent animate-pulse-glow" />

      {/* Rotating Clockwise Outer Sacred Ring */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-72 h-72 sm:w-[440px] sm:h-[440px] text-gold-500/40 animate-spin-extremely-slow absolute"
      >
        <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="100" cy="100" r="86" stroke="currentColor" strokeWidth="1.5" />
        {/* 12 Outer Petal Spokes */}
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 100 100)`}>
            <path
              d="M100 8 C94 22 92 36 100 48 C108 36 106 22 100 8 Z"
              fill="currentColor"
              fillOpacity="0.25"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <circle cx="100" cy="14" r="2" fill="#8B1E3F" />
          </g>
        ))}
      </svg>

      {/* Counter-Clockwise Inner Lotus Ring */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-56 h-56 sm:w-80 sm:h-80 text-burgundy-600/50 animate-spin-reverse-slow absolute"
      >
        <circle cx="100" cy="100" r="68" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
        {/* 8 Lotus Heart Petals */}
        {[...Array(8)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 45} 100 100)`}>
            <path
              d="M100 34 C90 50 88 64 100 78 C112 64 110 50 100 34 Z"
              fill="#C6A15B"
              fillOpacity="0.35"
              stroke="#C6A15B"
              strokeWidth="1"
            />
            <circle cx="100" cy="40" r="2.5" fill="#C6A15B" />
          </g>
        ))}
      </svg>

      {/* Radiant Glowing Golden Kalash & Diya Center Core */}
      <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-burgundy-900 via-navy-900 to-gold-700 p-1 shadow-royal flex items-center justify-center border-2 border-gold-400">
        <div className="absolute inset-0 rounded-full bg-radial from-amber-400/40 to-transparent animate-ping opacity-30" />
        <div className="text-3xl sm:text-4xl animate-bounce-gentle">🪔</div>
      </div>
    </div>
  );
}

/**
 * Animated Golden Diya Lamp with flickering fire flame and radiant heat glow
 */
export function AnimatedFlickerDiya({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xl",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-4xl",
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses}`}>
      {/* Radiant Flame Glow Aura */}
      <div className="absolute -top-1 w-full h-full rounded-full bg-amber-500/30 blur-md animate-pulse" />
      {/* Flame motion SVG */}
      <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
        {/* Brass Diya Bowl */}
        <path
          d="M8 24 C8 32 32 32 32 24 C30 20 26 19 20 19 C14 19 10 20 8 24 Z"
          fill="url(#diyaBrassGrad)"
          stroke="#9A7736"
          strokeWidth="1"
        />
        <ellipse cx="20" cy="21" rx="10" ry="2.5" fill="#581C87" fillOpacity="0.3" />
        {/* Animated flickering flame */}
        <path
          d="M20 7 C23 12 25 15 22 19 C20 20 18 19 17 18 C15 15 17 12 20 7 Z"
          fill="url(#flameGrad)"
          className="animate-flame-flicker origin-bottom"
        />
        {/* Inner intense white core */}
        <ellipse cx="19.5" cy="16" rx="2" ry="3.5" fill="#FEF08A" />

        <defs>
          <linearGradient id="diyaBrassGrad" x1="8" y1="20" x2="32" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.5" stopColor="#D97706" />
            <stop offset="1" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="17" y1="7" x2="23" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.4" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#EF4444" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Animated Celebration Confetti / Marigold Burst Trigger
 * Can be clicked or triggered to celebrate any milestone on the landing page!
 */
export function ShaadiCelebrationLauncher() {
  const launchBurst = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      // Traditional Indian Wedding Palette: Royal Burgundy, Saffron Gold, Amber, Emerald Green
      const colors = ["#8B1E3F", "#C6A15B", "#F59E0B", "#10B981", "#E11D48"];

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors,
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 250);
    } catch (e) {
      console.warn("Celebration confetti launch ignored", e);
    }
  };

  return (
    <button
      onClick={launchBurst}
      type="button"
      className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-burgundy-600 to-amber-600 text-white font-serif font-bold text-sm shadow-royal hover:shadow-goldGlow hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-gold-300"
      title="Click to shower auspicious wedding blessings!"
    >
      <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🎉</span>
      <span className="tracking-wide">Shower Wedding Blessings (Genda Phool)</span>
      <span className="text-lg animate-bounce">🏵️</span>
    </button>
  );
}

/**
 * Animated Traditional Indian Musical Shehnai & Dhol Wave
 * Adds lively animated celebratory music icons along with acoustic sound waves
 */
export function AnimatedShaadiMusicBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-navy-950 via-burgundy-950 to-navy-950 py-3 px-4 border-y border-gold-500/40 relative overflow-hidden select-none">
      <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-4xl mx-auto text-gold-300">
        <div className="flex items-center gap-2 animate-bounce-gentle">
          <span className="text-xl sm:text-2xl">🎺</span>
          <span className="font-serif text-xs sm:text-sm tracking-wider uppercase font-semibold text-gold-200">
            Shehnai Dhun
          </span>
        </div>

        {/* Dynamic Acoustic Soundwave Bars */}
        <div className="flex items-end gap-1 h-6">
          <div className="w-1 bg-gold-400 rounded-full animate-music-bar-1" />
          <div className="w-1 bg-amber-400 rounded-full animate-music-bar-2" />
          <div className="w-1 bg-rose-400 rounded-full animate-music-bar-3" />
          <div className="w-1 bg-gold-400 rounded-full animate-music-bar-4" />
          <div className="w-1 bg-amber-300 rounded-full animate-music-bar-2" />
          <div className="w-1 bg-rose-500 rounded-full animate-music-bar-1" />
        </div>

        <div className="flex items-center gap-2 animate-bounce-gentle" style={{ animationDelay: "0.5s" }}>
          <span className="text-xl sm:text-2xl">🥁</span>
          <span className="font-serif text-xs sm:text-sm tracking-wider uppercase font-semibold text-gold-200">
            Dhol Beat • Baraat Mode
          </span>
        </div>
      </div>
    </div>
  );
}
