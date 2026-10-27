"use client";

import * as React from "react";
import { ChevronDown, CalendarHeart, MapPin, Sparkles, Plus } from "lucide-react";
import { MOCK_WEDDINGS } from "@/lib/mock-data";
import { Wedding } from "@/types/models";
import { formatDate } from "@/lib/utils";
import { ShaadiStorage } from "@/lib/shaadi-storage";

interface WeddingSwitcherProps {
  activeWedding: Wedding | null;
  onSelectWedding: (wedding: Wedding) => void;
}

export function WeddingSwitcher({ activeWedding, onSelectWedding }: WeddingSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [weddings, setWeddings] = React.useState<Wedding[]>([]);

  React.useEffect(() => {
    setWeddings(ShaadiStorage.getWeddings());
  }, []);

  if (!activeWedding) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-500">
        <CalendarHeart className="h-4 w-4 text-slate-400" />
        <span>No Active Wedding</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-left shadow-xs transition-all hover:border-gold-500 hover:shadow-subtle focus:outline-none focus:ring-2 focus:ring-gold-500/20"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-800 border border-navy-100">
          <CalendarHeart className="h-5 w-5 text-gold-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-navy-900">{activeWedding.title}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-semibold text-emerald-800 uppercase">
              {activeWedding.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {activeWedding.primaryCity}
            </span>
            <span>•</span>
            <span>{formatDate(activeWedding.startDate)}</span>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400 ml-2" />
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-2 z-40 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-elevated">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Active Weddings
            </p>
            <div className="space-y-1">
              {weddings.map((wedding) => (
                <button
                  key={wedding.id}
                  onClick={() => {
                    onSelectWedding(wedding);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-lg p-2.5 text-left text-sm transition-colors ${
                    activeWedding.id === wedding.id
                      ? "bg-navy-50 font-semibold text-navy-900 border border-navy-200"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{wedding.title}</p>
                    <p className="text-xs text-slate-500">{wedding.primaryCity}</p>
                  </div>
                  {activeWedding.id === wedding.id && (
                    <Sparkles className="h-4 w-4 text-gold-500" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  alert("Wedding creation wizard opens in Phase 3 with database persistence.");
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 rounded-lg p-2 text-xs font-semibold text-gold-700 hover:bg-gold-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New Wedding Project
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
