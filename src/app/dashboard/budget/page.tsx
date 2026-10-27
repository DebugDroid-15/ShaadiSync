"use client";

import * as React from "react";
import {
  IndianRupee,
  PieChart,
  TrendingUp,
  AlertCircle,
  Plus,
  Download,
  Receipt,
  CreditCard,
  CheckCircle2,
  Calendar,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_BUDGET, MOCK_EXPENSES, MOCK_PAYMENTS, MOCK_VENDORS } from "@/lib/mock-data";
import { formatINR, calculateBudgetVariance } from "@/lib/utils";
import {
  BudgetSummary,
  Expense,
  PaymentRecord,
  ExpenseCategory,
  PaymentMode,
  PaymentType,
} from "@/types/models";
import { createExpenseAction, recordPaymentAction } from "@/lib/actions/budget";

const CATEGORY_NAMES: Record<ExpenseCategory, string> = {
  venue: "Venue & Lawns",
  catering: "Catering & Banquets",
  decor: "Decor & Production",
  photography: "Photography & Cinema",
  entertainment: "Sound & DJ Rig",
  attire_makeup: "Attire & Makeup",
  transport_logistics: "Transport & Logistics",
  invitations_gifts: "Invitations & Favours",
  priest_rituals: "Rituals & Pandit",
  miscellaneous: "Miscellaneous",
};

