"use client";

import { Reveal } from "./motion-primitives";

function NikeLogo() {
  return (
    <svg
      viewBox="0 5 24 12"
      aria-hidden="true"
      className="h-6 lg:h-7 w-auto"
      style={{ fill: "#111111" }}
    >
      <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" />
    </svg>
  );
}

function UCSanDiegoLogo() {
  const navy = "#182B49";
  return (
    <span
      className="text-[20px] lg:text-[22px] leading-none tracking-[0.04em] flex items-baseline gap-[0.35em]"
      style={{ color: navy }}
    >
      <span className="font-light">UC</span>
      <span className="font-bold">SAN&nbsp;DIEGO</span>
    </span>
  );
}

type Partner = {
  name: string;
  Logo: () => React.JSX.Element;
  // TODO(nicolas): replace with a real pull-quote from someone at this org.
  // Keep it under 16 words. One concrete thing they got, not a "love it" line.
  // Attribution: first name + initial + role (e.g. "Sarah K., Sr. PM").
  quote: string | null;
  attribution: string | null;
};

const PARTNERS: Partner[] = [
  {
    name: "Nike",
    Logo: NikeLogo,
    quote: null,
    attribution: null,
  },
  {
    name: "UC San Diego",
    Logo: UCSanDiegoLogo,
    quote: null,
    attribution: null,
  },
];

export function LandingTrust() {
  const hasAnyQuote = PARTNERS.some((p) => p.quote);

  return (
    <section aria-label="Early access partners" className="border-y border-paper-edge bg-paper-hi/30">
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 py-10 lg:py-12">
          {/* Logo strip */}
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
            <div className="serif italic text-[15px] lg:text-[16px] uppercase tracking-[0.18em] text-ink-faint shrink-0">
              Early Access Partners
            </div>
            <ul className="flex-1 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 lg:justify-around">
              {PARTNERS.map(({ name, Logo }) => (
                <li
                  key={name}
                  aria-label={name}
                  className="opacity-90 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap flex items-center"
                >
                  <Logo />
                </li>
              ))}
            </ul>
          </div>

          {/* Quote rail — only renders when at least one quote is filled in.
              Keeps the section honest while quotes are being gathered. */}
          {hasAnyQuote ? (
            <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {PARTNERS.map(({ name, quote, attribution }) =>
                quote ? (
                  <li
                    key={name}
                    className="rounded-lg border border-paper-edge bg-white p-5"
                  >
                    <p className="serif italic text-[15px] leading-snug text-ink">
                      &ldquo;{quote}&rdquo;
                    </p>
                    <div className="mt-3 text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                      {attribution} · {name}
                    </div>
                  </li>
                ) : null,
              )}
            </ul>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
