import { describe, it, expect } from "vitest";
import { inngest } from "@/src/inngest/client";

describe("inngest client", () => {
  it("exports a configured client with id 'aluqos'", () => {
    expect(inngest.id).toBe("aluqos");
  });
});
