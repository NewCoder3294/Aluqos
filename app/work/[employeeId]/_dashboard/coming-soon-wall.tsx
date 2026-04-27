import Link from "next/link";
import { DashboardShell } from "./dashboard-shell";
import { Button } from "@/src/components/ui/button";
import { Serif } from "@/src/components/serif";
import type { ActiveNavKey } from "./tree-nav";
import { cn } from "@/src/lib/cn";

type ComingSoonWallProps = {
  employeeId: string;
  employeeName: string;
  activeNav: ActiveNavKey;
  /** Display name of the locked teammate (e.g. "Jordan", "Sam"). */
  name: string;
  /** Role label (e.g. "Program Manager", "Marketing"). */
  role: string;
  /** Tailwind gradient class for the avatar circle. */
  avatarGradient: string;
  /** One sentence on what this teammate will do. */
  pitch: string;
};

export function ComingSoonWall({
  employeeId,
  employeeName,
  activeNav,
  name,
  role,
  avatarGradient,
  pitch,
}: ComingSoonWallProps) {
  return (
    <DashboardShell employeeId={employeeId} employeeName={employeeName} activeNav={activeNav}>
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="max-w-[520px] w-full text-center flex flex-col items-center gap-5">
          <span
            className={cn(
              "size-16 rounded-full flex items-center justify-center text-white text-[20px] font-medium shadow-sm",
              avatarGradient,
            )}
            aria-hidden
          >
            {name.charAt(0)}
          </span>

          <div className="text-[10px] uppercase tracking-[0.18em] text-coral-deep font-medium">
            Coming soon
          </div>

          <Serif as="h1" className="text-[36px] leading-[1.05] tracking-[-0.02em]">
            {name} is still in training.
          </Serif>

          <p className="text-[15px] text-ink-muted leading-relaxed max-w-[44ch]">
            {pitch} We&rsquo;re hiring {name} ({role}) right after Alex becomes your favorite teammate.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Button variant="ink" size="lg" asChild>
              <Link href={`/work/${employeeId}`}>Back to Alex →</Link>
            </Button>
            <Button variant="quiet" size="md" asChild>
              <Link href="/#waitlist">Join the waitlist</Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
