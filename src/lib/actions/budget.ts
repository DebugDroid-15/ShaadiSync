"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  budgetAllocationSchema,
  expenseSchema,
  paymentRecordSchema,
} from "@/lib/validations/budget-expenses";
import {
  MOCK_BUDGET,
  MOCK_BUDGET_ALLOCATIONS,
  MOCK_EXPENSES,
  MOCK_PAYMENTS,
  MOCK_VENDORS,
} from "@/lib/mock-data";
import {
  BudgetSummary,
  Expense,
  PaymentRecord,
  BudgetAllocation,
  ExpenseCategory,
} from "@/types/models";

export type BudgetActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Fetch budget summary and reconciliation for a wedding
 * Ensures vendor contracts and standalone expenses are unified without double-counting.
 */
export async function getBudgetSummaryAction(
  weddingId: string
): Promise<BudgetActionResult<BudgetSummary>> {
  if (!isSupabaseConfigured()) {
    return { success: true, data: MOCK_BUDGET };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  // Fetch wedding total budget
  const { data: weddingData, error: wedErr } = await (supabase.from("weddings") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: { total_budget: number } | null; error: { message: string } | null }> } };
  })
    .select("total_budget")
    .eq("id", weddingId)
    .single();

  if (wedErr) return { success: false, error: wedErr.message };

  // Fetch allocations
  const { data: allocations } = await (supabase.from("budget_allocations") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ category: ExpenseCategory; allocated_amount: number }> | null }> };
  })
    .select("category, allocated_amount")
    .eq("wedding_id", weddingId);

  // Fetch expenses
  const { data: expenses } = await (supabase.from("expenses") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ id: string; category: ExpenseCategory; actual_amount: number; vendor_id: string | null }> | null }> };
  })
    .select("id, category, actual_amount, vendor_id")
    .eq("wedding_id", weddingId);

  // Fetch vendors (agreed prices)
  const { data: vendors } = await (supabase.from("vendors") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ id: string; category: string; agreed_price: number; advance_paid: number }> | null }> };
  })
    .select("id, category, agreed_price, advance_paid")
    .eq("wedding_id", weddingId);

  // Fetch payments
  const { data: payments } = await (supabase.from("payments") as unknown as {
    select: (q: string) => { eq: (col: string, val: string) => Promise<{ data: Array<{ id: string; vendor_id: string | null; expense_id: string | null; amount: number }> | null }> };
  })
    .select("id, vendor_id, expense_id, amount")
    .eq("wedding_id", weddingId);

  // Standard category map
  const categoryNames: Record<ExpenseCategory, string> = {
    venue: "Venue & Lawns",
    catering: "Catering & Banquets",
    decor: "Decor & Floral",
    photography: "Photography & Cinema",
    entertainment: "Sound, DJ & Entertainment",
    attire_makeup: "Attire & Makeup",
    transport_logistics: "Transport & Fleet",
    invitations_gifts: "Invitations & Favours",
    priest_rituals: "Rituals & Pandit",
    miscellaneous: "Miscellaneous",
  };

  const categories: ExpenseCategory[] = [
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
  ];

  let totalActual = 0;
  let totalPaid = 0;

  const categoryItems = categories.map((cat) => {
    const allocated =
      allocations?.filter((a) => a.category === cat).reduce((acc, a) => acc + Number(a.allocated_amount), 0) || 0;

    // Expenses belonging to this category
    const catExpenses = expenses?.filter((e) => e.category === cat) || [];
    // Vendors belonging to this category (mapped from vendor category)
    const catVendors =
      vendors?.filter((v) => {
        if (cat === "catering") return v.category === "caterer";
        if (cat === "decor") return v.category === "decorator" || v.category === "florist";
        if (cat === "photography") return v.category === "photographer" || v.category === "videographer";
        if (cat === "entertainment") return v.category === "dj";
        if (cat === "attire_makeup") return v.category === "makeup";
        if (cat === "transport_logistics") return v.category === "transport";
        if (cat === "venue") return v.category === "venue";
        if (cat === "priest_rituals") return v.category === "priest";
        return v.category === "other";
      }) || [];

    // Avoid double counting: If an expense has a vendor_id, that contract is tracked via expense actual_amount OR vendor agreed_price
    // In our model, vendors without dedicated linked expenses represent their agreed_price
    const linkedVendorIds = new Set(catExpenses.map((e) => e.vendor_id).filter(Boolean));
    const standaloneVendorSum = catVendors
      .filter((v) => !linkedVendorIds.has(v.id))
      .reduce((acc, v) => acc + Number(v.agreed_price), 0);

    const expenseActualSum = catExpenses.reduce((acc, e) => acc + Number(e.actual_amount), 0);
    const actual = expenseActualSum + standaloneVendorSum;

    // Payments: payments linked to these expenses or these vendors
    const catExpenseIds = new Set(catExpenses.map((e) => e.id));
    const catVendorIds = new Set(catVendors.map((v) => v.id));

    const paid =
      payments
        ?.filter((p) => (p.expense_id && catExpenseIds.has(p.expense_id)) || (p.vendor_id && catVendorIds.has(p.vendor_id)))
        .reduce((acc, p) => acc + Number(p.amount), 0) || 0;

    const due = Math.max(0, actual - paid);
    const variance = allocated - actual;

    totalActual += actual;
    totalPaid += paid;

    return {
      category: cat,
      name: categoryNames[cat],
      allocated,
      actual,
      paid,
      due,
      variance,
    };
  });

  const totalBudget = Number(weddingData?.total_budget) || 0;
  const balanceDue = Math.max(0, totalActual - totalPaid);
  const variance = totalBudget - totalActual;

  return {
    success: true,
    data: {
      totalBudget,
      totalActual,
      advancePaid: totalPaid,
      balanceDue,
      variance,
      categories: categoryItems,
    },
  };
}

