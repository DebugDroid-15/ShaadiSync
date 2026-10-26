"use client";

import * as React from "react";
import { CalendarHeart, Plus, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_WEDDINGS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function WeddingsManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Multi-Wedding Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage multiple client weddings within your organisation with complete data isolation.
          </p>
        </div>

        <Button
          onClick={() => alert("Multi-wedding creation wizard connects to Supabase in Phase 3.")}
          className="gap-2 shadow-subtle"
        >
          <Plus className="h-4 w-4" />
          Create New Wedding
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_WEDDINGS.map((wedding) => (
          <Card key={wedding.id} className="border-slate-200/90 shadow-card hover:border-gold-400 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="gold" className="uppercase text-[10px]">
                  {wedding.status}
                </Badge>
                <span className="text-xs font-semibold text-slate-500">
                  {wedding.totalFunctions} Ceremonies
                </span>
              </div>
              <CardTitle className="text-xl text-navy-900">{wedding.title}</CardTitle>
              <div className="space-y-1 pt-2 text-xs text-slate-600">
                <p className="flex items-center gap-1.5 font-medium text-navy-800">
                  <MapPin className="h-3.5 w-3.5 text-gold-600" />
                  {wedding.primaryCity}
                </p>
                <p className="text-slate-500">
                  {formatDate(wedding.startDate)} – {formatDate(wedding.endDate)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Couple: <strong className="text-navy-900">{wedding.coupleBrideName}</strong> & <strong className="text-navy-900">{wedding.coupleGroomName}</strong>
              </div>
              <Button variant="secondary" size="sm">
                Open Workspace
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
