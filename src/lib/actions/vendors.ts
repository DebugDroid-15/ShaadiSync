"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { vendorSchema, vendorAssignmentSchema } from "@/lib/validations/catering-vendors";
import { MOCK_VENDORS } from "@/lib/mock-data";

export type VendorActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Fetch all vendors for a wedding
 */
export async function getVendorsAction(weddingId: string): Promise<VendorActionResult> {
  if (!isSupabaseConfigured()) {
    const list = MOCK_VENDORS.filter(
      (v) => v.weddingId === weddingId || weddingId.startsWith("mock") || weddingId === "wed-aarav-diya"
    );
    return { success: true, data: list.length > 0 ? list : MOCK_VENDORS };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("vendors") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .select("*, vendor_assignments(*, event:events(name, event_type, start_time))")
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/**
 * Create a new vendor record
 */
export async function createVendorAction(formData: FormData): Promise<VendorActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    businessName: formData.get("businessName") as string,
    category: (formData.get("category") as string) || "other",
    contactName: formData.get("contactName") as string,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    bookingStatus: (formData.get("bookingStatus") as string) || "inquiry",
    quotedPrice: Number(formData.get("quotedPrice") || 0),
    agreedPrice: Number(formData.get("agreedPrice") || 0),
    advancePaid: Number(formData.get("advancePaid") || 0),
    paymentDueDate: (formData.get("paymentDueDate") as string) || null,
    arrivalTime: (formData.get("arrivalTime") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  const parseResult = vendorSchema.safeParse(raw);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.errors.map((e) => e.message).join(", "),
    };
  }

  const validated = parseResult.data;

  if (!isSupabaseConfigured()) {
    const newVendor = {
      id: `mock-vendor-${Date.now()}`,
      weddingId: validated.weddingId,
      businessName: validated.businessName,
      category: validated.category,
      contactName: validated.contactName,
      phone: validated.phone || "",
      email: validated.email || "",
      bookingStatus: validated.bookingStatus,
      quotedPrice: validated.quotedPrice,
      agreedPrice: validated.agreedPrice,
      advancePaid: validated.advancePaid,
      balanceDue: Math.max(0, validated.agreedPrice - validated.advancePaid),
      paymentDueDate: validated.paymentDueDate,
      notes: validated.notes,
      assignedEvents: [],
    };
    return { success: true, data: newVendor };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("vendors") as unknown as {
    insert: (row: unknown) => {
      select: () => {
        single: () => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .insert({
      wedding_id: validated.weddingId,
      business_name: validated.businessName,
      category: validated.category,
      contact_name: validated.contactName,
      phone: validated.phone,
      email: validated.email,
      booking_status: validated.bookingStatus,
      quoted_price: validated.quotedPrice,
      agreed_price: validated.agreedPrice,
      advance_paid: validated.advancePaid,
      payment_due_date: validated.paymentDueDate,
      arrival_time: validated.arrivalTime,
      notes: validated.notes,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/vendors");
  return { success: true, data };
}

/**
 * Update an existing vendor's details or contract status
 */
export async function updateVendorAction(
  vendorId: string,
  formData: FormData
): Promise<VendorActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    businessName: formData.get("businessName") as string,
    category: (formData.get("category") as string) || "other",
    contactName: formData.get("contactName") as string,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    bookingStatus: (formData.get("bookingStatus") as string) || "inquiry",
    quotedPrice: Number(formData.get("quotedPrice") || 0),
    agreedPrice: Number(formData.get("agreedPrice") || 0),
    advancePaid: Number(formData.get("advancePaid") || 0),
    paymentDueDate: (formData.get("paymentDueDate") as string) || null,
    arrivalTime: (formData.get("arrivalTime") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  const parseResult = vendorSchema.safeParse(raw);
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
        id: vendorId,
        ...validated,
        balanceDue: Math.max(0, validated.agreedPrice - validated.advancePaid),
      },
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("vendors") as unknown as {
    update: (row: unknown) => {
      eq: (col: string, val: string) => {
        select: () => {
          single: () => Promise<{ data: unknown; error: { message: string } | null }>;
        };
      };
    };
  })
    .update({
      business_name: validated.businessName,
      category: validated.category,
      contact_name: validated.contactName,
      phone: validated.phone,
      email: validated.email,
      booking_status: validated.bookingStatus,
      quoted_price: validated.quotedPrice,
      agreed_price: validated.agreedPrice,
      advance_paid: validated.advancePaid,
      payment_due_date: validated.paymentDueDate,
      arrival_time: validated.arrivalTime,
      notes: validated.notes,
    })
    .eq("id", vendorId)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/vendors");
  return { success: true, data };
}

/**
 * Delete a vendor record
 */
export async function deleteVendorAction(vendorId: string): Promise<VendorActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { error } = await (supabase.from("vendors") as unknown as {
    delete: () => {
      eq: (col: string, val: string) => Promise<{ error: { message: string } | null }>;
    };
  })
    .delete()
    .eq("id", vendorId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/vendors");
  return { success: true };
}

/**
 * Assign a vendor to a specific wedding function / ceremony
 */
export async function assignVendorToEventAction(
  vendorId: string,
  eventId: string,
  serviceDescription?: string | null,
  arrivalTime?: string | null
): Promise<VendorActionResult> {
  const parseResult = vendorAssignmentSchema.safeParse({
    vendorId,
    eventId,
    serviceDescription,
    arrivalTime,
  });

  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.errors.map((e) => e.message).join(", "),
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: { id: `mock-assign-${Date.now()}`, vendorId, eventId, serviceDescription, arrivalTime },
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("vendor_assignments") as unknown as {
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
        vendor_id: vendorId,
        event_id: eventId,
        service_description: serviceDescription || null,
        arrival_time: arrivalTime || null,
      },
      { onConflict: "vendor_id,event_id" }
    )
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/vendors");
  revalidatePath("/dashboard/catering");
  return { success: true, data };
}

