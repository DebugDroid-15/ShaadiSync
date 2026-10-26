"use client";

import * as React from "react";
import { Plus, CalendarHeart, MapPin, Users, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_FUNCTIONS } from "@/lib/mock-data";
import { formatDate, formatTime } from "@/lib/utils";

export default function FunctionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Wedding Functions & Ceremonies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure independent dates, timings, dress codes, venues, and selective guest assignments.
          </p>
        </div>

        <Button
          onClick={() => alert("Ceremony creation form will be persisted to Supabase in Phase 3.")}
          className="gap-2 shadow-subtle"
        >
          <Plus className="h-4 w-4" />
          Add New Function
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_FUNCTIONS.map((fn) => (
          <Card key={fn.id} className="border-slate-200/90 shadow-card hover:border-gold-400 transition-all flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="gold" className="uppercase text-[10px]">
                  {fn.eventType}
                </Badge>
                <span className="text-xs font-semibold text-slate-500">
                  Cap: {fn.guestCapacity}
                </span>
              </div>
              <CardTitle className="text-lg text-navy-900">{fn.name}</CardTitle>
              <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                <p className="flex items-center gap-1.5 font-medium text-navy-800">
                  <Clock className="h-3.5 w-3.5 text-gold-600" />
                  {formatDate(fn.startTime)} • {formatTime(fn.startTime)}
                </p>
                <p className="flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gold-600 shrink-0 mt-0.5" />
                  <span>{fn.venueName}</span>
                </p>
                {fn.dressCode && (
                  <p className="text-slate-500">
                    <strong className="text-slate-700">Dress Code:</strong> {fn.dressCode}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-3 border-t border-slate-100">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Invited</p>
                  <p className="text-sm font-bold text-navy-900 font-mono">{fn.totalInvited}</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-100">
                  <p className="text-[10px] uppercase font-bold text-emerald-600">Confirmed</p>
                  <p className="text-sm font-bold text-emerald-800 font-mono">{fn.confirmedRsvp}</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-2 border border-amber-100">
                  <p className="text-[10px] uppercase font-bold text-amber-600">Pending</p>
                  <p className="text-sm font-bold text-amber-800 font-mono">{fn.pendingRsvp}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
