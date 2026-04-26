export function Greeting({
  name = "Nick",
  subline = "Here's what Alex has been up to.",
}: {
  name?: string;
  subline?: string;
}) {
  return (
    <div>
      <h1 className="serif text-[32px] leading-tight text-ink tracking-[-0.01em] mb-1">
        Good morning, {name}
      </h1>
      <p className="italic-serif text-[15px] text-ink-muted">{subline}</p>
    </div>
  );
}
