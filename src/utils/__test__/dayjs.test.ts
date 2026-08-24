import { describe, expect, it } from "vitest";
import dayjs from "@/utils/dayjs";

describe("configured dayjs", () => {
  it("supports UTC and timezone APIs", () => {
    expect(dayjs.utc("2024-01-01").isUTC()).toBe(true);
    expect(dayjs.tz("2024-01-01", "Australia/Hobart").isValid()).toBe(true);
  });

  it("supports strict custom-format parsing", () => {
    expect(dayjs("31/12/2024", "DD/MM/YYYY", true).isValid()).toBe(true);
    expect(dayjs("31/02/2024", "DD/MM/YYYY", true).isValid()).toBe(false);
  });
});
