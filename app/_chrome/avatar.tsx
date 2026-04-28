import { cn } from "@/src/lib/cn";

// Initials-in-a-coral-gradient circle. Used wherever a person appears in the
// product — recipient rows, attention items, people orbit, draft headers.
// Falls back to a neutral monogram for null actors so empty states still look
// considered, never broken.

const SIZE_PX: Record<NonNullable<AvatarProps["size"]>, number> = {
  xs: 20,
  sm: 28,
  md: 36,
  lg: 48,
};

const FONT_SIZE_PX: Record<NonNullable<AvatarProps["size"]>, number> = {
  xs: 9,
  sm: 11,
  md: 13,
  lg: 17,
};

type AvatarProps = {
  name: string | null;
  size?: "xs" | "sm" | "md" | "lg";
  /** Override the auto-derived initials (e.g. for "Alex" → "A") */
  initials?: string;
  /** Tone variant. "coral" for people, "neutral" for ambient/unknown */
  tone?: "coral" | "neutral";
  className?: string;
};

function deriveInitials(name: string | null): string {
  if (!name) return "·";
  const cleaned = name.includes("@") ? (name.split("@")[0] ?? name) : name;
  const parts = cleaned.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return (parts[0]?.[0] ?? "·").toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Avatar({
  name,
  size = "md",
  initials,
  tone = "coral",
  className,
}: AvatarProps) {
  const px = SIZE_PX[size];
  const fontPx = FONT_SIZE_PX[size];
  const label = initials ?? deriveInitials(name);

  return (
    <span
      role="img"
      aria-label={name ?? "Unknown person"}
      className={cn(
        "inline-flex items-center justify-center rounded-full select-none shrink-0",
        "border border-paper-edge/60",
        tone === "coral"
          ? "bg-gradient-to-br from-coral/85 via-coral to-coral-deep text-paper"
          : "bg-paper-hi text-ink-faint",
        className,
      )}
      style={{
        width: `${px}px`,
        height: `${px}px`,
        fontSize: `${fontPx}px`,
        letterSpacing: "0.02em",
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}
