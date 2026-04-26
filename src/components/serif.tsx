import { cn } from "@/src/lib/cn";

export function Serif({
  as: Tag = "span",
  className,
  italic,
  children,
}: {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  italic?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tag className={cn("serif", italic && "italic", className)}>{children}</Tag>
  );
}
