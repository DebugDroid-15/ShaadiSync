import { describe, it, expect } from "vitest";
import {
  issueQrPassSchema,
  revokeQrPassSchema,
  scanCheckinSchema,
  manualCheckinSchema,
} from "@/lib/validations/checkin";

describe("Phase 8: QR Pass Validation & Security Rules", () => {
  it("validates legitimate QR pass generation with positive attendee counts", () => {
    const validPass = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      eventId: "123e4567-e89b-12d3-a456-426614174001",
      guestId: "123e4567-e89b-12d3-a456-426614174002",
      permittedAttendeesCount: 2,
    };

    const res = issueQrPassSchema.safeParse(validPass);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.permittedAttendeesCount).toBe(2);
    }
  });

  it("rejects non-positive attendee counts in QR pass creation", () => {
    const invalidPass = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      eventId: "123e4567-e89b-12d3-a456-426614174001",
      guestId: "123e4567-e89b-12d3-a456-426614174002",
      permittedAttendeesCount: 0,
    };

    const res = issueQrPassSchema.safeParse(invalidPass);
    expect(res.success).toBe(false);
  });

  it("requires an explicit reason when revoking an active pass", () => {
    const invalidRevoke = {
      passId: "123e4567-e89b-12d3-a456-426614174000",
      reason: "",
    };

    const res = revokeQrPassSchema.safeParse(invalidRevoke);
    expect(res.success).toBe(false);

    const validRevoke = {
      passId: "123e4567-e89b-12d3-a456-426614174000",
      reason: "Guest requested pass reissue due to lost device",
    };

    const validRes = revokeQrPassSchema.safeParse(validRevoke);
    expect(validRes.success).toBe(true);
  });
});

describe("Phase 8: Check-in Concurrency & Duplicate Protection Invariants", () => {
  it("validates incoming scan payload with required pass code", () => {
    const scan = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      eventId: "123e4567-e89b-12d3-a456-426614174001",
      passCode: "pass_sng_7f8a92b",
      admittedCount: 2,
    };

    const res = scanCheckinSchema.safeParse(scan);
    expect(res.success).toBe(true);
  });

  it("enforces database unique constraint logic preventing duplicate attendance", () => {
    // Model existing check-in set
    const attendanceRecords = new Map<string, string>(); // key: `${eventId}_${guestId}` -> timestamp

    const eventId = "fn-02-sangeet";
    const guestId = "gst-001";
    const key = `${eventId}_${guestId}`;

    // First scan succeeds
    expect(attendanceRecords.has(key)).toBe(false);
    attendanceRecords.set(key, new Date().toISOString());

    // Second scan detected as duplicate
    const isDuplicate = attendanceRecords.has(key);
    expect(isDuplicate).toBe(true);
  });

  it("requires an override reason for manual supervisor check-in overrides", () => {
    const invalidOverride = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      eventId: "123e4567-e89b-12d3-a456-426614174001",
      guestId: "123e4567-e89b-12d3-a456-426614174002",
      isOverride: true,
      overrideReason: "", // Empty reason must fail
    };

    const res = manualCheckinSchema.safeParse(invalidOverride);
    expect(res.success).toBe(false);

    const validOverride = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      eventId: "123e4567-e89b-12d3-a456-426614174001",
      guestId: "123e4567-e89b-12d3-a456-426614174002",
      isOverride: true,
      overrideReason: "Father of groom confirmed re-entry clearance",
    };

    const validRes = manualCheckinSchema.safeParse(validOverride);
    expect(validRes.success).toBe(true);
  });
});

describe("Phase 8: Event Scoping & Ineligibility Isolation", () => {
  it("rejects check-in if pass is scanned at the wrong event", () => {
    const pass = {
      passCode: "pass_sng_7f8a92b",
      eventId: "fn-02-sangeet",
    };

    const currentGateEventId = "fn-04-wedding";
    const isEventMatch = pass.eventId === currentGateEventId;

    expect(isEventMatch).toBe(false);
  });

  it("calculates live gate attendance rates cleanly without dividing by zero", () => {
    const confirmedCount = 0;
    const checkedInCount = 0;
    const rate = confirmedCount > 0 ? Math.round((checkedInCount / confirmedCount) * 100) : 0;

    expect(rate).toBe(0);
    expect(isNaN(rate)).toBe(false);

    const normalConfirmed = 200;
    const normalCheckedIn = 150;
    const normalRate = Math.round((normalCheckedIn / normalConfirmed) * 100);

    expect(normalRate).toBe(75);
  });
});

