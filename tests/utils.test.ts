import { describe, it, expect } from "vitest";
import {
  formatINR,
  formatDate,
  calculateCateringGuarantee,
  calculateBudgetVariance,
} from "@/lib/utils";

describe("ShaadiSync Core Utility & Arithmetic Engine", () => {
  describe("formatINR Currency Formatter", () => {
    it("formats integer amounts into standard Indian numbering with rupee symbol", () => {
      const formatted = formatINR(150000);
      // Depending on locale whitespace, it should contain 1,50,000 and ₹
      expect(formatted).toContain("1,50,000");
      expect(formatted).toContain("₹");
    });

    it("formats zero amount safely", () => {
      const formatted = formatINR(0);
      expect(formatted).toContain("0.00");
    });

    it("handles null, undefined, or NaN defensively", () => {
      expect(formatINR(null)).toBe("₹0.00");
      expect(formatINR(undefined)).toBe("₹0.00");
      expect(formatINR("invalid")).toBe("₹0.00");
    });
  });

  describe("Catering Headcount Guarantee Engine", () => {
    it("computes guaranteed headcount with 10% safety buffer correctly", () => {
      const result = calculateCateringGuarantee(100, 10);
      expect(result.confirmed).toBe(100);
      expect(result.bufferCount).toBe(10);
      expect(result.guaranteedHeadcount).toBe(110);
    });

    it("rounds up buffer count using ceiling function to protect catering shortfalls", () => {
      // 155 * 10% = 15.5 -> ceiling is 16
      const result = calculateCateringGuarantee(155, 10);
      expect(result.confirmed).toBe(155);
      expect(result.bufferCount).toBe(16);
      expect(result.guaranteedHeadcount).toBe(171);
    });

    it("handles zero confirmed attendees without throwing errors", () => {
      const result = calculateCateringGuarantee(0, 10);
      expect(result.confirmed).toBe(0);
      expect(result.bufferCount).toBe(0);
      expect(result.guaranteedHeadcount).toBe(0);
    });
  });

  describe("Budget Variance & Utilization Calculation", () => {
    it("calculates positive variance when under budget", () => {
      const result = calculateBudgetVariance(4500000, 2850000);
      expect(result.allocated).toBe(4500000);
      expect(result.spent).toBe(2850000);
      expect(result.variance).toBe(1650000);
      expect(result.isOverBudget).toBe(false);
      expect(result.percentageUsed).toBe(63);
    });

    it("flags deficit when actual expenses exceed allocated budget", () => {
      const result = calculateBudgetVariance(1000000, 1200000);
      expect(result.variance).toBe(-200000);
      expect(result.isOverBudget).toBe(true);
    });
  });

  describe("Date Formatter", () => {
    it("formats valid ISO dates cleanly", () => {
      const formatted = formatDate("2026-11-20T14:00:00+05:30");
      expect(formatted).toContain("2026");
      expect(formatted).toContain("Nov");
    });

    it("handles null and undefined dates gracefully", () => {
      expect(formatDate(null)).toBe("Date TBD");
      expect(formatDate(undefined)).toBe("Date TBD");
    });
  });
});
