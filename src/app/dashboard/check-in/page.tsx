"use client";

import * as React from "react";
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Smartphone,
  Camera,
  ShieldAlert,
  Download,
  Users,
  Clock,
  Printer,
  ChevronRight,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  MOCK_GUESTS,
  MOCK_FUNCTIONS,
  MOCK_CHECKIN_GATES,
  MOCK_ATTENDANCE_DASHBOARDS,
  MOCK_ATTENDANCE_RECORDS,
} from "@/lib/mock-data";
import {
  EventAttendanceDashboard,
  AttendanceRecord,
  CheckinGate,
  Guest,
} from "@/types/models";
import { scanCheckinAction, manualCheckinAction } from "@/lib/actions/checkin";

export default function CheckInDeskPage() {
  const [selectedFunctionId, setSelectedFunctionId] = React.useState<string>(MOCK_FUNCTIONS[0].id);
  const [activeTab, setActiveTab] = React.useState<"scanner" | "lookup" | "manifest">("scanner");
  const [passCodeInput, setPassCodeInput] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [admittedCount, setAdmittedCount] = React.useState<number>(1);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Dashboards & activity states
  const [dashboard, setDashboard] = React.useState<EventAttendanceDashboard>(
    MOCK_ATTENDANCE_DASHBOARDS[MOCK_FUNCTIONS[0].id] || {
      eventId: MOCK_FUNCTIONS[0].id,
      eventName: MOCK_FUNCTIONS[0].name,
      totalEligibleGuests: 350,
      confirmedRsvpCount: 310,
      totalCheckedInCount: 185,
      notCheckedInCount: 125,
      ineligibleOrDeclinedCount: 40,
      attendanceRate: 60,
      recentActivity: MOCK_ATTENDANCE_RECORDS,
    }
  );

  const [recentRecords, setRecentRecords] = React.useState<AttendanceRecord[]>(dashboard.recentActivity);

  // Status Alerts
  const [scanResult, setScanResult] = React.useState<{
    type: "success" | "duplicate" | "error";
    title: string;
    description: string;
    timestamp?: string;
  } | null>(null);

  // Override Modal
  const [overrideGuest, setOverrideGuest] = React.useState<Guest | null>(null);
  const [overrideReason, setOverrideReason] = React.useState<string>("");

  const activeFunction = MOCK_FUNCTIONS.find((f) => f.id === selectedFunctionId) || MOCK_FUNCTIONS[0];

  const handleFunctionChange = (fnId: string) => {
    setSelectedFunctionId(fnId);
    setScanResult(null);
    const newDash = MOCK_ATTENDANCE_DASHBOARDS[fnId] || {
      eventId: fnId,
      eventName: MOCK_FUNCTIONS.find((f) => f.id === fnId)?.name || "Ceremony Event",
      totalEligibleGuests: 150,
      confirmedRsvpCount: 120,
      totalCheckedInCount: 0,
      notCheckedInCount: 120,
      ineligibleOrDeclinedCount: 30,
      attendanceRate: 0,
      recentActivity: [],
    };
    setDashboard(newDash);
    setRecentRecords(newDash.recentActivity);
  };

  // Submit QR / Token Scan
  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passCodeInput.trim()) return;

    setIsSubmitting(true);
    setScanResult(null);

    const formData = new FormData();
    formData.append("weddingId", "wed-aarav-diya");
    formData.append("eventId", selectedFunctionId);
    formData.append("passCode", passCodeInput.trim());
    formData.append("admittedCount", String(admittedCount));

    try {
      const res = await scanCheckinAction(formData);
      if (res.isDuplicate) {
        setScanResult({
          type: "duplicate",
          title: "⚠️ Duplicate Scan Detected",
          description: res.error || "This pass was already scanned.",
          timestamp: res.duplicateDetails?.checkedInAt,
        });
      } else if (!res.success) {
        setScanResult({
          type: "error",
          title: "❌ Invalid QR Pass",
          description: res.error || "Pass verification failed.",
        });
      } else {
        const admittedName = (res.data as AttendanceRecord)?.guestName || "Guest";
        setScanResult({
          type: "success",
          title: "✅ Admission Confirmed",
          description: `${admittedName} (${admittedCount} Attendee${admittedCount > 1 ? "s" : ""}) admitted to ${activeFunction.name}.`,
          timestamp: new Date().toLocaleTimeString(),
        });
        setPassCodeInput("");
        if (res.data) {
          setRecentRecords((prev) => [res.data as AttendanceRecord, ...prev]);
          setDashboard((prev) => ({
            ...prev,
            totalCheckedInCount: prev.totalCheckedInCount + admittedCount,
            notCheckedInCount: Math.max(0, prev.notCheckedInCount - admittedCount),
          }));
        }
      }
    } catch {
      setScanResult({
        type: "error",
        title: "Network Error",
        description: "Failed to communicate with gate validation server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Manual Check-in
  const handleManualCheckin = async (guest: Guest, isOverride = false) => {
    setIsSubmitting(true);
    setScanResult(null);

    const formData = new FormData();
    formData.append("weddingId", "wed-aarav-diya");
    formData.append("eventId", selectedFunctionId);
    formData.append("guestId", guest.id);
    formData.append("admittedCount", "1");
    if (isOverride) {
      formData.append("isOverride", "true");
      formData.append("overrideReason", overrideReason || "Supervisor authorization at gate");
    }

    try {
      const res = await manualCheckinAction(formData);
      if (res.isDuplicate) {
        setScanResult({
          type: "duplicate",
          title: "⚠️ Already Checked In",
          description: `${guest.firstName} ${guest.lastName} has already entered.`,
        });
      } else if (!res.success) {
        setScanResult({
          type: "error",
          title: "Check-in Blocked",
          description: res.error || "Manual admission failed.",
        });
      } else {
        setScanResult({
          type: "success",
          title: "✅ Manual Admission Recorded",
          description: `${guest.firstName} ${guest.lastName} admitted via ${isOverride ? "Supervisor Override" : "Roster Lookup"}.`,
        });
        if (res.data) {
          setRecentRecords((prev) => [res.data as AttendanceRecord, ...prev]);
        }
        setOverrideGuest(null);
        setOverrideReason("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Timestamp", "Guest Name", "Event", "Method", "Admitted Count", "Gate", "Operator Notes"];
    const rows = recentRecords.map((r) => [
      `"${r.checkinTime}"`,
      `"${(r.guestName || "Guest").replace(/"/g, '""')}"`,
      `"${activeFunction.name.replace(/"/g, '""')}"`,
      r.checkinMethod,
      String(r.admittedCount),
      `"${r.gateName || "Gate Desk"}"`,
      `"${(r.operatorNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ShaadiSync_Attendance_${activeFunction.eventType}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const eligibleGuests = MOCK_GUESTS.filter((g) =>
    g.invitedFunctionIds.includes(selectedFunctionId)
  );

  const filteredGuests = eligibleGuests.filter(
    (g) =>
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
            <span className="text-xs text-gold-300 font-mono">Real-Time Event Attendance</span>
          </div>
          <h1 className="text-2xl font-bold mt-1 tracking-tight">
            Ceremony Gate Check-in Desk
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Atomic QR admission, duplicate scan alerts, and supervisor guest verification for wedding functions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <label className="text-[11px] uppercase tracking-wider text-gold-200 block mb-1 font-semibold">
              Select Ceremony
            </label>
            <select
              value={selectedFunctionId}
              onChange={(e) => handleFunctionChange(e.target.value)}
              className="bg-navy-800 text-white border border-gold-300/30 text-sm rounded-lg px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              {MOCK_FUNCTIONS.map((fn) => (
                <option key={fn.id} value={fn.id} className="bg-navy-900 text-white">
                  {fn.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="border-gold-300/40 text-gold-200 hover:bg-gold-500/10 gap-2 mt-auto"
          >
            <Download className="h-4 w-4" />
            Export Log
          </Button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Checked-In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-navy-900 font-mono">
              {dashboard.totalCheckedInCount}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {dashboard.attendanceRate}% of confirmed guests
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Confirmed RSVPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy-900 font-mono">
              {dashboard.confirmedRsvpCount}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Eligible expected arrivals</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Pending Arrival
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700 font-mono">
              {dashboard.notCheckedInCount}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Yet to arrive at venue</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Eligible Invited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-700 font-mono">
              {dashboard.totalEligibleGuests}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Total event invitations</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("scanner")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "scanner"
              ? "border-burgundy-600 text-burgundy-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Camera className="h-4 w-4" />
          QR Scanner & Token Entry
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("lookup")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "lookup"
              ? "border-burgundy-600 text-burgundy-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Search className="h-4 w-4" />
          Manual Guest Lookup ({filteredGuests.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("manifest")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "manifest"
              ? "border-burgundy-600 text-burgundy-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clock className="h-4 w-4" />
          Gate Activity Stream ({recentRecords.length})
        </button>
      </div>

      {/* TAB 1: QR Scanner & Token Entry */}
      {activeTab === "scanner" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base font-bold text-navy-900 flex items-center gap-2">
                <QrCode className="h-5 w-5 text-burgundy-600" />
                Scan Pass or Enter Bearer Code
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {/* Camera Simulator viewport */}
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-burgundy-50 border border-burgundy-200 flex items-center justify-center mb-3">
                  <Camera className="h-8 w-8 text-burgundy-600" />
                </div>
                <h4 className="text-sm font-bold text-navy-900">Live Camera Optical Scanner</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Point device camera at the guest&apos;s digital wedding pass or printed card.
                </p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPassCodeInput("pass_sng_7f8a92b");
                    }}
                    className="text-xs border-slate-200"
                  >
                    Load Sample Test Pass
                  </Button>
                </div>
              </div>

              {/* Form Input for Token Entry */}
              <form onSubmit={handleScanSubmit} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="passCode">Pass Code / Token String *</Label>
                  <div className="relative">
                    <Input
                      id="passCode"
                      value={passCodeInput}
                      onChange={(e) => setPassCodeInput(e.target.value)}
                      placeholder="e.g. pass_sng_7f8a92b"
                      required
                      className="font-mono text-sm uppercase pl-9"
                    />
                    <QrCode className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="admittedCount">Admitted Person Count</Label>
                    <Input
                      id="admittedCount"
                      type="number"
                      min="1"
                      max="10"
                      value={admittedCount}
                      onChange={(e) => setAdmittedCount(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="gateDesk">Gate Desk</Label>
                    <select
                      id="gateDesk"
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    >
                      {MOCK_CHECKIN_GATES.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !passCodeInput.trim()}
                  className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold h-11"
                >
                  {isSubmitting ? "Verifying..." : "Validate & Check In"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Validation Feedback & Admission Status Card */}
          <Card className="border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-base font-bold text-navy-900">
                Gate Inspection Result
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!scanResult ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Smartphone className="h-10 w-10 mx-auto text-slate-300" />
                  <p className="text-sm font-medium">Ready to scan incoming passes</p>
                  <p className="text-xs max-w-xs mx-auto">
                    Pass validation checks ceremony eligibility, active token state, and prevents duplicate re-entry.
                  </p>
                </div>
              ) : scanResult.type === "success" ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    <h3 className="font-bold text-lg">{scanResult.title}</h3>
                  </div>
                  <p className="text-sm text-emerald-800">{scanResult.description}</p>
                  <div className="text-xs text-emerald-700 font-mono">
                    Admitted at: {scanResult.timestamp}
                  </div>
                </div>
              ) : scanResult.type === "duplicate" ? (
                <div className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                    <h3 className="font-bold text-lg">{scanResult.title}</h3>
                  </div>
                  <p className="text-sm text-amber-800">{scanResult.description}</p>
                  {scanResult.timestamp && (
                    <div className="text-xs text-amber-700 font-mono">
                      First checked in at: {new Date(scanResult.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                  <p className="text-xs text-slate-600 pt-2 border-t border-amber-200">
                    If this is an authorized re-entry or accompanying family member, use the Manual Lookup tab to record an override with notes.
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-rose-600" />
                    <h3 className="font-bold text-lg">{scanResult.title}</h3>
                  </div>
                  <p className="text-sm text-rose-800">{scanResult.description}</p>
                  <p className="text-xs text-slate-600 pt-1">
                    Pass may be revoked, expired, or issued for a different wedding function.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Manual Lookup & Override */}
      {activeTab === "lookup" && (
        <Card className="border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-base font-bold text-navy-900">
                Eligible Guest Roster for {activeFunction.name}
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Household / Side</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No matching guests found eligible for this ceremony.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuests.map((guest) => {
                    const isAlreadyCheckedIn = recentRecords.some((r) => r.guestId === guest.id);

                    return (
                      <TableRow key={guest.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="font-semibold text-navy-900">
                            {guest.firstName} {guest.lastName}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">{guest.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-slate-800 capitalize">{guest.side} Side</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize text-xs">
                            {guest.category.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 font-mono">
                          {guest.phone}
                        </TableCell>
                        <TableCell className="text-right">
                          {isAlreadyCheckedIn ? (
                            <div className="inline-flex items-center gap-2">
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Admitted</Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setOverrideGuest(guest)}
                                className="h-8 text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                              >
                                Override
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleManualCheckin(guest, false)}
                              disabled={isSubmitting}
                              className="h-8 text-xs bg-navy-900 hover:bg-navy-800 text-white"
                            >
                              Check In
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Gate Manifest Activity Stream */}
      {activeTab === "manifest" && (
        <Card className="border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-navy-900">
              Live Attendance Manifest ({recentRecords.length} Admitted)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Attendee</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Admitted Count</TableHead>
                  <TableHead>Gate / Desk</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRecords.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-xs text-slate-600">
                      {new Date(r.checkinTime).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-navy-900">{r.guestName}</div>
                      {r.householdName && <div className="text-xs text-slate-400">{r.householdName}</div>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs font-mono">
                        {r.checkinMethod.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-sm text-navy-900">
                      {r.admittedCount} Person{r.admittedCount > 1 ? "s" : ""}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{r.gateName || "Gate Desk"}</TableCell>
                    <TableCell className="text-xs text-slate-500 max-w-[200px] truncate">
                      {r.operatorNotes || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Override Modal */}
      {overrideGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md bg-white shadow-xl">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                Supervisor Check-in Override
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-xs text-slate-600">
                Guest <span className="font-bold text-navy-900">{overrideGuest.firstName} {overrideGuest.lastName}</span> was already admitted. An auditable override reason is required.
              </p>

              <div className="space-y-1">
                <Label htmlFor="overrideReason">Reason for Manual Override *</Label>
                <Input
                  id="overrideReason"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g. Lost badge, authorized re-entry, additional accompanying child"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setOverrideGuest(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!overrideReason.trim() || isSubmitting}
                  onClick={() => handleManualCheckin(overrideGuest, true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Confirm Override Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
