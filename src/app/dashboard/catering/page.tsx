"use client";

import * as React from "react";
import {
  UtensilsCrossed,
  Calculator,
  AlertTriangle,
  ShieldCheck,
  Download,
  Users,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_CATERING_PLANS } from "@/lib/mock-data";
import { formatINR, calculateCateringGuarantee } from "@/lib/utils";
import { CateringPlan } from "@/types/models";
import { approveCateringGuaranteeAction } from "@/lib/actions/catering";
import { ShaadiStorage } from "@/lib/shaadi-storage";

const MEAL_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  high_tea: "High Tea",
  dinner: "Gala Dinner",
};

export default function CateringPage() {
  const [buffer, setBuffer] = React.useState<number>(10);
  const [plans, setPlans] = React.useState<CateringPlan[]>([]);
  const [approvingId, setApprovingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPlans(ShaadiStorage.getCateringPlans());
  }, []);

  const totalConfirmedGuests = plans.reduce((acc, plan) => acc + plan.confirmedRsvp, 0);

  const totalGuaranteedPlates = plans.reduce((acc, plan) => {
    if (plan.isGuaranteeApproved && plan.approvedGuaranteeHeadcount) {
      return acc + plan.approvedGuaranteeHeadcount;
    }
    const calc = calculateCateringGuarantee(plan.confirmedRsvp, buffer);
    return acc + calc.guaranteedHeadcount;
  }, 0);

  const totalEstimatedCost = plans.reduce((acc, plan) => {
    const plates = plan.isGuaranteeApproved && plan.approvedGuaranteeHeadcount
      ? plan.approvedGuaranteeHeadcount
      : calculateCateringGuarantee(plan.confirmedRsvp, buffer).guaranteedHeadcount;
    return acc + plates * plan.perPlateEstimate;
  }, 0);

  const handleApproveGuarantee = async (planId: string, currentHeadcount: number) => {
    setApprovingId(planId);
    try {
      const res = await approveCateringGuaranteeAction(planId, currentHeadcount);
      if (res.success) {
        const updated = plans.map((p) =>
          p.id === planId
            ? {
                ...p,
                isGuaranteeApproved: true,
                approvedGuaranteeHeadcount: currentHeadcount,
                approvedBy: "Current Organiser",
                approvedAt: new Date().toISOString(),
              }
            : p
        );
        setPlans(updated);
        ShaadiStorage.saveCateringPlans(updated);
      }
    } finally {
      setApprovingId(null);
    }
  };

  const handlePrintSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Banquet Catering & Guaranteed Headcounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            RSVP-driven catering calculations with explicit organiser guarantee approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintSheet}
            className="gap-2 border-slate-200"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            Print Caterer Sheet
          </Button>
        </div>
      </div>

      {/* Buffer Control Card */}
      <Card className="border-gold-300/40 bg-gold-50/20">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-burgundy-600" />
                <h3 className="font-semibold text-navy-900 text-base">
                  Safety Buffer Configuration
                </h3>
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                Indian weddings typically add a 5% to 15% buffer over confirmed RSVPs to accommodate unexpected guests, unannounced children, and venue staff allocations.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm w-full lg:w-auto">
              <div className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Buffer: <span className="font-bold text-burgundy-700 text-base">+{buffer}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="5"
                value={buffer}
                onChange={(e) => setBuffer(Number(e.target.value))}
                className="w-48 accent-burgundy-600 cursor-pointer"
                aria-label="Safety Buffer Percentage"
              />
              <div className="flex gap-1">
                {[5, 10, 15, 20].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBuffer(val)}
                    className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                      buffer === val
                        ? "bg-burgundy-600 text-white border-burgundy-600 font-bold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    +{val}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Headcount & Budget Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Confirmed Guests
              <Users className="h-4 w-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">{totalConfirmedGuests}</div>
            <p className="text-xs text-slate-500 mt-1">Adults + children RSVP&apos;d Attending</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-burgundy-700 uppercase tracking-wider flex items-center justify-between">
              Guaranteed Plates
              <UtensilsCrossed className="h-4 w-4 text-burgundy-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-burgundy-700">{totalGuaranteedPlates}</div>
            <p className="text-xs text-slate-500 mt-1">Confirmed + buffer allocations</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
              Guarantees Approved
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {plans.filter((p) => p.isGuaranteeApproved).length} / {plans.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Signed off for caterer production</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-navy-800 uppercase tracking-wider flex items-center justify-between">
              Total Catering Cost
              <Calculator className="h-4 w-4 text-navy-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">{formatINR(totalEstimatedCost)}</div>
            <p className="text-xs text-slate-500 mt-1">Based on guaranteed counts</p>
          </CardContent>
        </Card>
      </div>

      {/* Meal Plans Table */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-navy-900">
              Ceremony Meal Plans & Headcount Breakdown
            </CardTitle>
            <span className="text-xs text-slate-500">
              Safety buffer applies dynamically unless a guarantee has been locked and signed off.
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[200px]">Function & Meal</TableHead>
                <TableHead>Caterer</TableHead>
                <TableHead className="text-center">Invited</TableHead>
                <TableHead className="text-center">Confirmed</TableHead>
                <TableHead className="text-center">Pending</TableHead>
                <TableHead className="text-center">Proposed (+{buffer}%)</TableHead>
                <TableHead className="text-center">Caterer Guarantee</TableHead>
                <TableHead className="text-right">Per Plate</TableHead>
                <TableHead className="text-right">Est. Total</TableHead>
                <TableHead className="text-right">Approval Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => {
                const calc = calculateCateringGuarantee(plan.confirmedRsvp, buffer);
                const isApproved = plan.isGuaranteeApproved;
                const finalHeadcount = isApproved && plan.approvedGuaranteeHeadcount
                  ? plan.approvedGuaranteeHeadcount
                  : calc.guaranteedHeadcount;
                const cost = finalHeadcount * plan.perPlateEstimate;

                return (
                  <TableRow key={plan.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="font-semibold text-navy-900">{plan.functionName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold py-0">
                          {MEAL_LABELS[plan.mealType] || plan.mealType}
                        </Badge>
                        {plan.serviceStyle && (
                          <span className="text-slate-400 capitalize">({plan.serviceStyle.replace("_", " ")})</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-slate-800 text-sm">{plan.catererName}</div>
                      {plan.notes && (
                        <div className="text-xs text-slate-500 truncate max-w-[160px]">{plan.notes}</div>
                      )}
                    </TableCell>

                    <TableCell className="text-center text-slate-600">{plan.totalInvited}</TableCell>
                    <TableCell className="text-center font-bold text-navy-900">{plan.confirmedRsvp}</TableCell>
                    <TableCell className="text-center text-amber-700 font-medium">
                      {plan.pendingRsvp || 0}
                    </TableCell>
                    <TableCell className="text-center text-slate-700">
                      {calc.guaranteedHeadcount}
                      <span className="text-[10px] text-slate-400 block">(+{calc.bufferCount})</span>
                    </TableCell>

                    <TableCell className="text-center">
                      {isApproved ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          {finalHeadcount} locked
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium">
                          <Clock className="h-3 w-3 text-amber-600" />
                          {calc.guaranteedHeadcount} proposed
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-right text-slate-700">
                      {formatINR(plan.perPlateEstimate)}
                    </TableCell>

                    <TableCell className="text-right font-bold text-navy-900">
                      {formatINR(cost)}
                    </TableCell>

                    <TableCell className="text-right">
                      {isApproved ? (
                        <span className="text-xs text-emerald-700 font-semibold block">
                          Signed Off
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={approvingId === plan.id}
                          onClick={() => handleApproveGuarantee(plan.id, calc.guaranteedHeadcount)}
                          className="h-8 text-xs gap-1 border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {approvingId === plan.id ? "Locking..." : "Approve Guarantee"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Caterer Directives Box */}
      <Card className="border-slate-200 bg-slate-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-navy-900">
                Organiser Guarantee Protocol
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guaranteed plate commitments cannot be revoked once shared with the venue or caterer. Pending RSVPs are strictly isolated from confirmed attendance to prevent inflated invoicing. When a guarantee is approved, it locks the headcount order for that ceremony.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
