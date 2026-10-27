"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { WeddingSwitcher } from "@/components/dashboard/wedding-switcher";
import { MOCK_WEDDINGS } from "@/lib/mock-data";
import { Wedding } from "@/types/models";
import { Badge } from "@/components/ui/badge";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { signOutAction } from "@/lib/actions/auth";
import { ShaadiStorage } from "@/lib/shaadi-storage";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeWedding, setActiveWedding] = React.useState<Wedding | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isConfigured = React.useMemo(() => isSupabaseConfigured(), []);

  React.useEffect(() => {
    const weddings = ShaadiStorage.getWeddings();
    if (weddings.length > 0) {
      setActiveWedding(weddings[0]);
    } else {
      setActiveWedding(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. Supabase Operational Status Banner */}
      <div className="bg-navy-900 text-white text-xs px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-navy-800">
        <div className="flex items-center gap-2">
          <Badge
            variant={isConfigured ? "success" : "gold"}
            className="text-[10px] py-0 px-2 font-mono"
          >
            {isConfigured ? "Supabase Live" : "Phase 2 Security Mode"}
          </Badge>
          <span>
            {isConfigured
              ? "Connected to Supabase PostgreSQL with database-enforced Row Level Security."
              : "Running in local secure mode with verified RLS policies and seed fixtures."}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <span>Zero Paid APIs</span>
          <span>•</span>
          <span>Canonical: DebugDroid-15/ShaadiSync</span>
        </div>
      </div>

      {/* 2. Top Header Bar */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 shadow-xs">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border border-gold-200/60 bg-white shadow-xs flex items-center justify-center p-0.5">
              <Image
                src="/logo.png"
                alt="ShaadiSync"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:inline font-bold text-lg text-navy-900">
              Shaadi<span className="text-burgundy-700">Sync</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Active Wedding Switcher */}
          <WeddingSwitcher
            activeWedding={activeWedding}
            onSelectWedding={setActiveWedding}
          />
        </div>

        {/* Right: Quick actions and Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search guests, vendors, rooms..."
              className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-navy-900 placeholder:text-slate-400 focus:border-gold-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <button
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold-500" />
          </button>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-navy-700 text-gold-400 flex items-center justify-center font-bold text-xs shadow-xs">
              AK
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-navy-900 leading-none">Laxman</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Royal Heritage</p>
            </div>
          </div>

          <button
            onClick={() => signOutAction()}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 3. Main Dashboard Workspace */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
