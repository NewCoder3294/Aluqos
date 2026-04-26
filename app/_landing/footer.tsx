const PRODUCT_LINKS: Array<{ href: string; label: string }> = [
  { href: "#roles", label: "Roles" },
  { href: "#pricing", label: "Pricing" },
  { href: "#", label: "Changelog" },
  { href: "#", label: "Status" },
];

const COMPANY_LINKS: Array<{ href: string; label: string }> = [
  { href: "#", label: "About" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Press" },
  { href: "mailto:hello@saathi.ai", label: "hello@saathi.ai" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-[--color-paper-edge]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="serif text-[20px] tracking-[-0.01em] text-[--color-ink]">
              Saathi
            </div>
            <p className="mt-3 max-w-[36ch] text-[14px] leading-[1.6] text-[--color-ink-muted]">
              AI employees that learn how you work.
            </p>
            <p className="mt-6 text-[12px] text-[--color-ink-faint]">
              &copy; 2026 Saathi Labs, Inc.
            </p>
          </div>

          <FooterColumn title="Product" links={PRODUCT_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
        </div>

        <div className="mt-12 pt-6 border-t border-[--color-paper-edge] text-[12px] italic text-[--color-ink-faint] serif">
          Made in San Francisco
        </div>
      </div>
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
      <div className="text-[11px] uppercase tracking-[0.14em] text-[--color-ink-faint] font-medium">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5">
        {links.map(link => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-[14px] text-[--color-ink-muted] hover:text-[--color-coral-deep] transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
