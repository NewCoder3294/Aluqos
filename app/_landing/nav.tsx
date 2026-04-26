"use client";

import { useEffect, useState } from "react";
import { hireProductManager } from "@/src/server/hire";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";

const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: "#product", label: "Product" },
  { href: "#how", label: "How it works" },
  { href: "#roles", label: "Roles" },
  { href: "#why", label: "Why now" },
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
        "sticky top-0 z-40 transition-colors duration-200",
        "bg-[--color-paper]/85 backdrop-blur",
        scrolled
          ? "border-b border-[--color-paper-edge]"
          : "border-b border-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <a href="#top" className="serif text-[18px] tracking-[-0.01em] text-[--color-ink]">
          Saathi
        </a>

        <nav
          aria-label="Primary"
          className="hidden lg:flex items-center gap-8 text-[13px] text-[--color-ink-muted]"
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[--color-coral-deep] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden sm:inline-block text-[13px] text-[--color-ink-faint] hover:text-[--color-ink] transition-colors duration-200"
          >
            Sign in
          </a>
          <form action={hireProductManager}>
            <Button variant="ink" size="md" type="submit">
              Get early access
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
