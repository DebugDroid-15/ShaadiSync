"use client";

import * as React from "react";
import { Briefcase } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
          Vendors, Contracts & Schedules
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Coordinate caterers, decorators, photographers, pandits, DJs, and makeup artists.
        </p>
      </div>

      <EmptyState
        icon={Briefcase}
        title="Vendor Operations Ready for Phase 5"
        description="Comprehensive vendor directory, advance token tracking, contract milestones, and function arrival schedules will activate in Phase 5."
        actionLabel="Preview Vendor Directory"
        onAction={() => alert("Vendor management database tables and UI will be delivered in Phase 5.")}
      />
    </div>
  );
}
