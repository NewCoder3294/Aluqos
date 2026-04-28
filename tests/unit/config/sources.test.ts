import { describe, it, expect } from "vitest";
import { SOURCES, getSource, type SourceId } from "@/src/config/sources";

describe("sources registry", () => {
  it("has all four V1 sources", () => {
    const ids: SourceId[] = ["linear", "github", "calendar", "slack"];
    for (const id of ids) {
      expect(SOURCES[id]).toBeDefined();
      expect(SOURCES[id].displayName).toBeTruthy();
    }
  });

  it("getSource returns config for a known source", () => {
    expect(getSource("linear").displayName).toBe("Linear");
  });

  it("getSource throws for unknown source", () => {
    // @ts-expect-error — runtime check for invalid input
    expect(() => getSource("notion")).toThrow(/unknown source/);
  });
});
