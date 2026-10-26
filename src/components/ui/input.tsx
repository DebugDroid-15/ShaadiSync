import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-navy-700">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-slate-400 focus-visible:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            error && "border-terracotta-500 focus-visible:ring-terracotta-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-terracotta-600 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
