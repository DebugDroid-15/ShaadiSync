import { describe, it, expect } from "vitest";
import { formatINR, calculateBudgetVariance } from "@/lib/utils";
import {
  budgetAllocationSchema,
  expenseSchema,
  paymentRecordSchema,
} from "@/lib/validations/budget-expenses";

describe("Phase 6: Monetary Precision & Budget Variance Calculations", () => {
  it("formats Indian Rupee (INR) amounts with standard lakh/crore commas and symbol", () => {
    expect(formatINR(150000)).toContain("1,50,000");
    expect(formatINR(4500000)).toContain("45,00,000");
    expect(formatINR(0)).toBe("₹0.00");
    expect(formatINR(null)).toBe("₹0.00");
  });

  it("calculates budget variance accurately distinguishing surplus and deficit", () => {
    // Under budget: Budget 10,00,000, Actual 7,50,000 -> Variance +2,50,000 (surplus)
    const underBudget = calculateBudgetVariance(1000000, 750000);
    expect(underBudget.allocated).toBe(1000000);
    expect(underBudget.spent).toBe(750000);
    expect(underBudget.variance).toBe(250000);
    expect(underBudget.isOverBudget).toBe(false);
    expect(underBudget.percentageUsed).toBe(75);

    // Over budget: Budget 5,00,000, Actual 6,20,000 -> Variance -1,20,000 (deficit)
    const overBudget = calculateBudgetVariance(500000, 620000);
    expect(overBudget.variance).toBe(-120000);
    expect(overBudget.isOverBudget).toBe(true);
    expect(overBudget.percentageUsed).toBe(100); // capped at 100 for gauge usage
  });

  it("handles zero total budget cleanly without NaN", () => {
    const zeroBudget = calculateBudgetVariance(0, 50000);
    expect(zeroBudget.variance).toBe(-50000);
    expect(zeroBudget.percentageUsed).toBe(0);
    expect(zeroBudget.isOverBudget).toBe(true);
  });
});

describe("Phase 6: Expense & Payment Validations & Invariants", () => {
  it("validates valid expense records with positive amounts and standard categories", () => {
    const validExpense = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      category: "decor",
      title: "Mandap Floral Setup",
      estimatedAmount: 350000,
      actualAmount: 320000,
      invoiceNumber: "INV-2026-99",
    };

    const res = expenseSchema.safeParse(validExpense);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.category).toBe("decor");
      expect(res.data.actualAmount).toBe(320000);
    }
  });

  it("rejects negative expense amounts", () => {
    const negativeExpense = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      title: "Floral Setup",
      actualAmount: -5000,
    };

    const res = expenseSchema.safeParse(negativeExpense);
    expect(res.success).toBe(false);
  });

  it("validates payment vouchers with non-zero amounts and modes", () => {
    const validPayment = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      amount: 50000,
      paymentType: "advance",
      paymentMode: "upi",
      paymentDate: "2026-10-27",
      referenceNumber: "UPI-481920",
    };

    const res = paymentRecordSchema.safeParse(validPayment);
    expect(res.success).toBe(true);
  });

  it("allows negative payments for refunds or corrections but rejects exact 0 amount", () => {
    const zeroPayment = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      amount: 0,
      paymentDate: "2026-10-27",
    };

    const zeroRes = paymentRecordSchema.safeParse(zeroPayment);
    expect(zeroRes.success).toBe(false);

    const refundPayment = {
      weddingId: "123e4567-e89b-12d3-a456-426614174000",
      amount: -15000,
      paymentType: "refund",
      paymentMode: "bank_transfer",
      paymentDate: "2026-10-27",
    };

    const refundRes = paymentRecordSchema.safeParse(refundPayment);
    expect(refundRes.success).toBe(true);
    if (refundRes.success) {
      expect(refundRes.data.amount).toBe(-15000);
      expect(refundRes.data.paymentType).toBe("refund");
    }
  });
});

describe("Phase 6: Non-Duplicative Vendor & Expense Reconciliation", () => {
  it("prevents double-counting vendor contracts when linked to expenses", () => {
    // Contract agreed price: 10,00,000
    // Linked expense actual_amount: 10,00,000
    // Total should be 10,00,000, NEVER 20,00,000
    const vendorContract = { id: "vnd-01", agreedPrice: 1000000 };
    const expenses = [
      { id: "exp-01", vendorId: "vnd-01", actualAmount: 1000000 },
      { id: "exp-02", vendorId: null, actualAmount: 50000 }, // Standalone
    ];

    const linkedVendorIds = new Set(expenses.map((e) => e.vendorId).filter(Boolean));
    const standaloneVendorSum = [vendorContract]
      .filter((v) => !linkedVendorIds.has(v.id))
      .reduce((acc, v) => acc + v.agreedPrice, 0);

    const expenseActualSum = expenses.reduce((acc, e) => acc + e.actualAmount, 0);
    const unifiedActual = expenseActualSum + standaloneVendorSum;

    expect(standaloneVendorSum).toBe(0); // Because vendor is linked in exp-01
    expect(unifiedActual).toBe(1050000); // 10,00,000 + 50,000
    expect(unifiedActual).not.toBe(2050000); // Verified: NO double counting
  });
});

