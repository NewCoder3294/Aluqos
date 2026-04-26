"use client";

import * as React from "react";
import { cn } from "@/src/lib/cn";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs subcomponents must be used inside <Tabs>");
  return ctx;
}

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const value = controlled ?? internal;
  const setValue = React.useCallback(
    (v: string) => {
      if (controlled === undefined) setInternal(v);
      onValueChange?.(v);
    },
    [controlled, onValueChange],
  );
  const ctx = React.useMemo(() => ({ value, setValue }), [value, setValue]);
  return (
    <TabsContext.Provider value={ctx}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-1 border-b border-paper-edge",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  count,
  className,
}: {
  value: string;
  children: React.ReactNode;
  count?: number;
  className?: string;
}) {
  const { value: active, setValue } = useTabs();
  const isActive = active === value;
  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={() => setValue(value)}
      className={cn(
        "relative px-3 py-2 text-[12px] uppercase tracking-[0.1em] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 rounded-sm",
        isActive
          ? "text-ink"
          : "text-ink-faint hover:text-ink-muted",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {typeof count === "number" && (
          <span
            className={cn(
              "inline-flex items-center justify-center min-w-[18px] h-[16px] px-1 rounded-full text-[10px] tracking-normal normal-case",
              isActive
                ? "bg-coral/15 text-coral-deep"
                : "bg-paper-hi text-ink-faint border border-paper-edge",
            )}
          >
            {count}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full transition-colors",
          isActive ? "bg-coral" : "bg-transparent",
        )}
      />
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { value: active } = useTabs();
  if (active !== value) return null;
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
}
