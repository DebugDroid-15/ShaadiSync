import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and twMerge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers into standard Indian Rupee currency format (e.g. ₹1,50,000.00).
 * Handles floating-point numbers defensively.
 */
export function formatINR(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "₹0.00";
  }
  const numericAmount = Number(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Format date string into readable Indian wedding format.
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "Date TBD";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "Invalid Date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Format time string into 12-hour format with AM/PM.
 */
export function formatTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return "";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

/**
 * Calculate catering guaranteed headcount with optional buffer.
 * Formula: Guaranteed = Confirmed Attendees + ceil(Confirmed Attendees * (bufferPct / 100))
 */
export function calculateCateringGuarantee(
  confirmedAttendees: number,
  bufferPercentage: number = 10
): { confirmed: number; confirmedHeadcount: number; bufferCount: number; guaranteedHeadcount: number } {
  const safeConfirmed = Math.max(0, Math.floor(confirmedAttendees));
  const safeBuffer = Math.max(0, bufferPercentage);
  const bufferCount = Math.ceil((safeConfirmed * safeBuffer) / 100);
  return {
    confirmed: safeConfirmed,
    confirmedHeadcount: safeConfirmed,
    bufferCount,
    guaranteedHeadcount: safeConfirmed + bufferCount,
  };
}

/**
 * Compute budget variance (Positive = surplus / under budget, Negative = deficit / over budget)
 */
export function calculateBudgetVariance(budget: number, actualExpenses: number): {
  allocated: number;
  spent: number;
  variance: number;
  isOverBudget: boolean;
  percentageUsed: number;
} {
  const variance = budget - actualExpenses;
  const percentageUsed = budget > 0 ? (actualExpenses / budget) * 100 : 0;
  return {
    allocated: budget,
    spent: actualExpenses,
    variance,
    isOverBudget: variance < 0,
    percentageUsed: Math.min(100, Math.round(percentageUsed)),
  };
}

