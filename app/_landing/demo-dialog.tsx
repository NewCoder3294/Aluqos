"use client";

import { useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Serif } from "@/src/components/serif";

export function DemoDialog() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => ref.current?.showModal()}
      >
        Watch the demo
      </Button>
      <dialog
        ref={ref}
        className="m-auto rounded-lg border border-[--color-paper-edge] bg-[--color-paper-hi] p-0 backdrop:bg-[--color-ink]/40 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="w-[min(92vw,560px)] p-10 text-center">
          <Serif as="h3" className="text-[28px] leading-tight">
            Demo coming soon.
          </Serif>
          <p className="mt-3 text-[14px] text-[--color-ink-muted] max-w-[42ch] mx-auto">
            We&rsquo;re recording the founders&rsquo; cut right now. In the meantime,
            click <em>Get early access</em> to walk through the live product yourself.
          </p>
          <div className="mt-6">
            <Button
              type="button"
              variant="ink"
              size="md"
              onClick={() => ref.current?.close()}
            >
              Close
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
