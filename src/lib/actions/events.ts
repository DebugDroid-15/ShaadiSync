"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { eventSchema } from "@/lib/validations/events-guests";
import { MOCK_FUNCTIONS } from "@/lib/mock-data";

export type EventActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Fetch all events/functions for a given wedding
 */
export async function getEventsAction(weddingId: string): Promise<EventActionResult> {
  if (!isSupabaseConfigured()) {
    const list = MOCK_FUNCTIONS.filter((f) => f.weddingId === weddingId || weddingId.startsWith("mock") || weddingId === "wed-aarav-diya");
    return { success: true, data: list.length > 0 ? list : MOCK_FUNCTIONS };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("events") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => { order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }> } };
  })
    .select("*, venue:venues(name, address, city)")
    .eq("wedding_id", weddingId)
    .order("start_time", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/**
 * Create a new wedding function/event
 */
export async function createEventAction(formData: FormData): Promise<EventActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    venueId: (formData.get("venueId") as string) || null,
    name: formData.get("name") as string,
    eventType: formData.get("eventType") as string,
    startTime: formData.get("startTime") as string,
    endTime: formData.get("endTime") as string,
    guestCapacity: Number(formData.get("guestCapacity")),
    dressCode: (formData.get("dressCode") as string) || null,
    description: (formData.get("description") as string) || null,
  };

  const validation = eventSchema.safeParse(raw);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const { data: valid } = validation;

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: {
        id: "mock-evt-" + Date.now(),
        ...valid,
        totalInvited: 0,
        confirmedRsvp: 0,
        declinedRsvp: 0,
        pendingRsvp: 0,
      },
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("events") as unknown as {
    insert: (values: unknown[]) => { select: () => { single: () => Promise<{ data: unknown; error: { message: string } | null }> } };
  })
    .insert([
      {
        wedding_id: valid.weddingId,
        venue_id: valid.venueId,
        name: valid.name,
        event_type: valid.eventType,
        start_time: valid.startTime,
        end_time: valid.endTime,
        guest_capacity: valid.guestCapacity,
        dress_code: valid.dressCode,
        description: valid.description,
      },
    ])
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/functions");
  revalidatePath("/dashboard");
  return { success: true, data };
}

/**
 * Delete a wedding ceremony/function
 */
export async function deleteEventAction(eventId: string): Promise<EventActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { error } = await (supabase.from("events") as unknown as {
    delete: () => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> };
  })
    .delete()
    .eq("id", eventId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/functions");
  return { success: true };
}
