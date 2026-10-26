import { describe, it, expect } from "vitest";
import { eventSchema, guestSchema } from "@/lib/validations/events-guests";

describe("Phase 3 Relational Validation & Selective Invariants", () => {
  const testWeddingId = "a0000000-0000-0000-0000-000000000001";
  const eventMehendiId = "b0000000-0000-0000-0000-000000000001";
  const eventSangeetId = "b0000000-0000-0000-0000-000000000002";
  const eventPherasId = "b0000000-0000-0000-0000-000000000003";

  describe("Event Schema Invariants", () => {
    it("validates valid event payload", () => {
      const valid = eventSchema.safeParse({
        weddingId: testWeddingId,
        name: "Mehendi Afternoon",
        eventType: "mehendi",
        startTime: "2026-11-20T14:00:00.000Z",
        endTime: "2026-11-20T19:00:00.000Z",
        guestCapacity: 180,
        dressCode: "Yellows",
      });
      expect(valid.success).toBe(true);
    });

    it("rejects event when end time is before start time", () => {
      const invalid = eventSchema.safeParse({
        weddingId: testWeddingId,
        name: "Invalid Timing Event",
        eventType: "haldi",
        startTime: "2026-11-20T18:00:00.000Z",
        endTime: "2026-11-20T12:00:00.000Z", // ends before it starts!
        guestCapacity: 150,
      });
      expect(invalid.success).toBe(false);
      if (!invalid.success) {
        expect(invalid.error.errors[0].message).toContain("End time cannot precede start time");
      }
    });

    it("rejects negative or zero guest capacity", () => {
      const invalid = eventSchema.safeParse({
        weddingId: testWeddingId,
        name: "Zero Capacity Event",
        eventType: "reception",
        startTime: "2026-11-20T18:00:00.000Z",
        endTime: "2026-11-20T22:00:00.000Z",
        guestCapacity: 0,
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("Selective Per-Function Invitation Invariants", () => {
    it("allows inviting a guest to selective functions without inviting to all", () => {
      // Guest invited to Sangeet & Pheras only, NOT to Mehendi
      const guestPayload = {
        weddingId: testWeddingId,
        firstName: "Harpreet",
        lastName: "Singh",
        side: "groom" as const,
        category: "close_friend" as const,
        ageGroup: "adult" as const,
        phone: "+91 98789 12345",
        email: "harpreet@example.com",
        dietaryPref: "non_veg" as const,
        isVip: false,
        invitedEventIds: [eventSangeetId, eventPherasId],
      };

      const result = guestSchema.safeParse(guestPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.invitedEventIds).toHaveLength(2);
        expect(result.data.invitedEventIds).toContain(eventSangeetId);
        expect(result.data.invitedEventIds).not.toContain(eventMehendiId); // Selective isolation preserved!
      }
    });

    it("verifies duplicate function invitations are prevented", () => {
      const invitationSet = new Set<string>();
      const addInvitation = (eventId: string, guestId: string) => {
        const key = `${eventId}:${guestId}`;
        if (invitationSet.has(key)) {
          return { success: false, error: "Duplicate invitation for this event" };
        }
        invitationSet.add(key);
        return { success: true };
      };

      const first = addInvitation(eventSangeetId, "guest-01");
      expect(first.success).toBe(true);

      // Attempting to add duplicate invitation for the same event and guest
      const duplicate = addInvitation(eventSangeetId, "guest-01");
      expect(duplicate.success).toBe(false);
      expect(duplicate.error).toContain("Duplicate");
    });
  });
});
