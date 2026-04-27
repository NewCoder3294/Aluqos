"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/src/components/ui/button";
import { hireProductManager } from "@/src/server/hire";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="outline" size="lg" type="submit" disabled={pending}>
      {pending ? "Spinning up Alex…" : "Try the demo"}
    </Button>
  );
}

export function TryDemoButton() {
  return (
    <form action={hireProductManager}>
      <SubmitButton />
    </form>
  );
}
