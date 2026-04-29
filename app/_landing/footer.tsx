"use client";

import { Reveal } from "./motion-primitives";

// All hrefs resolve to live anchors on the homepage or a real address.
// Do not add a footer link without first making sure its target exists.
const FOOTER_LINKS: Array<{ href: string; label: string }> = [
  { href: "#how", label: "How it works" },
  { href: "#integrations", label: "Integrations" },
  { href: "#architecture", label: "Architecture" },
  { href: "#founders", label: "Founders" },
  { href: "mailto:hello@aluqos.ai", label: "hello@aluqos.ai" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-paper-edge">
      <Reveal fade duration={0.7}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] text-ink-muted hover:text-coral-deep transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-[12px] text-ink-faint">
            <span className="serif italic">Made in San Francisco</span>
            <span aria-hidden>&middot;</span>
            <span>&copy; 2026 Aluqos Labs, Inc.</span>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
