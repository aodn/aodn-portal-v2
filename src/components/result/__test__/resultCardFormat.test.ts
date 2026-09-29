import {
  formatCoveragePercent,
  formatRecordCount,
  shortenCardTitle,
  truncateToWords,
} from "../resultCardFormat";

describe("resultCardFormat", () => {
  it("formats record counts with thousands separators", () => {
    expect(formatRecordCount(12345)).toBe("12,345");
    expect(formatRecordCount(999)).toBe("999");
  });

  it("shortens long card titles", () => {
    expect(shortenCardTitle("Ocean temperature", 5)).toBe("Ocean...");
    expect(shortenCardTitle("Ocean", 5)).toBe("Ocean");
  });

  it("truncates descriptions on whole words", () => {
    expect(truncateToWords("sea surface temperature data", 2)).toBe(
      "sea surface…"
    );
    expect(truncateToWords("  sea surface  ", 3)).toBe("sea surface");
  });

  it("formats coverage as a clamped whole percentage", () => {
    expect(formatCoveragePercent(0.256)).toBe("26%");
    expect(formatCoveragePercent(1.4)).toBe("100%");
    expect(formatCoveragePercent(-0.1)).toBe("0%");
  });
});
