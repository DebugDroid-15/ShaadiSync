"use client";

import * as React from "react";
import { UtensilsCrossed, Calculator, AlertTriangle, ShieldCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_CATERING_PLANS } from "@/lib/mock-data";
import { formatINR, calculateCateringGuarantee } from "@/lib/utils";

export default function CateringPage() {
  const [buffer, setBuffer] = React.useState<number>(10);

  const totalGuaranteedPlates = MOCK_CATERING_PLANS.reduce((acc, plan) => {
    const calc = calculateCateringGuarantee(plan.confirmedRsvp, buffer);
    return acc + calc.guaranteedHeadcount;
  }, 0);

  const totalEstimatedCost = MOCK_CATERING_PLANS.reduce((acc, plan) => {
    const calc = calculateCateringGuarantee(plan.confirmedRsvp, buffer);
    return acc + calc.guaranteedHeadcount * plan.perPlateEstimate;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Banquet Catering & Guaranteed Headcounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dynamic catering calculations based strictly on confirmed RSVPs + configurable safety buffer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Printable caterer guarantee summary will be generated in Phase 5.")}
            className="gap-2"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Download Caterer Sheet
          </Button>
        </div>
      </div>

      {/* Buffer Control Card */}
      <Card className="border-gold-300 bg-white shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-gold-600" />
                <h3 className="font-bold text-navy-900">Configurable Kitchen Safety Buffer</h3>
              </div>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                Indian wedding banquet contracts require guaranteeing a plate minimum. Adjust the safety buffer percentage to account for unexpected walk-ins without overpaying.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-ivory-100 p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-navy-800">Safety Buffer:</span>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setBuffer(pct)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      buffer === pct
                        ? "bg-navy-700 text-gold-400 shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    +{pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Headcount Breakdown Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ceremony</TableHead>
            <TableHead>Meal Service</TableHead>
            <TableHead>Caterer</TableHead>
            <TableHead className="text-center">Total Invited</TableHead>
            <TableHead className="text-center">Confirmed RSVPs</TableHead>
            <TableHead className="text-center">Safety Buffer (+{buffer}%)</TableHead>
            <TableHead className="text-center font-bold text-navy-900">Guaranteed Headcount</TableHead>
            <TableHead className="text-right">Per Plate</TableHead>
            <TableHead className="text-right">Estimated Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_CATERING_PLANS.map((plan) => {
            const { confirmed, bufferCount, guaranteedHeadcount } = calculateCateringGuarantee(
              plan.confirmedRsvp,
              buffer
            );
            const subtotal = guaranteedHeadcount * plan.perPlateEstimate;

            return (
              <TableRow key={plan.id}>
                <TableCell className="font-semibold text-navy-900">
                  {plan.functionName}
                </TableCell>
                <TableCell className="capitalize text-xs font-medium text-slate-700">
                  {plan.mealType}
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {plan.catererName}
                </TableCell>
                <TableCell className="text-center font-mono text-xs">{plan.totalInvited}</TableCell>
                <TableCell className="text-center font-mono text-xs text-emerald-700 font-semibold">
                  {confirmed}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-amber-600">
                  +{bufferCount} plates
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-navy-900 bg-gold-50/50">
                  {guaranteedHeadcount}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {formatINR(plan.perPlateEstimate)}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-navy-900">
                  {formatINR(subtotal)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Total Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-navy-900 text-white rounded-2xl shadow-elevated gap-4">
        <div>
          <p className="text-xs text-gold-400 font-semibold uppercase tracking-wider">Approved Banquet Total</p>
          <p className="text-sm text-slate-300 mt-0.5">Calculated across 3 major meal services with +{buffer}% safety buffer</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-mono text-gold-400">{formatINR(totalEstimatedCost)}</p>
          <p className="text-xs text-slate-300 font-mono">{totalGuaranteedPlates} Total Plates Ordered</p>
        </div>
      </div>
    </div>
  );
}
