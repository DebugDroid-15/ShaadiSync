"use client";

import * as React from "react";
import { Users, Search, Filter, Download, Upload, Plus, Phone, Mail, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MOCK_GUESTS, MOCK_FUNCTIONS } from "@/lib/mock-data";
import { Guest } from "@/types/models";

export default function GuestsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSide, setSelectedSide] = React.useState<string>("all");

  const filteredGuests = MOCK_GUESTS.filter((g) => {
    const matchesSearch =
      g.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);
    const matchesSide = selectedSide === "all" || g.side === selectedSide;
    return matchesSearch && matchesSide;
  });

  return (
    <div className="space-y-6">
      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Guest Directory & Selective RSVPs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Group by bride/groom side, manage household relations, and configure function-specific invitations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("CSV Export will be enabled in Phase 3.")}
            className="gap-1.5"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("CSV Import parser with error verification activates in Phase 3.")}
            className="gap-1.5"
          >
            <Upload className="h-4 w-4 text-slate-500" />
            Import CSV
          </Button>
          <Button
            size="sm"
            onClick={() => alert("Add Guest form will be persisted in Phase 3.")}
            className="gap-1.5 shadow-subtle"
          >
            <Plus className="h-4 w-4" />
            Add Guest Record
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by guest name or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-navy-900 placeholder:text-slate-400 focus:border-gold-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Filter Side:</span>
          <select
            value={selectedSide}
            onChange={(e) => setSelectedSide(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-navy-800 focus:border-gold-500 focus:outline-none"
          >
            <option value="all">All Guests</option>
            <option value="bride">Bride Side</option>
            <option value="groom">Groom Side</option>
            <option value="mutual">Mutual / Colleagues</option>
          </select>
        </div>
      </div>

      {/* Guests Data Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest Name</TableHead>
            <TableHead>Side / Category</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Dietary Preference</TableHead>
            <TableHead>Invited Functions</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell className="font-semibold text-navy-900">
                <div className="flex items-center gap-2">
                  <span>{guest.firstName} {guest.lastName}</span>
                  {guest.isVip && <Badge variant="vip" className="text-[9px] py-0">VIP</Badge>}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant={
                      guest.side === "bride"
                        ? "gold"
                        : guest.side === "groom"
                        ? "default"
                        : "secondary"
                    }
                    className="capitalize text-[10px]"
                  >
                    {guest.side} Side
                  </Badge>
                  <span className="text-[11px] text-slate-500 capitalize">({guest.category})</span>
                </div>
              </TableCell>

              <TableCell>
                <div className="text-xs text-slate-600 space-y-0.5 font-mono">
                  <p>{guest.phone}</p>
                  <p className="text-[11px] text-slate-400 font-sans">{guest.email}</p>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-xs capitalize font-medium text-navy-800">
                  {guest.dietaryPreference.replace("_", " ")}
                </span>
                {guest.allergies && guest.allergies !== "None" && (
                  <p className="text-[10px] text-terracotta-600">{guest.allergies}</p>
                )}
              </TableCell>

              <TableCell>
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  {guest.invitedFunctionIds.length} Functions
                </span>
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => alert(`Unique RSVP Token: ${guest.invitationToken}\nShareable link generator activates in Phase 4.`)}
                  className="text-xs font-semibold text-gold-700 hover:text-gold-800"
                >
                  RSVP Link
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
