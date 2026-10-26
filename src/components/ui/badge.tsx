import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-navy-700 text-white",
        secondary: "bg-ivory-300 text-navy-800",
        gold: "bg-gold-100 text-gold-900 border border-gold-300",
        success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        destructive: "bg-terracotta-100 text-terracotta-600 border border-terracotta-200",
        outline: "text-navy-700 border border-slate-300",
        vip: "bg-gradient-to-r from-gold-400 to-gold-600 text-white font-semibold shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
