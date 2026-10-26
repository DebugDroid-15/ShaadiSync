import * as React from "react";
import { LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-50 text-gold-600 border border-gold-200/60 shadow-xs mb-4">
        <Icon className="h-7 w-7 text-gold-600" />
      </div>
      <h3 className="text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 leading-relaxed">{description}</p>
      {actionLabel && (
        <div className="mt-6">
          <Button onClick={onAction} variant="primary" className="gap-2 shadow-subtle">
            <Sparkles className="h-4 w-4 text-gold-400" />
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
