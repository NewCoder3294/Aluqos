import { hireProductManager } from "@/src/server/hire";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-[640px] text-center space-y-10">
        <div className="space-y-4">
          <Serif as="h1" className="text-[44px] leading-tight">
            AI employees that learn how you work.
          </Serif>
          <p className="text-[16px] text-[--color-ink-muted] leading-relaxed">
            Hire an AI colleague in minutes. They shadow how you work — your tools,
            tone, priorities — and start contributing from day one.
          </p>
        </div>
        <form action={hireProductManager}>
          <Button variant="ink" size="lg" type="submit">
            Hire an AI Product Manager
          </Button>
        </form>
        <p className="label">More roles coming soon · Program Manager · Marketing</p>
      </div>
    </main>
  );
}
