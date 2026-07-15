import dayjs from "dayjs";
import {
  getMonthKeysInRange,
  formatMonthKey,
  buildPopupHtml,
  buildSumExpression,
} from "../PMTilesLayer";

describe("PMTilesLayer - getMonthKeysInRange", () => {
  it("returns one key per month between start and end inclusive", () => {
    const keys = getMonthKeysInRange(dayjs("2024-01-15"), dayjs("2024-04-02"));
    expect(keys).toEqual(["m202401", "m202402", "m202403", "m202404"]);
  });

  it("returns a single key when start and end are in the same month", () => {
    const keys = getMonthKeysInRange(dayjs("2024-06-01"), dayjs("2024-06-30"));
    expect(keys).toEqual(["m202406"]);
  });

  it("returns an empty array when start is after end", () => {
    const keys = getMonthKeysInRange(dayjs("2024-06-01"), dayjs("2024-01-01"));
    expect(keys).toEqual([]);
  });

  it("defaults to 2000-01 through the current month when no dates given", () => {
    const keys = getMonthKeysInRange();
    expect(keys[0]).toBe("m200001");
    expect(keys[keys.length - 1]).toBe(`m${dayjs().format("YYYYMM")}`);
  });

  it("caps the number of keys at 1200", () => {
    const keys = getMonthKeysInRange(dayjs("1800-01-01"), dayjs("2024-01-01"));
    expect(keys.length).toBe(1200);
  });
});

describe("PMTilesLayer - formatMonthKey", () => {
  it("formats a month key for display", () => {
    expect(formatMonthKey("m202401")).toBe("2024-01");
    expect(formatMonthKey("m199912")).toBe("1999-12");
  });
});

describe("PMTilesLayer - buildSumExpression", () => {
  it("returns 0 for no keys", () => {
    expect(buildSumExpression([])).toBe(0);
  });

  it("returns a single coalesce expression for one key", () => {
    expect(buildSumExpression(["m202401"])).toEqual([
      "coalesce",
      ["get", "m202401"],
      0,
    ]);
  });

  it("returns a sum of coalesce expressions for multiple keys", () => {
    expect(buildSumExpression(["m202401", "m202402"])).toEqual([
      "+",
      ["coalesce", ["get", "m202401"], 0],
      ["coalesce", ["get", "m202402"], 0],
    ]);
  });
});

describe("PMTilesLayer - buildPopupHtml", () => {
  const filterStart = dayjs("2024-01-01");
  const filterEnd = dayjs("2024-12-31");

  it("sums monthly counts and shows the month range of non-zero counts", () => {
    const html = buildPopupHtml(
      { m202401: 5, m202403: 7, m202405: 0 },
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Records In This Area:");
    expect(html).toContain("Data Record Count: 12");
    expect(html).toContain("Time Range: 2024-01 to 2024-03");
  });

  it("ignores months outside the filter range and non-numeric values", () => {
    const html = buildPopupHtml(
      { m202401: 5, m202506: 99, m202402: "not-a-number" },
      filterStart,
      filterEnd
    );
    expect(html).toContain("Data Record Count: 5");
    expect(html).toContain("Time Range: 2024-01 to 2024-01");
  });

  it("shows zero count and N/A range when the hexbin has no records in range", () => {
    const html = buildPopupHtml({ m202506: 99 }, filterStart, filterEnd);
    expect(html).toContain("Data Record Count: 0");
    expect(html).toContain("Time Range: N/A to N/A");
  });
});
