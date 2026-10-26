import { describe, it, expect } from "vitest";
import { parseCsvText, validateGuestCsv, exportGuestsToCsv } from "@/lib/csv";

describe("ShaadiSync CSV Guest Import & Export Engine", () => {
  describe("parseCsvText", () => {
    it("parses basic comma-separated rows", () => {
      const csv = "First Name,Last Name\nRajesh,Sharma\nPooja,Mehta";
      const parsed = parseCsvText(csv);
      expect(parsed).toHaveLength(3);
      expect(parsed[1][0]).toBe("Rajesh");
      expect(parsed[1][1]).toBe("Sharma");
    });

    it("handles cells with commas enclosed in double quotes", () => {
      const csv = 'First Name,Allergies\nVikram,"Shellfish, Peanuts"\nSunita,"Nut allergy"';
      const parsed = parseCsvText(csv);
      expect(parsed).toHaveLength(3);
      expect(parsed[1][1]).toBe("Shellfish, Peanuts");
      expect(parsed[2][1]).toBe("Nut allergy");
    });

    it("handles CRLF and LF mixed line breaks", () => {
      const csv = "A,B\r\nC,D\nE,F";
      const parsed = parseCsvText(csv);
      expect(parsed).toHaveLength(3);
      expect(parsed[2][0]).toBe("E");
    });
  });

  describe("validateGuestCsv Error Reporting", () => {
    it("reports exact row number and field error for invalid email", () => {
      const csv = `First Name,Last Name,Email,Phone,Side
Rajesh,Sharma,rajesh.sharma@example.com,+919876543210,bride
Amit,,invalid-email-format,+919876543211,groom`;

      const result = validateGuestCsv(csv);
      expect(result.success).toBe(false);
      expect(result.errorCount).toBe(1);
      expect(result.errors[0].rowNumber).toBe(3); // Row 3 has missing last name & invalid email
      expect(result.errors[0].errors.some((e) => e.includes("lastName") || e.includes("email"))).toBe(true);
      expect(result.importedCount).toBe(1);
    });

    it("splits full name into firstName and lastName if single column provided", () => {
      const csv = `Name,Phone,Side,Category
"Vikram Kapoor",+919811122334,groom,vip`;

      const result = validateGuestCsv(csv);
      expect(result.success).toBe(true);
      expect(result.validRows[0].firstName).toBe("Vikram");
      expect(result.validRows[0].lastName).toBe("Kapoor");
    });

    it("defensively maps invalid sides, categories, or dietary prefs to valid fallbacks", () => {
      const csv = `First Name,Last Name,Side,Diet
Aarav,Kapoor,invalid_side_test,uncommon_diet`;

      const result = validateGuestCsv(csv);
      expect(result.success).toBe(true);
      expect(result.validRows[0].side).toBe("mutual"); // fallback
      expect(result.validRows[0].dietaryPref).toBe("veg"); // fallback
    });

    it("correctly parses VIP indicators across various representations", () => {
      const csv = `First Name,Last Name,VIP
Rajesh,Sharma,YES
Meera,Patel,true
Amit,Verma,1
Pooja,Mehta,no`;

      const result = validateGuestCsv(csv);
      expect(result.success).toBe(true);
      expect(result.validRows[0].isVip).toBe(true);
      expect(result.validRows[1].isVip).toBe(true);
      expect(result.validRows[2].isVip).toBe(true);
      expect(result.validRows[3].isVip).toBe(false);
    });
  });

  describe("exportGuestsToCsv", () => {
    it("generates valid CSV with escaped quotes when commas are present", () => {
      const guests = [
        {
          firstName: "Vikram",
          lastName: "Kapoor",
          side: "groom",
          category: "family",
          ageGroup: "adult",
          phone: "+91 98111 22334",
          email: "vikram@example.com",
          dietaryPref: "non_veg",
          allergiesNotes: "Shellfish, Peanuts",
          isVip: true,
          familyName: "Kapoor Household",
          invitedEventsCount: 3,
        },
      ];

      const csv = exportGuestsToCsv(guests);
      expect(csv).toContain("First Name,Last Name");
      expect(csv).toContain('"Shellfish, Peanuts"');
      expect(csv).toContain("Yes");
    });
  });
});
