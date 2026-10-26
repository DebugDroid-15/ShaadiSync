"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  mealPlanSchema,
  approveGuaranteeSchema,
} from "@/lib/validations/catering-vendors";
import { MOCK_CATERING_PLANS } from "@/lib/mock-data";
import { CateringPlan } from "@/types/models";

export type CateringActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type EventHeadcountSummary = {
  eventId: string;
  eventName: string;
  totalInvited: number;
  confirmedAdults: number;
  confirmedChildren: number;
  totalConfirmed: number;
  pendingInvitations: number;
  declinedInvitations: number;
  bufferPercentage: number;
  proposedQuantity: number;
  isGuaranteeApproved: boolean;
  approvedGuaranteeHeadcount: number | null;
  actualCheckIns: number;
};

/**
 * Fetch all meal plans for a wedding's events
 */
export async function getMealPlansAction(weddingId: string): Promise<CateringActionResult> {
  if (!isSupabaseConfigured()) {
    const list = MOCK_CATERING_PLANS.map((c: CateringPlan) => ({
      ...c,
      eventId: c.functionId,
      eventName: c.functionName,
      isGuaranteeApproved: true,
      approvedGuaranteeHeadcount: c.guaranteedHeadcount,
      serviceStyle: "buffet" as const,
      mealType: c.mealType,
      bufferPercentage: c.bufferPercentage,
      plannedPerPlateCost: c.perPlateEstimate,
    }));
    return { success: true, data: list };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("meal_plans") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .select("*, event:events!inner(id, name, wedding_id, start_time), vendor:vendors(id, business_name, phone)")
    .eq("event.wedding_id", weddingId)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/**
 * Compute the live event headcount distinguishing confirmed, pending, buffer-adjusted proposed,
 * approved guarantees, and actual check-ins.
 *
 * Business Invariant:
 * - Confirmed = SUM(adult_count + child_count) of attendees with status = 'attending'
 * - Pending = COUNT of invitations that are not yet attending or declined
 * - Proposed = CEIL(confirmed * (1 + buffer_percentage / 100))
 * - Guarantee is ONLY approved via explicit organiser sign-off
 */
export async function computeEventHeadcountAction(
  eventId: string,
  bufferPercentage = 10
): Promise<CateringActionResult<EventHeadcountSummary>> {
  if (!isSupabaseConfigured()) {
    const mockConfirmed = 150;
    const mockPending = 35;
    const mockDeclined = 15;
    const totalInvited = mockConfirmed + mockPending + mockDeclined;
    const proposed = Math.ceil(mockConfirmed * (1 + bufferPercentage / 100));

    return {
      success: true,
      data: {
        eventId,
        eventName: "Sangeet & Dinner",
        totalInvited,
        confirmedAdults: 120,
        confirmedChildren: 30,
        totalConfirmed: mockConfirmed,
        pendingInvitations: mockPending,
        declinedInvitations: mockDeclined,
        bufferPercentage,
        proposedQuantity: proposed,
        isGuaranteeApproved: false,
        approvedGuaranteeHeadcount: null,
        actualCheckIns: 0,
      },
    };
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

  // Fetch invitations and RSVPs for this specific event
  const { data: invitations, error } = await (supabase.from("event_invitations") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ status: string; checked_in: boolean; rsvps: Array<{ attending: boolean; adult_count: number; child_count: number }> }> | null; error: { message: string } | null }> };
  })
    .select("status, checked_in, rsvps(attending, adult_count, child_count)")
    .eq("event_id", eventId);

  if (error) return { success: false, error: error.message };

  let confirmedAdults = 0;
  let confirmedChildren = 0;
  let pendingInvitations = 0;
  let declinedInvitations = 0;
  let actualCheckIns = 0;
  const totalInvited = invitations?.length || 0;

  invitations?.forEach((inv) => {
    if (inv.checked_in) actualCheckIns += 1;

    const rsvp = inv.rsvps?.[0];
    if (rsvp && rsvp.attending) {
      confirmedAdults += rsvp.adult_count || 1;
      confirmedChildren += rsvp.child_count || 0;
    } else if (rsvp && !rsvp.attending) {
      declinedInvitations += 1;
    } else {
      pendingInvitations += 1;
    }
  });

  const totalConfirmed = confirmedAdults + confirmedChildren;
  const proposedQuantity = Math.ceil(totalConfirmed * (1 + Math.max(0, bufferPercentage) / 100));

  // Check if there is an approved guarantee for this event
  const { data: mealPlan } = await (supabase.from("meal_plans") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => { maybeSingle: () => Promise<{ data: { is_guarantee_approved: boolean; approved_guarantee_headcount: number | null } | null }> } };
  })
    .select("is_guarantee_approved, approved_guarantee_headcount")
    .eq("event_id", eventId)
    .maybeSingle();

  return {
    success: true,
    data: {
      eventId,
      eventName: eventData?.name || "Ceremony Event",
      totalInvited,
      confirmedAdults,
      confirmedChildren,
      totalConfirmed,
      pendingInvitations,
      declinedInvitations,
      bufferPercentage,
      proposedQuantity,
      isGuaranteeApproved: Boolean(mealPlan?.is_guarantee_approved),
      approvedGuaranteeHeadcount: mealPlan?.approved_guarantee_headcount ?? null,
      actualCheckIns,
    },
  };
}

