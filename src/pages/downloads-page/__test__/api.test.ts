import { afterEach, describe, expect, it, vi } from "vitest";
import { ogcAxiosWithRetry } from "@/app/store/searchReducer";
import { fetchDownloadStatus } from "../api";

describe("fetchDownloadStatus", () => {
  afterEach(() => vi.restoreAllMocks());

  it("calls only the ID-scoped jobs endpoint with cancellation and no retries", async () => {
    const response = {
      processID: "download-dataset",
      type: "process",
      jobID: "job/id",
      status: "running",
      message: "Download job is running",
      collection: "Test Ocean Data Collection",
      dataSelection: "imos-data/dataset.zarr",
      format: "netcdf",
      metadataUrl: "https://example.com/details/collection-id",
    };
    const getSpy = vi
      .spyOn(ogcAxiosWithRetry, "get")
      .mockResolvedValue({ data: response } as any);
    const controller = new AbortController();

    await expect(
      fetchDownloadStatus("job/id", controller.signal)
    ).resolves.toEqual(response);

    expect(getSpy).toHaveBeenCalledWith("/ogc/jobs/job%2Fid", {
      signal: controller.signal,
      "axios-retry": { retries: 0 },
    });
    expect(getSpy).toHaveBeenCalledTimes(1);
  });
});
