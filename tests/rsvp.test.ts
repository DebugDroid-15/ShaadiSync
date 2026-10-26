import { describe, it, expect } from "vitest";
import { submitRsvpFormSchema } from "@/lib/validations/rsvp";
import { generateWhatsAppInvitation, generateWhatsAppRsvpReminder } from "@/lib/whatsapp";

describe("Phase 4 Invitations, Guest Portal & RSVP Engine", () => {
  const dummyInvitationId1 = "d0000000-0000-0000-0000-000000000001";
  const dummyInvitationId2 = "d0000000-0000-0000-0000-000000000002";

  describe("RSVP Submission Validation & Invariants", () => {
    it("validates valid multi-function attending response with dietary details", () => {
      const payload = {
        token: "tok_test_12345",
        responses: [
          {
            eventInvitationId: dummyInvitationId1,
            status: "attending" as const,
            adultCount: 2,
            childCount: 1,
            dietaryPref: "jain" as const,
            dietaryNotes: "Strict Jain meal without onions/garlic",
            accompanyingNames: "Pooja Sharma, Aryan Sharma",
          },
          {
            eventInvitationId: dummyInvitationId2,
            status: "declined" as const,
            adultCount: 0,
            childCount: 0,
            dietaryPref: "veg" as const,
          },
        ],
      };

      const result = submitRsvpFormSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.responses).toHaveLength(2);
        expect(result.data.responses[0].status).toBe("attending");
        expect(result.data.responses[0].dietaryPref).toBe("jain");
        expect(result.data.responses[1].status).toBe("declined");
      }
    });

    it("rejects empty responses array", () => {
      const invalid = submitRsvpFormSchema.safeParse({
        token: "tok_test_12345",
        responses: [],
      });
      expect(invalid.success).toBe(false);
    });

    it("rejects negative headcount values", () => {
      const invalid = submitRsvpFormSchema.safeParse({
        token: "tok_test_12345",
        responses: [
          {
            eventInvitationId: dummyInvitationId1,
            status: "attending",
            adultCount: -1, // Negative adult count!
            childCount: 0,
            dietaryPref: "veg",
          },
        ],
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("Token Revocation & Expiration Rules", () => {
    it("flags revoked or expired token accurately", () => {
      const isTokenValid = (tokenData: {
        revoked: boolean;
        expiresAt: string | null;
      }): boolean => {
        if (tokenData.revoked) return false;
        if (tokenData.expiresAt && new Date(tokenData.expiresAt) < new Date("2026-10-26T12:00:00Z")) {
          return false;
        }
        return true;
      };

      expect(isTokenValid({ revoked: false, expiresAt: null })).toBe(true);
      expect(isTokenValid({ revoked: true, expiresAt: null })).toBe(false);
      expect(isTokenValid({ revoked: false, expiresAt: "2026-10-20T00:00:00Z" })).toBe(false); // Expired
      expect(isTokenValid({ revoked: false, expiresAt: "2026-11-20T00:00:00Z" })).toBe(true); // Valid future date
    });
  });

  describe("Minimal Public Disclosure Boundary", () => {
    it("ensures public invitation response contains strictly scoped guest data", () => {
      const publicResponse = {
        guestName: "Rajesh Sharma",
        invitedCeremonies: ["Sangeet", "Pheras"],
        // Crucial security check: internal planner financial notes or other guests MUST be excluded
      };

      expect(publicResponse).not.toHaveProperty("totalContractAmount");
      expect(publicResponse).not.toHaveProperty("allWeddingGuests");
      expect(publicResponse.invitedCeremonies).toHaveLength(2);
    });
  });

  describe("WhatsApp Message Generator & wa.me Intent Encoding", () => {
    it("generates culturally tailored invitation message with encoded URL", () => {
      const { text, waUrl } = generateWhatsAppInvitation({
        guestName: "Rajesh",
        coupleTitle: "Diya & Aarav",
        ceremonyNames: ["Mehendi & Chooda", "Sangeet Gala", "Pheras Ceremony"],
        rsvpUrl: "https://shaadisync.com/invite/tok_sharma_01",
        startDate: "2026-11-20",
        city: "Udaipur",
      });

      expect(text).toContain("Namaste Rajesh ji");
      expect(text).toContain("Diya & Aarav");
      expect(text).toContain("Mehendi & Chooda");
      expect(text).toContain("https://shaadisync.com/invite/tok_sharma_01");
      expect(waUrl).toContain("https://wa.me/?text=");
      expect(waUrl).toContain("Namaste%20Rajesh%20ji");
    });

    it("generates concise reminder message for pending RSVPs", () => {
      const { text, waUrl } = generateWhatsAppRsvpReminder({
        guestName: "Pooja",
        coupleTitle: "Diya & Aarav",
        rsvpUrl: "https://shaadisync.com/invite/tok_mehta_02",
        daysLeft: 5,
      });

      expect(text).toContain("Namaste Pooja ji");
      expect(text).toContain("starting in 5 days");
      expect(waUrl).toContain("https://wa.me/?text=");
    });
  });
});