export default function BudgetPage() {
  const [activeTab, setActiveTab] = React.useState<"summary" | "expenses" | "payments">("summary");
  const [budget, setBudget] = React.useState<BudgetSummary>(MOCK_BUDGET);
  const [expenses, setExpenses] = React.useState<Expense[]>(MOCK_EXPENSES);
  const [payments, setPayments] = React.useState<PaymentRecord[]>(MOCK_PAYMENTS);

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const { allocated, spent, variance, isOverBudget, percentageUsed } = calculateBudgetVariance(
    budget.totalBudget,
    budget.totalActual
  );

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Category",
      "Title",
      "Vendor / Payee",
      "Estimated (INR)",
      "Actual (INR)",
      "Paid (INR)",
      "Balance Due (INR)",
      "Status",
    ];

    const rows = expenses.map((e) => [
      `"${CATEGORY_NAMES[e.category] || e.category}"`,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${(e.vendorName || "Direct / Standalone").replace(/"/g, '""')}"`,
      e.estimatedAmount,
      e.actualAmount,
      e.paidAmount || 0,
      e.balanceDue || 0,
      e.isPaid ? "Paid" : "Pending",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ShaadiSync_Budget_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Expense Handler
  const handleCreateExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("weddingId", "wed-aarav-diya");

    try {
      const res = await createExpenseAction(formData);
      if (!res.success) {
        setFormError(res.error || "Failed to record expense.");
      } else if (res.data) {
        setExpenses((prev) => [res.data as Expense, ...prev]);
        setIsExpenseModalOpen(false);
      }
    } catch {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Record Payment Voucher Handler
  const handleRecordPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("weddingId", "wed-aarav-diya");

    try {
      const res = await recordPaymentAction(formData);
      if (!res.success) {
        setFormError(res.error || "Failed to record payment voucher.");
      } else if (res.data) {
        setPayments((prev) => [res.data as PaymentRecord, ...prev]);
        setIsPaymentModalOpen(false);
      }
    } catch {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Budget Allocations, Expenses & Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Planned-versus-actual expenditure, advance token vouchers, and non-duplicative vendor reconciliation in INR (₹).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 border-slate-200"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Ledger CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpenseModalOpen(true)}
            className="gap-2 border-slate-200"
          >
            <Receipt className="h-4 w-4 text-slate-500" />
            Add Expense
          </Button>

          <Button
            size="sm"
            onClick={() => setIsPaymentModalOpen(true)}
            className="gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-subtle"
          >
            <Plus className="h-4 w-4" />
            Record Payment Voucher
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Total Budget
              <IndianRupee className="h-4 w-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900 font-mono">{formatINR(allocated)}</div>
            <p className="text-xs text-slate-500 mt-1">Planned wedding ceiling</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-navy-900 uppercase tracking-wider flex items-center justify-between">
              Actual Committed
              <PieChart className="h-4 w-4 text-navy-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900 font-mono">{formatINR(spent)}</div>
            <p className="text-xs text-slate-500 mt-1">{percentageUsed}% of planned budget allocated</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
              Total Payments Made
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 font-mono">{formatINR(budget.advancePaid)}</div>
            <p className="text-xs text-slate-500 mt-1">Advances, tokens & cleared settlements</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center justify-between">
              Outstanding Balance Due
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 font-mono">{formatINR(budget.balanceDue)}</div>
            <p className="text-xs text-slate-500 mt-1">
              Net balance: {variance >= 0 ? `+${formatINR(variance)} surplus` : `${formatINR(variance)} deficit`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("summary")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "summary"
              ? "border-burgundy-600 text-burgundy-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Category Allocations
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("expenses")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "expenses"
              ? "border-burgundy-600 text-burgundy-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Expenses & Contracts ({expenses.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "payments"
              ? "border-burgundy-600 text-burgundy-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Payment Ledger ({payments.length})
        </button>
      </div>

      {/* TAB 1: Category Allocations */}
      {activeTab === "summary" && (
        <Card className="border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-navy-900">
              Planned vs Actual Variance by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[220px]">Budget Category</TableHead>
                  <TableHead className="text-right">Planned Allocation</TableHead>
                  <TableHead className="text-right">Actual Cost</TableHead>
                  <TableHead className="text-right">Paid to Date</TableHead>
                  <TableHead className="text-right">Balance Due</TableHead>
                  <TableHead className="text-right">Variance (Surplus/Deficit)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budget.categories.map((cat) => {
                  const catVariance = cat.allocated - cat.actual;
                  const isPositive = catVariance >= 0;

                  return (
                    <TableRow key={cat.name} className="hover:bg-slate-50">
                      <TableCell className="font-semibold text-navy-900">{cat.name}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-slate-700">
                        {formatINR(cat.allocated)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-bold text-navy-900">
                        {formatINR(cat.actual)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-emerald-700">
                        {formatINR(cat.paid)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-amber-700">
                        {formatINR(cat.due)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-bold">
                        <span
                          className={`inline-flex items-center gap-0.5 ${
                            isPositive ? "text-emerald-700" : "text-rose-700"
                          }`}
                        >
                          {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          {formatINR(Math.abs(catVariance))}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: Expenses & Contracts */}
      {activeTab === "expenses" && (
        <Card className="border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-navy-900">
              Contract Vouchers & Individual Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[220px]">Title & Category</TableHead>
                  <TableHead>Vendor / Payee</TableHead>
                  <TableHead>Ceremony / Event</TableHead>
                  <TableHead className="text-right">Estimated</TableHead>
                  <TableHead className="text-right">Actual Cost</TableHead>
                  <TableHead className="text-right">Paid Amount</TableHead>
                  <TableHead className="text-right">Balance Due</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="font-semibold text-navy-900">{exp.title}</div>
                      <div className="text-xs text-slate-500 capitalize">
                        {CATEGORY_NAMES[exp.category] || exp.category}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm font-medium text-slate-800">
                        {exp.vendorName || "Direct Expense"}
                      </div>
                      {exp.invoiceNumber && (
                        <div className="text-[11px] text-slate-400 font-mono">Inv: {exp.invoiceNumber}</div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-slate-600">{exp.eventName || "Wedding-wide"}</div>
                    </TableCell>

                    <TableCell className="text-right font-mono text-sm text-slate-500">
                      {formatINR(exp.estimatedAmount)}
                    </TableCell>

                    <TableCell className="text-right font-mono text-sm font-bold text-navy-900">
                      {formatINR(exp.actualAmount)}
                    </TableCell>

                    <TableCell className="text-right font-mono text-sm text-emerald-700">
                      {formatINR(exp.paidAmount || 0)}
                    </TableCell>

                    <TableCell className="text-right font-mono text-sm font-bold text-amber-700">
                      {formatINR(exp.balanceDue || 0)}
                    </TableCell>

                    <TableCell className="text-center">
                      {exp.isPaid || (exp.balanceDue === 0 && exp.actualAmount > 0) ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Paid in Full</Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Payment Ledger */}
      {activeTab === "payments" && (
        <Card className="border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-navy-900">
              Cleared Payment Vouchers & Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Payee / Vendor</TableHead>
                  <TableHead>Linked Voucher</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Ref / Transaction ID</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50">
                    <TableCell className="font-mono text-xs text-slate-700">{p.paymentDate}</TableCell>
                    <TableCell className="font-medium text-navy-900">{p.vendorName || "Direct / Standalone"}</TableCell>
                    <TableCell className="text-xs text-slate-600 truncate max-w-[150px]">{p.expenseTitle || "General Token"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {p.paymentType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 uppercase font-semibold">{p.paymentMode.replace("_", " ")}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{p.referenceNumber || "—"}</TableCell>
                    <TableCell className="text-xs text-slate-600">{p.paidByName || "Organiser"}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-sm text-emerald-700">
                      {formatINR(p.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-navy-900">Record New Expense Voucher</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {formError && (
                <div className="p-3 mb-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateExpense} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="title">Expense Title *</Label>
                    <Input id="title" name="title" required placeholder="e.g. Sangeet Stage Sound" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    >
                      <option value="venue">Venue & Lawns</option>
                      <option value="catering">Catering & Banquets</option>
                      <option value="decor">Decor & Production</option>
                      <option value="photography">Photography & Cinema</option>
                      <option value="entertainment">Sound & DJ Rig</option>
                      <option value="attire_makeup">Attire & Makeup</option>
                      <option value="transport_logistics">Transport & Logistics</option>
                      <option value="invitations_gifts">Invitations & Favours</option>
                      <option value="priest_rituals">Rituals & Pandit</option>
                      <option value="miscellaneous">Miscellaneous</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="estimatedAmount">Estimated Amount (₹)</Label>
                    <Input id="estimatedAmount" name="estimatedAmount" type="number" min="0" defaultValue="0" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="actualAmount">Actual / Contracted (₹) *</Label>
                    <Input id="actualAmount" name="actualAmount" type="number" min="0" required defaultValue="0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="invoiceNumber">Invoice / Bill Number</Label>
                    <Input id="invoiceNumber" name="invoiceNumber" placeholder="INV-2026-001" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="dueDate">Payment Due Date</Label>
                    <Input id="dueDate" name="dueDate" type="date" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description">Notes / Scope Description</Label>
                  <Input id="description" name="description" placeholder="Optional details, deliverables, milestone clauses..." />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsExpenseModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                    {isSubmitting ? "Saving..." : "Save Expense"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Record Payment Voucher Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-navy-900">Record Payment Voucher</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {formError && (
                <div className="p-3 mb-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="amount">Payment Amount (₹) *</Label>
                    <Input id="amount" name="amount" type="number" required placeholder="e.g. 50000" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="paymentDate">Payment Date *</Label>
                    <Input
                      id="paymentDate"
                      name="paymentDate"
                      type="date"
                      required
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="paymentType">Payment Type</Label>
                    <select
                      id="paymentType"
                      name="paymentType"
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    >
                      <option value="advance">Token Advance</option>
                      <option value="milestone">Milestone Installment</option>
                      <option value="final">Final Settlement</option>
                      <option value="refund">Refund Received</option>
                      <option value="correction">Correction</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="paymentMode">Payment Mode</Label>
                    <select
                      id="paymentMode"
                      name="paymentMode"
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    >
                      <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
                      <option value="upi">UPI (GPay/PhonePe/Paytm)</option>
                      <option value="cash">Cash Voucher</option>
                      <option value="cheque">Cheque</option>
                      <option value="card">Card</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="referenceNumber">Reference / UTR / Cheque #</Label>
                    <Input id="referenceNumber" name="referenceNumber" placeholder="e.g. UPI-9923841" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="paidByName">Paid By Person</Label>
                    <Input id="paidByName" name="paidByName" placeholder="e.g. Laxman / Father of Bride" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" name="notes" placeholder="Transaction remarks, receipt details..." />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                    {isSubmitting ? "Recording..." : "Record Payment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
