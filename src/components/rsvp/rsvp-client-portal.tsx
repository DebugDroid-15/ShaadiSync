"use client";

import * as React from "react";
import {
  CalendarHeart,
  Check,
  X,
  HelpCircle,
  MapPin,
  Clock,
  Sparkles,
  UtensilsCrossed,
  Printer,
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicInvitationData, submitRsvpAction } from "@/lib/actions/rsvp";
import { formatDate, formatTime } from "@/lib/utils";

interface RsvpClientPortalProps {
  token: string;
  initialData: PublicInvitationData;
}

export function RsvpClientPortal({ token, initialData }: RsvpClientPortalProps) {
  const { guest, wedding, events } = initialData;

  // Initialize response state for each function
  const [responses, setResponses] = React.useState<
    Record<
      string,
      {
        status: "attending" | "declined" | "tentative";
        adultCount: number;
        childCount: number;
        dietaryPref: "veg" | "jain" | "non_veg" | "vegan";
        dietaryNotes: string;
        accompanyingNames: string;
      }
    >
  >(() => {
    const map: Record<string, any> = {};
    (events || []).forEach((e) => {
      map[e.invitationId] = {
        status: (e.status as any) || "attending",
        adultCount: 1,
        childCount: 0,
        dietaryPref: (guest?.dietaryPreference as any) || "veg",
        dietaryNotes: "",
        accompanyingNames: "",
      };
    });
    return map;
  });

  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!guest || !wedding || !events) {
    return null;
  }

  const handleStatusChange = (invitationId: string, status: "attending" | "declined" | "tentative") => {
    setResponses((prev) => ({
      ...prev,
      [invitationId]: { ...prev[invitationId], status },
    }));
  };

  const handleFieldChange = (invitationId: string, field: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [invitationId]: { ...prev[invitationId], [field]: value },
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      token,
      responses: Object.entries(responses).map(([invitationId, resp]) => ({
        eventInvitationId: invitationId,
        status: resp.status,
        adultCount: resp.adultCount,
        childCount: resp.childCount,
        dietaryPref: resp.dietaryPref,
        dietaryNotes: resp.dietaryNotes || null,
        accompanyingNames: resp.accompanyingNames || null,
      })),
    };

    try {
      const res = await submitRsvpAction(payload);
      if (!res.success) {
        setError(res.error || "Failed to submit RSVP.");
      } else {
        setSubmitted(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting RSVP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-100 via-white to-ivory-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Printable Pass Strip */}
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-gold-400">
              <CalendarHeart className="h-4 w-4" />
            </div>
            <span className="font-bold text-navy-900 text-sm">Shaadi<span className="text-gold-500">Sync</span> Guest Portal</span>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold text-navy-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
          >
            <Printer className="h-3.5 w-3.5 text-gold-600" />
            Print Invitation Card
          </button>
        </div>

        {/* Celebratory Wedding Header Card */}
        <Card className="border-2 border-gold-300 shadow-elevated bg-white overflow-hidden text-center p-8 sm:p-10 relative">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-gold-400 via-gold-500 to-navy-700" />
          <Badge variant="gold" className="mb-4">Wedding Festivities</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            {wedding.coupleBrideName} & {wedding.coupleGroomName}
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-slate-600">
            {wedding.primaryCity} • Commencing {formatDate(wedding.startDate)}
          </p>

          <div className="mt-6 pt-6 border-t border-slate-100 max-w-lg mx-auto">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Cordially Invited</p>
            <h2 className="text-xl font-bold text-navy-900 mt-1">
              {guest.firstName} {guest.lastName} {guest.isVip && "• VIP"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Please let us know which ceremonies you and your family will be attending.
            </p>
          </div>
        </Card>

        {/* Success Confirmation Banner */}
        {submitted ? (
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/80 p-8 text-center space-y-3 shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-950">Dhanyavaad! RSVP Confirmed</h3>
            <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
              Your response has been recorded directly into the banquet operations registry. You can return to this link anytime if your plans change.
            </p>
            <div className="pt-3">
              <Button onClick={() => setSubmitted(false)} variant="secondary" size="sm">
                Edit Response
              </Button>
            </div>
          </div>
        ) : (
          /* RSVP Form by Ceremony */
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-navy-900">Ceremonies & Dinners ({events.length})</h3>

              {events.map((evt) => {
                const current = responses[evt.invitationId] || {
                  status: "attending",
                  adultCount: 1,
                  childCount: 0,
                  dietaryPref: "veg",
                  dietaryNotes: "",
                  accompanyingNames: "",
                };

                return (
                  <Card key={evt.id} className="border-slate-200 shadow-card bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <Badge variant="gold" className="text-[9px] uppercase font-bold mb-1">
                            {evt.eventType}
                          </Badge>
                          <CardTitle className="text-lg text-navy-900">{evt.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(evt.invitationId, "attending")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                              current.status === "attending"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                            Attending
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(evt.invitationId, "declined")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                              current.status === "declined"
                                ? "bg-terracotta-600 text-white shadow-xs"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <X className="h-3.5 w-3.5" />
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(evt.invitationId, "tentative")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                              current.status === "tentative"
                                ? "bg-amber-500 text-white shadow-xs"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <HelpCircle className="h-3.5 w-3.5" />
                            Tentative
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1 font-medium text-navy-800">
                          <Clock className="h-3.5 w-3.5 text-gold-600" />
                          {formatDate(evt.startTime)} • {formatTime(evt.startTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gold-600" />
                          {evt.venueName}
                        </span>
                        {evt.dressCode && (
                          <span className="text-slate-600">Dress: <strong>{evt.dressCode}</strong></span>
                        )}
                      </div>
                    </CardHeader>

                    {current.status !== "declined" && (
                      <CardContent className="p-4 sm:p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-navy-700 block mb-1">
                              Adult Attendees
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={current.adultCount}
                              onChange={(e) => handleFieldChange(evt.invitationId, "adultCount", Number(e.target.value))}
                              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-navy-700 block mb-1">
                              Children Attendees
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={current.childCount}
                              onChange={(e) => handleFieldChange(evt.invitationId, "childCount", Number(e.target.value))}
                              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-navy-700 block mb-1">
                              Dietary Preference
                            </label>
                            <select
                              value={current.dietaryPref}
                              onChange={(e) => handleFieldChange(evt.invitationId, "dietaryPref", e.target.value)}
                              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm bg-white"
                            >
                              <option value="veg">Vegetarian</option>
                              <option value="jain">Jain (No Root Veg)</option>
                              <option value="non_veg">Non-Vegetarian</option>
                              <option value="vegan">Vegan</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-navy-700 block mb-1">
                              Accompanying Family Names
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Meera Sharma, Aryan Sharma"
                              value={current.accompanyingNames}
                              onChange={(e) => handleFieldChange(evt.invitationId, "accompanyingNames", e.target.value)}
                              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-navy-700 block mb-1">
                              Food Allergies / Notes
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Nut allergy, diabetic meal"
                              value={current.dietaryNotes}
                              onChange={(e) => handleFieldChange(evt.invitationId, "dietaryNotes", e.target.value)}
                              className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm"
                            />
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading} size="lg" className="w-full font-bold gap-2 shadow-elevated">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting RSVP...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-gold-400" />
                    Submit Final RSVP Responses
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
