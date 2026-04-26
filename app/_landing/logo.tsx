import { cn } from "@/src/lib/cn";

export function LogoMark({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden
      style={style}
      className={cn("shrink-0", className)}
    >
      <rect width="64" height="64" rx="14" fill="#1f1d1a" />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="var(--font-serif), Newsreader, Georgia, serif"
        fontSize="40"
        fontWeight={500}
        fill="#f4ede1"
        letterSpacing="-1"
      >
        A
      </text>
      <circle cx="49" cy="15" r="4" fill="#c46449" />
    </svg>
  );
}

export function Logo({
  className,
  textClassName,
  markSize = 22,
}: {
  className?: string;
  textClassName?: string;
  markSize?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark style={{ width: markSize, height: markSize }} className="rounded-[5px]" />
      <span className={cn("serif tracking-[-0.01em] text-ink", textClassName)}>
        Aluqos
      </span>
    </span>
  );
}
