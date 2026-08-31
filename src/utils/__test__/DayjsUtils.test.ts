import { afterEach, describe, expect, it } from "vitest";
import dayjs, {
  DEFAULT_APP_TIMEZONE,
  getAppTimezone,
  setAppTimezone,
} from "../DayjsUtils";

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

describe("app timezone", () => {
  afterEach(() => {
    setAppTimezone(DEFAULT_APP_TIMEZONE);
  });

  it("defaults to UTC on load", () => {
    expect(getAppTimezone()).toBe("UTC");
    expect(dayjs.tz("2024-06-01T00:00:00").format("Z")).toBe("+00:00");
  });

  it("setAppTimezone changes the default used by dayjs.tz()", () => {
    setAppTimezone("Australia/Hobart");
    expect(getAppTimezone()).toBe("Australia/Hobart");
    // 1 Jun is AEST in Hobart (UTC+10)
    expect(dayjs.tz("2024-06-01T00:00:00").format("Z")).toBe("+10:00");
  });
});
