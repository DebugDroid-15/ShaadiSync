"use client";

import * as React from "react";
import { QrCode, Search, CheckCircle2, AlertTriangle, UserCheck, Smartphone, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_GUESTS, MOCK_FUNCTIONS } from "@/lib/mock-data";

export default function CheckInDeskPage() {
  const [selectedFunctionId, setSelectedFunctionId] = React.useState<string>(MOCK_FUNCTIONS[0].id);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [checkedInGuestIds, setCheckedInGuestIds] = React.useState<Set<string>>(new Set(["gst-001"]));
  const [alertMessage, setAlertMessage] = React.useState<{ text: string; type: "success" | "warning" } | null>(null);

  const activeFunction = MOCK_FUNCTIONS.find((f) => f.id === selectedFunctionId) || MOCK_FUNCTIONS[0];

  const handleCheckIn = (guestId: string, guestName: string) => {
    if (checkedInGuestIds.has(guestId)) {
      setAlertMessage({
        text: `⚠️ Duplicate Check-in Alert: ${guestName} was already checked in at 02:15 PM!`,
        type: "warning",
      });
      return;
    }
    setCheckedInGuestIds((prev) => new Set(prev).add(guestId));
    setAlertMessage({
      text: `✅ Successfully checked in: ${guestName} for ${activeFunction.name}`,
      type: "success",
    });
  };

  const eligibleGuests = MOCK_GUESTS.filter((g) =>
    g.invitedFunctionIds.includes(selectedFunctionId)
  );

  const filteredGuests = eligibleGuests.filter((g) =>
    g.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Function Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900 text-white p-6 rounded-2xl shadow-elevated">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="gold" className="text-[10px] uppercase font-bold">Gate Operations</Badge>
            <span className="text-xs text-slate-300">Offline-Ready Check-in Desk</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 text-white">Event-Day Gate Scanner</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Select the active ceremony to verify QR passes and manage guest entry without bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-300 font-semibold">Active Ceremony:</label>
          <select
            value={selectedFunctionId}
            onChange={(e) => {
              setSelectedFunctionId(e.target.value);
              setAlertMessage(null);
            }}
            className="rounded-lg bg-navy-800 border border-navy-700 px-3 py-2 text-xs font-bold text-gold-400 focus:outline-none"
          >
            {MOCK_FUNCTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alert Feed */}
      {alertMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
            alertMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-amber-50 text-amber-900 border border-amber-300"
          }`}
        >
          <span>{alertMessage.text}</span>
          <button
            onClick={() => setAlertMessage(null)}
            className="text-xs underline ml-4 hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dual Scanner Layout: Camera Simulation & Fast Manual Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: QR Camera Scanner Mock */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-navy-900">QR Code Camera Scanner</h3>
          <Card className="border-slate-200 shadow-card bg-white text-center p-6 space-y-4">
            <div className="mx-auto flex h-48 w-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gold-400 bg-gold-50/40 p-4">
              <Camera className="h-10 w-10 text-gold-600 mb-2 animate-pulse" />
              <p className="text-xs font-semibold text-navy-800">Point Camera at Guest Pass</p>
              <p className="text-[10px] text-slate-500 mt-1">Works on any mobile browser</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCheckIn(eligibleGuests[1]?.id || "gst-002", `${eligibleGuests[1]?.firstName} ${eligibleGuests[1]?.lastName}`)}
              className="w-full text-xs font-semibold"
            >
              Simulate QR Scan (Vikram Kapoor)
            </Button>
          </Card>
        </div>

        {/* Right Column: Instant Name/Phone Search Fallback */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-navy-900">
              Manual Guest Search ({eligibleGuests.length} Invited)
            </h3>
            <span className="text-xs font-bold text-emerald-600 font-mono">
              {checkedInGuestIds.size} Checked In
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by guest name or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-navy-900 placeholder:text-slate-400 focus:border-gold-500 focus:outline-none transition-all shadow-xs"
            />
          </div>

          <div className="space-y-2.5">
            {filteredGuests.map((guest) => {
              const isCheckedIn = checkedInGuestIds.has(guest.id);
              return (
                <div
                  key={guest.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isCheckedIn
                      ? "bg-emerald-50/60 border-emerald-200"
                      : "bg-white border-slate-200 shadow-xs hover:border-gold-400"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900 text-sm">
                        {guest.firstName} {guest.lastName}
                      </span>
                      {guest.isVip && <Badge variant="vip" className="text-[9px] py-0">VIP</Badge>}
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {guest.side} Side
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">{guest.phone}</p>
                  </div>

                  <div>
                    {isCheckedIn ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Checked In
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(guest.id, `${guest.firstName} ${guest.lastName}`)}
                        className="text-xs font-semibold gap-1.5 shadow-xs"
                      >
                        <UserCheck className="h-4 w-4" />
                        Check In
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
