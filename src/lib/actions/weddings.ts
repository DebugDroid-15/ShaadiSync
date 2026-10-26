"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { MOCK_WEDDINGS } from "@/lib/mock-data";

const createWeddingSchema = z.object({
  organisationId: z.string().uuid("Valid organisation ID is required."),
  title: z.string().min(3, "Wedding title must be at least 3 characters."),
  coupleBrideName: z.string().min(2, "Bride name is required."),
  coupleGroomName: z.string().min(2, "Groom name is required."),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD."),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be YYYY-MM-DD."),
  primaryCity: z.string().min(2, "City is required."),
  totalBudget: z.coerce.number().min(0, "Budget must be a non-negative amount."),
});

export type TenantActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Fetch weddings for the active user enforcing RLS boundaries
 */
export async function getWeddingsAction(): Promise<TenantActionResult> {
  if (!isSupabaseConfigured()) {
    return { success: true, data: MOCK_WEDDINGS };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Database client unavailable." };
  }

  const { data, error } = await (supabase.from("weddings") as unknown as {
    select: (query: string) => { order: (col: string, opts: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }> };
  })
    .select("*, organisation:organisations(name, slug)")
    .order("start_date", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Create a new wedding within an organisation (RLS strictly enforced)
 */
export async function createWeddingAction(formData: FormData): Promise<TenantActionResult> {
  const rawData = {
    organisationId: formData.get("organisationId") as string,
    title: formData.get("title") as string,
    coupleBrideName: formData.get("coupleBrideName") as string,
    coupleGroomName: formData.get("coupleGroomName") as string,
    startDate: formData.get("startDate") as string,
    endDate: formData.get("endDate") as string,
    primaryCity: formData.get("primaryCity") as string,
    totalBudget: formData.get("totalBudget"),
  };

  const validation = createWeddingSchema.safeParse(rawData);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const { data: valid } = validation;

  if (new Date(valid.endDate) < new Date(valid.startDate)) {
    return { success: false, error: "End date cannot precede start date." };
  }

  if (!isSupabaseConfigured()) {
    return { success: true, data: { id: "mock-" + Date.now(), ...valid } };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Database client unavailable." };
  }

  const slug = valid.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") + "-" + Math.random().toString(36).substring(2, 6);

  const { data, error } = await (supabase.from("weddings") as unknown as {
    insert: (values: unknown[]) => { select: () => { single: () => Promise<{ data: unknown; error: { message: string } | null }> } };
  })
    .insert([
      {
        organisation_id: valid.organisationId,
        title: valid.title,
        slug,
        couple_bride_name: valid.coupleBrideName,
        couple_groom_name: valid.coupleGroomName,
        start_date: valid.startDate,
        end_date: valid.endDate,
        primary_city: valid.primaryCity,
        status: "planning",
        total_budget: valid.totalBudget,
      },
    ])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/weddings");
  return { success: true, data };
}
