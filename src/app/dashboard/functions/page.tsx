"use client";

import * as React from "react";
import { Plus, Clock, MapPin, Trash2, CalendarHeart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MOCK_FUNCTIONS, MOCK_WEDDINGS } from "@/lib/mock-data";
import { WeddingFunction } from "@/types/models";
import { formatDate, formatTime } from "@/lib/utils";
import { createEventAction, deleteEventAction } from "@/lib/actions/events";
import { ShaadiStorage } from "@/lib/shaadi-storage";

export default function FunctionsPage() {
  const [functions, setFunctions] = React.useState<WeddingFunction[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFunctions(ShaadiStorage.getFunctions());
  }, []);

  const activeWedding = MOCK_WEDDINGS[0];

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("weddingId", activeWedding.id);

    try {
      const result = await createEventAction(formData);
      if (!result.success) {
        setError(result.error || "Failed to create ceremony");
      } else {
        const newFn: WeddingFunction = {
          id: (result.data as { id?: string })?.id || "fn-" + Date.now(),
          weddingId: activeWedding.id,
          name: formData.get("name") as string,
          eventType: formData.get("eventType") as WeddingFunction["eventType"],
          startTime: formData.get("startTime") as string,
          endTime: formData.get("endTime") as string,
          venueName: (formData.get("venueName") as string) || "Main Banquet Pavilion",
          venueAddress: "Palace Lawns",
          googleMapsUrl: "https://maps.google.com",
          guestCapacity: Number(formData.get("guestCapacity")),
          dressCode: (formData.get("dressCode") as string) || undefined,
          description: (formData.get("description") as string) || undefined,
          totalInvited: 0,
          confirmedRsvp: 0,
          declinedRsvp: 0,
          pendingRsvp: 0,
        };
        const updated = [...functions, newFn];
        setFunctions(updated);
        ShaadiStorage.saveFunctions(updated);
        setIsModalOpen(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating function");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this ceremony?")) return;
    await deleteEventAction(id);
    const updated = functions.filter((f) => f.id !== id);
    setFunctions(updated);
    ShaadiStorage.saveFunctions(updated);
  }

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
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="gap-2 shadow-subtle"
        >
          <Plus className="h-4 w-4" />
          Add New Function
        </Button>
      </div>

      {/* Function Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {functions.map((fn) => (
          <Card key={fn.id} className="border-slate-200/90 shadow-card hover:border-gold-400 transition-all flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="gold" className="uppercase text-[10px]">
                  {fn.eventType}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Cap: {fn.guestCapacity}
                  </span>
                  <button
                    onClick={() => handleDelete(fn.id)}
                    className="text-slate-400 hover:text-terracotta-600 p-1 rounded"
                    title="Delete ceremony"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
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

      {/* Add Function Dialog */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Wedding Ceremony"
        description="Create an event with custom timing, venue capacity, and dress code."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          <Input label="Ceremony Name" name="name" placeholder="e.g. Sangeet Night" required />
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy-700">Ceremony Type</label>
            <select name="eventType" className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm bg-white">
              <option value="sangeet">Sangeet</option>
              <option value="mehendi">Mehendi</option>
              <option value="haldi">Haldi</option>
              <option value="ceremony">Wedding Ceremony (Pheras)</option>
              <option value="reception">Reception</option>
              <option value="roka">Roka</option>
              <option value="custom">Custom Ritual</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Time (ISO)" name="startTime" defaultValue="2026-11-21T18:00:00.000Z" required />
            <Input label="End Time (ISO)" name="endTime" defaultValue="2026-11-21T23:00:00.000Z" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Capacity Limit" name="guestCapacity" type="number" defaultValue="250" required />
            <Input label="Dress Code" name="dressCode" placeholder="e.g. Traditional Silk" />
          </div>
          <Input label="Description / Notes" name="description" placeholder="Ceremony details, rituals..." />

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Ceremony"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
