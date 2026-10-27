"use server";

import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { submitRsvpFormSchema, type SubmitRsvpForm } from "@/lib/validations/rsvp";
import { MOCK_GUESTS, MOCK_FUNCTIONS, MOCK_WEDDINGS } from "@/lib/mock-data";

export interface PublicInvitationData {
  isValid: boolean;
  error?: string;
  guest?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    dietaryPreference: string;
    isVip: boolean;
    side: string;
  };
  householdMembers?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    ageGroup: string;
  }>;
  wedding?: {
    title: string;
    coupleBrideName: string;
    coupleGroomName: string;
    startDate: string;
    endDate: string;
    primaryCity: string;
  };
  events?: Array<{
    id: string;
    invitationId: string;
    name: string;
    eventType: string;
    startTime: string;
    endTime: string;
    venueName: string;
    venueAddress: string;
    dressCode?: string | null;
    status: "invited" | "attending" | "declined" | "tentative";
    passCode?: string | null;
  }>;
}

/**
 * Fetch guest invitation details by token with minimal public disclosure.
 */
export async function getInvitationByTokenAction(token: string): Promise<PublicInvitationData> {
  if (!token || token.trim().length < 5) {
    return { isValid: false, error: "Invalid invitation token." };
  }

  if (!isSupabaseConfigured()) {
    // Fictional dev fallback matching MOCK_GUESTS
    const mockGuest = MOCK_GUESTS.find((g) => g.invitationToken === token) || MOCK_GUESTS[0];
    const mockWedding = MOCK_WEDDINGS[0];
    const invitedEvents = MOCK_FUNCTIONS.filter((f) => mockGuest.invitedFunctionIds.includes(f.id));

    return {
      isValid: true,
      guest: {
        id: mockGuest.id,
        firstName: mockGuest.firstName,
        lastName: mockGuest.lastName,
        phone: mockGuest.phone,
        dietaryPreference: mockGuest.dietaryPreference,
        isVip: mockGuest.isVip,
        side: mockGuest.side,
      },
      wedding: {
        title: mockWedding.title,
        coupleBrideName: mockWedding.coupleBrideName,
        coupleGroomName: mockWedding.coupleGroomName,
        startDate: mockWedding.startDate,
        endDate: mockWedding.endDate,
        primaryCity: mockWedding.primaryCity,
      },
      events: invitedEvents.map((e) => ({
        id: e.id,
        invitationId: "mock-inv-" + e.id,
        name: e.name,
        eventType: e.eventType,
        startTime: e.startTime,
        endTime: e.endTime,
        venueName: e.venueName,
        venueAddress: e.venueAddress,
        dressCode: e.dressCode,
        status: "invited",
      })),
    };
  }

  // Use Admin Client if available to bypass RLS for token lookup, or fall back to Server Client
  const adminSupabase = createAdminClient();
  const userSupabase = await createServerSupabaseClient();
  const supabase = (adminSupabase || userSupabase) as any;
  if (!supabase) return { isValid: false, error: "Database client unavailable." };

  // 1. Fetch guest record with unrevoked token check
  const { data: guestData, error: guestError } = await (supabase.from("guests") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: any; error: any }> } };
  })
    .select("id, wedding_id, household_id, first_name, last_name, phone, dietary_pref, is_vip, side, token_revoked, token_expires_at, wedding:weddings(title, couple_bride_name, couple_groom_name, start_date, end_date, primary_city)")
    .eq("invitation_token", token)
    .single();

  if (guestError || !guestData) {
    // If not found in database, check mock guests for demo/preview tokens
    const mockGuest = MOCK_GUESTS.find((g) => g.invitationToken === token);
    if (mockGuest) {
      const mockWedding = MOCK_WEDDINGS[0];
      const invitedEvents = MOCK_FUNCTIONS.filter((f) => mockGuest.invitedFunctionIds.includes(f.id));
      return {
        isValid: true,
        guest: {
          id: mockGuest.id,
          firstName: mockGuest.firstName,
          lastName: mockGuest.lastName,
          phone: mockGuest.phone,
          dietaryPreference: mockGuest.dietaryPreference,
          isVip: mockGuest.isVip,
          side: mockGuest.side,
        },
        wedding: {
          title: mockWedding.title,
          coupleBrideName: mockWedding.coupleBrideName,
          coupleGroomName: mockWedding.coupleGroomName,
          startDate: mockWedding.startDate,
          endDate: mockWedding.endDate,
          primaryCity: mockWedding.primaryCity,
        },
        events: invitedEvents.map((e) => ({
          id: e.id,
          invitationId: "mock-inv-" + e.id,
          name: e.name,
          eventType: e.eventType,
          startTime: e.startTime,
          endTime: e.endTime,
          venueName: e.venueName,
          venueAddress: e.venueAddress,
          dressCode: e.dressCode,
          status: "invited",
        })),
      };
    }
    return { isValid: false, error: "Invitation not found or link has expired." };
  }

  if (guestData.token_revoked) {
    return { isValid: false, error: "This invitation link has been revoked by the organiser." };
  }

  if (guestData.token_expires_at && new Date(guestData.token_expires_at) < new Date()) {
    return { isValid: false, error: "This invitation link has expired." };
  }

  // 2. Fetch specific invited functions and active QR passes
  const { data: invitations } = await (supabase.from("event_invitations") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: any; error: any }> };
  })
    .select("id, status, event:events(id, name, event_type, start_time, end_time, venues(name, address), dress_code)")
    .eq("guest_id", guestData.id);

  const { data: qrPasses } = await (supabase.from("qr_passes") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: any; error: any }> };
  })
    .select("event_id, pass_code, status")
    .eq("guest_id", guestData.id);

  const passMap = new Map((qrPasses || []).map((p: any) => [p.event_id, p.pass_code]));

  const events = (invitations || []).map((inv: any) => ({
    id: inv.event.id,
    invitationId: inv.id,
    name: inv.event.name,
    eventType: inv.event.event_type,
    startTime: inv.event.start_time,
    endTime: inv.event.end_time,
    venueName: inv.event.venues?.name || "Main Venue",
    venueAddress: inv.event.venues?.address || "",
    dressCode: inv.event.dress_code,
    status: inv.status,
    passCode: passMap.get(inv.event.id) || null,
  }));

  return {
    isValid: true,
    guest: {
      id: guestData.id,
      firstName: guestData.first_name,
      lastName: guestData.last_name,
      phone: guestData.phone,
      dietaryPreference: guestData.dietary_pref,
      isVip: guestData.is_vip,
      side: guestData.side,
    },
    wedding: {
      title: guestData.wedding.title,
      coupleBrideName: guestData.wedding.couple_bride_name,
      coupleGroomName: guestData.wedding.couple_groom_name,
      startDate: guestData.wedding.start_date,
      endDate: guestData.wedding.end_date,
      primaryCity: guestData.wedding.primary_city,
    },
    events,
  };
}

