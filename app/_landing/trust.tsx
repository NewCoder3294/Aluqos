"use client";

import { Reveal } from "./motion-primitives";

function NikeLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 lg:h-6 w-auto"
      style={{ fill: "#111111" }}
    >
      <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.504-.41-1.143-.28-1.918.13-.775.476-1.6 1.036-2.478.467-.71 1.232-1.643 2.297-2.8a6.122 6.122 0 00-.784 1.848c-.28 1.195-.028 2.072.756 2.632.373.261.886.392 1.54.392.522 0 1.11-.084 1.764-.252L24 7.8z" />
    </svg>
  );
}

function TMobileLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 lg:h-7 w-auto"
      style={{ fill: "#E20074" }}
    >
      <path d="M6.722 15.84h-4.8v-4.8h4.791v4.8zM1.922 0v8.16H3.36v-.236c0-3.844 2.159-6.24 6.239-6.24h.237v17.279c0 2.396-.957 3.36-3.36 3.36h-.72V24h12.478v-1.676h-.72c-2.395 0-3.36-.957-3.36-3.361V1.676h.237c4.08 0 6.239 2.396 6.239 6.24v.236h1.439V0Zm15.356 15.84h4.8v-4.8h-4.791v4.8z" />
    </svg>
  );
}

function ShipdLogo() {
  return (
    <span
      className="text-[22px] lg:text-[24px] leading-none font-semibold tracking-[-0.015em]"
      style={{ color: "#FF3B2F" }}
    >
      Shipd
    </span>
  );
}

function HPELogo() {
  const hpeGreen = "#01A982";
  return (
    <div className="flex items-center gap-2" style={{ color: hpeGreen }}>
      <svg viewBox="0 0 36 18" aria-hidden="true" className="h-3.5 lg:h-4 w-auto">
        <rect
          x="1.5"
          y="1.5"
          width="33"
          height="15"
          fill="none"
          stroke={hpeGreen}
          strokeWidth="3"
        />
      </svg>
      <span className="text-[20px] lg:text-[22px] leading-none font-extrabold tracking-[0.04em]">
        HPE
      </span>
    </div>
  );
}

function UCSanDiegoLogo() {
  return (
    <span
      className="text-[20px] lg:text-[22px] leading-none tracking-[0.02em]"
      style={{ color: "#182B49" }}
    >
      <span className="font-light">UC </span>
      <span className="font-bold">SAN DIEGO</span>
    </span>
  );
}

type Partner = {
  name: string;
  Logo: () => React.JSX.Element;
};

const PARTNERS: Partner[] = [
  { name: "Nike", Logo: NikeLogo },
  { name: "T-Mobile", Logo: TMobileLogo },
  { name: "Shipd", Logo: ShipdLogo },
  { name: "HPE", Logo: HPELogo },
  { name: "UC San Diego", Logo: UCSanDiegoLogo },
];

export function LandingTrust() {
  return (
    <section aria-label="Customers" className="border-y border-paper-edge">
      <Reveal>
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col items-center gap-5 lg:flex-row lg:gap-10">
          <div className="serif italic text-[18px] lg:text-[20px] text-ink-faint shrink-0">
            Being Used By Teams At:
          </div>
          <ul className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-6 gap-x-6 lg:gap-x-10 items-center justify-items-center">
            {PARTNERS.map(({ name, Logo }) => (
              <li
                key={name}
                aria-label={name}
                className="opacity-90 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
              >
                <Logo />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
