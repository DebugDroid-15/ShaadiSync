import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-navy-700 text-white shadow-subtle hover:bg-navy-800 active:bg-navy-900",
        gold:
          "bg-gold-500 text-navy-900 font-semibold shadow-subtle hover:bg-gold-600 active:bg-gold-700",
        secondary:
          "bg-ivory-200 text-navy-800 hover:bg-ivory-300 border border-ivory-300",
        outline:
          "border border-navy-300 text-navy-800 hover:bg-navy-50",
        ghost:
          "text-navy-700 hover:bg-navy-100/50",
        destructive:
          "bg-terracotta-500 text-white hover:bg-terracotta-600 shadow-subtle",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-6 text-base font-medium",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
