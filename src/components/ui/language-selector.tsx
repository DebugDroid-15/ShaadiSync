"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/i18n";

interface LanguageSelectorProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  className?: string;
}

export function LanguageSelector({
  currentLang,
  onLanguageChange,
  className = "",
}: LanguageSelectorProps) {
  return (
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <Globe className="h-4 w-4 text-gold-600 shrink-0" />
      <select
        value={currentLang}
        onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
        className="h-8 rounded-lg border border-slate-300 bg-white/95 px-2.5 py-0.5 text-xs font-semibold text-navy-900 shadow-xs focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/20 cursor-pointer"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
}

