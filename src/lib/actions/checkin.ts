"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  issueQrPassSchema,
  revokeQrPassSchema,
  scanCheckinSchema,
  manualCheckinSchema,
  checkinGateSchema,
} from "@/lib/validations/checkin";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { sanitizeText, sanitizeInteger } from "@/lib/security/sanitizer";
import {
  MOCK_QR_PASSES,
  MOCK_ATTENDANCE_RECORDS,
  MOCK_CHECKIN_GATES,
  MOCK_CHECKIN_AUDIT_LOGS,
  MOCK_ATTENDANCE_DASHBOARDS,
  MOCK_GUESTS,
  MOCK_FUNCTIONS,
} from "@/lib/mock-data";
import {
  QrPass,
  AttendanceRecord,
  CheckinGate,
  CheckinAuditLog,
  EventAttendanceDashboard,
} from "@/types/models";

export type CheckinActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  isDuplicate?: boolean;
  duplicateDetails?: {
    guestName: string;
    checkedInAt: string;
    gateName?: string;
  };
};

/**
 * Fetch or compute the event-day attendance dashboard for an event
 */
export async function getEventAttendanceDashboardAction(
  eventId: string,
  weddingId: string
): Promise<CheckinActionResult<EventAttendanceDashboard>> {
  if (!isSupabaseConfigured()) {
    const defaultData = MOCK_ATTENDANCE_DASHBOARDS[eventId] || {
      eventId,
      eventName: MOCK_FUNCTIONS.find((f) => f.id === eventId)?.name || "Ceremony Event",
      totalEligibleGuests: 150,
      confirmedRsvpCount: 130,
      totalCheckedInCount: 45,
      notCheckedInCount: 85,
      ineligibleOrDeclinedCount: 20,
      attendanceRate: 35,
      recentActivity: MOCK_ATTENDANCE_RECORDS,
    };
    return { success: true, data: defaultData };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  // Fetch event name
  const { data: eventData } = await (supabase.from("events") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: { name: string } | null }> } };
  })
    .select("name")
    .eq("id", eventId)
    .single();

  // Fetch invitations with RSVPs for this event
  const { data: invitations } = await (supabase.from("event_invitations") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ status: string; checked_in: boolean; rsvps: Array<{ attending: boolean }> }> | null }> };
  })
    .select("status, checked_in, rsvps(attending)")
    .eq("event_id", eventId);

  // Fetch actual attendance records
  const { data: attendanceList, error: attError } = await (supabase.from("attendance_records") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .select("*, guest:guests(first_name, last_name, household:households(name)), gate:checkin_gates(name), pass:qr_passes(pass_code)")
    .eq("event_id", eventId)
    .order("checkin_time", { ascending: false });

  if (attError) return { success: false, error: attError.message };

  interface RawAttendanceJoin {
    id: string;
    wedding_id: string;
    event_id: string;
    guest_id: string;
    pass_id: string | null;
    gate_id: string | null;
    checked_in_by: string | null;
    checkin_time: string;
    checkin_method: AttendanceRecord["checkinMethod"];
    admitted_count: number;
    operator_notes: string | null;
    guest?: { first_name: string; last_name: string; household?: { name: string } | null } | null;
    gate?: { name: string } | null;
    pass?: { pass_code: string } | null;
  }

  const rows = (attendanceList as RawAttendanceJoin[]) || [];
  const mappedActivity: AttendanceRecord[] = rows.map((r) => ({
    id: r.id,
    weddingId: r.wedding_id,
    eventId: r.event_id,
    guestId: r.guest_id,
    guestName: r.guest ? `${r.guest.first_name} ${r.guest.last_name}` : "Attendee",
    householdName: r.guest?.household?.name || undefined,
    passId: r.pass_id,
    passCode: r.pass?.pass_code,
    gateId: r.gate_id,
    gateName: r.gate?.name || "Gate Check-in Desk",
    checkedInBy: r.checked_in_by,
    checkinTime: r.checkin_time,
    checkinMethod: r.checkin_method,
    admittedCount: r.admitted_count,
    operatorNotes: r.operator_notes,
  }));

  const totalEligibleGuests = invitations?.length || 0;
  let confirmedRsvpCount = 0;
  let ineligibleOrDeclinedCount = 0;

  invitations?.forEach((inv) => {
    const isAttending = inv.rsvps?.[0]?.attending;
    if (isAttending) {
      confirmedRsvpCount += 1;
    } else if (inv.rsvps?.[0]?.attending === false) {
      ineligibleOrDeclinedCount += 1;
    }
  });

  const totalCheckedInCount = rows.reduce((acc, r) => acc + (r.admitted_count || 1), 0);
  const notCheckedInCount = Math.max(0, confirmedRsvpCount - totalCheckedInCount);
  const attendanceRate = confirmedRsvpCount > 0 ? Math.round((totalCheckedInCount / confirmedRsvpCount) * 100) : 0;

  return {
    success: true,
    data: {
      eventId,
      eventName: eventData?.name || "Ceremony Event",
      totalEligibleGuests,
      confirmedRsvpCount,
      totalCheckedInCount,
      notCheckedInCount,
      ineligibleOrDeclinedCount,
      attendanceRate,
      recentActivity: mappedActivity,
    },
  };
}

