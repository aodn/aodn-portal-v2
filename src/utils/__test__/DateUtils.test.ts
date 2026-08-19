import { describe, expect, it } from "vitest";
import { dayKeyToUtcValue } from "../DateUtils";

describe("dayKeyToUtcValue", () => {
  it("maps a day key to UTC midnight", () => {
    const value = dayKeyToUtcValue("2024-01-02") as number;
    expect(new Date(value).toISOString()).toBe("2024-01-02T00:00:00.000Z");
  });

  it("rejects impossible dates, not just badly-shaped ones", () => {
    expect(dayKeyToUtcValue("2024-02-31")).toBeUndefined();
    expect(dayKeyToUtcValue("2023-02-29")).toBeUndefined();
    expect(dayKeyToUtcValue("2024-13-01")).toBeUndefined();
    expect(dayKeyToUtcValue("2024-00-10")).toBeUndefined();
    expect(dayKeyToUtcValue("not-a-date")).toBeUndefined();
    expect(dayKeyToUtcValue("2024-1-2")).toBeUndefined();
    // A leap day is genuinely valid.
    expect(dayKeyToUtcValue("2024-02-29")).toBeDefined();
  });

  it("rejects a shape carrying time or timezone info", () => {
    expect(dayKeyToUtcValue("2024-01-02T00:00:00Z")).toBeUndefined();
    expect(dayKeyToUtcValue("2024-01-02 ")).toBeUndefined();
  });
});
