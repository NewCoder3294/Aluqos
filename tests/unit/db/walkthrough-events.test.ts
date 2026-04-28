import { describe, it, expect } from "vitest";
import { walkthroughEventsTable } from "@/src/db/walkthrough-events";

describe("walkthroughEventsTable", () => {
  it("returns the post-rename table name", () => {
    expect(walkthroughEventsTable()).toBe("walkthrough_events");
  });
});
