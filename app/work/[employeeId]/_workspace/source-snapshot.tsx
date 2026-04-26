"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "@/src/components/toast";

export function SourceSnapshot({ uploads }: { uploads: Array<{ id: string; filename: string }> }) {
  const top = uploads.slice(0, 3);
  return (
    <Card tone="default">
      <CardHeader>
        <CardTitle>Source materials</CardTitle>
        <Button variant="quiet" size="sm" onClick={() => toast.info("Coming soon")}>
          Add more
        </Button>
      </CardHeader>
      <CardContent compact className="p-0">
        <ul className="divide-y divide-[--color-paper-edge]/60">
          {top.length === 0 && (
            <li className="px-5 py-3 text-[12.5px] text-[--color-ink-faint]">
              No materials yet.
            </li>
          )}
          {top.map((u, idx) => (
            <li
              key={u.id}
              className="flex items-center gap-3 px-5 py-2.5 text-[13px] hover:bg-[--color-paper-hi]/30 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[--color-ink-faint] shrink-0" />
              <span className="text-[--color-ink] flex-1 truncate">{u.filename}</span>
              <span
                className={
                  idx === 0
                    ? "text-[10.5px] uppercase tracking-[0.1em] text-[--color-coral-deep] shrink-0"
                    : "text-[10.5px] uppercase tracking-[0.1em] text-[--color-ink-faint] shrink-0"
                }
              >
                {idx === 0 ? "reading…" : "✓ read"}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
