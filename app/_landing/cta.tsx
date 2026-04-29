"use client";

import { Serif } from "@/src/components/serif";
import { Card } from "@/src/components/ui/card";
import { Reveal } from "./motion-primitives";
import { EarlyAccessDialog } from "./early-access-dialog";

// Pricing tiers — three tiers to anchor expected price range. The middle
// tier is per-agent (not per-user) on purpose: it reinforces the
// "hiring an AI employee" frame. Numbers are placeholders the team can
// tune; what matters is the SHAPE of the anchor (free → real number → enterprise).
type Tier = {
  name: string;
  price: string;
  unit?: string;
  blurb: string;
  cta: { kind: "dialog"; source: string; label: string } | { kind: "mailto"; label: string };
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Free trial",
    price: "$0",
    blurb: "Two-week observation window. Aluqos watches your stack and proposes workflows. Zero commitment.",
    cta: { kind: "dialog", source: "pricing-free", label: "Start free trial" },
  },
  {
    name: "Pro",
    price: "$299",
    unit: "per agent / month",
    blurb: "One AI employee, fully ramped. Unlimited workflows, full autonomy controls, audit log, priority support.",
    cta: { kind: "dialog", source: "pricing-pro", label: "Hire an agent" },
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    blurb: "Multiple agents, SSO, on-prem deployment, dedicated success engineer, custom integrations.",
    cta: { kind: "mailto", label: "Contact sales" },
  },
];

export function LandingCTA() {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
      {/* Pricing */}
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
          Pricing
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[24ch]">
          One agent.{" "}
          <span className="italic-serif text-coral-deep">Or a whole team.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={0.1 + i * 0.05}>
            <div
              className={`h-full rounded-xl border p-7 lg:p-8 flex flex-col ${
                tier.featured
                  ? "border-coral/40 bg-paper-hi shadow-[0_4px_24px_rgba(196,100,73,0.12)]"
                  : "border-paper-edge bg-paper-hi/40"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <Serif className="text-[20px] leading-tight">{tier.name}</Serif>
                {tier.featured ? (
                  <span className="text-[10px] uppercase tracking-[0.14em] text-coral-deep">
                    Most teams
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="serif text-[40px] leading-none tracking-[-0.02em] text-ink tabular-nums">
                  {tier.price}
                </span>
                {tier.unit ? (
                  <span className="text-[12px] text-ink-faint leading-snug">
                    {tier.unit}
                  </span>
                ) : null}
              </div>
              <p className="mt-5 text-[14px] leading-[1.55] text-ink-muted flex-1">
                {tier.blurb}
              </p>
              <div className="mt-6">
                {tier.cta.kind === "dialog" ? (
                  <EarlyAccessDialog
                    triggerLabel={tier.cta.label}
                    triggerVariant={tier.featured ? "ink" : "outline"}
                    triggerSize="md"
                    source={tier.cta.source}
                  />
                ) : (
                  <a
                    href="mailto:hello@aluqos.ai?subject=Aluqos%20Enterprise%20inquiry"
                    className="inline-flex items-center justify-center rounded-md border border-paper-edge bg-white px-4 py-2 text-[13px] font-medium text-ink hover:border-coral/40 hover:text-coral-deep transition-colors"
                  >
                    {tier.cta.label}
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <p className="mt-6 text-[12.5px] text-ink-faint">
          Private beta. We&rsquo;re onboarding a small cohort each week.
        </p>
      </Reveal>

      {/* Closer */}
      <Reveal delay={0.35}>
        <Card
          tone="primary"
          className="relative overflow-hidden px-8 lg:px-16 py-12 lg:py-16 mt-14"
        >
          <span
            aria-hidden
            className="cta-breathe pointer-events-none absolute inset-0"
          />
          <div className="relative text-center">
            <Serif
              as="h2"
              className="text-[clamp(28px,4vw,44px)] leading-[1.1] tracking-[-0.02em] max-w-[22ch] mx-auto"
            >
              Stop asking humans to learn AI.
            </Serif>
            <p className="serif italic text-[clamp(22px,3vw,32px)] leading-[1.2] text-coral-deep mt-3 max-w-[20ch] mx-auto">
              Let AI learn humans.
            </p>
            <p className="mt-6 text-[16px] text-ink-muted max-w-[48ch] mx-auto">
              Tell us the most repetitive thing on your team&rsquo;s plate. We&rsquo;ll
              show you what Aluqos would propose.
            </p>
            <div className="mt-10 flex justify-center">
              <EarlyAccessDialog source="footer-cta" triggerLabel="Request early access" />
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
