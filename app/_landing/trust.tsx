const PARTNERS = [
  "Vellum",
  "Ridgeline",
  "Kettle & Co",
  "Northwind",
  "Nexsim",
  "Atlas Lab",
];

export function LandingTrust() {
  return (
    <section
      aria-label="Design partners"
      className="border-y border-[--color-paper-edge]"
    >
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="serif italic text-[13px] text-[--color-ink-faint] shrink-0">
          Building with teams at
        </div>
        <ul className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-4 lg:gap-6 items-center justify-items-center">
          {PARTNERS.map(name => (
            <li
              key={name}
              aria-label={name}
              className="text-[16px] font-medium text-[--color-ink-faint] opacity-60 hover:opacity-100 transition-opacity duration-200 tracking-[-0.01em] whitespace-nowrap"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
