"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  UtensilsCrossed,
  IndianRupee,
  CheckCircle2,
  Clock,
  QrCode,
  ArrowUpRight,
  Sparkles,
  MapPin,
  AlertCircle
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MOCK_WEDDINGS, MOCK_FUNCTIONS, MOCK_TASKS, MOCK_GUESTS } from "@/lib/mock-data";
import { formatINR, formatDate, formatTime } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const wedding = MOCK_WEDDINGS[0];
  const nextFunction = MOCK_FUNCTIONS[0]; // Mehendi

  // Aggregated calculations
  const totalUniqueGuests = wedding.totalGuests;
  const totalConfirmed = MOCK_FUNCTIONS.reduce((acc, f) => acc + f.confirmedRsvp, 0);
  const totalInvitedEvents = MOCK_FUNCTIONS.reduce((acc, f) => acc + f.totalInvited, 0);
  const overallConfirmationRate = Math.round((totalConfirmed / totalInvitedEvents) * 100);

  return (
    <div className="space-y-8">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Wedding Operations Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status for <span className="font-semibold text-navy-800">{wedding.title}</span> • {wedding.primaryCity}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/check-in">
            <Button variant="gold" size="sm" className="gap-2 shadow-subtle">
              <QrCode className="h-4 w-4" />
              Open Gate Check-in
            </Button>
          </Link>
          <Link href="/dashboard/guests">
            <Button variant="primary" size="sm" className="gap-2">
              <Users className="h-4 w-4 text-gold-400" />
              Manage Guests
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Unique Guests"
          value={totalUniqueGuests}
          subtitle="Across all bride & groom families"
          icon={Users}
        />
        <StatCard
          title="RSVP Confirmation"
          value={`${overallConfirmationRate}%`}
          subtitle={`${totalConfirmed} confirmed invitations`}
          icon={CheckCircle2}
          trend="+12% this week"
          trendUp={true}
        />
        <StatCard
          title="Catering Guarantee"
          value="369 Plates"
          subtitle="Approved wedding pheras headcount"
          icon={UtensilsCrossed}
        />
        <StatCard
          title="Budget Utilization"
          value={formatINR(wedding.totalExpenses)}
          subtitle={`Allocated: ${formatINR(wedding.totalBudget)}`}
          icon={IndianRupee}
        />
      </div>

      {/* Next Upcoming Function Banner */}
      <Card className="border-gold-300 bg-gradient-to-r from-gold-50/70 via-white to-ivory-100 shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="gold">Next Upcoming Ceremony</Badge>
                <span className="text-xs text-slate-500">Starts in 3 Days</span>
              </div>
              <h2 className="text-xl font-bold text-navy-900">{nextFunction.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <CalendarDays className="h-3.5 w-3.5 text-gold-600" />
                  {formatDate(nextFunction.startTime)} ({formatTime(nextFunction.startTime)})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gold-600" />
                  {nextFunction.venueName}
                </span>
                <span className="font-semibold text-navy-800">
                  Dress Code: {nextFunction.dressCode}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-center shadow-xs">
                <p className="text-[10px] uppercase font-semibold text-slate-500">Confirmed RSVPs</p>
                <p className="text-lg font-bold text-navy-900">{nextFunction.confirmedRsvp} / {nextFunction.totalInvited}</p>
              </div>
              <Link href={`/dashboard/functions`}>
                <Button variant="secondary" size="sm" className="gap-1">
                  Ceremony Details
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Column Grid: Functions Breakdown & Operational Checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2 cols): Function-Specific Headcounts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-navy-900">Ceremony Attendance & Capacity</h3>
            <Link href="/dashboard/functions" className="text-xs font-semibold text-gold-700 hover:underline">
              View All 5 Functions →
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ceremony</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-center">Invited</TableHead>
                <TableHead className="text-center">Confirmed</TableHead>
                <TableHead className="text-center">Pending</TableHead>
                <TableHead className="text-right">Capacity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_FUNCTIONS.map((fn) => (
                <TableRow key={fn.id}>
                  <TableCell className="font-semibold text-navy-900">
                    {fn.name}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {formatDate(fn.startTime)}
                  </TableCell>
                  <TableCell className="text-center font-mono">{fn.totalInvited}</TableCell>
                  <TableCell className="text-center font-mono text-emerald-600 font-semibold">
                    {fn.confirmedRsvp}
                  </TableCell>
                  <TableCell className="text-center font-mono text-amber-600">
                    {fn.pendingRsvp}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-600">
                    {fn.guestCapacity} Max
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right (1 col): Urgent Tasks & Event Operations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-navy-900">Urgent Tasks</h3>
            <Link href="/dashboard/tasks" className="text-xs font-semibold text-gold-700 hover:underline">
              Manage Tasks →
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_TASKS.map((task) => (
              <Card key={task.id} className="border-slate-200 shadow-xs">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        task.priority === "urgent"
                          ? "destructive"
                          : task.priority === "high"
                          ? "gold"
                          : "secondary"
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {task.priority}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-medium">Due {task.dueDate}</span>
                  </div>
                  <p className="text-xs font-semibold text-navy-900 leading-snug">{task.title}</p>
                  <p className="text-[11px] text-slate-500">Assignee: {task.assigneeName}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
