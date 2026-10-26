import { z } from "zod";

export const expenseCategoryEnum = z.enum([
  "venue",
  "catering",
  "decor",
  "photography",
  "entertainment",
  "attire_makeup",
  "transport_logistics",
  "invitations_gifts",
  "priest_rituals",
  "miscellaneous",
]);

export const paymentModeEnum = z.enum([
  "bank_transfer",
  "upi",
  "cash",
  "cheque",
  "card",
  "other",
]);

export const paymentTypeEnum = z.enum([
  "advance",
  "milestone",
  "final",
  "refund",
  "correction",
]);

export const budgetAllocationSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  eventId: z.string().uuid().optional().nullable(),
  category: expenseCategoryEnum,
  allocatedAmount: z.coerce
    .number()
    .min(0, "Allocated amount cannot be negative.")
    .default(0),
  notes: z.string().optional().nullable(),
});

export const expenseSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  eventId: z.string().uuid().optional().nullable(),
  vendorId: z.string().uuid().optional().nullable(),
  category: expenseCategoryEnum.default("miscellaneous"),
  title: z.string().min(1, "Expense title is required."),
  description: z.string().optional().nullable(),
  estimatedAmount: z.coerce
    .number()
    .min(0, "Estimated amount must be 0 or more.")
    .default(0),
  actualAmount: z.coerce
    .number()
    .min(0, "Actual cost must be 0 or more.")
    .default(0),
  isPaid: z.boolean().default(false),
  invoiceNumber: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

export const paymentRecordSchema = z.object({
  weddingId: z.string().uuid("Valid wedding ID required."),
  vendorId: z.string().uuid().optional().nullable(),
  expenseId: z.string().uuid().optional().nullable(),
  amount: z.coerce
    .number()
    .refine((val) => val !== 0, "Payment amount cannot be zero."),
  paymentType: paymentTypeEnum.default("advance"),
  paymentMode: paymentModeEnum.default("bank_transfer"),
  paymentDate: z.string().min(1, "Payment date is required."),
  referenceNumber: z.string().optional().nullable(),
  paidByName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type BudgetAllocationFormData = z.infer<typeof budgetAllocationSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type PaymentRecordFormData = z.infer<typeof paymentRecordSchema>;

