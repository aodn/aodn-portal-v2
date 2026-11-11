import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSavedBaseMapId, saveBaseMapId } from "../BaseMapStorageUtils";

const KEY = "test_base_map_id";

describe("BaseMapStorageUtils", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("returns null before anything is saved", () => {
    expect(getSavedBaseMapId(KEY)).toBeNull();
  });

  it("returns the id saved under the same key only", () => {
    saveBaseMapId(KEY, "2");

    expect(getSavedBaseMapId(KEY)).toBe("2");
    expect(getSavedBaseMapId("other_key")).toBeNull();
  });

  it("returns null when storage cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage unavailable", "SecurityError");
    });

    expect(getSavedBaseMapId(KEY)).toBeNull();
  });

  it("does not throw when storage cannot be written", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage unavailable", "SecurityError");
    });

    expect(() => saveBaseMapId(KEY, "2")).not.toThrow();
  });
});
