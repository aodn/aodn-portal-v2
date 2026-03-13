import { describe, expect, it } from "vitest";
import { formatBytes } from "../Helpers";

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
