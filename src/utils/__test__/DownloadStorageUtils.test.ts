import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addTrackedDownloadId,
  getTrackedDownloadIds,
  removeTrackedDownloadId,
  TRACKED_DOWNLOAD_IDS_KEY,
} from "../DownloadStorageUtils";

describe("DownloadStorageUtils", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("stores only deduplicated job IDs with the newest first", () => {
    expect(addTrackedDownloadId("job-1")).toBe(true);
    expect(addTrackedDownloadId("job-2")).toBe(true);
    expect(addTrackedDownloadId("job-1")).toBe(true);

    expect(getTrackedDownloadIds()).toEqual(["job-1", "job-2"]);
    expect(
      JSON.parse(localStorage.getItem(TRACKED_DOWNLOAD_IDS_KEY) ?? "")
    ).toEqual(["job-1", "job-2"]);
  });

  it("ignores malformed storage and removes a selected ID", () => {
    localStorage.setItem(TRACKED_DOWNLOAD_IDS_KEY, "not-json");
    expect(getTrackedDownloadIds()).toEqual([]);

    localStorage.setItem(
      TRACKED_DOWNLOAD_IDS_KEY,
      JSON.stringify(["job-1", "", 123, "job-2"])
    );
    removeTrackedDownloadId("job-1");

    expect(getTrackedDownloadIds()).toEqual(["job-2"]);
  });

  it("reports when browser storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage unavailable", "SecurityError");
    });

    expect(addTrackedDownloadId("job-1")).toBe(false);
  });
});
