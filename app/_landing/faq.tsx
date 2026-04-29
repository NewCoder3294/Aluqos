"use client";

import { Serif } from "@/src/components/serif";
import { Reveal } from "./motion-primitives";

// FAQ / objection-killers — written for both YC reviewers and the LOI
// prospect. Three questions only. Direct, confident, no soft-pedalling.

type QA = {
  q: string;
  a: React.ReactNode;
};

const FAQ: QA[] = [
  {
    q: "How is this different from Glean or Notion AI?",
    a: (
      <>
        Glean reads. Notion writes inside Notion. Aluqos watches your work,
        authors automations as Markdown skills <em>your team owns</em>, and
        runs them across every tool you already use. The skills library is
        the moat — and it&rsquo;s portable text, not a black box.
      </>
    ),
  },
  {
    q: "What if I don't trust the AI to act?",
    a: (
      <>
        You don&rsquo;t have to. Every external write — emails, tickets,
        Slack messages — requires one approval. The brain plans freely, but
        only humans ship. Dial autonomy up per workflow as trust builds.
        Audit log of every action, forever.
      </>
    ),
  },
  {
    q: "Where does my data live?",
    a: (
      <>
        Two modes. Hosted Aluqos for fast onboarding (SOC 2 in flight).
        Customer-cloud deployment when your security team needs the agent
        inside your VPC. Either way, the skills library belongs to you and
        exports as plain Markdown.
      </>
    ),
  },
];

export function LandingFAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative max-w-6xl mx-auto px-6 py-16 lg:py-24"
    >
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
          Objections, answered
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          id="faq-heading"
          className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[22ch]"
        >
          Things buyers ask{" "}
          <span className="italic-serif text-coral-deep">before they sign.</span>
        </h2>
      </Reveal>

      <ul className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {FAQ.map((item, i) => (
          <Reveal key={item.q} delay={0.1 + i * 0.05}>
            <li className="h-full rounded-xl border border-paper-edge bg-paper-hi/40 p-6 lg:p-7 flex flex-col">
              <Serif as="h3" className="text-[18px] lg:text-[19px] leading-snug tracking-[-0.01em] text-ink">
                {item.q}
              </Serif>
              <p className="mt-4 text-[14.5px] leading-[1.6] text-ink-muted">
                {item.a}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
