"use client";

import { Reveal } from "./motion-primitives";

type Partner = {
  name: string;
  /** Visual rendering for the wordmark — text only, on-brand-ish weight/tracking. */
  render: string;
  className: string;
};

const PARTNERS: Partner[] = [
  {
    name: "Nike",
    render: "NIKE",
    // Bold sans, slightly tracked — the recognizable shouty wordmark cadence.
    className: "font-extrabold tracking-[0.04em]",
  },
  {
    name: "T-Mobile",
    render: "T·Mobile",
    // The T·Mobile cadence with a strong T.
    className: "font-bold tracking-[-0.005em]",
  },
  {
    name: "Shipd",
    render: "Shipd",
    // Clean sans, normal weight.
    className: "font-medium tracking-[-0.01em]",
  },
  {
    name: "HPE",
    render: "HPE",
    // Blocky, bold, slightly tracked — like the Hewlett Packard Enterprise mark.
    className: "font-extrabold tracking-[0.05em]",
  },
];

export function LandingTrust() {
  return (
    <section
      aria-label="Customers"
      className="border-y border-paper-edge"
    >
      <Reveal>
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center gap-5 lg:flex-row lg:gap-10">
          <div className="serif italic text-[13px] text-ink-faint shrink-0">
            Building with teams at
          </div>
          <ul className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-6 lg:gap-x-10 items-center justify-items-center">
            {PARTNERS.map(p => (
              <li
                key={p.name}
                aria-label={p.name}
                className={
                  "text-[22px] lg:text-[24px] leading-none text-ink-faint " +
                  "opacity-60 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap " +
                  p.className
                }
              >
                {p.render}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
