"use client";

import * as React from "react";
import { Car } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function LogisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
          Parking, Shuttles & Accommodation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Venue parking zone capacity, driver dispatch cards, and hotel room family assignments.
        </p>
      </div>

      <EmptyState
        icon={Car}
        title="Logistics Operations Scheduled for Phase 7"
        description="Venue parking zone allocations, airport arrival pickup groups, shuttle dispatch, and hotel room inventory will be delivered in Phase 7."
        actionLabel="Preview Logistics Spec"
        onAction={() => alert("Parking and accommodation models and UI will be delivered in Phase 7.")}
      />
    </div>
  );
}
