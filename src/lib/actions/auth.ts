"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const signInSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  organisationName: z.string().min(2, "Organisation name must be at least 2 characters."),
  email: z.string().email("Please provide a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type AuthActionResult = {
  success: boolean;
  error?: string;
};

/**
 * Server Action for User Sign In
 */
export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = signInSchema.safeParse({ email, password });
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  if (!isSupabaseConfigured()) {
    // Graceful offline mock handling
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Authentication service currently unavailable." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Server Action for Organisation & User Registration
 */
export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  const fullName = formData.get("fullName") as string;
  const organisationName = formData.get("organisationName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = signUpSchema.safeParse({ fullName, organisationName, email, password });
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "Authentication service currently unavailable." };
  }

  // 1. Sign up user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError || !authData.user) {
    return { success: false, error: authError?.message || "Failed to create account." };
  }

  const userId = authData.user.id;

  // 2. Create organization with slug
  const slug = organisationName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") + "-" + Math.random().toString(36).substring(2, 6);

  const { data: orgData, error: orgError } = await (supabase.from("organisations") as unknown as {
    insert: (values: unknown[]) => { select: (cols: string) => { single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }> } };
  })
    .insert([
      {
        name: organisationName,
        slug,
        billing_tier: "free",
        created_by: userId,
      },
    ])
    .select("id")
    .single();

  if (orgError || !orgData) {
    return { success: false, error: "User registered, but organisation setup failed: " + (orgError?.message || "Unknown error") };
  }

  // 3. Add user as owner in organisation_members
  const { error: memberError } = await (supabase.from("organisation_members") as unknown as {
    insert: (values: unknown[]) => Promise<{ error: { message: string } | null }>;
  })
    .insert([
      {
        organisation_id: orgData.id,
        user_id: userId,
        role: "owner",
      },
    ]);

  if (memberError) {
    return { success: false, error: "Organisation member link failed: " + memberError.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Server Action for User Sign Out
 */
export async function signOutAction(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
