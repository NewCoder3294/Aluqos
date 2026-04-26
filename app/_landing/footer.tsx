"use client";

import { Reveal } from "./motion-primitives";

const PRODUCT_LINKS: Array<{ href: string; label: string }> = [
  { href: "#roles", label: "Roles" },
  { href: "#pricing", label: "Pricing" },
  { href: "#how", label: "How it works" },
  { href: "#why", label: "Why now" },
];

const RESOURCES_LINKS: Array<{ href: string; label: string }> = [
  { href: "#", label: "Documentation" },
  { href: "#", label: "Changelog" },
  { href: "#", label: "Status" },
  { href: "#", label: "API" },
];

const COMPANY_LINKS: Array<{ href: string; label: string }> = [
  { href: "#", label: "About" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Press" },
  { href: "mailto:hello@aluqos.ai", label: "hello@aluqos.ai" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-paper-edge">
      <Reveal fade duration={0.7}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2 md:col-span-1">
              <div className="serif text-[20px] tracking-[-0.01em] text-ink">
                Aluqos
              </div>
              <p className="mt-3 max-w-[36ch] text-[14px] leading-[1.6] text-ink-muted">
                AI employees that learn how you work.
              </p>
              <p className="mt-6 text-[12px] text-ink-faint">
                &copy; 2026 Aluqos Labs, Inc.
              </p>
            </div>

            <FooterColumn title="Product" links={PRODUCT_LINKS} />
            <FooterColumn title="Resources" links={RESOURCES_LINKS} />
            <FooterColumn title="Company" links={COMPANY_LINKS} />
          </div>

          <div className="mt-12 pt-6 border-t border-paper-edge text-[12px] italic text-ink-faint serif">
            Made in San Francisco
          </div>
        </div>
      </Reveal>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-faint font-medium">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5">
        {links.map(link => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-[14px] text-ink-muted hover:text-coral-deep transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
