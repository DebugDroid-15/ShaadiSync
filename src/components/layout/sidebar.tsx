"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UtensilsCrossed,
  Briefcase,
  IndianRupee,
  Car,
  QrCode,
  CheckSquare,
  Settings,
  ChevronRight,
  LogOut,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Functions (Events)", href: "/dashboard/functions", icon: CalendarDays },
  { name: "Guests & RSVPs", href: "/dashboard/guests", icon: Users },
  { name: "Catering Operations", href: "/dashboard/catering", icon: UtensilsCrossed },
  { name: "Vendors & Contracts", href: "/dashboard/vendors", icon: Briefcase },
  { name: "Budget & Expenses", href: "/dashboard/budget", icon: IndianRupee },
  { name: "Logistics & Parking", href: "/dashboard/logistics", icon: Car },
  { name: "Gate Check-in Desk", href: "/dashboard/check-in", icon: QrCode },
  { name: "Tasks & Operations", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Wedding Settings", href: "/dashboard/weddings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)]">
      {/* Active Organisation Badge */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-700 text-gold-400 font-bold text-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Organisation</p>
            <p className="text-sm font-bold text-navy-900 truncate">Royal Heritage Events</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Wedding Operations
        </div>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-navy-700 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-navy-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-gold-400" : "text-slate-400 group-hover:text-navy-700"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-gold-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info / Operator Role */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            <span className="text-xs font-medium text-slate-600">Lead Planner</span>
          </div>
          <Link href="/" className="text-xs text-slate-400 hover:text-navy-700 flex items-center gap-1 transition-colors">
            <LogOut className="h-3.5 w-3.5" />
            Exit
          </Link>
        </div>
      </div>
    </aside>
  );
}
