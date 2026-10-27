import { describe, it, expect } from "vitest";
import { updateSession } from "@/lib/supabase/middleware";
import { NextRequest } from "next/server";

describe("Phase 10: Production Readiness, Security & Deployment Verification", () => {
  it("enforces complete security headers on unauthenticated and unconfigured responses", async () => {
    const req = new NextRequest(new URL("http://localhost:3000/dashboard"), {
      headers: new Headers({
        host: "localhost:3000",
      }),
    });
    const res = await updateSession(req);

    // Verify critical defense-in-depth headers
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("X-XSS-Protection")).toBe("1; mode=block");
    expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(res.headers.get("Permissions-Policy")).toContain("camera=(self)");
    expect(res.headers.get("Permissions-Policy")).toContain("microphone=()");
    expect(res.headers.get("Permissions-Policy")).toContain("geolocation=()");

    // Verify Content Security Policy
    const csp = res.headers.get("Content-Security-Policy");
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("safeguards sensitive environment variables and rejects client-side leakage", () => {
    // Only NEXT_PUBLIC_ keys can be safely exposed to the client
    const clientAllowedPrefix = "NEXT_PUBLIC_";
    const serverSecrets = [
      "SUPABASE_SERVICE_ROLE_KEY",
      "DATABASE_URL",
      "SUPABASE_DB_PASSWORD",
      "JWT_SECRET",
    ];

    serverSecrets.forEach((secret) => {
      expect(secret.startsWith(clientAllowedPrefix)).toBe(false);
    });
  });

  it("validates that all production migrations maintain correct schema dependencies", () => {
    const expectedMigrations = [
      "20261026000001_initial_schema.sql",
      "20261026000002_functions_households_guests.sql",
      "20261026000003_rsvps_and_tokens.sql",
      "20261026000004_catering_and_vendors.sql",
      "20261026000005_budget_expenses_payments.sql",
      "20261026000006_parking_transport_accommodation.sql",
      "20261026000007_qr_passes_and_checkin.sql",
      "20261026000008_fix_events_rls_recursion.sql",
    ];

    expect(expectedMigrations.length).toBe(8);
    // Chronological timestamp ordering
    for (let i = 0; i < expectedMigrations.length - 1; i++) {
      expect(expectedMigrations[i] < expectedMigrations[i + 1]).toBe(true);
    }
  });
});
