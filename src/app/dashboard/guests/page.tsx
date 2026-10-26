"use client";

import * as React from "react";
import { Search, Download, Upload, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MOCK_GUESTS, MOCK_FUNCTIONS, MOCK_WEDDINGS } from "@/lib/mock-data";
import { Guest, WeddingFunction } from "@/types/models";
import { validateGuestCsv, exportGuestsToCsv } from "@/lib/csv";
import { createGuestAction, bulkImportGuestsAction, deleteGuestAction } from "@/lib/actions/guests";

export default function GuestsPage() {
  const [guests, setGuests] = React.useState<Guest[]>(MOCK_GUESTS);
  const [functions] = React.useState<WeddingFunction[]>(MOCK_FUNCTIONS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSide, setSelectedSide] = React.useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = React.useState(false);
  const [csvText, setCsvText] = React.useState("");
  const [csvTargetEvents, setCsvTargetEvents] = React.useState<string[]>([]);
  const [csvErrors, setCsvErrors] = React.useState<Array<{ rowNumber: number; errors: string[] }>>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const activeWedding = MOCK_WEDDINGS[0];

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery);
    const matchesSide = selectedSide === "all" || g.side === selectedSide;
    return matchesSearch && matchesSide;
  });

  // Handle CSV Export
  function handleExportCsv() {
    const formatted = guests.map((g) => ({
      firstName: g.firstName,
      lastName: g.lastName,
      side: g.side,
      category: g.category,
      ageGroup: g.ageGroup,
      phone: g.phone,
      email: g.email,
      dietaryPref: g.dietaryPreference,
      allergiesNotes: g.allergies,
      isVip: g.isVip,
      familyName: "",
      invitedEventsCount: g.invitedFunctionIds.length,
    }));
    const csvContent = exportGuestsToCsv(formatted);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ShaadiSync_Guests_${activeWedding.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Handle CSV Import
  async function handleImportCsv() {
    setLoading(true);
    setCsvErrors([]);
    setError(null);

    const validation = validateGuestCsv(csvText);
    if (!validation.success) {
      setCsvErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const result = await bulkImportGuestsAction(activeWedding.id, validation.validRows, csvTargetEvents);
      if (!result.success) {
        setError(result.error || "CSV import failed.");
      } else {
        const newGuests: Guest[] = validation.validRows.map((r, i) => ({
          id: "imported-" + Date.now() + "-" + i,
          weddingId: activeWedding.id,
          firstName: r.firstName,
          lastName: r.lastName,
          side: r.side,
          category: r.category,
          ageGroup: r.ageGroup,
          phone: r.phone || "",
          email: r.email || "",
          dietaryPreference: r.dietaryPref,
          allergies: r.allergies,
          isVip: r.isVip,
          invitationToken: "tok_" + Math.random().toString(36).substring(2, 9),
          invitedFunctionIds: csvTargetEvents,
        }));
        setGuests((prev) => [...prev, ...newGuests]);
        setIsCsvModalOpen(false);
        setCsvText("");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  // Handle Single Guest Create
  async function handleCreateGuest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("weddingId", activeWedding.id);

    try {
      const result = await createGuestAction(formData);
      if (!result.success) {
        setError(result.error || "Failed to add guest");
      } else {
        const invitedEventIds = (formData.getAll("invitedEventIds") as string[]).filter(Boolean);
        const newGuest: Guest = {
          id: (result.data as { id?: string })?.id || "gst-" + Date.now(),
          weddingId: activeWedding.id,
          firstName: formData.get("firstName") as string,
          lastName: formData.get("lastName") as string,
          side: formData.get("side") as Guest["side"],
          category: formData.get("category") as Guest["category"],
          ageGroup: formData.get("ageGroup") as Guest["ageGroup"],
          phone: (formData.get("phone") as string) || "",
          email: (formData.get("email") as string) || "",
          dietaryPreference: formData.get("dietaryPref") as Guest["dietaryPreference"],
          allergies: (formData.get("allergiesNotes") as string) || undefined,
          isVip: formData.get("isVip") === "on",
          invitationToken: "tok_" + Math.random().toString(36).substring(2, 9),
          invitedFunctionIds: invitedEventIds,
        };
        setGuests((prev) => [...prev, newGuest]);
        setIsAddModalOpen(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating guest");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this guest record?")) return;
    await deleteGuestAction(id);
    setGuests((prev) => prev.filter((g) => g.id !== id));
  }

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
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="gap-1.5">
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCsvErrors([]);
              setIsCsvModalOpen(true);
            }}
            className="gap-1.5"
          >
            <Upload className="h-4 w-4 text-slate-500" />
            Import CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setError(null);
              setIsAddModalOpen(true);
            }}
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
            <option value="all">All Guests ({guests.length})</option>
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
            <TableHead className="text-right">Actions</TableHead>
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
                    variant={guest.side === "bride" ? "gold" : guest.side === "groom" ? "default" : "secondary"}
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
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert(`Unique Token: ${guest.invitationToken}\nRSVP URL: /invite/${guest.invitationToken}`)}
                    className="text-xs font-semibold text-gold-700 hover:text-gold-800"
                  >
                    RSVP
                  </Button>
                  <button
                    onClick={() => handleDelete(guest.id)}
                    className="text-slate-400 hover:text-terracotta-600 p-1 rounded"
                    title="Delete guest"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* CSV Import Modal */}
      <Dialog
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        title="Import Guests from CSV"
        description="Paste CSV lines with columns: First Name, Last Name, Phone, Email, Side, Category, VIP."
      >
        <div className="space-y-4">
          {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          {csvErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-800 space-y-1 max-h-36 overflow-y-auto">
              <p className="font-bold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Row-Level Validation Errors:
              </p>
              {csvErrors.map((err, i) => (
                <p key={i}>Row {err.rowNumber}: {err.errors.join(", ")}</p>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">CSV Content</label>
            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="First Name,Last Name,Phone,Email,Side&#10;Amit,Verma,+919876543210,amit@test.com,groom&#10;Pooja,Sharma,+919876543211,pooja@test.com,bride"
              className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">Assign to Ceremonies (Optional)</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {functions.map((fn) => (
                <label key={fn.id} className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={csvTargetEvents.includes(fn.id)}
                    onChange={(e) => {
                      if (e.target.checked) setCsvTargetEvents((prev) => [...prev, fn.id]);
                      else setCsvTargetEvents((prev) => prev.filter((id) => id !== fn.id));
                    }}
                    className="rounded text-gold-600"
                  />
                  <span>{fn.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsCsvModalOpen(false)}>Cancel</Button>
            <Button onClick={handleImportCsv} disabled={loading || !csvText.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Validate & Import"}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Add Single Guest Modal */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Single Guest"
        description="Add guest details and assign to selective ceremonies."
      >
        <form onSubmit={handleCreateGuest} className="space-y-3">
          {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" name="firstName" required />
            <Input label="Last Name" name="lastName" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone Number" name="phone" placeholder="+91 98765 00000" />
            <Input label="Email Address" name="email" type="email" placeholder="guest@domain.com" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">Side</label>
              <select name="side" className="w-full h-10 rounded-lg border border-slate-300 px-2 text-xs bg-white">
                <option value="bride">Bride Side</option>
                <option value="groom">Groom Side</option>
                <option value="mutual">Mutual</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">Category</label>
              <select name="category" className="w-full h-10 rounded-lg border border-slate-300 px-2 text-xs bg-white">
                <option value="family">Family</option>
                <option value="close_friend">Close Friend</option>
                <option value="colleague">Colleague</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">Diet</label>
              <select name="dietaryPref" className="w-full h-10 rounded-lg border border-slate-300 px-2 text-xs bg-white">
                <option value="veg">Vegetarian</option>
                <option value="jain">Jain (No Root Veg)</option>
                <option value="non_veg">Non-Veg</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="vipCheck" name="isVip" className="rounded text-gold-600" />
            <label htmlFor="vipCheck" className="text-xs font-semibold text-navy-900">Mark as VIP Guest</label>
          </div>
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">Selective Function Invites</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {functions.map((fn) => (
                <label key={fn.id} className="flex items-center gap-1.5 text-slate-700">
                  <input type="checkbox" name="invitedEventIds" value={fn.id} defaultChecked className="rounded text-gold-600" />
                  <span className="truncate">{fn.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Guest"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
