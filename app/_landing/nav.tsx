"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";
import { LogoMark } from "./logo";

const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: "#how", label: "How it works" },
  { href: "#roles", label: "Roles" },
  { href: "#team", label: "Team" },
  { href: "#pricing", label: "Pricing" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300 ease-out",
        scrolled
          ? "py-3 bg-transparent"
          : "py-0 bg-paper/40 backdrop-blur-md border-b border-paper-edge/30",
      )}
    >
      <div
        className={cn(
          "mx-auto transition-all duration-300 ease-out",
          scrolled
            ? // Pill — liquid glass: heavy blur, saturated bg, paper-edge ring,
              // soft outer drop shadow + thin inset highlight on the top edge.
              "max-w-4xl h-13 px-7 rounded-full " +
              "bg-paper-hi/60 backdrop-blur-xl backdrop-saturate-150 " +
              "border border-paper-edge/70 " +
              "shadow-[0_10px_30px_-12px_rgba(31,29,26,0.20),inset_0_1px_0_0_rgba(255,255,255,0.55)]"
            : // Full-width bar — flush, transparent, lets the hero glow show through
              "max-w-6xl h-14 px-6 rounded-none bg-transparent border-transparent",
        )}
      >
        <div
          className={cn(
            "h-full grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-300",
            scrolled ? "gap-4" : "gap-6",
          )}
        >
          <a
            href="#top"
            className={cn(
              "inline-flex items-center justify-self-start serif tracking-[-0.01em] text-ink transition-all duration-300",
              scrolled ? "gap-2 text-[15px]" : "gap-2.5 text-[18px]",
            )}
          >
            <LogoMark
              className="rounded-[5px]"
              style={{
                width: scrolled ? 18 : 22,
                height: scrolled ? 18 : 22,
              }}
            />
            Aluqos
          </a>

          <nav
            aria-label="Primary"
            className={cn(
              "hidden lg:flex items-center justify-self-center text-ink-muted transition-all duration-300",
              scrolled ? "gap-2 text-[12px]" : "gap-3 text-[13px]",
            )}
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full transition-all duration-200",
                  "hover:bg-paper-edge/50 hover:text-ink",
                  scrolled ? "px-3 py-1.5" : "px-3.5 py-2",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <span aria-hidden className="justify-self-end" />
        </div>
      </div>
    </header>
  );
}
