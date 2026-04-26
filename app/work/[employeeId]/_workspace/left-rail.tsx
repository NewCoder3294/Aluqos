"use client";

import { Serif } from "@/src/components/serif";

export function LeftRail({
  employeeId,
  uploads,
  actionPlan,
}: {
  employeeId: string;
  uploads: Array<{ id: string; filename: string }>;
  actionPlan: { own: { title: string }[]; assist: { title: string }[]; flag: { title: string }[] } | null;
}) {
  void employeeId;
  return (
    <aside className="bg-[--color-paper-hi] border-r border-[--color-paper-edge] p-6 space-y-7 overflow-y-auto">
      <Section label="Source materials">
        <ul className="space-y-1 text-[13px]">
          {uploads.map(u => (
            <li key={u.id} className="flex items-center gap-2">
              <span className="w-3 h-3 inline-block border border-[--color-paper-edge] rounded-sm" />
              {u.filename}
            </li>
          ))}
          <li className="text-[12px] text-[--color-coral-deep] pt-1 cursor-pointer">＋ Add more</li>
        </ul>
      </Section>

      {actionPlan && (
        <Section label="Action plan">
          <Tier label="I will own" items={actionPlan.own} />
          <Tier label="I will assist" items={actionPlan.assist} />
          <Tier label="I will flag" items={actionPlan.flag} />
        </Section>
      )}
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="label mb-2">{label}</div>
      {children}
    </div>
  );
}

function Tier({ label, items }: { label: string; items: { title: string }[] }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-1.5 mb-3">
      <Serif italic className="text-[12.5px] text-[--color-ink-faint]">{label}</Serif>
      {items.map((it, i) => (
        <div key={i} className="text-[12.5px] bg-white border border-[--color-paper-edge] rounded px-2.5 py-1.5">
          {it.title}
        </div>
      ))}
    </div>
  );
}
