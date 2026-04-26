import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-[0.02em]",
  {
    variants: {
      variant: {
        default: "bg-paper-hi text-ink-muted border border-paper-edge",
        coral: "bg-coral/10 text-coral-deep border border-coral/20",
        green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        ink: "bg-ink text-paper",
        outline: "bg-transparent text-ink-muted border border-paper-edge",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
