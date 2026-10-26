import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Checks whether Supabase environment variables are available.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://your-project-id.supabase.co"
  );
}

/**
 * Creates a browser-side Supabase client.
 * Returns null if Supabase environment variables are unconfigured.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url === "https://your-project-id.supabase.co") {
    return null;
  }

  return createBrowserClient<Database>(url, anonKey);
}