/**
 * Fetch all expenses for a wedding
 */
export async function getExpensesAction(
  weddingId: string
): Promise<BudgetActionResult<Expense[]>> {
  if (!isSupabaseConfigured()) {
    const list = MOCK_EXPENSES.filter((e) => e.weddingId === weddingId || weddingId.startsWith("mock") || weddingId === "wed-aarav-diya");
    return { success: true, data: list };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("expenses") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .select("*, event:events(name), vendor:vendors(business_name), payments(amount)")
    .eq("wedding_id", weddingId)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  interface RawExpenseRow {
    id: string;
    wedding_id: string;
    event_id: string | null;
    vendor_id: string | null;
    category: ExpenseCategory;
    title: string;
    description: string | null;
    estimated_amount: number;
    actual_amount: number;
    is_paid: boolean;
    invoice_number: string | null;
    due_date: string | null;
    event?: { name: string } | null;
    vendor?: { business_name: string } | null;
    payments?: Array<{ amount: number }>;
  }

  const rows = (data as RawExpenseRow[]) || [];
  const mapped: Expense[] = rows.map((r) => {
    const paidSum = r.payments?.reduce((acc, p) => acc + Number(p.amount), 0) || 0;
    return {
      id: r.id,
      weddingId: r.wedding_id,
      eventId: r.event_id,
      eventName: r.event?.name || null,
      vendorId: r.vendor_id,
      vendorName: r.vendor?.business_name || null,
      category: r.category,
      title: r.title,
      description: r.description,
      estimatedAmount: Number(r.estimated_amount),
      actualAmount: Number(r.actual_amount),
      isPaid: r.is_paid || (paidSum >= Number(r.actual_amount) && Number(r.actual_amount) > 0),
      invoiceNumber: r.invoice_number,
      dueDate: r.due_date,
      paidAmount: paidSum,
      balanceDue: Math.max(0, Number(r.actual_amount) - paidSum),
    };
  });

  return { success: true, data: mapped };
}

/**
 * Record a new expense
 */
export async function createExpenseAction(formData: FormData): Promise<BudgetActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    eventId: (formData.get("eventId") as string) || null,
    vendorId: (formData.get("vendorId") as string) || null,
    category: (formData.get("category") as string) || "miscellaneous",
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    estimatedAmount: Number(formData.get("estimatedAmount") || 0),
    actualAmount: Number(formData.get("actualAmount") || 0),
    isPaid: formData.get("isPaid") === "true",
    invoiceNumber: (formData.get("invoiceNumber") as string) || null,
    dueDate: (formData.get("dueDate") as string) || null,
  };

  const parseResult = expenseSchema.safeParse(raw);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.errors.map((e) => e.message).join(", "),
    };
  }

  const validated = parseResult.data;

  if (!isSupabaseConfigured()) {
    const newExp: Expense = {
      id: `mock-exp-${Date.now()}`,
      weddingId: validated.weddingId,
      eventId: validated.eventId,
      vendorId: validated.vendorId,
      category: validated.category,
      title: validated.title,
      description: validated.description,
      estimatedAmount: validated.estimatedAmount,
      actualAmount: validated.actualAmount,
      isPaid: validated.isPaid,
      invoiceNumber: validated.invoiceNumber,
      dueDate: validated.dueDate,
      paidAmount: 0,
      balanceDue: validated.actualAmount,
    };
    return { success: true, data: newExp };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("expenses") as unknown as {
    insert: (row: unknown) => { select: () => { single: () => Promise<{ data: { id: string }; error: { message: string } | null }> } };
  })
    .insert({
      wedding_id: validated.weddingId,
      event_id: validated.eventId,
      vendor_id: validated.vendorId,
      category: validated.category,
      title: validated.title,
      description: validated.description,
      estimated_amount: validated.estimatedAmount,
      actual_amount: validated.actualAmount,
      is_paid: validated.isPaid,
      invoice_number: validated.invoiceNumber,
      due_date: validated.dueDate,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // Financial audit log
  const { data: userAuth } = await supabase.auth.getUser();
  await (supabase.from("financial_audit_logs") as unknown as {
    insert: (row: unknown) => Promise<unknown>;
  }).insert({
    wedding_id: validated.weddingId,
    entity_type: "expense",
    entity_id: data.id,
    action: "CREATE",
    new_values: validated,
    performed_by: userAuth.user?.id || null,
  });

  revalidatePath("/dashboard/budget");
  return { success: true, data };
}

/**
 * Fetch all payments made for a wedding
 */
export async function getPaymentsAction(
  weddingId: string
): Promise<BudgetActionResult<PaymentRecord[]>> {
  if (!isSupabaseConfigured()) {
    const list = MOCK_PAYMENTS.filter((p) => p.weddingId === weddingId || weddingId.startsWith("mock") || weddingId === "wed-aarav-diya");
    return { success: true, data: list };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data, error } = await (supabase.from("payments") as unknown as {
    select: (q: string) => {
      eq: (col: string, val: string) => {
        order: (col: string, opt: { ascending: boolean }) => Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  })
    .select("*, vendor:vendors(business_name), expense:expenses(title)")
    .eq("wedding_id", weddingId)
    .order("payment_date", { ascending: false });

  if (error) return { success: false, error: error.message };

  interface RawPaymentRow {
    id: string;
    wedding_id: string;
    vendor_id: string | null;
    expense_id: string | null;
    amount: number;
    payment_type: PaymentRecord["paymentType"];
    payment_mode: PaymentRecord["paymentMode"];
    payment_date: string;
    reference_number: string | null;
    paid_by_name: string | null;
    notes: string | null;
    created_at: string;
    vendor?: { business_name: string } | null;
    expense?: { title: string } | null;
  }

  const rows = (data as RawPaymentRow[]) || [];
  const mapped: PaymentRecord[] = rows.map((r) => ({
    id: r.id,
    weddingId: r.wedding_id,
    vendorId: r.vendor_id,
    vendorName: r.vendor?.business_name || null,
    expenseId: r.expense_id,
    expenseTitle: r.expense?.title || null,
    amount: Number(r.amount),
    paymentType: r.payment_type,
    paymentMode: r.payment_mode,
    paymentDate: r.payment_date,
    referenceNumber: r.reference_number,
    paidByName: r.paid_by_name,
    notes: r.notes,
    createdAt: r.created_at,
  }));

  return { success: true, data: mapped };
}

/**
 * Record a payment voucher / advance / milestone / refund
 */
export async function recordPaymentAction(formData: FormData): Promise<BudgetActionResult> {
  const raw = {
    weddingId: formData.get("weddingId") as string,
    vendorId: (formData.get("vendorId") as string) || null,
    expenseId: (formData.get("expenseId") as string) || null,
    amount: Number(formData.get("amount") || 0),
    paymentType: (formData.get("paymentType") as string) || "advance",
    paymentMode: (formData.get("paymentMode") as string) || "bank_transfer",
    paymentDate: (formData.get("paymentDate") as string) || new Date().toISOString().split("T")[0],
    referenceNumber: (formData.get("referenceNumber") as string) || null,
    paidByName: (formData.get("paidByName") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  const parseResult = paymentRecordSchema.safeParse(raw);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.errors.map((e) => e.message).join(", "),
    };
  }

  const validated = parseResult.data;

  if (!isSupabaseConfigured()) {
    const newPayment: PaymentRecord = {
      id: `mock-pay-${Date.now()}`,
      weddingId: validated.weddingId,
      vendorId: validated.vendorId,
      expenseId: validated.expenseId,
      amount: validated.amount,
      paymentType: validated.paymentType,
      paymentMode: validated.paymentMode,
      paymentDate: validated.paymentDate,
      referenceNumber: validated.referenceNumber,
      paidByName: validated.paidByName,
      notes: validated.notes,
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: newPayment };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, error: "Database client unavailable." };

  const { data: userAuth } = await supabase.auth.getUser();

  const { data, error } = await (supabase.from("payments") as unknown as {
    insert: (row: unknown) => { select: () => { single: () => Promise<{ data: { id: string }; error: { message: string } | null }> } };
  })
    .insert({
      wedding_id: validated.weddingId,
      vendor_id: validated.vendorId,
      expense_id: validated.expenseId,
      amount: validated.amount,
      payment_type: validated.paymentType,
      payment_mode: validated.paymentMode,
      payment_date: validated.paymentDate,
      reference_number: validated.referenceNumber,
      paid_by_name: validated.paidByName,
      notes: validated.notes,
      created_by: userAuth.user?.id || null,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // If vendor payment, update vendor advance_paid
  if (validated.vendorId && validated.amount > 0) {
    const { data: vendorData } = await (supabase.from("vendors") as unknown as {
      select: (q: string) => { eq: (col: string, val: string) => { single: () => Promise<{ data: { advance_paid: number } | null }> } };
    })
      .select("advance_paid")
      .eq("id", validated.vendorId)
      .single();

    if (vendorData) {
      const currentAdvance = Number(vendorData.advance_paid) || 0;
      await (supabase.from("vendors") as unknown as {
        update: (row: unknown) => { eq: (col: string, val: string) => Promise<unknown> };
      })
        .update({ advance_paid: currentAdvance + validated.amount })
        .eq("id", validated.vendorId);
    }
  }

  // Audit log
  await (supabase.from("financial_audit_logs") as unknown as {
    insert: (row: unknown) => Promise<unknown>;
  }).insert({
    wedding_id: validated.weddingId,
    entity_type: "payment",
    entity_id: data.id,
    action: "CREATE",
    new_values: validated,
    performed_by: userAuth.user?.id || null,
  });

  revalidatePath("/dashboard/budget");
  revalidatePath("/dashboard/vendors");
  return { success: true, data };
}

