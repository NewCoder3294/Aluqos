"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-coral] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-paper] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        ink: "bg-[--color-ink] text-[--color-paper] hover:bg-[--color-coral-deep]",
        outline:
          "bg-white border border-[--color-paper-edge] text-[--color-ink] hover:border-[--color-coral] hover:text-[--color-coral-deep]",
        ghost:
          "text-[--color-ink-faint] hover:text-[--color-ink] hover:bg-[--color-paper-hi]",
        coral: "bg-[--color-coral] text-white hover:bg-[--color-coral-deep]",
        quiet:
          "text-[--color-ink-faint] hover:text-[--color-coral-deep] underline-offset-4 hover:underline",
      },
      size: {
        sm: "px-3 py-1.5 text-[12px] uppercase tracking-[0.1em] rounded-sm",
        md: "px-5 py-2 text-[12px] uppercase tracking-[0.12em] rounded-sm",
        lg: "px-7 py-3 text-[12px] uppercase tracking-[0.12em] rounded-sm",
        icon: "size-9 rounded-full",
        chip: "px-3 py-1.5 text-[12px] rounded-full normal-case tracking-normal",
      },
    },
    defaultVariants: { variant: "ink", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
