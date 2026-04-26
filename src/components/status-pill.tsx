export function StatusPill({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span className="text-[11px] uppercase tracking-[0.12em] text-coral-deep inline-flex items-center gap-2">
      {active && (
        <span className="w-[7px] h-[7px] rounded-full bg-coral pulse-coral" />
      )}
      {children}
    </span>
  );
}