/**
 * Submit or update RSVP responses idempotently with accompanying headcount and dietary notes.
 */
export async function submitRsvpAction(payload: SubmitRsvpForm): Promise<{ success: boolean; error?: string }> {
  const validation = submitRsvpFormSchema.safeParse(payload);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const { data: valid } = validation;

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  // Check if mock token submission
  if (valid.token.startsWith("tok_aarav_diya_") || valid.token.startsWith("tok_mock_")) {
    return { success: true };
  }

  const adminSupabase = createAdminClient();
  const userSupabase = await createServerSupabaseClient();
  const supabase = (adminSupabase || userSupabase) as any;
  if (!supabase) return { success: false, error: "Database client unavailable." };

  for (const resp of valid.responses) {
    const isAttending = resp.status === "attending";

    // Update or insert rsvps row idempotently
    const { error: rsvpError } = await (supabase.from("rsvps") as unknown as {
      upsert: (values: any, opts: any) => Promise<{ error: any }>;
    }).upsert(
      {
        event_invitation_id: resp.eventInvitationId,
        attending: isAttending,
        adult_count: isAttending ? Math.max(1, resp.adultCount) : 0,
        child_count: isAttending ? resp.childCount : 0,
        dietary_pref: resp.dietaryPref,
        dietary_notes: resp.dietaryNotes || null,
        accompanying_names: resp.accompanyingNames || null,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: "event_invitation_id" }
    );

    if (rsvpError) {
      return { success: false, error: "Failed to record RSVP: " + rsvpError.message };
    }

    // Update event_invitations status
    await (supabase.from("event_invitations") as unknown as {
      update: (vals: any) => { eq: (col: string, val: string) => Promise<{ error: any }> };
    })
      .update({
        status: resp.status,
        responded_at: new Date().toISOString(),
      })
      .eq("id", resp.eventInvitationId);

    // If guest confirmed attending, auto-issue/update high-entropy QR pass for this ceremony
    if (isAttending) {
      try {
        const { data: invRow } = await (supabase.from("event_invitations") as unknown as {
          select: (q: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: { event_id: string; guest_id: string; wedding_id?: string } | null }> } };
        })
          .select("event_id, guest_id")
          .eq("id", resp.eventInvitationId)
          .single();

        if (invRow) {
          const passCode = `pass_${crypto.randomBytes(4).toString("hex")}`;
          const tokenHash = crypto.createHash("sha256").update(passCode).digest("hex");
          const permittedCount = (resp.adultCount || 1) + (resp.childCount || 0);

          // Get wedding_id from guest
          const { data: guestRow } = await (supabase.from("guests") as unknown as {
            select: (q: string) => { eq: (c: string, v: string) => { single: () => Promise<{ data: { wedding_id: string } | null }> } };
          })
            .select("wedding_id")
            .eq("id", invRow.guest_id)
            .single();

          if (guestRow) {
            await (supabase.from("qr_passes") as unknown as {
              upsert: (vals: any, opts: any) => Promise<{ error: any }>;
            }).upsert(
              {
                wedding_id: guestRow.wedding_id,
                event_id: invRow.event_id,
                guest_id: invRow.guest_id,
                event_invitation_id: resp.eventInvitationId,
                pass_code: passCode,
                token_hash: tokenHash,
                permitted_attendees_count: permittedCount,
                status: "active",
              },
              { onConflict: "event_id,guest_id" }
            );
          }
        }
      } catch (err) {
        console.error("QR pass auto-generation error:", err);
      }
    }
  }

  revalidatePath(`/invite/${valid.token}`);
  revalidatePath("/dashboard/catering");
  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Revoke or regenerate high-entropy invitation token (Organiser action)
 */
export async function regenerateGuestTokenAction(guestId: string): Promise<{ success: boolean; newToken?: string; error?: string }> {
  const newToken = "tok_" + crypto.randomBytes(8).toString("hex");

  if (!isSupabaseConfigured()) {
    return { success: true, newToken };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { error } = await (supabase.from("guests") as unknown as {
    update: (vals: any) => { eq: (col: string, val: string) => Promise<{ error: any }> };
  })
    .update({
      invitation_token: newToken,
      token_revoked: false,
    })
    .eq("id", guestId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/guests");
  return { success: true, newToken };
}
