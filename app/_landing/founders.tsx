"use client";

import Image from "next/image";
import { Serif } from "@/src/components/serif";
import { Reveal } from "./motion-primitives";

// One credibility line per founder. The job is not to recite a CV — it
// is to answer "why these four are the ones to build this." Each line
// names a single non-obvious unfair advantage that maps to the product.

type Founder = {
  name: string;
  role: string;
  photo: string;
  blurb: string;
  link?: string;
};

const FOUNDERS: Founder[] = [
  {
    name: "Nicolas Dos Santos",
    role: "Chief Executive Officer",
    photo: "/team/nicolas.jpeg",
    blurb:
      "Air Force Cyber Defense Operations. Brings the audit-and-permission discipline the brain needs to earn enterprise trust.",
    link: "https://www.linkedin.com/in/nicolas2007/",
  },
  {
    name: "Wali Viqas",
    role: "Chief Growth Officer",
    photo: "/team/wali.png",
    blurb:
      "Built Red Hat's internal AI on-call automation. Knows exactly what makes engineers and operators trust agents.",
    link: "https://www.linkedin.com/in/waliviqas/",
  },
  {
    name: "Aditya Chandrashekaran",
    role: "Chief Technology Officer",
    photo: "/team/aditya.jpeg",
    blurb:
      "Built versioned data platforms on ClickHouse, Kafka/Redpanda, and MCP. Owns the brain's memory and skills backbone.",
    link: "https://www.linkedin.com/in/aditya-chandrashekaran/",
  },
  {
    name: "Aman Goyal",
    role: "Chief Product Officer",
    photo: "/team/aman.jpeg",
    blurb:
      "Agentic AI PM at T-Mobile. CMU AI Research alum. Designs the agent personas and runs the early enterprise pipeline.",
    link: "https://www.linkedin.com/in/amangoyal99/",
  },
];

export function LandingFounders() {
  return (
    <section
      id="founders"
      aria-labelledby="founders-heading"
      className="max-w-6xl mx-auto px-6 py-16 lg:py-24"
    >
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
          Why us
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          id="founders-heading"
          className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[26ch]"
        >
          The four people{" "}
          <span className="italic-serif text-coral-deep">building this.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-[58ch] text-[16px] lg:text-[17px] leading-[1.6] text-ink-muted">
          Four founders, four unfair advantages. We didn't pick this team for the
          resumes. We picked it because each of us has lived the problem from a
          different angle.
        </p>
      </Reveal>

      <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {FOUNDERS.map((f, i) => (
          <Reveal key={f.name} delay={0.12 + i * 0.05}>
            <li className="h-full rounded-xl border border-paper-edge bg-paper-hi/40 p-6 lg:p-7 flex gap-5 hover:bg-paper-hi/70 transition-colors">
              <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border border-paper-edge bg-white shrink-0">
                <Image
                  src={f.photo}
                  alt={`${f.name}, ${f.role}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority={i < 2}
                />
              </div>
              <div className="min-w-0 flex-1">
                <Serif className="text-[20px] leading-tight">{f.name}</Serif>
                <div className="text-[11px] uppercase tracking-[0.14em] text-coral-deep mt-1">
                  {f.role}
                </div>
                <p className="mt-3 text-[14px] leading-[1.55] text-ink-muted">
                  {f.blurb}
                </p>
                {f.link ? (
                  <a
                    href={f.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[12px] uppercase tracking-[0.14em] text-ink-faint hover:text-coral-deep transition-colors"
                  >
                    LinkedIn ↗
                  </a>
                ) : null}
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
