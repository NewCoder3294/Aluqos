import type { inngest } from "./client";

// Functions land in subsequent tasks. This file is the export aggregation point
// consumed by app/api/inngest/route.ts.
// Type uses ReturnType to stay in sync with whatever createFunction signature
// the installed Inngest version exposes.

type InngestFunction = ReturnType<typeof inngest.createFunction>;

export const functions: InngestFunction[] = [];
