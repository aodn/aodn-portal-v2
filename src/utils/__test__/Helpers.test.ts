import { describe, expect, it } from "vitest";
import { formatBytes, orderSuggestions } from "../Helpers";

describe("orderSuggestions", () => {
  it("pins acronym full names on top", () => {
    const acronyms = ["Australian Antarctic Division"];
    const others = ["sea surface temperature", "salinity"];

    // "aad" is not in the full name, so it only shows because we pin it
    const result = orderSuggestions(acronyms, others, "aad");

    expect(result[0]).toBe("Australian Antarctic Division");
  });

  it("lists pinned acronyms first, then the rest by relevance", () => {
    const acronyms = ["Australian Antarctic Division"];
    const others = ["deep water temperature", "temperature"];

    const result = orderSuggestions(acronyms, others, "temp");

    expect(result).toEqual([
      "Australian Antarctic Division", // pinned acronym, always first
      "temperature", // starts with "temp"
      "deep water temperature", // matches "temp" later in the text
    ]);
  });

  it("shows a duplicate item once, in its pinned position", () => {
    const acronyms = ["Aurora Australis"];
    const others = ["Aurora Australis", "wave height"];

    const result = orderSuggestions(acronyms, others, "aa");

    expect(result[0]).toBe("Aurora Australis");
    expect(result.filter((s) => s === "Aurora Australis")).toHaveLength(1);
  });

  it("sorts by relevance when there are no acronyms", () => {
    const others = new Set(["beta", "alpha"]);

    const result = orderSuggestions(new Set(), others, "al");

    expect(result[0]).toBe("alpha");
  });
});

describe("formatBytes", () => {
  it("returns '0 Bytes' for zero", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
  });

  it("formats bytes under 1 KB", () => {
    expect(formatBytes(500)).toBe("500 Bytes");
  });

  it("formats exact kilobytes", () => {
    expect(formatBytes(1024)).toBe("1 KB");
  });

  it("formats values in KB range", () => {
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("formats exact megabytes", () => {
    expect(formatBytes(1024 * 1024)).toBe("1 MB");
  });

  it("formats values in MB range", () => {
    expect(formatBytes(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });

  it("formats exact gigabytes", () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
  });

  it("formats large byte values from estimate-complete SSE payload", () => {
    // 236231682 bytes ≈ 225.29 MB
    expect(formatBytes(236231682)).toBe("225.29 MB");
  });
});
