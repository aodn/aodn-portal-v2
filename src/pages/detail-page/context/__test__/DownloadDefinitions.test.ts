import { describe, expect, it } from "vitest";
import { getValidEstimatedSizeBytes } from "../DownloadDefinitions";

describe("getValidEstimatedSizeBytes", () => {
  it.each([
    [0, 0],
    [987654, 987654],
    [-1, undefined],
    [1.5, undefined],
    [undefined, undefined],
    [null, undefined],
  ])("validates %s as %s", (value, expected) => {
    expect(getValidEstimatedSizeBytes(value)).toBe(expected);
  });
});