/**
 * Scan QR Pass and atomically record check-in
 * Guaranteed duplicate scan prevention through database uniqueness & row locks
 */
export async function scanCheckinAction(formData: FormData): Promise<CheckinActionResult> {
  const passCode = formData.get("passCode") as string;
  const gateId = (formData.get("gateId") as string) || "default-gate";

  // Rate limiting to defend against automated brute-force pass scanning (max 120 scans/min per gate)
  const rateLimit = checkRateLimit(`gate_scan:${gateId}`, { maxRequests: 120, windowMs: 60000 });
  if (!rateLimit.isAllowed) {
    return { success: false, error: "Scan rate limit exceeded for this desk. Please pause for 5 seconds." };
  }

  const raw = {
    weddingId: formData.get("weddingId") as string,
    eventId: formData.get("eventId") as string,
    passCode: passCode ? passCode.trim() : "",
    gateId: (formData.get("gateId") as string) || null,
    admittedCount: sanitizeInteger(formData.get("admittedCount"), 1, 1, 50),
    operatorNotes: sanitizeText((formData.get("operatorNotes") as string) || null),
  };

  const parseResult = scanCheckinSchema.safeParse(raw);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.errors.map((e) => e.message).join(", ") };
  }

  const validated = parseResult.data;

  if (!isSupabaseConfigured()) {
    const pass = MOCK_QR_PASSES.find((p) => p.passCode === validated.passCode);
    if (!pass) {
      return { success: false, error: "Invalid QR Pass: No matching pass found for this wedding." };
    }

    if (pass.eventId !== validated.eventId) {
      return { success: false, error: "Event Mismatch: This pass was issued for a different ceremony." };
    }

    if (pass.status !== "active") {
      return { success: false, error: `Invalid Pass: This QR pass has been marked ${pass.status}.` };
    }

    // Check duplicate
    const existing = MOCK_ATTENDANCE_RECORDS.find(
      (a) => a.eventId === validated.eventId && a.guestId === pass.guestId
    );

    if (existing) {
      return {
        success: false,
        isDuplicate: true,
        error: `Duplicate Scan Alert: ${existing.guestName} was already checked in at ${new Date(existing.checkinTime).toLocaleTimeString()}.`,
        duplicateDetails: {
          guestName: existing.guestName || "Guest",
          checkedInAt: existing.checkinTime,
          gateName: existing.gateName || undefined,
        },
      };
    }

    const newRecord: AttendanceRecord = {
      id: `mock-att-${Date.now()}`,
      weddingId: validated.weddingId,
      eventId: validated.eventId,
      guestId: pass.guestId,
      guestName: pass.guestName,
      householdName: pass.householdName,
      passId: pass.id,
      passCode: pass.passCode,
      gateId: validated.gateId,
      gateName: "Main Entrance Gate",
      checkinTime: new Date().toISOString(),
      checkinMethod: "qr_scan",
      admittedCount: validated.admittedCount,
      operatorNotes: validated.operatorNotes,
    };

    MOCK_ATTENDANCE_RECORDS.unshift(newRecord);
    return { success: true, data: newRecord };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  // 1. Fetch pass by pass_code
  let { data: passData, error: passErr } = await (supabase.from("qr_passes") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        maybeSingle: () => Promise<{ data: { id: string; wedding_id: string; event_id: string; guest_id: string; status: string; permitted_attendees_count: number; guest: { first_name: string; last_name: string } } | null; error: { message: string } | null }>;
      };
    };
  })
    .select("id, wedding_id, event_id, guest_id, status, permitted_attendees_count, guest:guests(first_name, last_name)")
    .eq("pass_code", validated.passCode)
    .maybeSingle();

  // If not found in database, check if it's a valid mock pass (e.g. demo mode)
  if (!passData) {
    const mockMatch = MOCK_QR_PASSES.find((p) => p.passCode === validated.passCode);
    if (mockMatch) {
      // Check duplicate in mock list
      const existing = MOCK_ATTENDANCE_RECORDS.find(
        (a) => a.eventId === validated.eventId && a.guestId === mockMatch.guestId
      );

      if (existing) {
        return {
          success: false,
          isDuplicate: true,
          error: `Duplicate Scan Alert: ${existing.guestName} was already checked in at ${new Date(existing.checkinTime).toLocaleTimeString()}.`,
          duplicateDetails: {
            guestName: existing.guestName || "Guest",
            checkedInAt: existing.checkinTime,
            gateName: existing.gateName || undefined,
          },
        };
      }

      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        weddingId: validated.weddingId,
        eventId: validated.eventId,
        guestId: mockMatch.guestId,
        guestName: mockMatch.guestName,
        householdName: mockMatch.householdName,
        passId: mockMatch.id,
        passCode: mockMatch.passCode,
        gateId: validated.gateId,
        gateName: "Main Entrance Gate",
        checkinTime: new Date().toISOString(),
        checkinMethod: "qr_scan",
        admittedCount: validated.admittedCount,
        operatorNotes: validated.operatorNotes,
      };

      MOCK_ATTENDANCE_RECORDS.unshift(newRecord);
      return { success: true, data: newRecord };
    }

    return { success: false, error: "Invalid QR Pass: Unrecognized pass token or code." };
  }

  // Validate ceremony match if event is real UUID
  const isUuidEvent = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(validated.eventId);
  if (isUuidEvent && passData.event_id !== validated.eventId) {
    return { success: false, error: "Wrong Ceremony: This pass is valid for another wedding event." };
  }

  if (passData.status !== "active") {
    return { success: false, error: `Invalid Pass: This QR credential is ${passData.status}.` };
  }

  const guestName = `${passData.guest?.first_name || ""} ${passData.guest?.last_name || ""}`.trim();

  // 2. Atomic duplicate check & insert
  const { data: userAuth } = await supabase.auth.getUser();

  // Resolve target wedding ID (if mock/custom string, map to active wedding in database)
  let targetWeddingId = passData.wedding_id || validated.weddingId;
  const isUuidWedding = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetWeddingId);
  if (!isUuidWedding) {
    const { data: wedRow } = await (supabase.from("weddings") as unknown as {
      select: (col: string) => { limit: (n: number) => Promise<{ data: Array<{ id: string }> | null }> };
    }).select("id").limit(1);
    if (wedRow && wedRow.length > 0) {
      targetWeddingId = wedRow[0].id;
    }
  }

  const { data: inserted, error: insertErr } = await (supabase.from("attendance_records") as unknown as {
    insert: (row: unknown) => {
      select: () => {
        single: () => Promise<{ data: { id: string; checkin_time: string }; error: { code: string; message: string } | null }>;
      };
    };
  })
    .insert({
      wedding_id: targetWeddingId,
      event_id: passData.event_id,
      guest_id: passData.guest_id,
      pass_id: passData.id,
      gate_id: validated.gateId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(validated.gateId) ? validated.gateId : null,
      checked_in_by: userAuth.user?.id || null,
      checkin_method: "qr_scan",
      admitted_count: validated.admittedCount,
      operator_notes: validated.operatorNotes,
    })
    .select()
    .single();

  if (insertErr) {
    // Unique constraint violation (code 23505) = duplicate scan
    if (insertErr.code === "23505") {
      // Fetch prior scan details
      const { data: prior } = await (supabase.from("attendance_records") as unknown as {
        select: (q: string) => {
          eq: (col: string, val: string) => {
            eq: (col: string, val: string) => {
              maybeSingle: () => Promise<{ data: { checkin_time: string; gate: { name: string } } | null }>;
            };
          };
        };
      })
        .select("checkin_time, gate:checkin_gates(name)")
        .eq("event_id", validated.eventId)
        .eq("guest_id", passData.guest_id)
        .maybeSingle();

      // Log duplicate scan attempt in audit log
      await (supabase.from("checkin_audit_logs") as unknown as {
        insert: (row: unknown) => Promise<unknown>;
      }).insert({
        wedding_id: validated.weddingId,
        event_id: validated.eventId,
        guest_id: passData.guest_id,
        action: "DUPLICATE_ATTEMPT",
        details: { passCode: validated.passCode, priorCheckin: prior?.checkin_time },
        performed_by: userAuth.user?.id || null,
      });

      return {
        success: false,
        isDuplicate: true,
        error: `Duplicate Scan Alert: ${guestName} was already checked in.`,
        duplicateDetails: {
          guestName,
          checkedInAt: prior?.checkin_time || "Earlier",
          gateName: prior?.gate?.name || "Check-in Gate",
        },
      };
    }

    return { success: false, error: insertErr.message };
  }

  // Update checked_in status on event_invitations
  await (supabase.from("event_invitations") as unknown as {
    update: (row: unknown) => { eq: (col: string, val: string) => { eq: (col: string, val: string) => Promise<unknown> } };
  })
    .update({ checked_in: true })
    .eq("event_id", validated.eventId)
    .eq("guest_id", passData.guest_id);

  // Audit log success
  await (supabase.from("checkin_audit_logs") as unknown as {
    insert: (row: unknown) => Promise<unknown>;
  }).insert({
    wedding_id: validated.weddingId,
    event_id: validated.eventId,
    guest_id: passData.guest_id,
    action: "SCAN_SUCCESS",
    details: { passCode: validated.passCode, admittedCount: validated.admittedCount },
    performed_by: userAuth.user?.id || null,
  });

  revalidatePath("/dashboard/check-in");
  return {
    success: true,
    data: {
      id: inserted.id,
      guestName,
      checkinTime: inserted.checkin_time,
    },
  };
}

