import { afterEach, describe, expect, it } from "vitest";
import dayjs, {
  DEFAULT_APP_TIMEZONE,
  getAppTimezone,
  setAppTimezone,
} from "../DayjsUtils";

describe("DayjsUtils app timezone", () => {
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
