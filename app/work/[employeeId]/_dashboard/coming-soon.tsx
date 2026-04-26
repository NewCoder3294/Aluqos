export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh] px-8 py-16">
      <h1 className="serif text-[44px] tracking-[-0.02em] text-ink leading-[1.05]">
        {title}
      </h1>
      <p className="mt-5 max-w-md text-[15px] text-ink-faint italic leading-relaxed">
        Alex hasn&apos;t started this view yet — check back after the YC demo.
      </p>
    </div>
  );
}
