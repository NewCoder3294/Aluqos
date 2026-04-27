"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/lib/cn";
import { AGENTS, type TeamStatus } from "./data/overview";

function stateColor(state: TeamStatus["state"]): string {
  switch (state) {
    case "Drafting":
      return "bg-coral";
    case "Reviewing":
      return "bg-[#7a8b5c]";
    case "Idle":
    default:
      return "bg-paper-edge";
  }
}

export function TeamToday({
  employeeId,
  team,
}: {
  employeeId: string;
  team: TeamStatus[];
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Your team today</CardTitle>
      </CardHeader>
      <CardContent compact className="p-0">
        <ul>
          {team.map((row, idx) => {
            const meta = AGENTS[row.agent];
            const href = `/work/${employeeId}${row.href ? "/" + row.href : ""}`;
            return (
              <li key={row.agent}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-5 py-4 transition-colors hover:bg-paper-hi/40 w-full",
                    idx !== team.length - 1 && "border-b border-paper-edge",
                  )}
                >
                  <span
                    className={cn(
                      "size-8 rounded-full shrink-0 flex items-center justify-center",
                      meta.avatarGradient,
                    )}
                    aria-hidden
                  >
                    <span className="size-3 rounded-full bg-white/45" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[14px] text-ink font-medium">{meta.name}</span>
                      <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
                        {meta.role}
                      </span>
                    </div>
                    <div className="text-[12px] text-ink-faint mt-0.5 truncate">{row.detail}</div>
                    {typeof row.progress === "number" && (
                      <div className="h-1 w-full bg-paper-edge/60 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-coral"
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1.5">
                    <span className={cn("size-1.5 rounded-full", stateColor(row.state))} />
                    <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                      {row.state}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
