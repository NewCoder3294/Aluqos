"use client";

import { useState } from "react";
import { cn } from "@/src/lib/cn";

type Slice = {
  source: string;
  count: number;
  color: string;
};

const CX = 90;
const CY = 90;
const OUTER = 70;
const INNER = 48;
const POP = 8;
// Tiny gap between wedges (degrees) so adjacent slices read as separate.
const GAP_DEG = 1.5;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function wedgePath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number,
): string {
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  const o1 = polar(cx, cy, rOuter, startDeg);
  const o2 = polar(cx, cy, rOuter, endDeg);
  const i1 = polar(cx, cy, rInner, endDeg);
  const i2 = polar(cx, cy, rInner, startDeg);
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${i2.x} ${i2.y}`,
    "Z",
  ].join(" ");
}

export function SourceDonut({ data }: { data: Slice[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.count, 0);

  let cumulativeDeg = 0;
  const slices = data.map((d) => {
    const fraction = d.count / total;
    const span = fraction * 360;
    const startDeg = cumulativeDeg + GAP_DEG / 2;
    const endDeg = cumulativeDeg + span - GAP_DEG / 2;
    const midDeg = (startDeg + endDeg) / 2;
    cumulativeDeg += span;
    return {
      ...d,
      startDeg,
      endDeg,
      midDeg,
      pct: Math.round(fraction * 100),
      path: wedgePath(CX, CY, OUTER, INNER, startDeg, endDeg),
    };
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center pt-1">
        <div className="relative">
          <svg
            width={180}
            height={180}
            viewBox="0 0 180 180"
            className="overflow-visible"
            aria-label="Top sources this week"
          >
            {slices.map((s, i) => {
              const isActive = hovered === i;
              const isDimmed = hovered !== null && !isActive;
              const a = ((s.midDeg - 90) * Math.PI) / 180;
              const dx = isActive ? Math.cos(a) * POP : 0;
              const dy = isActive ? Math.sin(a) * POP : 0;
              return (
                <path
                  key={s.source}
                  d={s.path}
                  fill={s.color}
                  className={cn(
                    "cursor-pointer transition-[transform,opacity,filter] duration-200 ease-out",
                    "[transform-box:fill-box] [transform-origin:center]",
                  )}
                  style={{
                    opacity: isDimmed ? 0.4 : 1,
                    transform: `translate(${dx}px, ${dy}px)`,
                    filter: isActive
                      ? "drop-shadow(0 4px 10px rgba(0,0,0,0.15))"
                      : undefined,
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="serif text-[28px] tabular-nums text-ink leading-none">
              {hovered === null ? total : slices[hovered].count}
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint mt-1">
              {hovered === null ? "requests" : slices[hovered].source}
            </span>
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {slices.map((s, i) => {
          const isActive = hovered === i;
          const isDimmed = hovered !== null && !isActive;
          return (
            <li
              key={s.source}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex items-center gap-2.5 px-1.5 py-1 -mx-1.5 rounded-md cursor-pointer",
                "transition-[background-color,opacity] duration-150 ease-out",
                isActive && "bg-paper-hi/60",
                isDimmed && "opacity-50",
              )}
            >
              <span
                aria-hidden
                className="size-2.5 rounded-sm shrink-0 transition-transform duration-150"
                style={{
                  backgroundColor: s.color,
                  transform: isActive ? "scale(1.25)" : "scale(1)",
                }}
              />
              <span className="text-[13px] text-ink flex-1">{s.source}</span>
              <span className="text-[11.5px] tabular-nums text-ink-faint">
                {s.pct}%
              </span>
              <span className="serif text-[15px] tabular-nums text-ink w-7 text-right">
                {s.count}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
