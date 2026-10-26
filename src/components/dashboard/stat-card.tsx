import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border border-slate-200/80 bg-white shadow-card hover:border-gold-300 transition-all", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
            <Icon className="h-5 w-5 text-gold-600" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-navy-900">{value}</p>
          {(subtitle || trend) && (
            <div className="mt-1 flex items-center gap-2 text-xs">
              {trend && (
                <span
                  className={cn(
                    "font-semibold",
                    trendUp ? "text-emerald-600" : "text-terracotta-600"
                  )}
                >
                  {trend}
                </span>
              )}
              {subtitle && <span className="text-slate-500">{subtitle}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
