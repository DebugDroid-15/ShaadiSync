"use server";

import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { guestSchema, householdSchema, type CsvGuestRow } from "@/lib/validations/events-guests";
import { sanitizeText, sanitizePhoneNumber } from "@/lib/security/sanitizer";
import { MOCK_GUESTS } from "@/lib/mock-data";

export type GuestActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Fetch guests for a wedding, including household and invited function IDs
 */
export async function getGuestsAction(weddingId: string): Promise<GuestActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: true, data: MOCK_GUESTS };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("guests") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => { order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }> } };
  })
    .select("*, household:households(family_name, primary_contact_name), event_invitations(event_id, status)")
    .eq("wedding_id", weddingId)
    .order("first_name", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/**
 * Create or update a single guest record with selective per-function invitations
 */
export async function createGuestAction(formData: FormData): Promise<GuestActionResult> {
  const invitedEventIdsRaw = formData.getAll("invitedEventIds") as string[];

  const raw = {
    weddingId: formData.get("weddingId") as string,
    householdId: (formData.get("householdId") as string) || null,
    firstName: sanitizeText(formData.get("firstName") as string),
    lastName: sanitizeText(formData.get("lastName") as string),
    side: (formData.get("side") as string) || "mutual",
    category: (formData.get("category") as string) || "family",
    ageGroup: (formData.get("ageGroup") as string) || "adult",
    phone: sanitizePhoneNumber((formData.get("phone") as string) || null),
    email: (formData.get("email") as string)?.trim().toLowerCase() || null,
    dietaryPref: (formData.get("dietaryPref") as string) || "veg",
    allergiesNotes: sanitizeText((formData.get("allergiesNotes") as string) || null),
    isVip: formData.get("isVip") === "true" || formData.get("isVip") === "on",
    invitedEventIds: invitedEventIdsRaw.filter((id) => id.length > 0),
  };

  const validation = guestSchema.safeParse(raw);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const { data: valid } = validation;
  const invitationToken = "tok_" + crypto.randomBytes(8).toString("hex");

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: {
        id: "mock-gst-" + Date.now(),
        ...valid,
        invitationToken,
        invitedFunctionIds: valid.invitedEventIds,
      },
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  // Resolve target wedding ID (if mock/custom string, map to active wedding in database)
  let targetWeddingId = valid.weddingId;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetWeddingId);
  if (!isUuid) {
    const { data: wedRow } = await (supabase.from("weddings") as unknown as {
      select: (col: string) => { limit: (n: number) => Promise<{ data: Array<{ id: string }> | null }> };
    }).select("id").limit(1);
    if (wedRow && wedRow.length > 0) {
      targetWeddingId = wedRow[0].id;
    }
  }

  // 1. Insert guest
  const { data: guestData, error: guestError } = await (supabase.from("guests") as unknown as {
    insert: (values: unknown[]) => { select: () => { single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }> } };
  })
    .insert([
      {
        wedding_id: targetWeddingId,
        household_id: valid.householdId,
        first_name: valid.firstName,
        last_name: valid.lastName,
        side: valid.side,
        category: valid.category,
        age_group: valid.ageGroup,
        phone: valid.phone,
        email: valid.email,
        dietary_pref: valid.dietaryPref,
        allergies_notes: valid.allergiesNotes,
        is_vip: valid.isVip,
        invitation_token: invitationToken,
      },
    ])
    .select()
    .single();

  if (guestError || !guestData) {
    return { success: false, error: guestError?.message || "Failed to create guest." };
  }

  // 2. Insert function-specific invitation records
  if (valid.invitedEventIds.length > 0) {
    // Only map valid UUID event IDs to prevent foreign key errors if mock ceremony IDs were passed
    const uuidEventIds = valid.invitedEventIds.filter((id) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    );

    if (uuidEventIds.length > 0) {
      const invitations = uuidEventIds.map((eventId) => ({
        event_id: eventId,
        guest_id: guestData.id,
        status: "invited",
      }));

      await (supabase.from("event_invitations") as unknown as {
        insert: (values: unknown[]) => Promise<{ error: unknown }>;
      }).insert(invitations);
    }
  }

  revalidatePath("/dashboard/guests");
  revalidatePath("/dashboard");
  return { success: true, data: guestData };
}

/**
 * Bulk import verified CSV guest records
 */
export async function bulkImportGuestsAction(
  weddingId: string,
  guestRows: CsvGuestRow[],
  targetEventIds: string[] = []
): Promise<GuestActionResult<{ insertedCount: number }>> {
  if (!weddingId) return { success: false, error: "Wedding ID is required." };
  if (guestRows.length === 0) return { success: false, error: "No guest rows to import." };

  if (!isSupabaseConfigured()) {
    return { success: true, data: { insertedCount: guestRows.length } };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  // Prepare records with high-entropy randomized invitation tokens
  const records = guestRows.map((g) => ({
    wedding_id: weddingId,
    first_name: g.firstName,
    last_name: g.lastName,
    phone: g.phone || null,
    email: g.email || null,
    side: g.side,
    category: g.category,
    age_group: g.ageGroup,
    dietary_pref: g.dietaryPref,
    allergies_notes: g.allergies || null,
    is_vip: g.isVip,
    invitation_token: "tok_" + crypto.randomBytes(8).toString("hex"),
  }));

  const { data: insertedGuests, error: insertError } = await (supabase.from("guests") as unknown as {
    insert: (values: unknown[]) => { select: (q: string) => Promise<{ data: Array<{ id: string }> | null; error: { message: string } | null }> };
  })
    .insert(records)
    .select("id");

  if (insertError) {
    return { success: false, error: "Bulk insert failed: " + insertError.message };
  }

  // If target events were specified, create function invitations for all imported guests
  if (targetEventIds.length > 0 && insertedGuests && insertedGuests.length > 0) {
    const invitationRows = [];
    for (const guest of insertedGuests) {
      for (const eventId of targetEventIds) {
        invitationRows.push({
          event_id: eventId,
          guest_id: guest.id,
          status: "invited",
        });
      }
    }

    if (invitationRows.length > 0) {
      await (supabase.from("event_invitations") as unknown as {
        insert: (values: unknown[]) => Promise<{ error: unknown }>;
      }).insert(invitationRows);
    }
  }

  revalidatePath("/dashboard/guests");
  revalidatePath("/dashboard");
  return { success: true, data: { insertedCount: records.length } };
}

/**
 * Delete a guest record
 */
export async function deleteGuestAction(guestId: string): Promise<GuestActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { error } = await (supabase.from("guests") as unknown as {
    delete: () => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> };
  })
    .delete()
    .eq("id", guestId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/guests");
  return { success: true };
}
