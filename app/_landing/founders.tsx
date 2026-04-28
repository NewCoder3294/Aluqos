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
      "UC San Diego SWE. Air Force National Guard, Cyber Defense Operations. Anthropic × Parallel.ai hackathon winner. Brings the SOC discipline that lets an autonomous agent earn trust.",
    link: "https://www.linkedin.com/in/nicolas2007/",
  },
  {
    name: "Wali Viqas",
    role: "Chief Growth Officer",
    photo: "/team/wali.png",
    blurb:
      "NC State CS. Incoming SWE intern at Red Hat — building their internal AI on-call automation. Has watched first-hand what it takes for an engineer to actually trust an agent at 3am.",
    link: "https://www.linkedin.com/in/waliviqas/",
  },
  {
    name: "Aditya Chandrashekaran",
    role: "Chief Technology Officer",
    photo: "/team/aditya.jpeg",
    blurb:
      "Incoming CS at University of Washington. Founder of YourChessBuddy and AIRethought. Owns the telemetry-and-memory backbone — ClickHouse, Kafka/Redpanda, MCP — that makes observation possible.",
    link: "https://www.linkedin.com/in/aditya-chandrashekaran/",
  },
  {
    name: "Aman Goyal",
    role: "Chief Product Officer",
    photo: "/team/aman.jpeg",
    blurb:
      "CMU grad. Agentic AI Product Manager at T-Mobile. Ex-Intel and CMU AI Research. CVPR-published in multimodal ML. Brings carrier-scale ops know-how and warm intros into Fortune-50 buyers.",
    link: "https://www.linkedin.com/in/amangoyal99/",
  },
];

export function LandingFounders() {
  return (
    <section
      id="team"
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
          <span className="italic text-ink-faint">building this.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-[58ch] text-[16px] lg:text-[17px] leading-[1.6] text-ink-muted">
          Four founders, four overlapping unfair advantages. We did not pick this team
          for the resumes — we picked it because each of us has lived the problem from
          a different angle.
        </p>
      </Reveal>

      <ul className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
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