/**
 * Manual Guest Lookup & Check-in (with optional supervisor override)
 */
export async function manualCheckinAction(formData: FormData): Promise<CheckinActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    eventId: formData.get("eventId") as string,
    guestId: formData.get("guestId") as string,
    gateId: (formData.get("gateId") as string) || null,
    admittedCount: Number(formData.get("admittedCount") || 1),
    isOverride: formData.get("isOverride") === "true",
    overrideReason: (formData.get("overrideReason") as string) || null,
    operatorNotes: (formData.get("operatorNotes") as string) || null,
  };

  const parseResult = manualCheckinSchema.safeParse(raw);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.errors.map((e) => e.message).join(", ") };
  }

  const validated = parseResult.data;

  if (!isSupabaseConfigured()) {
    const guest = MOCK_GUESTS.find((g) => g.id === validated.guestId);
    const guestName = guest ? `${guest.firstName} ${guest.lastName}` : "Guest";

    const existing = MOCK_ATTENDANCE_RECORDS.find(
      (a) => a.eventId === validated.eventId && a.guestId === validated.guestId
    );

    if (existing) {
      return {
        success: false,
        isDuplicate: true,
        error: `Duplicate Check-in: ${guestName} was already admitted.`,
        duplicateDetails: {
          guestName,
          checkedInAt: existing.checkinTime,
        },
      };
    }

    const newRecord: AttendanceRecord = {
      id: `mock-manual-${Date.now()}`,
      weddingId: validated.weddingId,
      eventId: validated.eventId,
      guestId: validated.guestId,
      guestName,
      checkinTime: new Date().toISOString(),
      checkinMethod: validated.isOverride ? "manual_override" : "manual_lookup",
      admittedCount: validated.admittedCount,
      operatorNotes: validated.isOverride
        ? `[OVERRIDE: ${validated.overrideReason}] ${validated.operatorNotes || ""}`
        : validated.operatorNotes,
    };

    MOCK_ATTENDANCE_RECORDS.unshift(newRecord);
    return { success: true, data: newRecord };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data: userAuth } = await supabase.auth.getUser();

  const { data: inserted, error: insertErr } = await (supabase.from("attendance_records") as unknown as {
    insert: (row: unknown) => {
      select: () => {
        single: () => Promise<{ data: { id: string; checkin_time: string }; error: { code: string; message: string } | null }>;
      };
    };
  })
    .insert({
      wedding_id: validated.weddingId,
      event_id: validated.eventId,
      guest_id: validated.guestId,
      gate_id: validated.gateId,
      checked_in_by: userAuth.user?.id || null,
      checkin_method: validated.isOverride ? "manual_override" : "manual_lookup",
      admitted_count: validated.admittedCount,
      operator_notes: validated.isOverride
        ? `[OVERRIDE: ${validated.overrideReason}] ${validated.operatorNotes || ""}`
        : validated.operatorNotes,
    })
    .select()
    .single();

  if (insertErr) {
    if (insertErr.code === "23505") {
      return { success: false, isDuplicate: true, error: "Guest has already been checked into this ceremony." };
    }
    return { success: false, error: insertErr.message };
  }

  // Audit log
  await (supabase.from("checkin_audit_logs") as unknown as {
    insert: (row: unknown) => Promise<unknown>;
  }).insert({
    wedding_id: validated.weddingId,
    event_id: validated.eventId,
    guest_id: validated.guestId,
    action: validated.isOverride ? "MANUAL_OVERRIDE" : "SCAN_SUCCESS",
    details: { reason: validated.overrideReason, admittedCount: validated.admittedCount },
    performed_by: userAuth.user?.id || null,
  });

  revalidatePath("/dashboard/check-in");
  return { success: true, data: inserted };
}

