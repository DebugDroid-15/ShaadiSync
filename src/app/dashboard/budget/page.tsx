"use client";

import * as React from "react";
import { IndianRupee, PieChart, TrendingUp, AlertCircle, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MOCK_BUDGET } from "@/lib/mock-data";
import { formatINR, calculateBudgetVariance } from "@/lib/utils";

export default function BudgetPage() {
  const { allocated, spent, variance, isOverBudget, percentageUsed } = calculateBudgetVariance(
    MOCK_BUDGET.totalBudget,
    MOCK_BUDGET.totalActual
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Budget Allocations & Vendor Balances
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track planned budgets, advance token payments, and outstanding balances in Indian Rupees (₹ INR).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Financial CSV export activates in Phase 6.")}
            className="gap-2"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export Ledger
          </Button>
          <Button
            size="sm"
            onClick={() => alert("Add Expense voucher modal activates in Phase 6.")}
            className="gap-2 shadow-subtle"
          >
            <Plus className="h-4 w-4" />
            Record Payment Voucher
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-slate-200 shadow-card">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Budget</p>
            <p className="text-2xl font-bold text-navy-900 mt-2 font-mono">{formatINR(allocated)}</p>
            <p className="text-xs text-slate-500 mt-1">Planned expenditure cap</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-card">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Actual Contracted</p>
            <p className="text-2xl font-bold text-navy-900 mt-2 font-mono">{formatINR(spent)}</p>
            <p className="text-xs text-slate-500 mt-1">{percentageUsed}% of planned budget</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-card">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Advance Paid</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2 font-mono">{formatINR(MOCK_BUDGET.advancePaid)}</p>
            <p className="text-xs text-slate-500 mt-1">Cleared bank/UPI transfers</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-card">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Outstanding Balance Due</p>
            <p className="text-2xl font-bold text-terracotta-600 mt-2 font-mono">{formatINR(MOCK_BUDGET.balanceDue)}</p>
            <p className="text-xs text-slate-500 mt-1">Payable upon delivery/event day</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Ledger Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Budget Category</TableHead>
            <TableHead className="text-right">Allocated (₹)</TableHead>
            <TableHead className="text-right">Actual Cost (₹)</TableHead>
            <TableHead className="text-right">Advance Paid (₹)</TableHead>
            <TableHead className="text-right">Balance Due (₹)</TableHead>
            <TableHead className="text-right">Variance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_BUDGET.categories.map((cat) => {
            const catVariance = cat.allocated - cat.actual;
            return (
              <TableRow key={cat.name}>
                <TableCell className="font-semibold text-navy-900">{cat.name}</TableCell>
                <TableCell className="text-right font-mono text-xs">{formatINR(cat.allocated)}</TableCell>
                <TableCell className="text-right font-mono text-xs font-semibold">{formatINR(cat.actual)}</TableCell>
                <TableCell className="text-right font-mono text-xs text-emerald-700">{formatINR(cat.paid)}</TableCell>
                <TableCell className="text-right font-mono text-xs text-terracotta-700">{formatINR(cat.due)}</TableCell>
                <TableCell className="text-right font-mono text-xs font-bold text-emerald-700">
                  {catVariance >= 0 ? `+${formatINR(catVariance)}` : formatINR(catVariance)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