/**
 * Save or update an event meal plan
 */
export async function saveMealPlanAction(formData: FormData): Promise<CateringActionResult> {
  const raw = {
    eventId: formData.get("eventId") as string,
    vendorId: (formData.get("vendorId") as string) || null,
    mealType: (formData.get("mealType") as string) || "dinner",
    serviceStyle: (formData.get("serviceStyle") as string) || "buffet",
    menuDescription: (formData.get("menuDescription") as string) || null,
    plannedPerPlateCost: Number(formData.get("plannedPerPlateCost") || 0),
    bufferPercentage: Number(formData.get("bufferPercentage") || 10),
    notes: (formData.get("notes") as string) || null,
  };

  const parseResult = mealPlanSchema.safeParse(raw);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.errors.map((e) => e.message).join(", "),
    };
  }

  const validated = parseResult.data;

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: {
        id: `mock-meal-${Date.now()}`,
        ...validated,
        isGuaranteeApproved: false,
        approvedGuaranteeHeadcount: null,
      },
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("meal_plans") as unknown as {
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
        event_id: validated.eventId,
        vendor_id: validated.vendorId,
        meal_type: validated.mealType,
        service_style: validated.serviceStyle,
        menu_description: validated.menuDescription,
        planned_per_plate_cost: validated.plannedPerPlateCost,
        buffer_percentage: validated.bufferPercentage,
        notes: validated.notes,
      },
      { onConflict: "event_id,meal_type" }
    )
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/catering");
  return { success: true, data };
}

/**
 * Approve the caterer guarantee with explicit organiser sign-off
 * (Prevents unapproved headcount or automatic budget conversions)
 */
export async function approveCateringGuaranteeAction(
  mealPlanId: string,
  approvedHeadcount: number
): Promise<CateringActionResult> {
  const parseResult = approveGuaranteeSchema.safeParse({ mealPlanId, approvedHeadcount });
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.errors.map((e) => e.message).join(", "),
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: {
        mealPlanId,
        isGuaranteeApproved: true,
        approvedGuaranteeHeadcount: approvedHeadcount,
        approvedAt: new Date().toISOString(),
      },
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data: userAuth } = await supabase.auth.getUser();

  const { data, error } = await (supabase.from("meal_plans") as unknown as {
    update: (row: unknown) => {
      eq: (col: string, val: string) => {
        select: () => {
          single: () => Promise<{ data: unknown; error: { message: string } | null }>;
        };
      };
    };
  })
    .update({
      is_guarantee_approved: true,
      approved_guarantee_headcount: approvedHeadcount,
      approved_by: userAuth.user?.id || null,
      approved_at: new Date().toISOString(),
    })
    .eq("id", mealPlanId)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/catering");
  return { success: true, data };
}
