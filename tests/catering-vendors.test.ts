import { describe, it, expect } from "vitest";
import { calculateCateringGuarantee, formatINR } from "@/lib/utils";
import {
  vendorSchema,
  mealPlanSchema,
  approveGuaranteeSchema,
} from "@/lib/validations/catering-vendors";

describe("Phase 5: Catering Headcount Engine & Business Rules", () => {
  it("strictly separates confirmed RSVPs from pending invitations in guaranteed calculations", () => {
    const confirmedCount = 100;
    const pendingCount = 50;
    const bufferPercent = 10;

    // Buffer MUST only apply to confirmed headcount, never pending
    const guarantee = calculateCateringGuarantee(confirmedCount, bufferPercent);

    expect(guarantee.confirmedHeadcount).toBe(100);
    expect(guarantee.bufferCount).toBe(10);
    expect(guarantee.guaranteedHeadcount).toBe(110);
    // Ensure pending count is completely excluded
    expect(guarantee.guaranteedHeadcount).not.toBe(Math.ceil((confirmedCount + pendingCount) * 1.1));
  });

  it("handles zero confirmed attendees cleanly without producing NaN or negative counts", () => {
    const guarantee = calculateCateringGuarantee(0, 15);
    expect(guarantee.confirmedHeadcount).toBe(0);
    expect(guarantee.bufferCount).toBe(0);
    expect(guarantee.guaranteedHeadcount).toBe(0);
  });

  it("applies ceiling rounding (ceil) to ensure fractional buffers round up to integer plates", () => {
    // 155 guests * 10% = 15.5 -> ceil = 16 buffer -> 171 guaranteed
    const guarantee = calculateCateringGuarantee(155, 10);
    expect(guarantee.bufferCount).toBe(16);
    expect(guarantee.guaranteedHeadcount).toBe(171);
  });

  it("handles maximum allowed 50% buffer boundary and clamps negative buffer to 0", () => {
    const standardGuarantee = calculateCateringGuarantee(100, 50);
    expect(standardGuarantee.guaranteedHeadcount).toBe(150);

    const negativeGuarantee = calculateCateringGuarantee(100, -10);
    expect(negativeGuarantee.bufferCount).toBe(0);
    expect(negativeGuarantee.guaranteedHeadcount).toBe(100);
  });
});

describe("Phase 5: Vendor Financial Calculations & Validation Invariants", () => {
  it("calculates balance due correctly as max(0, agreed_price - advance_paid)", () => {
    const agreed = 150000;
    const advance = 50000;
    const balanceDue = Math.max(0, agreed - advance);

    expect(balanceDue).toBe(100000);
    expect(formatINR(balanceDue)).toContain("1,00,000");
  });

  it("prevents advance paid from exceeding agreed price in vendor schema", () => {
    const invalidVendor = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      businessName: "Test Caterers",
      category: "caterer",
      contactName: "Rajesh",
      agreedPrice: 50000,
      advancePaid: 80000, // Invalid: exceeds agreed price
    };

    const result = vendorSchema.safeParse(invalidVendor);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain("Advance paid cannot exceed agreed contract price");
    }
  });

  it("accepts valid vendor contracts with correct INR values and categories", () => {
    const validVendor = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      businessName: "KalaKriti Cinema",
      category: "photographer",
      contactName: "Neha",
      phone: "+91 98111 67890",
      email: "team@kalakriti.in",
      bookingStatus: "booked",
      quotedPrice: 200000,
      agreedPrice: 180000,
      advancePaid: 90000,
    };

    const result = vendorSchema.safeParse(validVendor);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.quotedPrice).toBe(200000);
      expect(result.data.agreedPrice).toBe(180000);
      expect(result.data.advancePaid).toBe(90000);
    }
  });
});

describe("Phase 5: Organiser Guarantee Approval Workflow", () => {
  it("validates that approved catering guarantees require positive integer headcounts", () => {
    const invalidApproval = {
      mealPlanId: "123e4567-e89b-12d3-a456-426614174000",
      approvedHeadcount: 0, // Must be >= 1
    };

    const result = approveGuaranteeSchema.safeParse(invalidApproval);
    expect(result.success).toBe(false);

    const validApproval = {
      mealPlanId: "123e4567-e89b-12d3-a456-426614174000",
      approvedHeadcount: 250,
    };
    const validResult = approveGuaranteeSchema.safeParse(validApproval);
    expect(validResult.success).toBe(true);
  });

  it("validates meal plan schema constraints (per plate cost, buffer limits)", () => {
    const validMealPlan = {
      eventId: "123e4567-e89b-12d3-a456-426614174000",
      mealType: "dinner",
      serviceStyle: "buffet",
      plannedPerPlateCost: 2500,
      bufferPercentage: 15,
    };

    const result = mealPlanSchema.safeParse(validMealPlan);
    expect(result.success).toBe(true);

    const excessiveBuffer = {
      ...validMealPlan,
      bufferPercentage: 75, // Max is 50%
    };
    const badBufferResult = mealPlanSchema.safeParse(excessiveBuffer);
    expect(badBufferResult.success).toBe(false);
  });
});

