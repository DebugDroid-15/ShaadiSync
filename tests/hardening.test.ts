import { describe, it, expect } from "vitest";
import { exportGuestsToCsv } from "@/lib/csv";
import { formatINR, calculateBudgetVariance, calculateCateringGuarantee } from "@/lib/utils";
import {
  MOCK_WEDDINGS,
  MOCK_FUNCTIONS,
  MOCK_GUESTS,
  MOCK_VENDORS,
  MOCK_BUDGET,
  MOCK_PARKING_AREAS,
  MOCK_TRANSPORT_TRIPS,
  MOCK_ROOM_INVENTORY,
  MOCK_QR_PASSES,
  MOCK_ATTENDANCE_RECORDS,
} from "@/lib/mock-data";

describe("Phase 9: Comprehensive Cross-Module Integration & Data Integrity", () => {
  it("maintains consistent wedding and ceremony scopes across all modules", () => {
    const wedding = MOCK_WEDDINGS[0];
    expect(wedding.id).toBe("wed-aarav-diya");

    // All functions belong to the wedding
    const weddingFunctions = MOCK_FUNCTIONS.filter((f) => f.weddingId === wedding.id);
    expect(weddingFunctions.length).toBeGreaterThanOrEqual(3);

    // Guests are linked to the wedding
    const weddingGuests = MOCK_GUESTS.filter((g) => g.weddingId === wedding.id);
    expect(weddingGuests.length).toBeGreaterThan(0);

    // Vendors belong to the wedding
    const weddingVendors = MOCK_VENDORS.filter((v) => v.weddingId === wedding.id);
    expect(weddingVendors.length).toBeGreaterThan(0);

    // Parking, transport, and rooms match the wedding ID
    expect(MOCK_PARKING_AREAS.every((p) => p.weddingId === wedding.id)).toBe(true);
    expect(MOCK_TRANSPORT_TRIPS.every((t) => t.weddingId === wedding.id)).toBe(true);
    expect(MOCK_ROOM_INVENTORY.every((r) => r.weddingId === wedding.id)).toBe(true);
    expect(MOCK_QR_PASSES.every((q) => q.weddingId === wedding.id)).toBe(true);
  });

  it("reconciles vendor agreed prices and advance payments without monetary drift", () => {
    MOCK_VENDORS.forEach((vendor) => {
      expect(vendor.agreedPrice).toBeGreaterThanOrEqual(0);
      expect(vendor.advancePaid).toBeGreaterThanOrEqual(0);
      // Invariant: advance_paid cannot exceed agreed_price (when agreed > 0)
      if (vendor.agreedPrice > 0) {
        expect(vendor.advancePaid).toBeLessThanOrEqual(vendor.agreedPrice);
      }
      // Invariant: balance_due = max(0, agreed_price - advance_paid)
      const expectedBalance = Math.max(0, vendor.agreedPrice - vendor.advancePaid);
      expect(vendor.balanceDue).toBe(expectedBalance);
    });
  });

  it("protects CSV exports from spreadsheet formula injection", () => {
    const maliciousGuests = [
      {
        firstName: "=cmd|' /C calc'!A0",
        lastName: "Hacker",
        side: "bride",
        category: "vip",
        ageGroup: "adult",
        isVip: true,
      },
      {
        firstName: "@SUM(1+1)",
        lastName: "Formula",
        side: "groom",
        category: "family",
        ageGroup: "adult",
        isVip: false,
      },
    ];

    const csvOutput = exportGuestsToCsv(maliciousGuests);
    // Every cell starting with =, +, -, @ must be prefixed with a single quote (')
    expect(csvOutput).toContain("'=cmd|' /C calc'!A0");
    expect(csvOutput).toContain("'@SUM(1+1)");
  });

  it("verifies wedding budget variance matches category sum aggregates", () => {
    const budget = MOCK_BUDGET;
    const computedVariance = budget.totalBudget - budget.totalActual;
    expect(budget.variance).toBe(computedVariance);

    const varianceResult = calculateBudgetVariance(budget.totalBudget, budget.totalActual);
    expect(varianceResult.variance).toBe(computedVariance);
    expect(varianceResult.isOverBudget).toBe(false);
  });

  it("strictly separates catering guarantees from actual check-in attendance", () => {
    const confirmedCount = 310;
    const bufferPercent = 10;
    const catering = calculateCateringGuarantee(confirmedCount, bufferPercent);

    // Guaranteed headcount = 310 + 31 = 341
    expect(catering.guaranteedHeadcount).toBe(341);

    // Sangeet check-in records must reflect physical gate scans, NOT guaranteed plate count
    const sangeetAttendance = MOCK_ATTENDANCE_RECORDS.filter((a) => a.eventId === "fn-02-sangeet");
    const physicalAttendees = sangeetAttendance.reduce((acc, a) => acc + a.admittedCount, 0);

    expect(physicalAttendees).not.toBe(catering.guaranteedHeadcount);
    expect(physicalAttendees).toBe(2); // Only Rajesh Sharma & spouse physically checked in so far
  });
});

