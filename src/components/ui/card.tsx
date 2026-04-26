import * as React from "react";
import { cn } from "@/src/lib/cn";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { tone?: "default" | "primary" | "muted" }
>(({ className, tone = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white border border-paper-edge rounded-lg overflow-hidden",
      tone === "default" && "shadow-[0_1px_2px_rgba(31,29,26,0.04)]",
      tone === "primary" && "shadow-[0_2px_8px_rgba(31,29,26,0.06)]",
      tone === "muted" && "bg-paper-hi/40",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-3 px-5 py-3.5 bg-paper-hi border-b border-paper-edge",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("serif text-[15px] tracking-[-0.01em] text-ink", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-[12px] text-ink-faint", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }
>(({ className, compact, ...props }, ref) => (
  <div ref={ref} className={cn(compact ? "p-5" : "p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-3 px-5 py-3 bg-paper-hi border-t border-paper-edge",
        className,
      )}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";
