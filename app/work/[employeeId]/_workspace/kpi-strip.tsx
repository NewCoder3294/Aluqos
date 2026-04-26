"use client";

import { KpiCard } from "@/src/components/ui/kpi-card";
import { Clock, Eye, FileText, Flag } from "lucide-react";

export function KpiStrip() {
  return (
    <div className="flex items-stretch gap-3">
      <KpiCard
        label="Drafted today"
        value="1"
        trend="+1 vs. yesterday"
        trendVariant="up"
        icon={<FileText className="size-3.5" />}
      />
      <KpiCard
        label="Avg time-to-PRD"
        value="8m 14s"
        trend="−2m"
        trendVariant="up"
        icon={<Clock className="size-3.5" />}
      />
      <KpiCard
        label="Pending review"
        value="2"
        trend="awaiting approver"
        trendVariant="neutral"
        icon={<Eye className="size-3.5" />}
      />
      <KpiCard
        label="Items flagged"
        value="3"
        trend="needs your eye"
        trendVariant="warning"
        icon={<Flag className="size-3.5" />}
      />
    </div>
  );
}