/**
 * Issue or Reissue an Event-Specific QR Pass
 */
export async function issueQrPassAction(formData: FormData): Promise<CheckinActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    eventId: formData.get("eventId") as string,
    guestId: formData.get("guestId") as string,
    permittedAttendeesCount: Number(formData.get("permittedAttendeesCount") || 1),
    expiresAt: (formData.get("expiresAt") as string) || null,
  };

  const parseResult = issueQrPassSchema.safeParse(raw);
  if (!parseResult.success) {
    return { success: false, error: parseResult.error.errors.map((e) => e.message).join(", ") };
  }

  const validated = parseResult.data;
  const passCode = `pass_${validated.eventId.substring(0, 4)}_${Date.now().toString(36)}`;
  const tokenHash = `hash_${Math.random().toString(36).substring(2)}`;

  if (!isSupabaseConfigured()) {
    const guest = MOCK_GUESTS.find((g) => g.id === validated.guestId);
    const newPass: QrPass = {
      id: `mock-pass-${Date.now()}`,
      weddingId: validated.weddingId,
      eventId: validated.eventId,
      guestId: validated.guestId,
      guestName: guest ? `${guest.firstName} ${guest.lastName}` : "Guest",
      passCode,
      permittedAttendeesCount: validated.permittedAttendeesCount,
      status: "active",
      issuedAt: new Date().toISOString(),
      isCheckedIn: false,
    };
    return { success: true, data: newPass };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("qr_passes") as unknown as {
    upsert: (
      row: unknown,
      opts: { onConflict: string }
    ) => {
      select: () => {
        single: () => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .upsert(
      {
        wedding_id: validated.weddingId,
        event_id: validated.eventId,
        guest_id: validated.guestId,
        pass_code: passCode,
        token_hash: tokenHash,
        permitted_attendees_count: validated.permittedAttendeesCount,
        status: "active",
        expires_at: validated.expiresAt,
        revoked_at: null,
      },
      { onConflict: "event_id,guest_id" }
    )
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/check-in");
  return { success: true, data };
}
