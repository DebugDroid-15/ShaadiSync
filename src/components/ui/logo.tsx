import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textClassName?: string;
}

export function Logo({
  className = "",
  size = "md",
  showText = true,
  textClassName = "",
}: LogoProps) {
  const dimensions = {
    sm: { img: 28, text: "text-lg", sub: "text-[9px]" },
    md: { img: 36, text: "text-xl", sub: "text-[10px]" },
    lg: { img: 44, text: "text-2xl", sub: "text-xs" },
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
    >
      <div className="relative shrink-0 overflow-hidden rounded-xl shadow-sm border border-gold-200/50 bg-white">
        <Image
          src="/logo.png"
          alt="ShaadiSync Logo"
          width={dimensions.img}
          height={dimensions.img}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight text-navy-900 ${dimensions.text} ${textClassName}`}>
              Shaadi<span className="text-gold-600">Sync</span>
            </span>
          </div>
          <p className={`text-slate-500 tracking-wider uppercase font-semibold ${dimensions.sub}`}>
            Wedding Operations
          </p>
        </div>
      )}
    </Link>
  );
}

